import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const session = request.cookies.get('session');
    const { pathname } = request.nextUrl;

    // Skip middleware for internal Next.js requests and static files
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/static') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    // If no session, we let the pages/actions handle it or we could auto-set here.
    // However, middleware can't easily access the DB to get the user ID.
    // So we'll let the getCurrentUser action handle the LOGIC, but we need to ensure
    // that the session is initiated.

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
