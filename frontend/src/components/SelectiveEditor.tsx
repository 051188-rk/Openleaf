import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Edit, Loader, Sparkles, Wand2 } from 'lucide-react';
import { useAutoResizeTextarea } from '@/hooks/use-auto-resize-textarea';
import { cn } from '@/lib/utils';

interface SelectiveEditorProps {
    latexContent: string;
    onEdit: (instruction: string) => void;
    loading: boolean;
}

export function SelectiveEditor({ latexContent, onEdit, loading }: SelectiveEditorProps) {
    const [instruction, setInstruction] = useState('');
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 100,
        maxHeight: 300,
    });

    const handleEdit = () => {
        if (instruction.trim()) {
            onEdit(instruction);
            setInstruction('');
            adjustHeight(true);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && e.ctrlKey && instruction.trim()) {
            e.preventDefault();
            handleEdit();
        }
    };

    const quickEdits = [
        'Make the experience section more detailed',
        'Add more technical keywords',
        'Improve the summary section',
        'Make it more concise',
    ];

    return (
        <Card className="shadow-lg border-2">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <Wand2 className="w-5 h-5" />
                        AI Editor
                    </CardTitle>
                    <Badge variant="secondary" className="gap-1">
                        <Sparkles className="w-3 h-3" />
                        Selective
                    </Badge>
                </div>
                <CardDescription>
                    Describe changes to specific resume sections using natural language
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Quick Edit Suggestions */}
                <div className="space-y-2">
                    <p className="text-xs text-muted-foreground font-medium">Quick edits:</p>
                    <div className="flex flex-wrap gap-2">
                        {quickEdits.map((edit, idx) => (
                            <Badge
                                key={idx}
                                variant="outline"
                                className="cursor-pointer hover:bg-accent transition-colors text-xs"
                                onClick={() => {
                                    setInstruction(edit);
                                    if (textareaRef.current) {
                                        textareaRef.current.value = edit;
                                        adjustHeight();
                                    }
                                }}
                            >
                                {edit}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* AI Prompt Input */}
                <div className="space-y-2">
                    <div className="rounded-xl border-2 bg-muted/30 p-3">
                        <Textarea
                            ref={textareaRef}
                            placeholder="e.g., Change the job title in the first experience entry to 'Lead Software Engineer' or Add more achievements to the second role"
                            value={instruction}
                            onChange={(e) => {
                                setInstruction(e.target.value);
                                adjustHeight();
                            }}
                            onKeyDown={handleKeyDown}
                            className={cn(
                                "border-none bg-transparent placeholder:text-muted-foreground/70 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none text-base",
                                "min-h-[100px]"
                            )}
                        />
                        <div className="flex items-center justify-between mt-3 pt-3 border-t">
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                    <Edit className="w-3 h-3 mr-1" />
                                    Context-Aware
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                    Ctrl+Enter to submit
                                </span>
                            </div>
                            <Button
                                onClick={handleEdit}
                                disabled={!instruction.trim() || loading}
                                size="sm"
                                className="gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader className="w-4 h-4 animate-spin" />
                                        Applying...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        Apply Edit
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        The AI will identify and modify only the mentioned sections while preserving the rest
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
