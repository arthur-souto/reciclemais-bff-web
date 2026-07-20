import { AiCompletionService } from "../domain/ports/AiPort";
import Logger from "../domain/ports/LoggerPort";



export default class EvidenceUseCases {

    constructor(private log: Logger, private groqService: AiCompletionService) {}   
    
    public async analyzeEvidence(imagemUrl: string, question: string): Promise<string> {
        this.log.info("Iniciando análise de evidência", { imagemUrl, question });
        return await this.groqService.analyze({ imageUrl: imagemUrl, systemPrompt: question });
    }
}