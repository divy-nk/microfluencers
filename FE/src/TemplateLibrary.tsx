import React from 'react';

const TemplateLibrary: React.FC = () => {
    const templates = [
        { id: '1', name: '3-Second Hook', description: 'Grabs attention immediately. Best for TikTok/Reels.' },
        { id: '2', name: 'Problem-Solution', description: 'Classic marketing structure. Show problem, then product as solution.' },
        { id: '3', name: 'Unboxing ASMR', description: 'Focus on packaging and sensory experience.' },
        { id: '4', name: 'Testimonial', description: 'Authentic user review and reaction.' },
    ];

    return (
        <div style={{ padding: '20px', border: '1px solid #eee', marginTop: '20px' }}>
            <h3>Video Template Library</h3>
            <p>Select a structure for your creators to follow.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                {templates.map(template => (
                    <div key={template.id} style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                        <h4 style={{ margin: '0 0 10px 0' }}>{template.name}</h4>
                        <p style={{ fontSize: '0.9em', color: '#666' }}>{template.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TemplateLibrary;
