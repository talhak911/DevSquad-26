import { Box, Typography, Container } from "@mui/material";

export default function Footer() {
  return (
    <Box>
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography 
          sx={{ 
            fontFamily: "var(--font-montserrat)", 
            fontWeight: 400, 
            fontSize: "14px",
            color: "#666666",
            textTransform: "uppercase",
            mb: 2
          }}
        >
          THANKS FOR WATCHING
        </Typography>
        <Typography 
          sx={{ 
            fontFamily: "var(--font-montserrat)", 
            fontWeight: 900, 
            fontStyle: "italic",
            fontSize: { xs: "28px", md: "48px" },
            color: "#000000",
            mb: 4
          }}
        >
          Glory to Ukraine
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 8 }}>
          <Box sx={{ width: "80px", height: "50px", display: "flex", flexDirection: "column" }}>
             <Box sx={{ flex: 1, backgroundColor: "#53C8FB" }} />
             <Box sx={{ flex: 1, backgroundColor: "#FFED46" }} />
          </Box>
        </Box>
      </Box>

      {/* Black footer bottom section */}
      <Box sx={{ backgroundColor: "#000000", minHeight: "320px", py: 6, color: "#FFFFFF" }}>
        <Container maxWidth="xl">
          <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4, alignItems: "center", justifyContent: "space-between", textAlign: { xs: "center", md: "left" } }}>
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 3, alignItems: { xs: "center", md: "flex-start" } }}>
              <Typography sx={{ fontFamily: "var(--font-montserrat)", fontSize: "18px", fontWeight: 700 }}>ALL</Typography>
              <Typography sx={{ fontFamily: "var(--font-montserrat)", fontSize: "20px" }}>WOMAN</Typography>
              <Typography sx={{ fontFamily: "var(--font-montserrat)", fontSize: "18px" }}>MEN</Typography>
            </Box>

            <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
               <Box 
                 sx={{ 
                   width: "220px", 
                   height: "220px", 
                   border: "5px solid #FFFFFF", 
                   borderRadius: "50%", 
                   position: "relative",
                   display: "flex",
                   justifyContent: "center",
                   alignItems: "center"
                  }}
               >
                 <Box 
                  sx={{
                    position: "absolute",
                    width: "150px",
                    height: "150px",
                    background: "url('/design-and-css/desktop.png')", // Fallback for the nike tick outline
                    backgroundSize: "cover",
                    opacity: 0.2
                  }}
                 />
                 <Typography 
                   sx={{ 
                      fontFamily: "var(--font-montserrat)", 
                      fontSize: "14px", 
                      textAlign: "center",
                      textTransform: "uppercase",
                      letterSpacing: "0.2em",
                      position: "absolute",
                      top: "10%"
                   }}
                 >
                   ВСЕ БУДЕ УКРАЇНА
                 </Typography>
                 <Typography 
                   sx={{ 
                      fontFamily: "var(--font-montserrat)", 
                      fontSize: "14px", 
                      textAlign: "center",
                      textTransform: "uppercase",
                      letterSpacing: "0.2em",
                      position: "absolute",
                      bottom: "10%"
                   }}
                 >
                   ВСЕ БУДЕ УКРАЇНА
                 </Typography>
               </Box>
            </Box>

            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 3, alignItems: { xs: "center", md: "flex-end" } }}>
              <Typography sx={{ fontFamily: "var(--font-montserrat)", fontSize: "18px", fontWeight: 700 }}>WORKOUT</Typography>
              <Typography sx={{ fontFamily: "var(--font-montserrat)", fontSize: "18px" }}>RUN</Typography>
              <Typography sx={{ fontFamily: "var(--font-montserrat)", fontSize: "20px" }}>FOOTBALL</Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
