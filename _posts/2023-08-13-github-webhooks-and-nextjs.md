---
layout: post
title:  "Supporting Github Webhook Handlers on NextJS App Router"
author: "Karim"
comments: false
---

I recently decided to switch an internal tool from NextJS pages router to app router.  There's lots of documentation about how to do that but the part that I was surprised would be tricky was getting my api implementation for my Github app's webhook handler working again.  

As part of the migration I moved my webhooks endpoint for github from its original location `/pages/api/github/hooks.ts` to `/app/api/github/hooks/route.ts`.

In the app dir, route handlers actually take different parameters and export different function.  For one thing, you export a separate handler for each method type (though you can double up if they handle the method validation internally).  Secondly, we are no longer receiving `NextApiRequest` which is an extension of the [`IncomingMessage`](https://nodejs.org/api/http.html#class-httpincomingmessage) object.  Instead we are receiving the more web-friendly [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) object.  Since NextJS now expects handlers that receive a `Request` object we can no longer just export the response from Probot/Octokit's `createNodeMiddleware`.  

So, instead, we have to handle the reception and processing of the request at a lower level.  It looks something like this:

```typescript
import { App } from 'octokit'
import { NextRequest } from 'next/server'
import { EmitterWebhookEventName } from '@octokit/webhooks/dist-types/types'

const handler = async (req: NextRequest) => {
    const app = new App({
        appId: process.env.APP_ID as string,
        privateKey: Buffer.from(
            process.env.PRIVATE_KEY || '',
            'base64'
        ).toString('utf8'),
        webhooks: {
            secret: process.env.GITHUB_WEBHOOK_SECRET as string,
        },
    })

    app.webhooks.on('pull_request.opened', async ({ payload }) => {
        try {
            // Do something
        } catch (e) {
            console.error(
                `pull_request.opened handler failed with error: ${
                    (<Error>e).message
                }`
            )
        }
    })

    app.webhooks.on('pull_request.edited', async ({ payload }) => {
        try {
            // Do something else
        } catch (e) {
            console.error(
                `pull_request.edited handler failed with error: ${
                    (<Error>e).message
                }`
            )
        }
    })
    
    await app.webhooks.verifyAndReceive({
        id: req.headers.get('X-GitHub-Delivery') as string,
        name: req.headers.get('X-GitHub-Event') as EmitterWebhookEventName,        
        signature: req.headers.get('X-Hub-Signature-256') as string,
        payload: await req.text(),
    })

    return new Response('ok')
}

export { handler as GET, handler as POST }
```

