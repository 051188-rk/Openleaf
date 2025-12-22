import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { generateResume } from '../api';

export function InputForm() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const templateId = searchParams.get('template') || '';

    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState('');
    const [skills, setSkills] = useState('');
    const [experience, setExperience] = useState('');

    const handleGenerate = async () => {
        if (!role || !skills || !experience || !templateId) return;

        setLoading(true);
        try {
            const skillsArray = skills.split(',').map(s => s.trim());
            const result = await generateResume({
                role,
                skills: skillsArray,
                experience,
                template_id: templateId,
            });

            // Navigate to editor with LaTeX content
            navigate('/editor', {
                state: {
                    latexContent: result.latex_content
                }
            });
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to generate resume');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-8 animate-scaleIn" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="card">
                <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>
                    Your Information
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>
                            Target Role
                        </label>
                        <input
                            type="text"
                            className="input"
                            placeholder="e.g., Senior Software Engineer"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>
                            Skills (comma-separated)
                        </label>
                        <input
                            type="text"
                            className="input"
                            placeholder="e.g., Python, React, TypeScript, AWS"
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>
                            Experience
                        </label>
                        <textarea
                            className="textarea"
                            placeholder="Describe your work experience..."
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            rows={8}
                        />
                    </div>

                    <button
                        className="btn"
                        onClick={handleGenerate}
                        disabled={loading || !role || !skills || !experience}
                        style={{ width: '100%', fontSize: '1.125rem', padding: '1rem' }}
                    >
                        {loading ? 'Generating & Downloading...' : 'Generate Resume'}
                    </button>
                </div>
            </div>
        </div>
    );
}
