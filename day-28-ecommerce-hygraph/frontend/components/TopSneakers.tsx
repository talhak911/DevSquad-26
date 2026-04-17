'use client';

import { Box, Typography, Container, IconButton, Snackbar, Alert } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useGetProductsQuery, useAddToCartMutation } from '../services/api';
import { useState } from "react";

export default function TopSneakers() {
  const { data: products = [] } = useGetProductsQuery();
  const [addToCart] = useAddToCartMutation();
  const [snackOpen, setSnackOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sessionId = "default-session";

  const displayProducts = products.length > 0 ? products : [
    { id: "1", name: "Air Max 97", price: 20.99, image: { url: "/nike-air-max.png" } },
    { id: "2", name: "React Presto", price: 20.99, image: { url: "/nike-air-max-red.png" } },
    { id: "3", name: "KD13 EP", price: 20.99, image: { url: "/nike-air-max.png" } },
  ];

  const visibleProducts = displayProducts.slice(currentIndex, currentIndex + 3);

  const handleAddToCart = async (item: any) => {
    const productData = {
      productId: item.id,
      name: item.name,
      price: 20.99,
      image: item.image?.url || "",
      quantity: 1
    };
    await addToCart({ sessionId, item: productData });
    setSnackOpen(true);
  };

  const handlePrev = () => setCurrentIndex(Math.max(0, currentIndex - 1));
  const handleNext = () => setCurrentIndex(Math.min(displayProducts.length - (displayProducts.length > 3 ? 3 : 0), currentIndex + 1));

  return (
    <Box sx={{ width: '100%', py: 10 }}>
      {/* Summertime Mood Header */}
      <Box sx={{ textAlign: "center", mb: 10 }}>
        <Typography sx={{ fontFamily: "var(--font-montserrat)", fontWeight: 400, fontSize: "40px", color: "#000" }}>
          At the moment
        </Typography>
        <Typography sx={{ fontFamily: "var(--font-montserrat)", fontWeight: 900, fontStyle: "italic", fontSize: { xs: "50px", md: "80px" }, textTransform: "uppercase", lineHeight: 1.2 }}>
          SUMMERTIME MOOD
        </Typography>
        <Typography sx={{ fontFamily: "var(--font-montserrat)", fontWeight: 400, fontSize: "40px", color: "#000" }}>
          Fight the heat in a sunny look!
        </Typography>
      </Box>

      <Container maxWidth="xl">
        {/* Navigation and Title */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 6 }}>
          <Typography sx={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "40px", color: "#000" }}>
            Top sneakers
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <IconButton
              onClick={handlePrev}
              disabled={currentIndex === 0}
              sx={{ 
                width: 55, height: 55,
                backgroundColor: "#F5F5F5", 
                color: "#000",
                '&:hover': { backgroundColor: "#DDD" } 
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <IconButton
              onClick={handleNext}
              disabled={displayProducts.length <= 3 || currentIndex >= displayProducts.length - 3}
              sx={{ 
                width: 55, height: 55,
                backgroundColor: "#C6C6C6", 
                color: "#000",
                '&:hover': { backgroundColor: "#AAA" } 
              }}
            >
              <ArrowForwardIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Product Cards Grid */}
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
          {visibleProducts.map((item: any, index: number) => (
            <Box 
              key={item.id || index} 
              sx={{ 
                flex: 1, 
                backgroundColor: "#EFEFEF", 
                borderRadius: "18px", 
                height: "580px",
                position: "relative",
                overflow: "hidden",
                boxShadow: "5px 5px 25px rgba(0, 0, 0, 0.15)",
                display: 'flex',
                flexDirection: 'column',
                p: 4
              }}
            >
              {/* Rotated NIKE Background Text */}
              <Typography 
                sx={{ 
                  position: "absolute",
                  fontFamily: "var(--font-poppins)",
                  fontWeight: 900,
                  fontStyle: "italic",
                  fontSize: "160px",
                  color: "rgba(0,0,0,0.05)",
                  transform: "rotate(-90deg)",
                  top: "30%",
                  left: "20%",
                  whiteSpace: "nowrap",
                  zIndex: 1,
                  pointerEvents: "none"
                }}
              >
                NIKE
              </Typography>

              {/* Shoe Image */}
              <Box 
                sx={{ 
                  flex: 1, 
                  display: "flex", 
                  justifyContent: "center", 
                  alignItems: "center",
                  zIndex: 2,
                  position: 'relative'
                }}
              >
                <Box 
                  component="img"
                  src={item.image?.url || "/nike-air-max.png"}
                  alt={item.name}
                  sx={{ 
                    width: "120%", 
                    filter: "drop-shadow(0px 20px 40px rgba(0,0,0,0.3))",
                    transform: "rotate(-5deg) translateY(-20px)",
                    transition: 'transform 0.4s ease',
                    '&:hover': { transform: "rotate(0deg) scale(1.05) translateY(-30px)" }
                  }}
                />
              </Box>

              {/* Content */}
              <Box sx={{ zIndex: 3, mt: 'auto' }}>
                <Typography sx={{ fontFamily: "var(--font-work-sans)", fontWeight: 700, fontSize: "40px", color: "#000", mb: 1 }}>
                  {item.name}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontFamily: "var(--font-work-sans)", fontWeight: 400, fontSize: "20px", color: "#000" }}>
                    ${parseFloat(item.price || "20.99").toFixed(2)}
                  </Typography>
                  <IconButton
                    onClick={() => handleAddToCart(item)}
                    sx={{ 
                      width: 55, height: 55,
                      backgroundColor: "#FFF", 
                      color: "#000", 
                      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                      '&:hover': { backgroundColor: "#F0F0F0", transform: 'scale(1.1)' } 
                    }}
                  >
                    <AddShoppingCartIcon />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>

      <Snackbar open={snackOpen} autoHideDuration={2000} onClose={() => setSnackOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity="success" sx={{ fontFamily: "var(--font-montserrat)" }}>Added to cart!</Alert>
      </Snackbar>
    </Box>
  );
}
