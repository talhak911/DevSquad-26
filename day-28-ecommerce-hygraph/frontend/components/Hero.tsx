'use client';

import { Box, Typography, Container, Button } from "@mui/material";
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { useGetProductsQuery, useAddToCartMutation } from '../services/api';
import { useState } from "react";
import Link from 'next/link';

export default function Hero() {
  const { data: products = [], isLoading } = useGetProductsQuery();
  const [addToCart] = useAddToCartMutation();
  const sessionId = "default-session";
  
  // Filter featured products for the hero section
  const featuredProducts = products.filter((p: any) => p.featured).slice(0, 2);
  
  // Fallback if no featured products
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 2);

  const handleAddToCart = (item: any) => {
    const productData = {
      productId: item.id,
      name: item.name,
      price: typeof item.price === 'number' ? item.price : 20,
      image: item.image?.url || "",
      quantity: 1
    };
    addToCart({ sessionId, item: productData });
  };

  return (
    <Box sx={{ backgroundColor: "#F5F5F3", minHeight: "80vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
      <Container maxWidth="xl">
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: "center", py: 8 }}>
          
          {/* Text Content */}
          <Box sx={{ flex: 1, zIndex: 2, textAlign: { xs: "center", md: "left" }, mb: { xs: 6, md: 0 } }}>
            <Typography 
              sx={{ 
                fontFamily: "var(--font-montserrat)", 
                fontWeight: 900, 
                fontSize: { xs: "48px", md: "86px" },
                lineHeight: 1,
                textTransform: "uppercase",
                fontStyle: "italic",
                mb: 2,
                color: "#000"
              }}
            >
              Ride Your <br /> Way
            </Typography>
            <Typography 
              sx={{ 
                fontFamily: "var(--font-montserrat)", 
                fontWeight: 400, 
                fontSize: { xs: "18px", md: "22px" },
                maxWidth: "500px",
                mb: 4,
                color: "#666"
              }}
            >
              Experience the next generation of movement with our premium bike collection. Engineered for performance, designed for style.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, justifyContent: { xs: "center", md: "flex-start" } }}>
              <Link href="/cart" style={{ textDecoration: 'none' }}>
                <Button 
                  variant="contained" 
                  sx={{ 
                    backgroundColor: "#000", 
                    color: "#fff", 
                    px: 4, 
                    py: 2, 
                    borderRadius: "30px",
                    fontWeight: 700,
                    textTransform: "none",
                    fontFamily: "var(--font-montserrat)",
                    '&:hover': { backgroundColor: "#333" }
                  }}
                >
                  View Cart
                </Button>
              </Link>
            </Box>
          </Box>

          {/* Visual Content */}
          <Box sx={{ flex: 1, position: "relative", height: { xs: "400px", md: "600px" }, width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            {/* Background decorative text */}
            <Typography 
              sx={{ 
                position: "absolute",
                fontSize: { xs: "120px", md: "250px" },
                fontWeight: 900,
                color: "#EBEBEB",
                zIndex: 1,
                userSelect: "none",
                transform: "rotate(-10deg)",
                top: "50%",
                left: "50%",
                transformOrigin: "center",
                translate: "-50% -50%",
                lineHeight: 1
              }}
            >
              DRIVE
            </Typography>

            {/* Product Images Floating */}
            {displayProducts.map((item: any, index: number) => (
              <Box 
                key={item.id}
                sx={{ 
                  position: "absolute",
                  width: { xs: "280px", md: "450px" },
                  height: { xs: "200px", md: "350px" },
                  zIndex: index === 0 ? 3 : 2,
                  left: index === 0 ? "10%" : "auto",
                  right: index === 1 ? "10%" : "auto",
                  top: index === 0 ? "20%" : "40%",
                  transition: "all 0.5s ease",
                  transform: index === 0 ? "rotate(-15deg)" : "rotate(15deg)",
                  '&:hover': { transform: index === 0 ? "rotate(-10deg) scale(1.05)" : "rotate(10deg) scale(1.05)", zIndex: 10 }
                }}
              >
                {item.image?.url ? (
                  <img 
                    src={item.image.url} 
                    alt={item.name} 
                    style={{ width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 20px 50px rgba(0,0,0,0.2))" }} 
                  />
                ) : (
                  <Box sx={{ width: "100%", height: "100%", backgroundColor: "#ddd", borderRadius: "20px" }} />
                )}
                
                {/* Micro-interaction Add to Cart button */}
                <Box 
                  onClick={() => handleAddToCart(item)}
                  sx={{ 
                    position: "absolute",
                    bottom: "20px",
                    right: "20px",
                    width: "48px",
                    height: "48px",
                    backgroundColor: "#fff",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                    '&:hover': { backgroundColor: "#000", color: "#fff" }
                  }}
                >
                  <ArrowOutwardIcon />
                </Box>
              </Box>
            ))}
          </Box>

        </Box>
      </Container>
    </Box>
  );
}
