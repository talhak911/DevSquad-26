"use client";
import { useState } from "react";
import { Eye, EyeOff, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/authSlice";
import api from "@/lib/axios";

const schema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().min(8, "Minimum 8 characters").required("Password is required"),
});

export default function LoginForm() {
    const [showPw, setShowPw] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const dispatch = useAppDispatch();
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.post("/auth/login", data);
            dispatch(setCredentials(response.data));
            router.push("/");
        } catch (err: any) {
            setError(err.response?.data?.message || "Login failed. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[592px] bg-white shadow-[0_0_12px_rgba(0,0,0,0.12)] rounded-[5px] px-9 py-10 max-sm:px-5 max-sm:py-7">
            {/* Form Header */}
            <div className="text-center mb-8">
                <h2 className="text-[24px] font-bold text-[#2e3d83] font-[family-name:var(--font-display)]">Log In</h2>
                <p className="text-[16px] font-normal text-[#afafaf] mt-1">
                    New member?{" "}
                    <button 
                        onClick={() => router.push("/register")}
                        className="font-semibold text-[#2e3d83] hover:underline"
                    >
                        Register Here
                    </button>
                </p>
            </div>

            {error && (
                <div className="mb-5 p-3 bg-red-100 text-red-700 rounded text-sm text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Email Field */}
                <div className="flex flex-col gap-1.5 mb-5">
                    <label className="text-[14px] font-medium text-[#2e3d83]">Enter Your Email*</label>
                    <input
                        {...register("email")}
                        type="email"
                        placeholder="john@example.com"
                        className={`w-full h-11 px-4 border ${errors.email ? "border-red-500" : "border-[#eaecf3]"} rounded-[5px] text-[14px] text-[#2e3d83] outline-none focus:border-[#2e3d83] placeholder:text-gray-300 transition-colors`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                {/* Password Field */}
                <div className="flex flex-col gap-1.5 mb-5">
                    <label className="text-[14px] font-medium text-[#2e3d83]">Password*</label>
                    <div className="relative">
                        <input
                            {...register("password")}
                            type={showPw ? "text" : "password"}
                            placeholder="••••••••"
                            className={`w-full h-11 px-4 pr-12 border ${errors.password ? "border-red-500" : "border-[#eaecf3]"} rounded-[5px] text-[14px] text-[#2e3d83] outline-none focus:border-[#2e3d83] placeholder:text-gray-300 transition-colors`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPw(!showPw)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#545677] hover:text-[#2e3d83]"
                        >
                            {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between mb-8">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${rememberMe ? "bg-[#2e3d83] border-[#2e3d83]" : "bg-white border-[#eaecf3] group-hover:border-[#2e3d83]"}`}>
                            {rememberMe && <Check size={12} className="text-white" />}
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                            />
                        </div>
                        <span className="text-[14px] font-medium text-[#2e3d83]">Remember me</span>
                    </label>
                    <a href="#" className="text-[14px] font-medium text-[#545677] hover:text-[#2e3d83] transition-colors">
                        Forget Password
                    </a>
                </div>

                {/* Log In Button */}
                <button 
                    disabled={isLoading}
                    className="w-full h-12 bg-[#2e3d83] text-white text-[18px] font-bold rounded-[5px] hover:bg-opacity-95 transition-all shadow-md active:scale-[0.98] disabled:opacity-50"
                >
                    {isLoading ? "Logging In..." : "Log in"}
                </button>
            </form>

            {/* Social Divider */}
            <div className="relative my-8 text-center">
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-[#eaecf3]" />
                <span className="relative bg-white px-4 text-[16px] font-medium text-[#545677]">Or Register With</span>
            </div>

            {/* Social Buttons */}
            <div className="flex justify-center gap-3.5">
                {/* Social icons SVGs kept identical as per user instruction... */}
                {/* ... existing SVG content ... */}
            </div>
        </div>
    );
}
