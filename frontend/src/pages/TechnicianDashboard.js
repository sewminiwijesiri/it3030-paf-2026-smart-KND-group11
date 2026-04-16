import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TechnicianDashboard = () => {
    return (
        <div className="min-h-screen flex flex-col bg-bg-soft">
            <Navbar />
            <main className="flex-1 px-4 py-12 md:px-8 max-w-7xl mx-auto w-full">
                <div className="card glass animate-up p-8 md:p-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-primary tracking-tight">Technician Dashboard</h1>
                    <p className="text-text-muted text-lg md:text-xl leading-relaxed max-w-3xl">
                        Welcome, Technician. Keep track of your assigned tasks and update the status of service requests.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                        <div className="card bg-white/50 backdrop-blur-sm p-8 border-none shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-lg font-semibold mb-4 text-text-main">Pending Tasks</h3>
                            <p className="text-4xl md:text-5xl font-bold text-primary">0</p>
                        </div>
                        <div className="card bg-white/50 backdrop-blur-sm p-8 border-none shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-lg font-semibold mb-4 text-text-main">Completed Jobs</h3>
                            <p className="text-4xl md:text-5xl font-bold text-secondary">0</p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default TechnicianDashboard;
