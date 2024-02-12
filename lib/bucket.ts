import { HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
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
                // eslint-disable-next-line no-constant-condition
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

/**
 * Upload a file to R2 and return the URL to the file.
 * @param fileUrl 
 * @param key 
 * @returns 
 */
export async function uploadToR2(fileUrl: string, key: string) {
    const client = new S3Client({
        endpoint: process.env.R2_ENDPOINT as string,
        region: 'us-east-1', // 'us-east-1' is the default region for R2, but you can change it to your desired region
        credentials: {
            accessKeyId: process.env.R2_AWS_ACCESS_KEY_ID as string,
            secretAccessKey: process.env.R2_AWS_SECRET_ACCESS_KEY as string,
        },
        forcePathStyle: true,
    });

    const bucket = process.env.R2_BUCKET_NAME;
    if (!bucket) throw new Error('R2_BUCKET_NAME is not defined');

    try {
        const response = await fetch(fileUrl);
        if (!response.ok)
            throw new Error(
                `Failed to fetch ${fileUrl}: ${response.statusText}`,
            );
        if (!response.body) throw new Error('Response body is undefined');

        const params = new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: readableStreamToReadable(response.body),
            ContentType: response.headers.get('content-type') || undefined,
            ContentLength: Number(response.headers.get('content-length')) || undefined,
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
export async function r2FileExists(key: string): Promise<string|undefined> {
    const client = new S3Client({
        endpoint: process.env.R2_ENDPOINT as string,
        region: 'us-east-1', // 'us-east-1' is the default region for R2, but you can change it to your desired region
        credentials: {
            accessKeyId: process.env.R2_AWS_ACCESS_KEY_ID as string,
            secretAccessKey: process.env.R2_AWS_SECRET_ACCESS_KEY as string,
        },
        forcePathStyle: true,
    });
    
    const command = new HeadObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
    })
    const response = await client.send(command)
    if (response.$metadata.httpStatusCode === 200) {
        return makeR2UrlFromKey(key);
    } 
        
    return undefined;
    
}
