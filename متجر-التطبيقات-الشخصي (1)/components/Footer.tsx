
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 mt-12 py-6">
      <div className="container mx-auto px-4 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} متجر التطبيقات الشخصي. جميع الحقوق محفوظة.</p>
      </div>
    </footer>
  );
};

export default Footer;
