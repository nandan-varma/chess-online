import React from "react";
import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";

const NavBar = () => {
    const router = useRouter()
  return (
    <AppBar style={{width: "97vw", borderRadius: "24px"}} position="static">
      <Toolbar>
        <Typography variant="h6">Chess Online</Typography>
        <div style={{ marginLeft: "auto" }}>
            <Button onClick={() => {router.push("/login")}} color="inherit">Log In</Button>
            <Button onClick={() => {router.push("/signup")}} color="inherit">Sign Up</Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
