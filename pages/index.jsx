import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Footer from '@/components/Footer'

function revisedRandId() {
  return Math.random().toString(36).replace(/[^a-z]+/g, "").substr(2, 10);
}


const Index = () => {
  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-screen bg-cover p-5 gap-5 bg-gray-900">
        <Link href="/vsAI">
          <Button variant={"outline"}>
            Play with AI
          </Button>
        </Link>
        <Link href={"/" + revisedRandId()}>
          <Button variant={"outline"}>
            Play with friend
          </Button>
        </Link>
        <Link href="/board">
          <Button variant={"outline"}>
            Play Over Board
          </Button>
        </Link>
        <Footer />
      </div>
    </>
  );
};

export default Index;
