import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import http from 'node:http';
import https from 'node:https';
import { Readable } from 'stream';

/**
 * Convert a ReadableStream to a Node.js Readable stream.  This handles the case
 * where we are using web streams in the browser and need to convert them to Node.js
 * streams.
 * @param readableStream
 * @returns
 */
function readableStreamToReadable(readableStream: ReadableStream<Uint8Array>) {
    return new Readable({
        async read() {
            const reader = readableStream.getReader();
            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) {
                        this.push(null); // Indicates the end of the stream
                        break;
                    }
                    this.push(value);
                }
            } catch (err) {
                this.emit('error', err);
            }
        },
    });
}

/**
 * Make a URL to an object in R2 from the key.  We are using a static URL
 * for all R2 objects.  This has been configured in the R2 bucket settings.
 * @param key
 * @returns
 */
export function makeR2UrlFromKey(key: string) {
    return `https://static.karim.cloud/${key}`;
}

function createR2Client() {
    return new S3Client({
        endpoint: process.env.R2_ENDPOINT as string,
        region: 'us-east-1',
        credentials: {
            accessKeyId: process.env.R2_AWS_ACCESS_KEY_ID as string,
            secretAccessKey: process.env.R2_AWS_SECRET_ACCESS_KEY as string,
        },
        forcePathStyle: true,
    });
}

function headRequest(url: string): Promise<boolean> {
    const transport = url.startsWith('https:') ? https : http;

    return new Promise((resolve, reject) => {
        const request = transport.request(url, { method: 'HEAD' }, response => {
            resolve((response.statusCode ?? 500) < 400);
        });

        request.on('error', reject);
        request.end();
    });
}

/**
 * Upload a file to R2 and return the URL to the file.
 * @param fileUrl
 * @param key
 * @returns
 */
export async function uploadToR2(fileUrl: string, key: string) {
    const bucket = process.env.R2_BUCKET_NAME;
    if (!bucket) throw new Error('R2_BUCKET_NAME is not defined');

    try {
        const response = await fetch(fileUrl);
        if (!response.ok)
            throw new Error(
                `Failed to fetch ${fileUrl}: ${response.statusText}`,
            );
        if (!response.body) throw new Error('Response body is undefined');

        if (response.bodyUsed || response.body.locked) {
            return;
        }

        const client = createR2Client();

        const params = new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: readableStreamToReadable(response.body),
            ContentType: response.headers.get('content-type') || undefined,
            ContentLength:
                Number(response.headers.get('content-length')) || undefined,
        });

        await client.send(params);

        console.log('Successfully uploaded file:', key);

        return makeR2UrlFromKey(key);
    } catch (err) {
        console.error('Error uploading file: ', err);
    }
}

/**
 * Check to see if an object exists in R2.  If it does, return the URL to the object, otherwise return undefined.
 * @param key
 * @returns
 */
export async function r2FileExists(key: string): Promise<string | undefined> {
    const url = makeR2UrlFromKey(key);

    try {
        if (await headRequest(url)) {
            return url;
        }
    } catch (e) {
        console.error('Error checking if file exists:', e);
    }

    return undefined;
}

export async function getMirroredFileUrl(
    sourceUrl: string,
    key: string,
): Promise<string> {
    const existingUrl = await r2FileExists(key);
    if (existingUrl) {
        return existingUrl;
    }

    const uploadedUrl = await uploadToR2(sourceUrl, key);
    return uploadedUrl ?? sourceUrl;
}
