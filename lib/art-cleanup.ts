import { generateText } from 'ai';
import sharp from 'sharp';

const CLEANUP_PROMPT = `Clean up this photograph of an artwork. Perform the following corrections:
- Remove cast shadows caused by lighting or the camera angle
- Correct perspective distortion from the photo not being taken directly straight-on in front of the artwork (fix keystone/trapezoidal distortion so the artwork appears as a flat, head-on view)
- Straighten and correct any rotation so the artwork is level and properly oriented
- Normalize the background color: if the background appears patchy, uneven, or in shadow but is clearly meant to be a plain white paper/canvas surface, make it a uniform pure white. Be sensitive to the true background color — only whiten it if it should be white; if the background is intentionally off-white, colored, or part of the artwork, leave it unchanged
- Preserve all original artwork content, colors, and details — only fix the photographic artifacts
Return only the corrected image with no background or border added.`;

const DEFAULT_IMAGE_MODEL = 'google/gemini-3.1-flash-image-preview';

export async function cleanImageWithAI(
    imageBuffer: Buffer,
): Promise<Buffer | null> {
    const apiKey = process.env.AI_GATEWAY_API_KEY;
    if (!apiKey) return null;

    const model = process.env.AI_GATEWAY_IMAGE_MODEL || DEFAULT_IMAGE_MODEL;

    let result;
    try {
        result = await generateText({
            model,
            messages: [
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: CLEANUP_PROMPT },
                        { type: 'image', image: imageBuffer },
                    ],
                },
            ],
        });
    } catch (err) {
        console.warn(`AI cleanup request failed: ${err}`);
        return null;
    }

    const imageFiles = result.files.filter(f =>
        f.mediaType?.startsWith('image/'),
    );
    if (imageFiles.length === 0) return null;

    return stripRotationMetadata(Buffer.from(imageFiles[0].uint8Array));
}

export async function stripRotationMetadata(buffer: Buffer): Promise<Buffer> {
    // sharp auto-applies EXIF orientation to pixel data and strips all metadata
    return sharp(buffer).rotate().toBuffer();
}
