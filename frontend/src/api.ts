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
