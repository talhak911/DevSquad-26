import { Box, Typography, Container, Button } from "@mui/material";

export default function Membership() {
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 8 } }}>
      <Typography 
        sx={{ 
          fontFamily: "var(--font-montserrat)", 
          fontWeight: 700, 
          fontSize: { xs: "20px", md: "32px" },
          mb: 4,
          textTransform: "uppercase"
        }}
      >
        MORE NIKE PRODUCTS
      </Typography>

      <Box 
        sx={{ 
          width: "100%", 
          minHeight: "300px", 
          backgroundColor: "#333333",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          p: { xs: 3, md: 6 },
          backgroundImage: "url('/design-and-css/desktop.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative"
        }}
      >
        <Box sx={{ position: "absolute", width: "100%", height: "100%", top: 0, left: 0, background: "rgba(0,0,0,0.5)", zIndex: 1 }} />
        
        <Box sx={{ zIndex: 2, maxWidth: "500px" }}>
          <Typography 
            sx={{ 
              fontFamily: "var(--font-montserrat)", 
              fontWeight: 900, 
              fontStyle: "italic",
              fontSize: { xs: "32px", md: "48px" },
              color: "#FFFFFF",
              textTransform: "uppercase",
              mb: 2,
              lineHeight: 1.1
            }}
          >
            YOUR NIKE<br/>MEMBERSHIP
          </Typography>
          <Typography 
            sx={{ 
              fontFamily: "var(--font-montserrat)", 
              fontWeight: 400, 
              fontSize: { xs: "14px", md: "16px" },
              color: "#FFFFFF",
              mb: 4
            }}
          >
            Join our members and show your love with <b>Nike By You!</b>
          </Typography>
          <Button 
            variant="contained" 
            sx={{ 
              backgroundColor: "#FFFFFF", 
              color: "#000000", 
              borderRadius: "20px",
              textTransform: "none",
              fontFamily: "var(--font-montserrat)",
              fontWeight: 600,
              px: 4,
              py: 1,
              '&:hover': {
                backgroundColor: "#F0F0F0"
              }
            }}
          >
            Join Us
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
