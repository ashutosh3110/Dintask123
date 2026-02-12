import { create } from 'zustand';
import api from '@/lib/api';
import { toast } from 'sonner';
import socketService from '@/services/socket';

const useTicketStore = create((set, get) => ({
    tickets: [],
    loading: false,
    error: null,
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        pages: 1
    },

    stats: {
        avgFeedback: 0,
        resolvedRate: 0,
        inTimeResolution: 0
    },

    fetchTicketStats: async () => {
        try {
            const res = await api('/support-tickets/stats');
            if (res.success) {
                set({ stats: res.data });
            }
        } catch (err) {
            console.error("Fetch Stats Error:", err);
        }
    },

    fetchTickets: async ({ page = 1, limit = 10, search = '', scope = 'all' } = {}) => {
        set({ loading: true, error: null });
        try {
            const queryParams = new URLSearchParams({
                page,
                limit,
                search,
                scope
            });
            const res = await api(`/support-tickets?${queryParams.toString()}`);
            set({
                tickets: res.data || [],
                pagination: res.pagination || { page, limit, total: 0, pages: 1 },
                loading: false
            });
        } catch (err) {
            console.error("Fetch Tickets Error:", err);
            set({ error: err.message, loading: false });
        }
    },

    deleteTicket: async (id) => {
        try {
            const res = await api(`/support-tickets/${id}`, { method: 'DELETE' });
            if (res.success) {
                set(state => ({
                    tickets: state.tickets.filter(t => t._id !== id)
                }));
                get().fetchTickets(get().pagination);
                get().fetchTicketStats();

                // Background re-fetch for global state synchronization
                import('./adminStore').then(m => m.default.getState().fetchDashboardStats())
                    .catch(err => console.error("Background sync error:", err));

                toast.success('Ticket deleted successfully');
                return true;
            }
        } catch (err) {
            console.error("Delete Ticket Error:", err);
            toast.error(err.message || 'Failed to delete ticket');
            return false;
        }
    },

    addTicket: async (ticketData) => {
        set({ loading: true });
        try {
            // Map frontend fields to backend fields
            const payload = {
                title: ticketData.subject,
                description: ticketData.description,
                type: ticketData.category,
                priority: ticketData.priority,
                attachments: ticketData.attachments
            };

            const res = await api('/support-tickets', {
                method: 'POST',
                body: payload
            });

            if (res.success) {
                set((state) => ({
                    tickets: [res.data, ...state.tickets],
                    loading: false
                }));
                get().fetchTickets(get().pagination);
                get().fetchTicketStats();

                // Background re-fetch for global state synchronization
                import('./adminStore').then(m => m.default.getState().fetchDashboardStats())
                    .catch(err => console.error("Background sync error:", err));

                toast.success('Ticket created successfully');
                return true;
            }
        } catch (err) {
            console.error("Create Ticket Error:", err);
            toast.error(err.message || 'Failed to create ticket');
            set({ loading: false });
            return false;
        }
    },

    updateTicketStatus: async (id, status) => {
        // Optimistic update
        const originalTickets = get().tickets;
        set((state) => ({
            tickets: state.tickets.map((t) =>
                t._id === id ? { ...t, status } : t
            )
        }));

        try {
            await api(`/support-tickets/${id}`, {
                method: 'PUT',
                body: { status }
            });
            get().fetchTickets(get().pagination);
            get().fetchTicketStats();

            // Background re-fetch for global state synchronization
            import('./adminStore').then(m => m.default.getState().fetchDashboardStats())
                .catch(err => console.error("Background sync error:", err));

            toast.success(`Ticket marked as ${status}`);
        } catch (err) {
            console.error("Update Ticket Error:", err);
            toast.error(err.message || 'Failed to update ticket');
            // Revert
            set({ tickets: originalTickets });
        }
    },

    replyToTicket: async (id, message) => {
        try {
            const res = await api(`/support-tickets/${id}`, {
                method: 'PUT',
                body: { response: message }
            });

            // Update local state with the returned updated ticket
            set((state) => ({
                tickets: state.tickets.map((t) =>
                    t._id === id ? res.data : t // Backend returns fully populated updated ticket
                )
            }));

            toast.success('Reply sent successfully');
            return true;
        } catch (err) {
            console.error("Reply Error:", err);
            toast.error(err.message || 'Failed to send reply');
            return false;
        }
    },

    escalateTicket: async (id) => {
        try {
            const res = await api(`/support-tickets/${id}`, {
                method: 'PUT',
                body: { isEscalatedToSuperAdmin: true, status: 'Escalated' }
            });

            set((state) => ({
                tickets: state.tickets.map((t) =>
                    t._id === id ? res.data : t
                )
            }));

            toast.success('Ticket escalated to Super Admin');
            return true;
        } catch (err) {
            console.error("Escalation Error:", err);
            toast.error(err.message || 'Failed to escalate ticket');
            return false;
        }
    },

    giveFeedback: async (id, rating, feedback) => {
        try {
            const res = await api(`/support-tickets/${id}`, {
                method: 'PUT',
                body: { rating, feedback, status: 'Closed' }
            });

            set((state) => ({
                tickets: state.tickets.map((t) =>
                    t._id === id ? res.data : t
                )
            }));

            toast.success('Thank you for your feedback!');
            return true;
        } catch (err) {
            console.error("Feedback Error:", err);
            toast.error(err.message || 'Failed to submit feedback');
            return false;
        }
    },

    initializeSocket: (userId) => {
        socketService.onSupportResponse(({ ticketId, updatedTicket }) => {
            set((state) => ({
                tickets: state.tickets.map((t) =>
                    t._id === ticketId ? updatedTicket : t
                )
            }));

            // Optional: If we want to show a toast if the user is not looking at the ticket
            // But usually, real-time update in the view is enough.
        });

        socketService.onSupportTicket((newTicket) => {
            // Check if it belongs to current admin/company
            // Actually the backend already emits to the correct room if not escalated.
            // If escalated, it might be for SuperAdmin.
            set((state) => ({
                tickets: [newTicket, ...state.tickets]
            }));
            toast.info(`New support ticket: ${newTicket.title}`);
        });
    },

    uploadFiles: async (files) => {
        const formData = new FormData();
        if (files.length === 1) {
            formData.append('image', files[0]);
            try {
                const res = await api('/upload', {
                    method: 'POST',
                    body: formData
                });
                return [res.imageUrl];
            } catch (err) {
                console.error("Upload Error:", err);
                toast.error("Failed to upload file");
                return [];
            }
        } else {
            files.forEach(file => formData.append('files', file));
            try {
                const res = await api('/upload/multiple', {
                    method: 'POST',
                    body: formData
                });
                return res.urls;
            } catch (err) {
                console.error("Upload Error:", err);
                toast.error("Failed to upload files");
                return [];
            }
        }
    }
}));

export default useTicketStore;
