# Google Photos Integration Setup

The sketchbook upload and modify routes copy the final image to a Google Photos
album in addition to the existing Cloudflare R2 upload. This is best-effort: if
Google Photos is not connected or the upload fails, the R2 upload still
succeeds and a warning is returned.

The Google connection is initiated from the sketchbook upload page via an
interactive OAuth flow. The refresh token and album ID are stored in Vercel KV.

## Prerequisites

1. A Google account with Google Photos enabled.
2. Access to the [Google Cloud Console](https://console.cloud.google.com/).
3. A Vercel project with KV enabled (or a compatible KV store).

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (or reuse an existing one), e.g. `sketchbook-uploader`.

## Step 2: Enable the Google Photos Library API

1. In the Cloud Console, go to **APIs & Services > Library**.
2. Search for **Google Photos Library API**.
3. Click **Enable**.

## Step 3: Create OAuth 2.0 Credentials

1. Go to **APIs & Services > OAuth consent screen**.
2. Configure the consent screen (External is fine for personal use).
3. Add your Google account email as a **Test user**.
4. Go to **APIs & Services > Credentials > Create credentials > OAuth client ID**.
5. Choose **Web application**.
6. Add these **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/google/callback` (local dev)
   - `https://karim.cloud/api/auth/google/callback` (production)
7. Note the **Client ID** and **Client Secret**.

## Step 4: Set up Vercel KV

1. In your Vercel project dashboard, go to **Storage > Create > KV**.
2. Name it (e.g. `sketchbook-kv`).
3. Vercel automatically injects `KV_REST_API_URL` and `KV_REST_API_TOKEN` as
   environment variables into your deployment.
4. For local development, run `vercel env pull` to download env vars into
   `.env.local`, or manually set `KV_REST_API_URL` and `KV_REST_API_TOKEN`
   from the KV dashboard.

## Step 5: Set Environment Variables

Add these to your `.env.local` (and your Vercel project environment):

```
GOOGLE_PHOTOS_CLIENT_ID=your_client_id
GOOGLE_PHOTOS_CLIENT_SECRET=your_client_secret
KV_REST_API_URL=your_kv_rest_api_url
KV_REST_API_TOKEN=your_kv_rest_api_token
```

> `KV_REST_API_URL` and `KV_REST_API_TOKEN` are auto-configured by Vercel
> when you link a KV store to your project. For local dev, use
> `vercel env pull`.

## Step 6: Connect Google Photos

1. Go to `/sketchbook/upload` on your site.
2. Enter your upload secret (bearer token).
3. Click **Connect** next to "Google Photos not connected".
4. You will be redirected to Google's consent screen. Authorize the app.
5. Google redirects back to the upload page. A "Sketchbook" album is created
   automatically in your Google Photos account.
6. The status indicator should now show "Google Photos connected".

## How It Works

- The OAuth flow stores a refresh token and the auto-created album ID in
  Vercel KV (keys: `google_photos:tokens`).
- When uploading or modifying a sketchbook image, the server reads the stored
  tokens from KV, refreshes the access token, and uploads the image to the
  album.
- If Google Photos is not connected or the upload fails, the R2 upload still
  succeeds and a yellow warning is shown.
- Click **Disconnect** on the upload page to remove the stored tokens from KV.

## Verification

After connecting, upload or modify a sketchbook image. The image should appear
in the Google Photos "Sketchbook" album. If something goes wrong, the upload UI
will show a yellow warning line with the error message while the R2 upload
still succeeds.
