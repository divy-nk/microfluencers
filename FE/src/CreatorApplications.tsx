import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { useAuth } from './auth';
import type { Application } from './types';
import VideoUploader from './VideoUploader';

const CreatorApplications: React.FC = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchApplications();
        }
    }, [user]);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            // Join with drops table to get product info
            const { data, error } = await supabase
                .from('applications')
                .select('*, drops(product_link, title, campaign_type, product_value)')
                .eq('creator_id', user?.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Manually map the joined data if needed, or rely on TS treating it loosely or fix types
            // For now, casting or relying on structure
            setApplications(data as any || []);
        } catch (error: any) {
            console.error('Error fetching applications:', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', borderTop: '1px solid #ccc', marginTop: '20px' }}>
            <h3>My Applications</h3>
            {loading ? (
                <p>Loading applications...</p>
            ) : applications.length === 0 ? (
                <p>You haven't applied to any drops yet.</p>
            ) : (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {applications.map((app) => (
                        <li key={app.id} style={{ borderBottom: '1px solid #333', padding: '10px 0' }}>
                            <strong>{(app as any).drops?.title || 'Untitled Drop'}</strong>
                            <span style={{ marginLeft: '8px', fontSize: '11px', opacity: 0.6 }}>
                                {(app as any).drops?.campaign_type === 'barter' ? '🎁' : (app as any).drops?.campaign_type === 'performance' ? '📈' : '🚀'}
                            </span> <br />
                            <strong>Status:</strong> {app.status} <br />
                            <strong>Applied:</strong> {new Date(app.created_at || '').toLocaleDateString()}

                            {app.status === 'applied' && (
                                <div style={{ marginTop: '10px' }}>
                                    <p><em>Please purchase the product and submit details.</em></p>
                                    <VideoUploader applicationId={app.id} onUploadComplete={() => fetchApplications()} />
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CreatorApplications;
