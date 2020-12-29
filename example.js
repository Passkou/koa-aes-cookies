/**
 * A simple example that will update a counter when user refresh.
 * User can see the encrypted cookie but can not modify or see original content unless it has secret key.
 */

const koaAesCookies = require('./dist/index.js');
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