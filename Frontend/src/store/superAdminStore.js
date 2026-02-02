import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useSuperAdminStore = create(
    persist(
        (set, get) => ({
            admins: [
                {
                    id: 'adm-1',
                    name: 'Tech Solutions Inc.',
                    owner: 'John Boss',
                    email: 'admin@demo.com',
                    status: 'active',
                    plan: 'Pro Team',
                    employees: 4,
                    tasks: 12,
                    joinedDate: '2025-10-15'
                },
                {
                    id: 'adm-2',
                    name: 'Creative Agency',
                    owner: 'Sarah Boss',
                    email: 'sarah@creative.com',
                    status: 'pending',
                    plan: 'Starter',
                    employees: 1,
                    tasks: 2,
                    joinedDate: '2026-01-02'
                },
                {
                    id: 'adm-3',
                    name: 'Global Logistics',
                    owner: 'Mike Boss',
                    email: 'mike@logistics.com',
                    status: 'suspended',
                    plan: 'Business',
                    employees: 18,
                    tasks: 145,
                    joinedDate: '2025-05-20'
                }
            ],

            plans: [
                { id: 'p1', name: 'Starter', price: 999, limit: 2, isActive: true },
                { id: 'p2', name: 'Pro Team', price: 2499, limit: 5, isActive: true },
                { id: 'p3', name: 'Business', price: 4999, limit: 20, isActive: true },
                { id: 'p4', name: 'Trial Plan', price: 2499, limit: 5, isActive: true, trialDays: 7 },
                { id: 'p5', name: 'Enterprise', price: 9999, limit: 100, isActive: true, trialDays: 7 }
            ],

            stats: {
                totalRevenue: 485000,
                activeCompanies: 12,
                avgCompletionRate: 92
            },

            systemSettings: {
                platformName: 'DinTask CRM',
                supportEmail: 'support@dintask.com',
                maintenanceMode: false,
                force2FA: true,
                sessionTimeout: 24 // hours
            },

            updateSystemSettings: (settings) => {
                set((state) => ({
                    systemSettings: { ...state.systemSettings, ...settings }
                }));
            },

            updateAdminStatus: (id, status) => {
                set((state) => ({
                    admins: state.admins.map((adm) =>
                        adm.id === id ? { ...adm, status } : adm
                    ),
                }));
            },

            deleteAdmin: (id) => {
                set((state) => ({
                    admins: state.admins.filter((adm) => adm.id !== id),
                }));
            },

            addPlan: (newPlan) => {
                set((state) => ({
                    plans: [...state.plans, { ...newPlan, id: `p${Date.now()}` }]
                }));
            },

            updatePlan: (id, updatedPlan) => {
                set((state) => ({
                    plans: state.plans.map((p) =>
                        p.id === id ? { ...p, ...updatedPlan } : p
                    ),
                }));
            }
        }),
        {
            name: 'dintask-superadmin-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);

export default useSuperAdminStore;
