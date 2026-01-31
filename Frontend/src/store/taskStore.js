import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import mockTasks from '../data/mockTasks.json';

const useTaskStore = create(
    persist(
        (set, get) => ({
            tasks: mockTasks,
            loading: false,

            fetchTasks: async () => {
                set({ loading: true });
                // Simulate API delay
                await new Promise((resolve) => setTimeout(resolve, 500));
                set({ loading: false });
            },

            addTask: (task) => {
                set((state) => ({
                    tasks: [
                        ...state.tasks,
                        {
                            ...task,
                            id: Date.now().toString(),
                            createdAt: new Date().toISOString(),
                            status: task.status || 'pending',
                        },
                    ],
                }));
            },

            updateTask: (taskId, updatedData) => {
                set((state) => ({
                    tasks: state.tasks.map((task) =>
                        task.id === taskId ? { ...task, ...updatedData } : task
                    ),
                }));
            },

            deleteTask: (taskId) => {
                set((state) => ({
                    tasks: state.tasks.filter((task) => task.id !== taskId),
                }));
            },

            assignTaskToManager: (taskId, managerId) => {
                set((state) => ({
                    tasks: state.tasks.map((task) =>
                        task.id === taskId
                            ? { ...task, assignedToManager: managerId, assignedBy: 'admin', status: 'pending' }
                            : task
                    ),
                }));
            },

            delegateTaskToEmployee: (taskId, employeeId, managerId, notes) => {
                set((state) => ({
                    tasks: state.tasks.map((task) =>
                        task.id === taskId
                            ? {
                                ...task,
                                assignedTo: [...(task.assignedTo || []), employeeId],
                                delegatedBy: managerId,
                                delegationNotes: notes,
                                status: 'pending'
                            }
                            : task
                    ),
                }));
            },

            completeTask: (taskId, location, completionData) => {
                set((state) => ({
                    tasks: state.tasks.map((task) =>
                        task.id === taskId
                            ? {
                                ...task,
                                status: 'completed',
                                completedAt: new Date().toISOString(),
                                completionLocation: location,
                                ...completionData
                            }
                            : task
                    ),
                }));
            },

            addActivity: (taskId, activityItem) => {
                set((state) => ({
                    tasks: state.tasks.map((task) =>
                        task.id === taskId
                            ? {
                                ...task,
                                activity: [...(task.activity || []), activityItem]
                            }
                            : task
                    ),
                }));
            },

            addComment: (taskId, comment) => {
                set((state) => ({
                    tasks: state.tasks.map((task) =>
                        task.id === taskId
                            ? {
                                ...task,
                                comments: [...(task.comments || []), { ...comment, id: Date.now(), createdAt: new Date().toISOString() }]
                            }
                            : task
                    ),
                }));
            },
        }),
        {
            name: 'dintask-tasks-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);

export default useTaskStore;
