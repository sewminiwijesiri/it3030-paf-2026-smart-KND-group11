import React, { useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import toast from 'react-hot-toast';
import { Bell } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const NotificationListener = () => {
    const { addNotification } = useNotifications();

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const email = localStorage.getItem('email');

    useEffect(() => {
        // Only connect if user is logged in
        if (!token || !role) {
            console.log('No token or role found, skipping WebSocket connection');
            return;
        }

        let stompClient = null;

        const connect = () => {
            console.log(`Initializing WebSocket for role: ${role}, email: ${email}`);
            const socket = new SockJS('http://localhost:8081/ws-notifications');
            stompClient = new Client({
                webSocketFactory: () => socket,
                debug: (str) => {
                    console.log('STOMP Debug:', str);
                },
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
            });

            stompClient.onConnect = (frame) => {
                console.log('CONNECTED TO STOMP BROKER');
                
                // Subscribe to admin notifications if role is ADMIN
                if (role === 'ADMIN') {
                    console.log('Subscribing to: /topic/admin-notifications');
                    stompClient.subscribe('/topic/admin-notifications', (notification) => {
                        const data = JSON.parse(notification.body);
                        console.log('RECEIVED ADMIN NOTIFICATION:', data);
                        addNotification(data);
                        showNotification(data);
                    });
                }

                // Subscribe to user-specific notifications if email exists
                if (email) {
                    const userTopic = `/topic/user/${email}/notifications`;
                    console.log(`Subscribing to: ${userTopic}`);
                    stompClient.subscribe(userTopic, (notification) => {
                        const data = JSON.parse(notification.body);
                        console.log('RECEIVED USER NOTIFICATION:', data);
                        addNotification(data);
                        showNotification(data);
                    });
                }
            };

            stompClient.onStompError = (frame) => {
                console.error('STOMP ERROR:', frame.headers['message']);
                console.error('STOMP DETAILS:', frame.body);
            };

            stompClient.activate();
        };

        connect();

        return () => {
            console.log('Deactivating WebSocket connection');
            if (stompClient) {
                stompClient.deactivate();
            }
        };
    }, [token, role, email, addNotification]);

    const showNotification = (data) => {
        toast.custom((t) => (
            <div
                className={`${
                    t.visible ? 'animate-enter' : 'animate-leave'
                } max-w-md w-full bg-slate-900 shadow-2xl rounded-xl pointer-events-auto flex ring-1 ring-yellow-500/20 border border-yellow-500/30 overflow-hidden`}
            >
                <div className="flex-1 w-0 p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 pt-0.5">
                            <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                                <Bell className="h-5 w-5 text-yellow-500" />
                            </div>
                        </div>
                        <div className="ml-3 flex-1">
                            <p className="text-sm font-bold text-yellow-500">
                                {data.title}
                            </p>
                            <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                                {data.message}
                            </p>
                            {data.targetUrl && (
                                <button
                                    onClick={() => {
                                        window.location.href = data.targetUrl;
                                        toast.dismiss(t.id);
                                    }}
                                    className="mt-2 text-[10px] font-bold text-yellow-500 hover:text-yellow-400 uppercase tracking-wider flex items-center gap-1 transition-colors"
                                >
                                    View Details →
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex border-l border-slate-800">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-xs font-medium text-slate-500 hover:text-slate-400 focus:outline-none"
                    >
                        Close
                    </button>
                </div>
            </div>
        ), {
            duration: 6000,
            position: 'top-right',
        });
    };

    return null; // This component doesn't render anything itself
};

export default NotificationListener;
