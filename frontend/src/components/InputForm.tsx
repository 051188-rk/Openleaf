import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Code, FileText, Sparkles } from 'lucide-react';
import { useAutoResizeTextarea } from '@/hooks/use-auto-resize-textarea';

interface InputFormProps {
    onSubmit: (data: { role: string; skills: string[]; experience: string }) => void;
    loading: boolean;
}

export function InputForm({ onSubmit, loading }: InputFormProps) {
    const [role, setRole] = useState('');
    const [skills, setSkills] = useState('');
    const [experience, setExperience] = useState('');
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 120,
        maxHeight: 400,
    });

    const handleSubmit = () => {
        const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
        onSubmit({ role, skills: skillsArray, experience });
    };

    const isValid = role.trim() !== '' && skills.trim() !== '' && experience.trim() !== '';

    return (
        <Card className="max-w-3xl mx-auto shadow-lg border-2">
            <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl flex items-center gap-2">
                        <Sparkles className="w-6 h-6" />
                        Enter Your Information
                    </CardTitle>
                    <Badge variant="default" className="text-xs">
                        <FileText className="w-3 h-3 mr-1" />
                        ATS Optimized
                    </Badge>
                </div>
                <CardDescription className="text-base">
                    Provide your professional details to generate an ATS-friendly resume
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="role" className="flex items-center gap-2 text-sm font-semibold">
                        <Briefcase className="w-4 h-4" />
                        Target Role
                    </Label>
                    <Input
                        id="role"
                        placeholder="e.g., Senior Software Engineer"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="border-2 h-11 text-base"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="skills" className="flex items-center gap-2 text-sm font-semibold">
                            <Code className="w-4 h-4" />
                            Skills (comma-separated)
                        </Label>
                        <Badge variant="secondary" className="text-xs">
                            {skills.split(',').filter(s => s.trim()).length} skills
                        </Badge>
                    </div>
                    <Input
                        id="skills"
                        placeholder="e.g., Python, React, TypeScript, AWS, Docker"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        className="border-2 h-11 text-base"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="experience" className="text-sm font-semibold">
                        Professional Experience
                    </Label>
                    <div className="relative">
                        <Textarea
                            id="experience"
                            placeholder="Describe your work experience, achievements, and responsibilities in detail...&#10;&#10;Example:&#10;- Led a team of 5 engineers to deliver project X&#10;- Improved system performance by 40%&#10;- Implemented CI/CD pipeline reducing deployment time"
                            value={experience}
                            onChange={(e) => {
                                setExperience(e.target.value);
                                adjustHeight();
                            }}
                            ref={textareaRef}
                            className="border-2 text-base resize-none"
                        />
                        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                            {experience.length} characters
                        </div>
                    </div>
                </div>

                <Button
                    onClick={handleSubmit}
                    disabled={!isValid || loading}
                    className="w-full h-12 text-base font-semibold"
                >
                    {loading ? (
                        <>
                            <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                            Generating Resume with AI...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Generate Resume
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}
