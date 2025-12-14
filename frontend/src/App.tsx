import { useState } from 'react';
import { TemplateSelector } from './components/TemplateSelector';
import { InputForm } from './components/InputForm';
import { PDFPreview } from './components/PDFPreview';
import { SelectiveEditor } from './components/SelectiveEditor';
import { api } from './lib/api';
import { FileText } from 'lucide-react';
import './index.css';

type Step = 'template' | 'input' | 'preview';

function App() {
  const [step, setStep] = useState<Step>('template');
  const [templateId, setTemplateId] = useState('');
  const [latexContent, setLatexContent] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTemplateSelect = (id: string) => {
    setTemplateId(id);
    setTimeout(() => setStep('input'), 300);
  };

  const handleInputSubmit = async (data: { role: string; skills: string[]; experience: string }) => {
    setLoading(true);
    try {
      const result = await api.generateResume({
        ...data,
        template_id: templateId,
      });
      setLatexContent(result.latex_content);

      const preview = await api.previewResume(result.latex_content);
      setPdfUrl(preview);
      setStep('preview');
    } catch (error) {
      console.error('Error generating resume:', error);
      alert('Failed to generate resume. Please check your API connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (instruction: string) => {
    setLoading(true);
    try {
      const result = await api.editResume(latexContent, instruction);
      setLatexContent(result.latex_content);

      const preview = await api.previewResume(result.latex_content);
      setPdfUrl(preview);
    } catch (error) {
      console.error('Error editing resume:', error);
      alert('Failed to edit resume. Please try again.');
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
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white">
      {/* Header */}
      <header
        className="sticky top-0 z-50 border-b border-black/10 shadow-sm"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)' }}
      >
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3" style={{ animation: 'fadeIn 0.5s ease-out' }}>
              <div className="p-2 rounded-xl bg-black text-white">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h1
                  className="text-2xl font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #000000 0%, #434343 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Res-Gen
                </h1>
                <p className="text-xs text-gray-500">AI Resume Generator</p>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center gap-2">
              <div
                className="rounded-full transition-all duration-300"
                style={{
                  width: step === 'template' ? '32px' : '8px',
                  height: '8px',
                  backgroundColor: step === 'template' ? '#000' : '#d4d4d4'
                }}
              />
              <div
                className="rounded-full transition-all duration-300"
                style={{
                  width: step === 'input' ? '32px' : '8px',
                  height: '8px',
                  backgroundColor: step === 'input' ? '#000' : '#d4d4d4'
                }}
              />
              <div
                className="rounded-full transition-all duration-300"
                style={{
                  width: step === 'preview' ? '32px' : '8px',
                  height: '8px',
                  backgroundColor: step === 'preview' ? '#000' : '#d4d4d4'
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div
          style={{
            animation: step === 'template' ? 'fadeIn 0.5s ease-out' :
              step === 'input' ? 'scaleIn 0.4s ease-out' :
                'fadeIn 0.5s ease-out'
          }}
        >
          {step === 'template' && (
            <TemplateSelector onSelect={handleTemplateSelect} />
          )}

          {step === 'input' && (
            <InputForm onSubmit={handleInputSubmit} loading={loading} />
          )}

          {step === 'preview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div
                className="lg:col-span-2"
                style={{ animation: 'slideInLeft 0.6s ease-out' }}
              >
                <PDFPreview pdfUrl={pdfUrl} onDownload={handleDownload} />
              </div>
              <div style={{ animation: 'slideInRight 0.6s ease-out' }}>
                <SelectiveEditor
                  latexContent={latexContent}
                  onEdit={handleEdit}
                  loading={loading}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/10 mt-20 py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              Built with LangChain, Gemini API, FastAPI, React & shadcn/ui
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>© 2025 Res-Gen</span>
              <span>•</span>
              <span>MIT License</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

export default App;
