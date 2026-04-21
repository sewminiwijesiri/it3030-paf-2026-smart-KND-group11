import React from 'react';
import Navbar from './Navbar';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F1F5F9]">
      <Navbar />
      <div className="flex flex-1 pt-[2px]"> {/* Small offset for navbar border */}
        <AdminSidebar />
        <main className="flex-1 lg:ml-72 transition-all duration-300">
          <div className="p-4 md:p-8 lg:p-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
