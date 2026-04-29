import React, { useEffect, useState } from "react";
import Link from "next/link";

const Footer: React.FC = () => {
  const [year, setYear] = useState<number>(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="w-full border-t bg-card py-6">
      <div className="mx-auto text-center">
        <Link href="https://nandanvarma.com" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
          &copy; {year} Nandan Varma
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
