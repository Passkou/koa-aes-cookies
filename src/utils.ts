import {BaseContext} from 'koa';

export function parseCookiesString(cookiesString: string) {
    const cookieDict: any = {};
    cookiesString.split('; ').forEach(v => {
        const [key, value] = v.split('=');;
        cookieDict[key] = value;
    });
    return cookieDict;
}

export interface Cookie {
    key: string
    value: string
    maxAge?: number
    domain?: string
    path?: string
    secure?: boolean
    httpOnly?: boolean
    sameSite?: "None" | "Strict" | "Lax"
}

export function setCookie(ctx: BaseContext, cookie: Cookie): void {
    const {key, value} = cookie;
    let cookieHeader = `${key}=${value}`;
    for (const [k, v] of Object.entries(cookie)) {
        if (k !== 'key' && k !== 'value') {
            switch (k) {
                case 'secure':
                    if (v) {
                        cookieHeader += '; Secure';
                    }
                    break;
                case 'httpOnly':
                    if (v) {
                        cookieHeader += '; HttpOnly';
                    }
                    break;
                case 'sameSite':
                    cookieHeader += '; Same-Site=' + v;
                    break;
                case 'maxAge':
                    cookieHeader += '; Max-Age=' + v;
                    break;
                case 'domain':
                    cookieHeader += '; Domain=' + v;
                    break;
                case 'path':
                    cookieHeader += '; Path=' + encodeURIComponent(v);
                    break;
                default:
                    break;
            }
        }
    }
    ctx.append('Set-Cookie', cookieHeader);
}

export function getCookies(ctx: BaseContext) {
    if (ctx.header['cookie']) {
        return parseCookiesString(ctx.header['cookie']);
    } else {
        return {};
    }
}