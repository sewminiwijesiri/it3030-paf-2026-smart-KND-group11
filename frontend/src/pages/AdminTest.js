import React, { useState } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';


const AdminTest = () => {
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    const callAdmin = async () => {
        setLoading(true);
        setResult('');

        try {
            const response = await api.get('/admin/test');

            console.log('Admin test response:', response.data);
            setResult(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
            alert('API Success: ' + (typeof response.data === 'string' ? response.data : JSON.stringify(response.data)));
        } catch (err) {
            console.error('Admin test error:', err);
            const errorMsg = err.response?.data?.message || err.message || 'Access Denied';
            setResult('Error: ' + errorMsg);
            alert('API Failed: ' + errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-bg-soft">
            <Navbar />
            <main className="flex-1 flex items-center justify-center p-8">
                <div className="card glass animate-up w-full max-w-2xl p-10 text-center shadow-2xl">
                    <div className="mb-10">
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-primary tracking-tight">Admin Dashboard</h2>
                        <p className="text-slate-500">Welcome to the protected admin area. Your role is: <strong className="text-slate-900">{role}</strong></p>
                    </div>

                    <div className="p-10 bg-slate-900/5 rounded-2xl border border-slate-200 mb-8">
                        <h4 className="mb-6 text-xl font-bold text-slate-800 tracking-tight">Protected API Test</h4>
                        <p className="text-sm text-slate-500 mb-8">
                            Click the button below to test the protected <code className="bg-slate-200 px-1.5 py-0.5 rounded">GET /admin/test</code> endpoint using your JWT token.
                        </p>
                        
                        <button 
                            onClick={callAdmin} 
                            className="btn btn-primary !px-12 !py-4 shadow-xl shadow-primary/20" 
                            disabled={loading || !token}
                        >
                            {loading ? 'Calling API...' : 'Call Admin API'}
                        </button>
                    </div>

                    {result && (
                        <div className={`p-6 rounded-xl font-semibold font-mono text-left break-all ${result.startsWith('Error') ? 'bg-error/10 text-error' : 'bg-success/10 text-success'}`}>
                             {result}
                        </div>
                    )}

                    {!token && (
                        <div className="text-error mt-4 font-bold animate-pulse">
                            No JWT token found. Please login first.
                        </div>
                    )}
                </div>
            </main>

        </div>
    );
};

export default AdminTest;
