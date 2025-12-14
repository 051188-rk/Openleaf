import axios from 'axios';

const API_BASE_URL = '/api';

export interface ResumeInput {
    role: string;
    skills: string[];
    experience: string;
    template_id: string;
}

export interface GeneratedResume {
    latex_content: string;
}

export interface EditSection {
    section_name: string;
    current_content: string;
    instruction: string;
}

export interface Template {
    id: string;
    name: string;
}

export const api = {
    getTemplates: async (): Promise<Template[]> => {
        const response = await axios.get(`${API_BASE_URL}/templates`);
        return response.data;
    },

    generateResume: async (data: ResumeInput): Promise<GeneratedResume> => {
        const response = await axios.post(`${API_BASE_URL}/generate`, data);
        return response.data;
    },

    previewResume: async (latexContent: string): Promise<string> => {
        const response = await axios.post(`${API_BASE_URL}/preview`, {
            latex_content: latexContent,
        });
        return response.data.pdf_url;
    },

    editResume: async (currentContent: string, instruction: string): Promise<GeneratedResume> => {
        const response = await axios.post(`${API_BASE_URL}/edit`, {
            section_name: 'full',
            current_content: currentContent,
            instruction: instruction,
        });
        return response.data;
    },
};
