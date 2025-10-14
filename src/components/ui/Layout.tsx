
import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-gray-50">
      {/* <header className="py-6 px-8 flex items-center justify-center border-b border-gray-100">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-5xl"
        >
          <h1 className="text-2xl font-semibold text-mdii-black flex items-center">
            <span className="text-mdii-purple">MDII</span>
            <span className="mx-2 text-gray-300">|</span>
            <span>Evaluation Tool</span>
          </h1>
        </motion.div>
      </header> */}
      
      <main className="flex-1 flex flex-col">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex flex-col"
        >
          {children}
        </motion.div>
      </main>
      
      {/* <footer className="py-4 px-8 border-t border-gray-100">
        <div className="w-full max-w-5xl mx-auto text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} MDII Evaluation</p>
        </div>
      </footer> */}
    </div>
  );
};

export default Layout;
