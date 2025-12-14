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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-black/10 bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Res-Gen</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Professional Resume Generator powered by AI
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {step === 'template' && (
          <TemplateSelector onSelect={handleTemplateSelect} />
        )}

        {step === 'input' && (
          <InputForm onSubmit={handleInputSubmit} loading={loading} />
        )}

        {step === 'preview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PDFPreview pdfUrl={pdfUrl} onDownload={handleDownload} />
            </div>
            <div>
              <SelectiveEditor
                latexContent={latexContent}
                onEdit={handleEdit}
                loading={loading}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-black/10 mt-16 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Built with LangChain, Gemini API, FastAPI, React & shadcn/ui
        </div>
      </footer>
    </div>
  );
}

export default App;
