import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const { pathname } = req.nextUrl

    // Panel sin sesión → login
    if (pathname.startsWith('/panel') && !isLoggedIn) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    // Login con sesión activa → panel
    if (pathname === '/login' && isLoggedIn) {
        return NextResponse.redirect(new URL('/panel', req.url))
    }
})

export const config = {
    matcher: ['/panel/:path*', '/login'],
}
