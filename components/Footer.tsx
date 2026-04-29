import Link from 'next/link';
import type React from 'react';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-card py-6">
      <div className="mx-auto text-center">
        <Link
          href="https://nandanvarma.com"
          className="text-muted-foreground text-sm hover:text-foreground transition-colors"
        >
          &copy; {year} Nandan Varma
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
