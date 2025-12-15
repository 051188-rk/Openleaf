import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsFileEarmarkText, BsLayoutTextSidebarReverse, BsGrid3X3Gap } from 'react-icons/bs';
import { AiOutlineBlock } from 'react-icons/ai';
import { MdOutlineArticle } from 'react-icons/md';
import { getTemplates, type Template } from '../api';
import { RadioTemplateCard } from '../components/shared/RadioTemplateCard';

const TEMPLATE_ICONS: Record<string, any> = {
    modern: BsLayoutTextSidebarReverse,
    classic: BsFileEarmarkText,
    professional: MdOutlineArticle,
    minimalist: AiOutlineBlock,
    executive: BsGrid3X3Gap,
};

export function TemplateSelector() {
    const navigate = useNavigate();
    const [templates, setTemplates] = useState<Template[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState('');

    useEffect(() => {
        getTemplates().then(setTemplates).catch(console.error);
    }, []);

    const handleStart = () => {
        if (selectedTemplate) {
            navigate(`/input?template=${selectedTemplate}`);
        }
    };

    return (
        <div className="container py-8 animate-fadeIn">
            <div className="text-center mb-8">
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>
                    Choose Your Template
                </h2>
                <p style={{ color: 'var(--gray-600)', fontSize: '1.125rem' }}>
                    Select a professional resume style
                </p>
            </div>

            {/* Radio Template Selector */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '1.5rem',
                flexWrap: 'wrap',
                marginBottom: '3rem'
            }}>
                {templates.map((template) => (
                    <RadioTemplateCard
                        key={template.id}
                        id={template.id}
                        name={template.name}
                        icon={TEMPLATE_ICONS[template.id] || BsFileEarmarkText}
                        isSelected={selectedTemplate === template.id}
                        onSelect={setSelectedTemplate}
                    />
                ))}
            </div>

            <div style={{ textAlign: 'center' }}>
                <button
                    className="btn"
                    onClick={handleStart}
                    disabled={!selectedTemplate}
                    style={{
                        fontSize: '1.125rem',
                        padding: '1rem 3rem',
                        opacity: selectedTemplate ? 1 : 0.5,
                        cursor: selectedTemplate ? 'pointer' : 'not-allowed'
                    }}
                >
                    Start Generating →
                </button>
            </div>
        </div>
    );
}
