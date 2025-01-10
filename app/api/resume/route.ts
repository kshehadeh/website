// NOTE: This is here to allow the resume to be downloaded instead of rendered as a PDF in the browser
export async function GET() {
    // Download a PDF locally and then send it to the client as a response
    const response = await fetch(
        'https://static.karim.cloud/resume/karim-shehadeh-resume.pdf',
    );

    const buffer = await response.arrayBuffer();
    return new Response(buffer, {
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition':
                'attachment; filename="karim-shehadeh-resume.pdf"',
        },
    });
}
