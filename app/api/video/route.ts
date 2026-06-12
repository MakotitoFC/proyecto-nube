import { NextRequest } from 'next/server'

// Edge runtime: streaming real sin límite de tamaño (Vercel Hobby compatible)
export const runtime = 'edge'

const BACKEND_URL = 'http://pelicanos-backend-env-1.eba-uzzr6qa2.us-east-1.elasticbeanstalk.com'

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl
    const filename = searchParams.get('file')

    if (!filename) {
        return new Response('Missing file parameter', { status: 400 })
    }

    const backendUrl = `${BACKEND_URL}/minio/view/${encodeURIComponent(filename)}`

    const forwardHeaders: HeadersInit = {}
    const range = request.headers.get('range')
    if (range) {
        forwardHeaders['Range'] = range
    }

    try {
        const response = await fetch(backendUrl, {
            headers: forwardHeaders,
        })

        const responseHeaders = new Headers()
        responseHeaders.set('Content-Type', response.headers.get('content-type') || 'video/webm')
        responseHeaders.set('Accept-Ranges', 'bytes')

        const contentLength = response.headers.get('content-length')
        const contentRange = response.headers.get('content-range')
        if (contentLength) responseHeaders.set('Content-Length', contentLength)
        if (contentRange) responseHeaders.set('Content-Range', contentRange)

        // Allow browser caching for 1 hour
        responseHeaders.set('Cache-Control', 'public, max-age=3600')

        return new Response(response.body, {
            status: response.status,
            headers: responseHeaders,
        })
    } catch {
        return new Response('Error fetching video', { status: 502 })
    }
}
