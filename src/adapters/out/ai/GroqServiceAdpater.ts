import Groq from "groq-sdk";
import { AiAnalysisPrompt, AiCompletionService, AiPrompt, AiPromptOptions } from "../../../domain/ports/AiPort";
import Logger from "../../../domain/ports/LoggerPort";

export default class GroqServiceAdpater implements AiCompletionService {
  private client: Groq;
  private model: string;
  private visionModel: string;

  private readonly DEFAULT_VISION_MODEL = "qwen/qwen3.6-27b";
  private readonly DEFAULT_TEMPERATURE = 1;
  private readonly DEFAULT_MAX_TOKENS = 1024;

  constructor(
    apiKey: string,
    model: string,
    private log: Logger,
    visionModel: string = this.DEFAULT_VISION_MODEL,
  ) {
    this.client = new Groq({ apiKey });
    this.model = model;
    this.visionModel = visionModel;
  }

  public async analyze(aiPrompt: AiAnalysisPrompt, options?: AiPromptOptions): Promise<string> {
    const { imageUrl, systemPrompt } = aiPrompt;

    try {
      const response = await this.client.chat.completions.create({
        model: this.visionModel, 
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: systemPrompt },
              { type: "image_url", image_url: { url: imageUrl } },
            ],
          },
        ],
        temperature: options?.temperature ?? this.DEFAULT_TEMPERATURE,
        max_tokens: options?.maxTokens ?? this.DEFAULT_MAX_TOKENS,
      });

      const content = response.choices[0]?.message?.content ?? "";
      this.log.info("Análise de imagem recebida", { chars: content.length });
      return content;
    } catch (err) {
      this.log.error("Erro ao analisar imagem via Groq", { err });
      throw new Error("Falha ao analisar imagem");
    }
  }

  public async prompt(aiPrompt: AiPrompt, options?: AiPromptOptions): Promise<string> {
    const { prompt, systemPrompt } = aiPrompt;

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          ...(systemPrompt
            ? [{ role: "system" as const, content: systemPrompt }]
            : []),
          { role: "user" as const, content: prompt },
        ],
        temperature: options?.temperature ?? this.DEFAULT_TEMPERATURE,
        max_tokens: options?.maxTokens ?? this.DEFAULT_MAX_TOKENS,
      });

      const content = response.choices[0]?.message?.content ?? "";
      this.log.info("Resposta da Groq recebida", { chars: content.length });
      return content;
    } catch (err) {
      this.log.error("Erro ao chamar Groq", { err });
      throw new Error("Falha ao gerar resposta de IA");
    }
  }
}