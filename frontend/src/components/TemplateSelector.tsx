import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api, type Template } from '@/lib/api';
import { FileText, Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TemplateSelectorProps {
    onSelect: (templateId: string) => void;
}

export function TemplateSelector({ onSelect }: TemplateSelectorProps) {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [selectedId, setSelectedId] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTemplates = async () => {
            try {
                const data = await api.getTemplates();
                setTemplates(data);
            } catch (error) {
                console.error('Failed to load templates:', error);
            } finally {
                setLoading(false);
            }
        };
        loadTemplates();
    }, []);

    const handleSelect = (id: string) => {
        setSelectedId(id);
        onSelect(id);
    };

    const getTemplateDescription = (id: string) => {
        const descriptions: Record<string, { desc: string; features: string[] }> = {
            modern: {
                desc: 'Clean and contemporary design',
                features: ['Two-column layout', 'Icon support', 'Color accents'],
            },
            classic: {
                desc: 'Traditional professional layout',
                features: ['Single column', 'Formal structure', 'Academic style'],
            },
            professional: {
                desc: 'Corporate formal style',
                features: ['Executive format', 'Clean typography', 'Business-ready'],
            },
            minimalist: {
                desc: 'Simple and elegant',
                features: ['White space', 'Essential info', 'Readable'],
            },
            executive: {
                desc: 'Executive level design',
                features: ['Leadership focus', 'Achievement-driven', 'Premium feel'],
            },
        };
        return descriptions[id] || { desc: 'Professional template', features: [] };
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="flex flex-col items-center gap-3">
                    <Sparkles className="w-8 h-8 animate-pulse" />
                    <p className="text-muted-foreground">Loading templates...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-2">
                    <h2 className="text-4xl font-bold">Select Resume Template</h2>
                    <Badge variant="default" className="gap-1">
                        <Sparkles className="w-3 h-3" />
                        {templates.length} Available
                    </Badge>
                </div>
                <p className="text-muted-foreground text-lg">
                    Choose a professional template optimized for ATS systems
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => {
                    const templateInfo = getTemplateDescription(template.id);
                    const isSelected = selectedId === template.id;

                    return (
                        <Card
                            key={template.id}
                            className={cn(
                                'cursor-pointer transition-all hover:shadow-xl border-2 relative overflow-hidden',
                                isSelected
                                    ? 'ring-4 ring-primary ring-offset-2 border-primary shadow-xl'
                                    : 'hover:border-primary/50'
                            )}
                            onClick={() => handleSelect(template.id)}
                        >
                            {isSelected && (
                                <div className="absolute top-3 right-3 z-10">
                                    <Badge className="gap-1 shadow-lg">
                                        <Check className="w-3 h-3" />
                                        Selected
                                    </Badge>
                                </div>
                            )}

                            <CardHeader className="pb-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <CardTitle className="text-xl">{template.name}</CardTitle>
                                        <CardDescription className="mt-1">
                                            {templateInfo.desc}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div className="flex flex-wrap gap-1.5">
                                    {templateInfo.features.map((feature, idx) => (
                                        <Badge key={idx} variant="secondary" className="text-xs">
                                            {feature}
                                        </Badge>
                                    ))}
                                </div>

                                <Button
                                    variant={isSelected ? 'default' : 'outline'}
                                    className="w-full"
                                    size="sm"
                                >
                                    {isSelected ? (
                                        <>
                                            <Check className="w-4 h-4" />
                                            Selected
                                        </>
                                    ) : (
                                        'Select Template'
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
