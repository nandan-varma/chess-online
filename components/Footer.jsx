import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const Footer = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100px",
        backgroundColor: "#f5f5f5",
        width: "100%",
        position: "fixed",
        bottom: "0",
      }}
    >
      <Typography variant="body2" color="textSecondary">
        Your App Footer
      </Typography>
    </Box>
  );
};

export default Footer;
