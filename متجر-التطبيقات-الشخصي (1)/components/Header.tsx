
import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/80 backdrop-blur-sm shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/">
            <h1 className="text-2xl font-bold text-white tracking-wider">متجر <span className="text-cyan-400">التطبيقات</span></h1>
        </Link>
        <Link to="/admin" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors">
          لوحة التحكم
        </Link>
      </div>
    </header>
  );
};

export default Header;
