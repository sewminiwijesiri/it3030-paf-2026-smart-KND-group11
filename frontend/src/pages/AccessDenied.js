import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';


const AccessDenied = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col bg-bg-soft">
            <Navbar />
            <main className="flex-1 flex items-center justify-center p-8">
                <div className="card glass animate-up w-full max-w-2xl p-12 text-center shadow-2xl">
                    <div className="text-8xl mb-6">🚫</div>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-error tracking-tight">
                        Access Denied
                    </h1>
                    <p className="text-lg text-slate-500 mb-10 max-w-md mx-auto leading-relaxed">
                        You do not have the required permissions to view this page. 
                        If you believe this is an error, please contact your administrator.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <button 
                            onClick={() => navigate(-1)} 
                            className="btn btn-outline !px-8 !py-3"
                        >
                            Go Back
                        </button>
                        <button 
                            onClick={() => navigate('/')} 
                            className="btn btn-primary !px-8 !py-3"
                        >
                            Return Home
                        </button>
                    </div>
                </div>
            </main>

        </div>
    );
};

export default AccessDenied;
