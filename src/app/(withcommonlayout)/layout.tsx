
import Footer from '@/src/components/share/Footer';
import Navbar from '@/src/components/share/Navbar';
import React, { ReactNode } from 'react';
interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <Navbar
       />
      <div className="">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;