import { Box, Typography, Container, Button } from "@mui/material";

export default function PromoBanner() {
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 8 } }}>
      <Typography 
        sx={{ 
          fontFamily: "var(--font-montserrat)", 
          fontWeight: 900, 
          fontStyle: "italic",
          fontSize: { xs: "20px", md: "36px" },
          textAlign: "center",
          mb: { xs: 4, md: 8 },
          textTransform: "uppercase"
        }}
      >
        LOOKS GOOD. RUNS GOOD. FEELS GOOD.
      </Typography>

      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
        <Box sx={{ flex: 1 }}>
            <Box 
              sx={{ 
                backgroundColor: "#EFEFEF", 
                borderRadius: "18px", 
                boxShadow: "5px 5px 25px rgba(0, 0, 0, 0.25)",
                p: { xs: 3, md: 5 },
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
                minHeight: "250px",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, zIndex: 2 }}>
                <Typography sx={{ color: "#FF3939", fontWeight: 700, fontFamily: "var(--font-montserrat)", fontSize: { xs: "20px", md: "24px" } }}>
                  -20%
                </Typography>
                <Typography sx={{ color: "#FF3939", fontWeight: 700, fontFamily: "var(--font-montserrat)", fontSize: { xs: "18px", md: "20px" } }}>
                  Discount
                </Typography>
              </Box>
              <Typography sx={{ color: "#202727", fontWeight: 400, fontFamily: "var(--font-montserrat)", fontSize: { xs: "14px", md: "16px" }, mt: 1, mb: 3, zIndex: 2 }}>
                on your first purchase
              </Typography>
              <Button 
                variant="contained" 
                sx={{ 
                  backgroundColor: "#000000", 
                  color: "#FFFFFF", 
                  borderRadius: "16px", 
                  textTransform: "none",
                  fontFamily: "var(--font-montserrat)",
                  px: 4,
                  py: 1,
                  zIndex: 2,
                  '&:hover': { backgroundColor: "#333333" }
                }}
              >
                Shop now
              </Button>
              <Box sx={{ position: "absolute", right: "-10%", top: 0, width: "200px", height: "200px", background: "#D9D9D9", transform: "rotate(-20deg)", zIndex: 1, opacity: 0.1 }} />
            </Box>
        </Box>

        <Box sx={{ flex: 1 }}>
           <Box 
              sx={{ 
                backgroundColor: "#EFEFEF", 
                borderRadius: "18px", 
                boxShadow: "5px 5px 25px rgba(0, 0, 0, 0.25)",
                p: { xs: 3, md: 5 },
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
                minHeight: "250px",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, zIndex: 2 }}>
                <Typography sx={{ color: "#FF3939", fontWeight: 700, fontFamily: "var(--font-montserrat)", fontSize: { xs: "20px", md: "24px" } }}>
                  -20%
                </Typography>
                <Typography sx={{ color: "#FF3939", fontWeight: 700, fontFamily: "var(--font-montserrat)", fontSize: { xs: "18px", md: "20px" } }}>
                  Discount
                </Typography>
              </Box>
              <Typography sx={{ color: "#202727", fontWeight: 400, fontFamily: "var(--font-montserrat)", fontSize: { xs: "14px", md: "16px" }, mt: 1, mb: 3, zIndex: 2 }}>
                on your first purchase
              </Typography>
              <Button 
                variant="contained" 
                sx={{ 
                  backgroundColor: "#000000", 
                  color: "#FFFFFF", 
                  borderRadius: "16px", 
                  textTransform: "none",
                  fontFamily: "var(--font-montserrat)",
                  px: 4,
                  py: 1,
                  zIndex: 2,
                  '&:hover': { backgroundColor: "#333333" }
                }}
              >
                Shop now
              </Button>
              <Box sx={{ position: "absolute", right: "-10%", top: 0, width: "200px", height: "200px", background: "#D9D9D9", transform: "rotate(20deg)", zIndex: 1, opacity: 0.1 }} />
            </Box>
        </Box>
      </Box>
    </Container>
  );
}
