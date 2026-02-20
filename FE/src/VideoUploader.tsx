import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { useAuth } from './auth';

interface VideoUploaderProps {
    applicationId: string;
    onUploadComplete: () => void;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ applicationId, onUploadComplete }) => {
    const { user } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [orderId, setOrderId] = useState('');
    const [message, setMessage] = useState('');

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !user) return;

        try {
            setUploading(true);
            setMessage('');

            // 1. Upload video to Supabase Storage
            const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
            if (!allowedTypes.includes(file.type)) {
                setMessage('Invalid file type. Only MP4, WebM, and MOV are allowed.');
                setUploading(false);
                return;
            }

            const fileExt = file.name.split('.').pop()?.toLowerCase();
            const allowedExts = ['mp4', 'webm', 'mov'];
            if (!fileExt || !allowedExts.includes(fileExt)) {
                setMessage('Invalid file extension.');
                setUploading(false);
                return;
            }

            const fileName = `${applicationId}/${Math.random()}.${fileExt}`;
            const filePath = `${user.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('assets') // Ensure this bucket exists
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get public URL (or signed URL)
            const { data: { publicUrl } } = supabase.storage
                .from('assets')
                .getPublicUrl(filePath);

            // 2. Update Application record
            const { error: updateError } = await supabase
                .from('applications')
                .update({
                    status: 'uploaded',
                    video_url: publicUrl,
                    order_id: orderId, // Assuming order ID is verified here or earlier
                    updated_at: new Date().toISOString()
                })
                .eq('id', applicationId);

            if (updateError) throw updateError;

            setMessage('Upload successful!');
            onUploadComplete();
        } catch (error: any) {
            setMessage('Error uploading: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{ padding: '15px', border: '1px solid #ddd', marginTop: '10px' }}>
            <h4>Submit Content</h4>
            <form onSubmit={handleUpload}>
                <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Amazon Order ID:</label>
                    <input
                        type="text"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        required
                        placeholder="e.g., 123-1234567-1234567"
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Video File:</label>
                    <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                        required
                    />
                </div>
                <button type="submit" disabled={uploading || !file}>
                    {uploading ? 'Uploading...' : 'Submit Video'}
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default VideoUploader;
