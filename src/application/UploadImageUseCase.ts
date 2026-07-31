import AppError from "../domain/errors/AppError";
import { ImageStoragePort, UploadFileInput, UploadFileOutput } from "../domain/ports/StoragePort";

export const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export class UploadImageUseCase {
    constructor(private readonly storage: ImageStoragePort) {}

    async execute(input: UploadFileInput): Promise<UploadFileOutput> {
        if (!ALLOWED_MIME_TYPES.includes(input.mimeType)) {
            throw new AppError("Tipo de arquivo não permitido", 400);
        }

        if(input.buffer.byteLength > MAX_SIZE_BYTES) {
            throw new AppError("Arquivo excede o tamanho máximo de 5MB");
        }

        return this.storage.upload(input);
    }
}