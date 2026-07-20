export interface AiPrompt {
    prompt: string;
    systemPrompt?: string;
}

export interface AiAnalysisPrompt {
    systemPrompt: string;
    imageUrl: string;
}

export interface AiPromptOptions {
    temperature?: number;
    maxTokens?: number;
}

export interface AiCompletionService {
    prompt: (aiPrompt: AiPrompt, options?: AiPromptOptions) => Promise<string>;
    analyze: (aiPrompt: AiAnalysisPrompt, options?: AiPromptOptions) => Promise<string>;
}