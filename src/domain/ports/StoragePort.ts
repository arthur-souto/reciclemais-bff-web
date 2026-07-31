export interface UploadFileInput {
    buffer: Buffer;
    mimeType: string;
    originalmage: string;
}

export interface UploadFileOutput {
    key: string;
    url: string;
}


export interface ImageStoragePort {
    upload(input: UploadFileInput): Promise<UploadFileOutput>
}