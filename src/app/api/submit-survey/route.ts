import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const googleScriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
        if (!googleScriptUrl) {
            console.error('❌ NEXT_PUBLIC_GOOGLE_SCRIPT_URL is not set!');
            return NextResponse.json(
                { status: 'error', message: 'Google Script URL not configured' },
                { status: 500 }
            );
        }

        console.log('📤 Sending to Google:', googleScriptUrl);

        const response = await fetch(googleScriptUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            redirect: 'follow',
        });

        console.log('📥 Google responded:', response.status, response.statusText);
        console.log('📥 Response URL:', response.url);

        const text = await response.text();
        console.log('📥 Response body:', text.substring(0, 500));

        if (!response.ok) {
            return NextResponse.json(
                { status: 'error', message: `Google returned ${response.status}: ${text.substring(0, 200)}` },
                { status: 502 }
            );
        }

        let data;
        try {
            data = JSON.parse(text);
        } catch {
            data = { status: 'success', message: text };
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('❌ Proxy error:', error);
        return NextResponse.json(
            { status: 'error', message: error.message || 'Failed to submit survey' },
            { status: 500 }
        );
    }
}
