import React, { useState } from 'react';
import { supabase } from './supabaseClient';

export function AssetUploader({ bucket = 'assets', label = 'Upload Asset', onUpload }: { bucket?: string; label?: string; onUpload?: (url: string) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    const filePath = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from(bucket).upload(filePath, file);
    if (error) {
      setError(error.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    setUrl(data.publicUrl);
    setUploading(false);
    if (onUpload) onUpload(data.publicUrl);
  };

  return (
    <div>
      <label>{label}</label>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {url && (
        <div>
          <a href={url} target="_blank" rel="noopener noreferrer">View Uploaded File</a>
        </div>
      )}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}

export function ScreenshotUploader(props: { onUpload?: (url: string) => void }) {
  return <AssetUploader bucket="screenshots" label="Upload Screenshot" {...props} />;
}
