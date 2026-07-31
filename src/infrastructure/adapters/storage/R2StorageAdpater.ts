import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ImageStoragePort, UploadFileInput, UploadFileOutput } from "../../../domain/ports/StoragePort";

export class R2StorageAdapter implements ImageStoragePort {
    private readonly client: S3Client;
    private readonly bucket: string;
    private readonly publicUrl: string;

    constructor() {
      this.client = new S3Client({
      region: "auto",
      forcePathStyle: true,
      endpoint: process.env.R2_ENDPOINT!,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });
    this.bucket = process.env.R2_BUCKET_NAME!;
    this.publicUrl = process.env.R2_PUBLIC_URL!;
    }

    async upload(input: UploadFileInput): Promise<UploadFileOutput> {
        const key = `uploads/${Date.now()}-${input.originalmage.replace(/\s+/g, "-")}`;
        
        await this.client.send(
            new PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: input.buffer,
                ContentType: input.mimeType
            })
        );
        
        return {key, url: `${this.publicUrl}/${key}`}
    }
    
}