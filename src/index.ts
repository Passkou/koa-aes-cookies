import AES from 'crypto-js/aes'
import CryptoJS from 'crypto-js'
import Koa from 'koa';
import {setCookie, getCookies, Cookie} from './utils';

interface Config {
    /** The name of the key name, default is 'session' */ 
    key?: string
    /** (Required) The secret of the AES key. Will be used in encrypt and decrypt. */
    secretKey: string
    /** Max age of the cookie. Default is 86400*7 (1 week) */
    maxAge?: number
    /** Can client get cookie through Javascript? Default is true*/
    httpOnly?: boolean
    /** Send cookie only when protocol is HTTPS. Default is false*/
    secure?: boolean
    /** See https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies for help. Default is 'None'*/
    sameSite?: 'None' | 'Strict' | 'Lax'
    /** See https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies for help.*/
    domain?: string
    /** See https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies for help.*/
    path?: string
}

declare module "koa" {
    interface BaseContext {
        aesCookies: object
    }
}


function koaAesCookies(config: Config, app: Koa) {
    config.key = config.key || 'session';
    config.maxAge = config.maxAge || 86400 * 7;
    config.httpOnly = config.httpOnly || true;
    config.secure = config.secure || false;
    config.sameSite = config.sameSite || 'None';
    
    app.context.aesCookies
    const middleware: Koa.Middleware = async (ctx, next) => {
        // Read cookies
        const cookies = getCookies(ctx);
        const aesCookies = cookies[<string>config.key];
        if (aesCookies) {
            // Decrypt cookies
            try {
                const decryptedString = AES.decrypt(aesCookies, config.secretKey).toString(CryptoJS.enc.Utf8);
                ctx.aesCookies = JSON.parse(decryptedString);
            } catch (e) {
                // Failed
                ctx.aesCookies = {};
            }
        } else {
            ctx.aesCookies = {};
        }
        const before = JSON.stringify(ctx.aesCookies);
        // Next
        await next();

        const after = JSON.stringify(ctx.aesCookies);

        if (before !== after) {
            // Set cookie only when changed
            const jsonContent = JSON.stringify(ctx.aesCookies);
            const key = <string>config.key;
            const cookieConfig: Cookie = {
                key: key,
                value: AES.encrypt(jsonContent, config.secretKey).toString(),
                httpOnly: config.httpOnly,
                maxAge: config.maxAge,
                secure: config.secure,
                sameSite: config.sameSite
            };
            if (config.domain) {
                cookieConfig.domain = config.domain;
            }
            if (config.path) {
                cookieConfig.path = config.path;
            }
            setCookie(ctx, cookieConfig);
        }
    };
    return middleware;
}

export default koaAesCookies;
module.exports = koaAesCookies;