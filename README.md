# koa-aes-cookies

A middleware for koa that can save and get cookie encrypted with AES to or from the browser.

# Installation

```bash
$ npm install -S koa-aes-cookies
```

# Example

```javascript
const koaAesCookies = require('koa-aes-cookies');
const Koa = require('koa');

const app = new Koa();

// Ensure that this middleware be loaded at first.
app.use(koaAesCookies({
    secretKey: '114514' // Your secret key. Keep it unguessable and really secret!
}, app));

app.use(async function(ctx, next) {
    let i = ctx.aesCookies.i || 0;

    // Set ctx.aesCookies directly
    ctx.aesCookies.i = ++i;
    
    ctx.body = ctx.aesCookies.i.toString();
});

app.listen(5000);
```

# Configuration

key?: string           The name of the key name, default is 'session'

secretKey: string       (Required) The secret of the AES key. Will be used in encrypt and decrypt.

maxAge?: number         Max age of the cookie. Default is 86400*7 (1 week)

httpOnly?: boolean      Can client get cookie through Javascript? Default is true

secure?: boolean        Send cookie only when protocol is HTTPS. Default is false

sameSite?: 'None' | 'Strict' | 'Lax'         See https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies for help. Default is 'None'

domain?: string         See https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies for help.

path?: string           See https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies for help.
