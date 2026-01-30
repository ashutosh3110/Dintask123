import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import mockSales from '../data/mockSales.json';

const useSalesStore = create(
    persist(
        (set, get) => ({
            salesReps: mockSales,
            loading: false,
            error: null,
            
            // Sales activities store
            salesActivities: [
                {
                    id: 'ACT001',
                    type: 'call',
                    title: 'Follow-up call with ABC Corp',
                    description: 'Discuss proposal details',
                    clientId: 'C001',
                    dealId: 'D001',
                    salesRepId: 'S001',
                    date: '2026-01-28T14:00:00',
                    duration: '30',
                    outcome: 'positive',
                    createdAt: '2026-01-28T14:30:00'
                },
                {
                    id: 'ACT002',
                    type: 'email',
                    title: 'Send proposal to XYZ Ltd',
                    description: 'Sent detailed proposal for software solution',
                    clientId: 'C002',
                    dealId: 'D002',
                    salesRepId: 'S001',
                    date: '2026-01-27T10:15:00',
                    duration: null,
                    outcome: 'sent',
                    createdAt: '2026-01-27T10:15:00'
                },
                {
                    id: 'ACT003',
                    type: 'meeting',
                    title: 'Client meeting with Global Tech',
                    description: 'In-person meeting to discuss requirements',
                    clientId: 'C005',
                    dealId: null,
                    salesRepId: 'S001',
                    date: '2026-01-29T11:00:00',
                    duration: '60',
                    outcome: 'scheduled',
                    createdAt: '2026-01-26T16:45:00'
                }
            ],

            fetchSalesReps: async () => {
                set({ loading: true });
                // Simulate API delay
                await new Promise((resolve) => setTimeout(resolve, 500));
                set({ loading: false });
            },

            addSalesRep: (salesRep) => {
                set((state) => ({
                    salesReps: [
                        ...state.salesReps,
                        {
                            ...salesRep,
                            id: `S${Date.now()}`,
                            status: 'active',
                            totalSales: 0,
                            activeDeals: 0,
                            conversionRate: 0,
                            clients: 0,
                            performance: [],
                            recentSales: []
                        },
                    ],
                }));
            },

            updateSalesRep: (salesRepId, updatedData) => {
                set((state) => ({
                    salesReps: state.salesReps.map((salesRep) =>
                        salesRep.id === salesRepId ? { ...salesRep, ...updatedData } : salesRep
                    ),
                }));
            },

            deleteSalesRep: (salesRepId) => {
                set((state) => ({
                    salesReps: state.salesReps.filter((salesRep) => salesRep.id !== salesRepId),
                }));
            },

            getSalesRepByEmail: (email) => {
                return get().salesReps.find(s => s.email === email);
            },

            getSalesRepById: (id) => {
                return get().salesReps.find(s => s.id === id);
            },

            // Sales activities methods
            addSalesActivity: (activity) => {
                set((state) => ({
                    salesActivities: [
                        ...state.salesActivities,
                        {
                            ...activity,
                            id: `ACT${Date.now()}`,
                            createdAt: new Date().toISOString()
                        }
                    ]
                }));
            },

            updateSalesActivity: (activityId, updatedData) => {
                set((state) => ({
                    salesActivities: state.salesActivities.map((activity) =>
                        activity.id === activityId ? { ...activity, ...updatedData } : activity
                    )
                }));
            },

            deleteSalesActivity: (activityId) => {
                set((state) => ({
                    salesActivities: state.salesActivities.filter((activity) => activity.id !== activityId)
                }));
            },

            getActivitiesByClientId: (clientId) => {
                return get().salesActivities.filter(activity => activity.clientId === clientId);
            },

            getActivitiesByDealId: (dealId) => {
                return get().salesActivities.filter(activity => activity.dealId === dealId);
            },

            getActivitiesBySalesRepId: (salesRepId) => {
                return get().salesActivities.filter(activity => activity.salesRepId === salesRepId);
            },

            getRecentActivities: (limit = 10) => {
                return get().salesActivities
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, limit);
            }
        }),
        {
            name: 'dintask-sales-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);

export default useSalesStore;