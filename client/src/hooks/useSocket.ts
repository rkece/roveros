import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = '/'; // Proxy handles local path

export const useSocket = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socketInstance = io(SOCKET_URL, {
            path: '/socket.io',
            transports: ['websocket'],
            reconnectionAttempts: 5,
        });

        socketInstance.on('connect', () => {
            console.log('Socket Connected');
            setIsConnected(true);
        });

        socketInstance.on('disconnect', () => {
            console.log('Socket Disconnected');
            setIsConnected(false);
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    return { socket, isConnected };
};
