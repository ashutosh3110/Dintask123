import React, { useState, useEffect } from 'react';
import apiRequest from '@/lib/api';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { CheckCircle2, XCircle, Star, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const TestimonialsManager = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTestimonials = async () => {
        setIsLoading(true);
        try {
            const res = await apiRequest('/testimonials');
            if (res.success) {
                setTestimonials(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch testimonials:', error);
            toast.error('Failed to load testimonials');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const handleStatusUpdate = async (id, isApproved) => {
        try {
            await apiRequest(`/testimonials/${id}/status`, {
                method: 'PUT',
                body: { isApproved }
            });
            toast.success(`Testimonial ${isApproved ? 'approved' : 'rejected'}`);
            fetchTestimonials();
        } catch (error) {
            console.error('Failed to update status:', error);
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this testimonial?')) return;
        try {
            await apiRequest(`/testimonials/${id}`, {
                method: 'DELETE'
            });
            toast.success('Testimonial deleted');
            fetchTestimonials();
        } catch (error) {
            console.error('Failed to delete:', error);
            toast.error('Failed to delete testimonial');
        }
    };

    if (isLoading) return <div className="p-8">Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Testimonials</h1>
                    <p className="text-slate-500 text-lg mt-2">Manage user testimonials and approvals.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {testimonials.map((t) => (
                    <Card key={t._id} className="relative group overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                        {/* Status Badge */}
                        <div className="absolute top-4 right-4">
                            {t.isApproved ? (
                                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200">
                                    Approved
                                </Badge>
                            ) : (
                                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200">
                                    Pending
                                </Badge>
                            )}
                        </div>

                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <div>
                                    <h3 className="text-lg font-bold">{t.name}</h3>
                                    <p className="text-sm font-medium text-slate-500">{t.role}</p>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex text-yellow-500">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill={i < t.rating ? "currentColor" : "none"} className={i < t.rating ? "" : "text-slate-300"} />
                                ))}
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 italic">"{t.testimonial}"</p>

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                                {!t.isApproved ? (
                                    <Button size="sm" onClick={() => handleStatusUpdate(t._id, true)} className="bg-emerald-600 hover:bg-emerald-700 text-white w-full">
                                        <CheckCircle2 size={16} className="mr-2" /> Approve
                                    </Button>
                                ) : (
                                    <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(t._id, false)} className="border-amber-200 text-amber-700 hover:bg-amber-50 w-full">
                                        <XCircle size={16} className="mr-2" /> Reject
                                    </Button>
                                )}
                                <Button size="icon" variant="ghost" onClick={() => handleDelete(t._id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {testimonials.length === 0 && (
                    <div className="col-span-full text-center py-12 text-slate-500">
                        No testimonials found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default TestimonialsManager;
