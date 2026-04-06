"use client";
import Image from "next/image";
import { Check, Loader2, Star, Clock, Hammer, Tag, Gauge, ArrowUpRight, Minus, Plus, User as UserIcon, Mail, Phone, Flag, ShieldCheck } from "lucide-react";
import PageHero from "@/components/common/page-hero";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useSocketContext } from "@/context/socket-context";
import { useAppSelector } from "@/store/hooks";
import { useCountdown } from "@/hooks/use-countdown";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

export default function CarAuctionDetailPage() {
    const params = useParams();
    const router = useRouter();
    const carId = params.slug as string;
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);
    const { socket, joinCar, leaveCar } = useSocketContext();
    const [car, setCar] = useState<any>(null);
    const timeLeft = useCountdown(car?.auctionEndDate);
    const [bids, setBids] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [bidAmount, setBidAmount] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [carRes, bidsRes] = await Promise.all([
                    api.get(`/cars/${carId}`),
                    api.get(`/bids/car/${carId}`)
                ]);
                setCar(carRes.data);
                setBids(bidsRes.data);
                setBidAmount(Math.max(carRes.data.currentBid, carRes.data.startingBid) + 100);
            } catch (err) {
                console.error("Failed to fetch car details:", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (carId) fetchData();
    }, [carId]);

    useEffect(() => {
        if (socket && carId) {
            joinCar(carId);

            socket.on('newBid', (newBid: any) => {
                setBids(prev => [newBid, ...prev]);
                setCar((prev: any) => ({ 
                    ...prev, 
                    currentBid: newBid.amount,
                    bidCount: (prev?.bidCount || 0) + 1
                }));
                setBidAmount(newBid.amount + 100);
            });

            socket.on('auctionEnded', (data: any) => {
                setCar((prev: any) => ({ ...prev, status: 'sold' }));
            });

            return () => {
                socket.off('newBid');
                socket.off('auctionEnded');
                leaveCar(carId);
            };
        }
    }, [socket, carId, joinCar, leaveCar]);

    const handlePlaceBid = async () => {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        if (car.uploadedBy._id === user?._id) {
            setError("You cannot bid on your own car.");
            return;
        }

        if (bidAmount <= car.currentBid) {
            setError(`Bid must be higher than current bid ($${car.currentBid})`);
            return;
        }

        setIsSubmitting(true);
        setError(null);
        try {
            await api.post("/bids", { carId, amount: bidAmount });
            setBidAmount(bidAmount + 100);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to place bid.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white text-[#2E3D83]">
                <Loader2 className="animate-spin" size={64} />
                <span className="ml-4 text-2xl font-bold">Loading Auction Details...</span>
            </div>
        );
    }

    if (!car) return <div className="p-20 text-center text-2xl font-bold">Car not found.</div>;

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    };

    const topBid = bids.length > 0 ? bids[0] : null;

    return (
        <main className="min-h-screen bg-[#FDFDFD] pb-24">
            <PageHero
                title={car.title}
                subtitle={`${car.year} ${car.make} ${car.model} available for bidding.`}
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Auction", href: "/auction" },
                    { label: car.title }
                ]}
            />

            <div className="container mx-auto px-4 lg:px-[118px] -mt-8 relative z-10">
                {/* Product Title Bar */}
                <div className="bg-[#2E3D83] rounded-t-[10px] w-full h-[70px] flex items-center justify-between px-8 shadow-lg">
                    <h2 className="text-white text-[24px] font-bold tracking-tight">
                        {car.title}
                    </h2>
                    <button className="text-white/80 hover:text-[#F4C23D] transition-colors">
                        <Star size={24} className="fill-current" />
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="bg-white rounded-b-[10px] p-6 lg:p-10 shadow-xl flex flex-col gap-10">
                    
                    {/* Image Gallery Section */}
                    <div className="flex flex-col gap-6 lg:w-[65%]">
                        {/* Main Swiper */}
                        <div className="relative aspect-[16/9] rounded-[10px] overflow-hidden bg-gray-50 border border-[#EAECF3] shadow-lg">
                            {car.status === 'live' && (
                                <div className="absolute left-6 top-6 z-20 bg-[#EF233C] text-white px-4 py-2 rounded-[5px] flex items-center gap-2 shadow-lg scale-90 md:scale-100">
                                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                    <span className="text-[14px] font-bold uppercase tracking-wider">Live Now</span>
                                </div>
                            )}
                            
                            <Swiper
                                modules={[Navigation, Thumbs, Autoplay]}
                                navigation={{
                                    nextEl: '.swiper-button-next-custom',
                                    prevEl: '.swiper-button-prev-custom',
                                }}
                                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                                spaceBetween={10}
                                className="w-full h-full group"
                            >
                                {(car.images?.length > 0 ? car.images : ["/placeholder-car.webp"]).map((img: string, i: number) => (
                                    <SwiperSlide key={i}>
                                        <Image
                                            src={img}
                                            alt={`${car.title} view ${i + 1}`}
                                            fill
                                            className="object-contain p-2"
                                            priority={i === 0}
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>

                        {/* Thumbs Swiper */}
                        <div className="h-24 md:h-32 w-full">
                            <Swiper
                                onSwiper={setThumbsSwiper}
                                spaceBetween={12}
                                slidesPerView={4}
                                freeMode={true}
                                watchSlidesProgress={true}
                                modules={[FreeMode, Navigation, Thumbs]}
                                breakpoints={{
                                    640: { slidesPerView: 5 },
                                    1024: { slidesPerView: 6 }
                                }}
                                className="h-full thumbs-swiper"
                            >
                                {(car.images?.length > 0 ? car.images : ["/placeholder-car.webp"]).map((img: string, i: number) => (
                                    <SwiperSlide key={i} className="cursor-pointer border-2 border-transparent rounded-[8px] overflow-hidden transition-all swiper-slide-thumb-active:border-[#2E3D83]">
                                        <div className="relative w-full h-full bg-gray-50">
                                            <Image
                                                src={img}
                                                alt={`Thumbnail ${i + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>

                    {/* Horizontal Stats Bar */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-px bg-[#EAECF3] border border-[#EAECF3] rounded-[10px] overflow-hidden shadow-sm">
                        <div className="bg-white p-4 flex flex-col items-center justify-center gap-1">
                            <div className="flex items-center gap-2 text-[#2E3D83]">
                                <Clock size={16} />
                                <span className="text-[12px] font-bold uppercase tracking-wider">Time Left</span>
                            </div>
                            <span className={`text-[14px] font-bold ${timeLeft.isExpired ? 'text-gray-400' : 'text-[#EF233C]'}`}>
                                {timeLeft.isExpired ? "Ended" : `${timeLeft.days}D : ${timeLeft.hours}H : ${timeLeft.minutes}M`}
                            </span>
                        </div>
                        <div className="bg-white p-4 flex flex-col items-center justify-center gap-1">
                            <div className="flex items-center gap-1 text-[#2E3D83]">
                                <Hammer size={16} />
                                <span className="text-[12px] font-bold uppercase tracking-wider">Current Bid</span>
                            </div>
                            <span className="text-[14px] font-bold text-[#2E3D83]">{formatCurrency(car.currentBid)}</span>
                        </div>
                        <div className="bg-white p-4 flex flex-col items-center justify-center gap-1">
                            <div className="flex items-center gap-2 text-[#2E3D83]">
                                <Clock size={16} />
                                <span className="text-[12px] font-bold uppercase tracking-wider">End Time</span>
                            </div>
                            <span className="text-[14px] font-bold text-[#2E3D83]">
                                {car.auctionEndDate ? new Date(car.auctionEndDate).toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit' }) : "N/A"}
                            </span>
                        </div>
                        <div className="bg-white p-4 flex flex-col items-center justify-center gap-1">
                            <div className="flex items-center gap-2 text-[#2E3D83]">
                                <ArrowUpRight size={16} />
                                <span className="text-[12px] font-bold uppercase tracking-wider">Min Inc.</span>
                            </div>
                            <span className="text-[14px] font-bold text-[#2E3D83]">${car.minIncrement || 100}</span>
                        </div>
                        <div className="bg-white p-4 flex flex-col items-center justify-center gap-1">
                            <div className="flex items-center gap-2 text-[#2E3D83]">
                                <Hammer size={16} />
                                <span className="text-[12px] font-bold uppercase tracking-wider">Total Bids</span>
                            </div>
                            <span className="text-[14px] font-bold text-[#2E3D83]">{car.bidCount || 0}</span>
                        </div>
                        <div className="bg-white p-4 flex flex-col items-center justify-center gap-1">
                            <div className="flex items-center gap-2 text-[#2E3D83]">
                                <Tag size={16} />
                                <span className="text-[12px] font-bold uppercase tracking-wider">Lot No.</span>
                            </div>
                            <span className="text-[14px] font-bold text-[#2E3D83]">{car.lotNumber || "N/A"}</span>
                        </div>
                        <div className="bg-white p-4 flex flex-col items-center justify-center gap-1">
                            <div className="flex items-center gap-2 text-[#2E3D83]">
                                <Gauge size={16} />
                                <span className="text-[12px] font-bold uppercase tracking-wider">Odometer</span>
                            </div>
                            <span className="text-[14px] font-bold text-[#2E3D83]">{car.mileage?.toLocaleString()} KM</span>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Left Column: Details & Top Bidder */}
                        <div className="flex-1 flex flex-col gap-12">
                            {/* Description Section */}
                            <div className="flex flex-col gap-6">
                                <h3 className="text-[24px] font-bold text-[#2E3D83] relative inline-block w-fit">
                                    Description
                                    <span className="absolute -bottom-2 left-0 w-full h-[4px] bg-[#F4C23D] rounded-full" />
                                </h3>
                                <div className="text-[#545677] text-[16px] leading-relaxed font-medium mt-4">
                                    {car.description || "No detailed description provided for this vehicle."}
                                    <p className="mt-4">
                                        Experience sheer driving pleasure with this meticulously maintained {car.title}. 
                                        Combining luxury with performance, it offers an unparalleled journey every time you sit behind the wheel.
                                    </p>
                                </div>
                            </div>

                            {/* Top Bidder Section */}
                            <div className="flex flex-col gap-6">
                                <div className="bg-[#2E3D83] h-[50px] rounded-t-[8px] flex items-center px-6 shadow-sm">
                                    <h3 className="text-white text-[18px] font-bold uppercase tracking-tight">Top Bidder</h3>
                                </div>
                                <div className="bg-[#F1F2FF] rounded-b-[8px] p-8 border border-[#EAECF3] flex flex-col md:flex-row gap-10 items-center">
                                    <div className="relative w-[140px] h-[140px] rounded-full overflow-hidden border-4 border-white shadow-xl flex-shrink-0 bg-gray-50">
                                        <Image
                                            src={topBid?.user?.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${topBid?.user?.firstName || 'User'}`}
                                            alt="Top Bidder"
                                            fill
                                            className="object-cover bg-white"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 flex-1 gap-x-12 gap-y-6">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[14px] text-[#2E3D83] font-bold flex items-center gap-2">
                                                <UserIcon size={14} /> Full Name
                                            </span>
                                            <span className="text-[16px] text-[#545677] font-semibold">
                                                {topBid ? `${topBid.user.firstName} ${topBid.user.lastName}` : "No bids yet"}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[14px] text-[#2E3D83] font-bold flex items-center gap-2">
                                                <Mail size={14} /> Email
                                            </span>
                                            <span className="text-[16px] text-[#545677] font-semibold truncate">
                                                {topBid?.user?.email || "---"}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[14px] text-[#2E3D83] font-bold flex items-center gap-2">
                                                <Phone size={14} /> Mobile Number
                                            </span>
                                            <span className="text-[16px] text-[#545677] font-semibold">
                                                {topBid?.user?.phone || "---"}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[14px] text-[#2E3D83] font-bold flex items-center gap-2">
                                                <Flag size={14} /> Nationality
                                            </span>
                                            <span className="text-[16px] text-[#545677] font-semibold">
                                                {topBid?.user?.nationality || "---"}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[14px] text-[#2E3D83] font-bold flex items-center gap-2">
                                                <ShieldCheck size={14} /> ID Type
                                            </span>
                                            <span className="text-[16px] text-[#545677] font-semibold">
                                                {topBid?.user?.idType || "---"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Bidding Controls */}
                        <div className="w-full lg:w-[320px] flex flex-col gap-6">
                            {/* Bidding Card */}
                            <div className="bg-[#F1F2FF] rounded-[10px] p-6 border border-[#EAECF3] shadow-sm">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex flex-col">
                                        <span className="text-[12px] font-bold text-[#2E3D83] uppercase">Starts From</span>
                                        <span className="text-[18px] font-bold text-[#2E3D83]">{formatCurrency(car.startingBid)}</span>
                                    </div>
                                    <div className="flex flex-col text-right">
                                        <span className="text-[12px] font-bold text-[#2E3D83] uppercase">Current Bid</span>
                                        <span className="text-[18px] font-bold text-[#2E3D83]">{formatCurrency(car.currentBid)}</span>
                                    </div>
                                </div>

                                {/* Bidding Progress Slider */}
                                <div className="relative h-2 bg-white rounded-full mb-8 shadow-inner border border-gray-100">
                                    <div 
                                        className="absolute h-full bg-[#F4C23D] rounded-full transition-all duration-500" 
                                        style={{ width: `${Math.min(((car.currentBid - car.startingBid) / car.startingBid) * 100 + 10, 100)}%` }}
                                    />
                                    <div 
                                        className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-[#2E3D83] rounded-full border-4 border-white shadow-md flex items-center justify-center transition-all duration-500"
                                        style={{ left: `calc(${Math.min(((car.currentBid - car.startingBid) / car.startingBid) * 100 + 10, 100)}% - 12px)` }}
                                    >
                                        <Hammer size={10} className="text-[#F4C23D]" />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-6">
                                    {car.status === 'live' ? (
                                        <>
                                            <div className="flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <span className="text-[18px] font-bold text-[#2E3D83]">{car.bidCount || 0}</span>
                                                    <span className="text-[10px] text-[#A0A0A0] uppercase font-bold">Bids Placed</span>
                                                </div>
                                                <div className="flex items-center gap-3 bg-white border border-[#EAECF3] p-1 rounded-[5px] shadow-sm">
                                                    <button 
                                                        onClick={() => setBidAmount(prev => Math.max(car.currentBid + car.minIncrement, prev - car.minIncrement))}
                                                        className="w-8 h-8 flex items-center justify-center text-[#2E3D83] hover:bg-gray-100 rounded transition-colors"
                                                    >
                                                        <Minus size={16} />
                                                    </button>
                                                    <span className="text-[14px] font-bold text-[#2E3D83] min-w-[80px] text-center">
                                                        {formatCurrency(bidAmount)}
                                                    </span>
                                                    <button 
                                                        onClick={() => setBidAmount(prev => prev + (car.minIncrement || 100))}
                                                        className="w-8 h-8 flex items-center justify-center text-[#2E3D83] hover:bg-gray-100 rounded transition-colors"
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                            {error && <p className="text-red-500 text-xs text-center -mb-4 animate-shake">{error}</p>}

                                            <button
                                                disabled={isSubmitting}
                                                onClick={handlePlaceBid}
                                                className="w-full h-[55px] bg-[#2E3D83] text-white text-[16px] font-bold rounded-[5px] hover:bg-opacity-95 transition-all shadow-lg active:scale-[0.98] uppercase tracking-wider"
                                            >
                                                {isSubmitting ? "Processing..." : "Submit A Bid"}
                                            </button>
                                        </>
                                    ) : (
                                        <div className="bg-[#2E3D83]/5 border border-[#2E3D83]/20 rounded-[8px] p-6 text-center">
                                            <h4 className="text-[18px] font-bold text-[#2E3D83] uppercase tracking-tight mb-2">Auction Ended</h4>
                                            <p className="text-[14px] text-[#545677] font-medium leading-tight">
                                                This vehicle has been sold or the listing has expired. No further bids can be accepted.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Bidders List */}
                            <div className="flex flex-col bg-white border border-[#EAECF3] rounded-[10px] overflow-hidden shadow-sm">
                                <div className="bg-[#2E3D83] h-[60px] flex items-center px-6">
                                    <h3 className="text-white text-[16px] font-bold uppercase tracking-tight">Bidders List</h3>
                                </div>
                                <div className="p-2 flex flex-col divide-y divide-[#EAECF3]">
                                    {bids.length === 0 ? (
                                        <div className="p-8 text-center text-[#A0A0A0] italic text-sm">No bids yet. Start the auction!</div>
                                    ) : (
                                        bids.map((bid, i) => (
                                            <div key={bid._id} className="p-4 flex items-center justify-between hover:bg-[#F1F2FF] transition-colors rounded-lg group">
                                                <div className="flex flex-col">
                                                    <span className={`text-[14px] font-bold ${i === 0 ? "text-[#2E3D83]" : "text-[#545677]"}`}>
                                                        {bid.user ? `${bid.user.firstName} ${bid.user.lastName}` : `Bidder ${i + 1}`}
                                                    </span>
                                                    <span className="text-[10px] text-[#A0A0A0] uppercase font-bold">{new Date(bid.createdAt).toLocaleTimeString()}</span>
                                                </div>
                                                <span className={`text-[16px] font-bold ${i === 0 ? "text-[#EF233C]" : "text-[#2E3D83]"}`}>
                                                    {formatCurrency(bid.amount)}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
