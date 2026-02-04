import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useChatStore = create(
    persist(
        (set, get) => ({
            messages: [
                {
                    id: 'msg-1',
                    senderId: 'emp-1',
                    receiverId: 'manager-1',
                    text: 'Hello Manager, I have a question regarding the task.',
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
                    taskId: 'task-1'
                },
                {
                    id: 'msg-2',
                    senderId: 'manager-1',
                    receiverId: 'emp-1',
                    text: 'Sure, what is it?',
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(), // 1 hour ago
                    taskId: 'task-1'
                }
            ],

            sendMessage: (senderId, receiverId, text, taskId = null) => {
                const newMessage = {
                    id: `msg-${Date.now()}`,
                    senderId,
                    receiverId,
                    text,
                    timestamp: new Date().toISOString(),
                    taskId
                };
                set((state) => ({
                    messages: [...state.messages, newMessage]
                }));
            },

            getChatPartner: (currentUserId, partnerId) => {
                return get().messages.filter(msg =>
                    (msg.senderId === currentUserId && msg.receiverId === partnerId) ||
                    (msg.senderId === partnerId && msg.receiverId === currentUserId)
                );
            },

            getLatestMessagesForUser: (userId) => {
                const userMessages = get().messages.filter(msg => msg.senderId === userId || msg.receiverId === userId);
                const partners = new Set();
                userMessages.forEach(msg => {
                    partners.add(msg.senderId === userId ? msg.receiverId : msg.senderId);
                });

                return Array.from(partners).map(partnerId => {
                    const partnerMsgs = userMessages.filter(msg => msg.senderId === partnerId || msg.receiverId === partnerId);
                    return partnerMsgs[partnerMsgs.length - 1];
                });
            }
        }),
        {
            name: 'chat-storage',
        }
    )
);

export default useChatStore;
