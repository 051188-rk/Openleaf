import { Download, FileText, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PDFPreviewProps {
    pdfUrl: string;
    onDownload: () => void;
}

export function PDFPreview({ pdfUrl, onDownload }: PDFPreviewProps) {
    const fullUrl = pdfUrl.startsWith('http') ? pdfUrl : `${window.location.origin}${pdfUrl}`;

    return (
        <Card className="h-full shadow-lg border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="flex items-center gap-3">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <FileText className="w-5 h-5" />
                        Resume Preview
                    </CardTitle>
                    <Badge variant="secondary">PDF</Badge>
                </div>
                <Button onClick={onDownload} size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    Download
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                <div className="relative">
                    <iframe
                        src={fullUrl}
                        className="w-full h-[800px] border-t-2"
                        title="Resume Preview"
                    />
                    {!pdfUrl && (
                        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                            <div className="flex flex-col items-center gap-3">
                                <Loader className="w-8 h-8 animate-spin" />
                                <p className="text-sm text-muted-foreground">Loading preview...</p>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
