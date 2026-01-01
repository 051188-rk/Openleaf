import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
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

// Authentication interfaces
export interface SignupData {
    email: string;
    password: string;
    name: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    user: {
        id: number;
        email: string;
        name: string;
        createdAt: string;
    };
}

// Authentication API functions
export const signup = async (data: SignupData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/signup', data);
    return response.data;
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
};

// Set auth token for API requests
export const setAuthToken = (token: string | null) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token} `;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};


