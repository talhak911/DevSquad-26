import { Box, Typography } from "@mui/material";

export default function Categories() {
  return (
    <Box sx={{ width: "100%", maxWidth: "1600px", mx: "auto", py: { xs: 4, md: 8 }, px: { xs: 2, sm: 4, md: 6, lg: 8 } }}>
      <Typography 
        sx={{ 
          fontFamily: "var(--font-montserrat)", 
          fontWeight: 700, 
          fontSize: { xs: "20px", md: "24px" },
          mb: 4
        }}
      >
        Buy by category
      </Typography>

      {/* Structured flexbox layout */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
        
        {/* Row 1: WORKOUT */}
        <Box sx={{ display: "flex", flexDirection: { xs: "column-reverse", md: "row" }, height: { xs: "auto", md: "400px" } }}>
          <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", p: 4, backgroundColor: "#FFFFFF" }}>
            <Typography sx={{ fontFamily: "var(--font-montserrat)", fontWeight: 900, fontStyle: "italic", fontSize: { xs: "24px", md: "36px" }, letterSpacing: "0.2em", color: "#000000" }}>
              WORKOUT
            </Typography>
          </Box>
          <Box sx={{ flex: 1, backgroundColor: "#EAEAEA", height: { xs: "250px", md: "100%" }, backgroundSize: "cover", backgroundPosition: "center" }} />
        </Box>

        {/* Row 2: RUN */}
        <Box sx={{ display: "flex", flexDirection: { xs: "column-reverse", md: "row" }, height: { xs: "auto", md: "400px" } }}>
          <Box sx={{ flex: 1, backgroundColor: "#2D2D2D", height: { xs: "250px", md: "100%" }, backgroundSize: "cover", backgroundPosition: "center" }} />
          <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", p: 4, backgroundColor: "#FFFFFF" }}>
            <Typography sx={{ fontFamily: "var(--font-montserrat)", fontWeight: 900, fontStyle: "italic", fontSize: { xs: "24px", md: "36px" }, letterSpacing: "0.2em", color: "#000000" }}>
              RUN
            </Typography>
          </Box>
        </Box>

        {/* Row 3: FOOTBALL */}
        <Box sx={{ display: "flex", flexDirection: { xs: "column-reverse", md: "row" }, height: { xs: "auto", md: "400px" } }}>
          <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", p: 4, backgroundColor: "#FFFFFF" }}>
            <Typography sx={{ fontFamily: "var(--font-montserrat)", fontWeight: 900, fontStyle: "italic", fontSize: { xs: "24px", md: "36px" }, letterSpacing: "0.2em", color: "#000000" }}>
              FOOTBALL
            </Typography>
          </Box>
          <Box sx={{ flex: 1, backgroundColor: "#A05A42", height: { xs: "250px", md: "100%" }, backgroundSize: "cover", backgroundPosition: "center" }} />
        </Box>

      </Box>
    </Box>
  );
}
