import sharp from "sharp";

export default class GenerateBufferByImage {
    private readonly MAX_IMAGE_DIMENSION = 5760;

    private async resizeImage(buffer: Buffer<ArrayBufferLike>): Promise<Buffer<ArrayBufferLike>> {
        return await sharp(buffer)
            .resize(this.MAX_IMAGE_DIMENSION, this.MAX_IMAGE_DIMENSION, {
                fit: "inside",
                withoutEnlargement: true,
            })
            .toBuffer();
    }

    public async convertToBase64AndReturnUrl(buffer: Buffer<ArrayBufferLike>, mimetype: string): Promise<string> {
        const base = (await this.resizeImage(buffer)).toString("base64");
        const imageUrl = `data:${mimetype};base64,${base}`;
        return imageUrl;
    }
}