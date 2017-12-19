const path = require('path')
const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))
const Koa = require('koa')
const app = new Koa()
const serve = require('koa-static')
const logger = require('koa-logger')
const Router = require('koa-router')
const router = new Router()
const koaBody = require('koa-body')
const send = require('koa-send')
app.use(logger())

app.use(serve(path.join(__dirname, 'public')))
app.use(koaBody({multipart: true}))

router
    .get('/', async (ctx, next) => {
        await send(ctx, './index.html')
    })
    .post('/upload', async (ctx, next) => {
        console.log(ctx.request.body)
        let data = ctx.request.body.files.file
        const reader = fs.createReadStream(data.path)
        const stream = fs.createWriteStream(`./public/image/${Math.floor(Math.random() * 10000)}.jpg`)
        reader.pipe(stream)
        ctx.body = {status: 200}
    })

app
    .use(router.routes())
    .use(router.allowedMethods())

app.listen(3000)
