import React from "react";
import Link from "next/link";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Button from "@mui/material/Button";

function revisedRandId() {
  return Math.random().toString(36).replace(/[^a-z]+/g, "").substr(2, 10);
}

const buttonStyle = {
  padding: "2rem",
  width: "20rem"
}

const Index = () => {
  return (
    <>
      <NavBar />

      <div
        style={{
          backgroundSize: "cover",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            padding: "20px",
          }}
        >
          <Button style={buttonStyle} variant="contained" color="primary" component={Link} href={"/vsAI"}>
            Play with AI
          </Button>
          <br />
          <br />
          <Button
            style={buttonStyle}
            variant="contained"
            color="primary"
            component={Link}
            href={"/" + revisedRandId()}
          >
            Play with friend
          </Button>
          <br />
          <br />
          <Button style={buttonStyle} variant="contained" color="primary" component={Link} href={"/board"}>
            Play Over Board
          </Button>
        </div>
      </div>
    </>
  );
};

export default Index;
