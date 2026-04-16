'use client';

import { Box, Typography, Container, IconButton, Snackbar, Alert } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useGetProductsQuery, useAddToCartMutation } from '../services/api';
import { useState, useRef } from "react";

export default function TopSneakers() {
  const { data: products = [], isLoading } = useGetProductsQuery();
  const [addToCart] = useAddToCartMutation();
  const [snackOpen, setSnackOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sessionId = "default-session";

  const displayProducts = products.length > 0 ? products : [
    { id: "1", name: "Aero One", price: 20, image: null, featured: true },
    { id: "2", name: "Commuter S", price: 20, image: null, featured: true },
    { id: "3", name: "Volt E1", price: 20, image: null, featured: false },
  ];

  const visibleProducts = displayProducts.slice(currentIndex, currentIndex + 3);

  const handleAddToCart = async (item: any) => {
    const productData = {
      productId: item.id,
      name: item.name,
      price: typeof item.price === 'number' ? item.price : 20,
      image: item.image?.url || "",
      quantity: 1
    };
    await addToCart({ sessionId, item: productData });
    setSnackOpen(true);
  };

  const handlePrev = () => setCurrentIndex(Math.max(0, currentIndex - 1));
  const handleNext = () => setCurrentIndex(Math.min(displayProducts.length - 3, currentIndex + 1));

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 8 } }}>
      <Box sx={{ textAlign: "center", mb: { xs: 4, md: 8 } }}>
        <Typography sx={{ fontFamily: "var(--font-montserrat)", fontWeight: 400, fontSize: "16px", mb: 1 }}>
          At the moment
        </Typography>
        <Typography sx={{ fontFamily: "var(--font-montserrat)", fontWeight: 900, fontStyle: "italic", fontSize: { xs: "24px", md: "48px" }, textTransform: "uppercase", mb: 2 }}>
          Summertime Mood
        </Typography>
        <Typography sx={{ fontFamily: "var(--font-montserrat)", fontWeight: 400, fontSize: { xs: "16px", md: "20px" } }}>
          Fight the heat in a sunny look!
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography sx={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: { xs: "20px", md: "24px" } }}>
          Top Products
        </Typography>
        <Box>
          <IconButton
            onClick={handlePrev}
            disabled={currentIndex === 0}
            sx={{ backgroundColor: "#F0F0F0", mr: 1, '&:hover': { backgroundColor: "#E0E0E0" } }}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={handleNext}
            disabled={currentIndex >= displayProducts.length - 3}
            sx={{ backgroundColor: "#E0E0E0", '&:hover': { backgroundColor: "#D0D0D0" } }}
          >
            <ArrowForwardIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
        {visibleProducts.map((item: any, index: number) => (
          <Box key={item.id || index} sx={{ flex: 1 }}>
            <Box
              sx={{
                backgroundColor: "#F5F5F5",
                borderRadius: "18px",
                overflow: "hidden",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s, box-shadow 0.2s",
                '&:hover': { transform: "translateY(-4px)", boxShadow: "0 12px 40px rgba(0,0,0,0.12)" }
              }}
            >
              {/* Product Image */}
              <Box sx={{ height: "280px", backgroundColor: "#EEEEEE", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
                {item.image?.url ? (
                  <img
                    src={item.image.url}
                    alt={item.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <Box sx={{ color: "#CCC", fontSize: "48px" }}>🚲</Box>
                )}
                {item.featured && (
                  <Box sx={{ position: "absolute", top: "12px", left: "12px", backgroundColor: "#FF3939", color: "#FFF", px: 1.5, py: 0.5, borderRadius: "20px", fontSize: "11px", fontFamily: "var(--font-montserrat)", fontWeight: 700 }}>
                    FEATURED
                  </Box>
                )}
              </Box>

              {/* Product Info */}
              <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <Box>
                  <Typography sx={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "18px", mb: 0.5 }}>
                    {item.name}
                  </Typography>
                  <Typography sx={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "20px", color: "#000" }}>
                    ${item.price?.toFixed(2)}
                  </Typography>
                </Box>

                <IconButton
                  onClick={() => handleAddToCart(item)}
                  sx={{
                    backgroundColor: "#000000",
                    color: "#FFFFFF",
                    width: "44px",
                    height: "44px",
                    '&:hover': { backgroundColor: "#333333", transform: 'scale(1.1)', transition: 'transform 0.2s' }
                  }}
                >
                  <AddShoppingCartIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      <Snackbar open={snackOpen} autoHideDuration={2000} onClose={() => setSnackOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity="success" sx={{ fontFamily: "var(--font-montserrat)" }}>Added to cart!</Alert>
      </Snackbar>
    </Container>
  );
}
