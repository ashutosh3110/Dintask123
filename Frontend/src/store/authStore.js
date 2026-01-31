import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import mockUsers from '../data/mockUsers.json';

const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            role: null,
            isAuthenticated: false,
            loading: false,
            error: null,

            login: async (email, password, selectedRole) => {
                set({ loading: true, error: null });

                // Simulate API delay
                await new Promise((resolve) => setTimeout(resolve, 800));

                let user;
                let userData;

                if (selectedRole === 'manager') {
                    // Import manager data dynamically or use from a store if available
                    // For now, checking mockUsers.json which I updated to include 'manager'
                    user = mockUsers[selectedRole];
                } else {
                    user = mockUsers[selectedRole];
                }

                if (user && user.email === email && user.password === password) {
                    userData = {
                        id: selectedRole === 'employee' ? '103' :
                            selectedRole === 'manager' ? 'M001' :
                                selectedRole === 'sales' ? 'S001' : selectedRole,
                        name: user.name,
                        email: user.email,
                    };

                    set({
                        user: userData,
                        role: selectedRole,
                        isAuthenticated: true,
                        loading: false,
                    });
                    return true;
                } else {
                    set({
                        loading: false,
                        error: 'Invalid credentials for chosen role',
                    });
                    return false;
                }
            },

            logout: () => {
                set({
                    user: null,
                    role: null,
                    isAuthenticated: false,
                    error: null,
                });
            },

            updateProfile: async (updatedData) => {
                set({ loading: true });
                // Simulate API delay
                await new Promise((resolve) => setTimeout(resolve, 800));

                set((state) => ({
                    user: { ...state.user, ...updatedData },
                    loading: false
                }));
                return true;
            },

            changePassword: async (currentPassword, newPassword) => {
                set({ loading: true });
                // Simulate API delay
                await new Promise((resolve) => setTimeout(resolve, 800));

                // In a real app, we would verify currentPassword here.
                // For this mock, we'll just assume success.

                set({ loading: false });
                return true;
            },

            clearError: () => set({ error: null }),
        }),
        {
            name: 'dintask-auth-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);

export default useAuthStore;
