import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const googleScriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
        if (!googleScriptUrl) {
            return NextResponse.json(
                { status: 'error', message: 'Google Script URL not configured' },
                { status: 500 }
            );
        }

        const response = await fetch(googleScriptUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            redirect: 'follow',
        });

        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch {
            data = { status: 'success', message: text };
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Proxy error:', error);
        return NextResponse.json(
            { status: 'error', message: error.message || 'Failed to submit survey' },
            { status: 500 }
        );
    }
}
