import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const UserDashboard = () => {
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name') || 'Student';

    return (
        <div className="min-h-screen flex flex-col bg-bg-soft">
            <Navbar />
            <main className="flex-1 py-[60px]">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="animate-up">
                        <div className="mb-12">
                            <span className="badge badge-primary mb-4">Connected as {role}</span>
                            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight leading-tight">Welcome, {name}</h1>
                            <p className="text-text-muted text-lg md:text-xl max-w-[600px]">
                                This is your personalized dashboard. Manage your technical inquiries, access course materials, and track your global progress in the UniFlow ecosystem.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            <div className="card glass-dark p-10 border-none bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
                                <h3 className="mb-6 text-white/90 text-sm md:text-base font-medium uppercase tracking-widest">Current Status</h3>
                                <div className="text-4xl md:text-5xl font-extrabold mb-4">Active Flow</div>
                                <p className="text-white/60">Your account is in good standing. All services are operational.</p>
                            </div>

                            <div className="card p-10">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg md:text-xl text-text-main font-semibold tracking-tight">Notifications</h3>
                                    <div className="w-2.5 h-2.5 bg-error rounded-full animate-pulse"></div>
                                </div>
                                <div className="flex flex-col gap-5">
                                    <p className="text-[0.95rem] text-text-main font-medium"> <span className="text-primary mr-2">•</span> Global Seminar starts tomorrow</p>
                                    <p className="text-[0.95rem] text-text-muted"> <span className="text-primary mr-2">•</span> Your profile update is complete</p>
                                    <p className="text-[0.95rem] text-text-muted"> <span className="text-primary mr-2">•</span> 2 New resources added to Labs</p>
                                </div>
                            </div>

                            <div className="card p-10">
                                <h3 className="mb-6 text-lg md:text-xl font-semibold">Quick Actions</h3>
                                <div className="grid gap-4">
                                    <button className="btn btn-outline !justify-start text-left">Browse Innovation Portal</button>
                                    <button className="btn btn-outline !justify-start text-left">Contact Faculty Lab</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default UserDashboard;
