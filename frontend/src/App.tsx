import { useState } from 'react';
import { FiFileText, FiDownload } from 'react-icons/fi';
import { getTemplates, generateResume, previewResume, editResume, type Template } from './api';
import './index.css';

type Step = 'template' | 'input' | 'preview';

function App() {
  const [step, setStep] = useState<Step>('template');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [loading, setLoading] = useState(false);
  const [latexContent, setLatexContent] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');

  // Form states
  const [role, setRole] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [editInstruction, setEditInstruction] = useState('');

  // Load templates on mount
  useState(() => {
    getTemplates().then(setTemplates).catch(console.error);
  });

  const handleSelectTemplate = (id: string) => {
    setSelectedTemplate(id);
    setTimeout(() => setStep('input'), 300);
  };

  const handleGenerate = async () => {
    if (!role || !skills || !experience) return;

    setLoading(true);
    try {
      const skillsArray = skills.split(',').map(s => s.trim());
      const result = await generateResume({
        role,
        skills: skillsArray,
        experience,
        template_id: selectedTemplate,
      });
      setLatexContent(result.latex_content);

      const url = await previewResume(result.latex_content);
      setPdfUrl(url);
      setStep('preview');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate resume');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!editInstruction.trim()) return;

    setLoading(true);
    try {
      const result = await editResume(latexContent, editInstruction);
      setLatexContent(result.latex_content);

      const url = await previewResume(result.latex_content);
      setPdfUrl(url);
      setEditInstruction('');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to edit resume');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl.startsWith('http') ? pdfUrl : `${window.location.origin}${pdfUrl}`;
    link.download = 'resume.pdf';
    link.click();
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--gray-200)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}>
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 animate-fadeIn">
              <div style={{
                width: '48px',
                height: '48px',
                background: 'var(--black)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--white)'
              }}>
                <FiFileText size={24} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>res-gen</h1>
                <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', margin: 0 }}>AI Resume Generator</p>
              </div>
            </div>

            {/* Progress */}
            <div className="flex gap-2">
              {['template', 'input', 'preview'].map((s, i) => (
                <div
                  key={s}
                  style={{
                    width: step === s ? '32px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    background: step === s ? 'var(--black)' : 'var(--gray-300)',
                    transition: 'all 0.3s'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container py-8">
        {/* Template Selection */}
        {step === 'template' && (
          <div className="animate-fadeIn">
            <div className="text-center mb-8">
              <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>
                Select Template
              </h2>
              <p style={{ color: 'var(--gray-600)', fontSize: '1.125rem' }}>
                Choose a professional ATS-optimized resume template
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="card"
                  onClick={() => handleSelectTemplate(template.id)}
                  style={{
                    cursor: 'pointer',
                    background: selectedTemplate === template.id ? 'var(--black)' : 'var(--white)',
                    color: selectedTemplate === template.id ? 'var(--white)' : 'var(--black)',
                  }}
                >
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                    {template.name}
                  </h3>
                  <p style={{ opacity: 0.7, marginBottom: '1rem' }}>
                    Professional layout
                  </p>
                  <button
                    className="btn"
                    style={{
                      width: '100%',
                      background: selectedTemplate === template.id ? 'var(--white)' : 'var(--black)',
                      color: selectedTemplate === template.id ? 'var(--black)' : 'var(--white)',
                    }}
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Input Form */}
        {step === 'input' && (
          <div className="animate-scaleIn" style={{ maxWidth: '800px', margin: '0 auto' }}>
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
                    placeholder="Describe your work experience, achievements, and responsibilities..."
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
                  {loading ? 'Generating...' : 'Generate Resume'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Preview & Edit */}
        {step === 'preview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            <div className="lg:col-span-2">
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="flex justify-between items-center" style={{ padding: '1.5rem', borderBottom: '1px solid var(--gray-200)' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                    Resume Preview
                  </h3>
                  <button className="btn" onClick={handleDownload}>
                    <FiDownload /> Download PDF
                  </button>
                </div>
                <iframe
                  src={pdfUrl}
                  style={{ width: '100%', height: '800px', border: 'none' }}
                  title="Resume Preview"
                />
              </div>
            </div>

            <div>
              <div className="card">
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
                  AI Editor
                </h3>
                <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                  Make targeted edits to specific sections
                </p>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                    Edit Instructions
                  </label>
                  <textarea
                    className="textarea"
                    placeholder="e.g., Make the experience section more detailed"
                    value={editInstruction}
                    onChange={(e) => setEditInstruction(e.target.value)}
                    rows={4}
                  />
                </div>

                <button
                  className="btn"
                  onClick={handleEdit}
                  disabled={loading || !editInstruction.trim()}
                  style={{ width: '100%' }}
                >
                  {loading ? 'Applying...' : 'Apply Edit'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--gray-200)',
        padding: '2rem 0',
        marginTop: '4rem',
        background: 'var(--gray-50)'
      }}>
        <div className="container text-center">
          <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
            Built with LangChain, Gemini API, FastAPI & React
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
