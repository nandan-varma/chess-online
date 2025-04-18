import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-24 w-full fixed bottom-0">
      <Link href="https://nandanvarma.com" className="text-gray-600 text-sm">
        &copy; {new Date().getFullYear()} Nandan Varma
      </Link>
    </div>
  );
};

export default Footer;
