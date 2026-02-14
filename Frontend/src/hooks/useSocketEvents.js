import { useEffect } from 'react';
import socketService from '@/services/socket';
import useChatStore from '@/store/chatStore';
import useAuthStore from '@/store/authStore';
import useTicketStore from '@/store/ticketStore';

const useSocketEvents = () => {
    const { isAuthenticated, user } = useAuthStore();
    const { addMessage } = useChatStore();

    const { tickets, initializeSocket } = useTicketStore();

    useEffect(() => {
        if (isAuthenticated && user) {
            // Connect socket
            socketService.connect(user);

            // Set up chat listeners
            socketService.onMessageReceived((message) => {
                console.log('New message received via socket:', message);
                addMessage(message);
            });

            // Set up support ticket listeners globally
            initializeSocket(user._id || user.id);

            return () => {
                // socketService.disconnect();
            };
        }
    }, [isAuthenticated, user, addMessage, initializeSocket]);
};

export default useSocketEvents;
