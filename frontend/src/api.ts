import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface Template {
    id: string;
    name: string;
}

export interface ResumeInput {
    role: string;
    skills: string[];
    experience: string;
    template_id: string;
}

export interface GeneratedResume {
    latex_content: string;
}

export const getTemplates = async (): Promise<Template[]> => {
    const response = await api.get<Template[]>('/templates');
    return response.data;
};

export const generateResume = async (data: ResumeInput): Promise<GeneratedResume> => {
    const response = await api.post<GeneratedResume>('/generate', data);
    return response.data;
};

export const previewResume = async (latexContent: string): Promise<string> => {
    const response = await api.post<{ pdf_url: string }>('/preview', {
        latex_content: latexContent,
    });
    return response.data.pdf_url;
};

export const compilePreview = async (latexContent: string): Promise<string> => {
    const response = await api.post<{ image: string }>('/compile-preview', {
        latex_content: latexContent,
    });
    return response.data.image;
};

export const editResume = async (currentContent: string,
    instruction: string
): Promise<GeneratedResume> => {
    const response = await api.post<GeneratedResume>('/edit', {
        current_content: currentContent,
        instruction,
    });
    return response.data;
};

export const compilePDFBase64 = async (latexContent: string): Promise<{ success: boolean; pdf: string | null; error: string | null }> => {
    const response = await api.post<{ success: boolean; pdf: string | null; error: string | null }>('/compile-pdf-base64', {
        latex_content: latexContent,
    });
    return response.data;
};

export const chatEdit = async (message: string, latexContent: string): Promise<{ latex_content: string; success: boolean; error: string | null }> => {
    const response = await api.post<{ latex_content: string; success: boolean; error: string | null }>('/chat-edit', {
        message,
        latex_content: latexContent,
    });
    return response.data;
};

