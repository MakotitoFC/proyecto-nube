import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const { pathname } = req.nextUrl

    if (pathname === '/login') {
        if (isLoggedIn) return NextResponse.redirect(new URL('/panel', req.url))
        return
    }

    if (pathname === '/') {
        return NextResponse.redirect(new URL(isLoggedIn ? '/panel' : '/login', req.url))
    }

    if (pathname.startsWith('/panel') && !isLoggedIn) {
        return NextResponse.redirect(new URL('/login', req.url))
    }
})

export const config = {
    matcher: ['/', '/login', '/panel/:path*'],
}
