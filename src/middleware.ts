import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
    // Match only internationalized pathnames
    // Matching all paths except for api, _next/static, _next/image, favicon.ico
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
