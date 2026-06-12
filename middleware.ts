import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isOnPanel = req.nextUrl.pathname.startsWith('/panel')
    const isOnLogin = req.nextUrl.pathname.startsWith('/login')

    if (isOnPanel && !isLoggedIn) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    if (isOnLogin && isLoggedIn) {
        return NextResponse.redirect(new URL('/panel', req.url))
    }
})

export const config = {
    matcher: ['/panel/:path*', '/login'],
}
