const express = require('express')
const nunjucks = require('nunjucks')
const bodyParser = require('body-parser')
const session = require('cookie-session')

// 服务器端配置 引入 cors 模块
// const cors = require('cors')

const { log } = require('./utils')
const { secretKey } = require('./config')
// 上面一行相当于下面两行
// const a = require('./config')
// const secretKey = a.secretKey

// 先初始化一个 express 实例
const app = express()

// 配置 cors, 允许所有 cors 请求通过
// app.use(cors())

// 设置 bodyParser
// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false,
}))
// 设置 bodyParser 解析 json 格式的数据
// application/json
app.use(bodyParser.json())
// 设置 session, 这里的 secretKey 是从 config.js 文件中拿到的
app.use(session({
    secret: secretKey,
}))

// 配置 nunjucks 模板, 第一个参数是模板文件的路径
// nunjucks.configure 返回的是一个 nunjucks.Environment 实例对象
const env = nunjucks.configure('templates', {
    autoescape: true,
    express: app,
    noCache: true,
})

// nunjucks 添加自定义的过滤器
env.addFilter('formattedTime', (ts) => {
    // 引入自定义的过滤器 filter
    const formattedTime = require('./filter/formattedTime')
    const s = formattedTime(ts)
    return s
})


// 配置静态资源文件, 比如 js css 图片
const asset = __dirname + '/static'
app.use('/static', express.static(asset))

// 有时候在页面跳转的时候需要提示用户一些信息,
// 比如某样操作需要管理员权限, 跳转到新页面的时候就要把这个信息告知用户
// 这是一个套路写法, 直接记住这样用就可以
app.use((request, response, next) => {
    // response.locals 会把数据传到页面中
    // 这里的处理方式是先把 flash 数据放在 session 中
    // 然后把 flash 里面的数据放在 response.locals 中
    // 接着删除 response.session 中的 flash 数据,
    // 这样只会在当前这次请求中使用 flash 数据
    response.locals.flash = request.session.flash
    // obj = { a: '123' }
    // obj.a = null
    // delete obj.a
    delete request.session.flash
    next()
})

// 引入路由文件
const topic = require('./routes/topic')
const index = require('./routes/index')
const reply = require('./routes/reply')

// 引入 board 路由
// 这次 exports 的是 topic: main 的形式
// 所以需要解包
const { board } = require('./routes/board')
const { user } = require('./routes/user')
const { zujm } = require('./routes/zujm')

// 使用 app.use(path, route) 的方式注册路由程序
app.use('/', index)
app.use('/topic', topic)
app.use('/reply', reply)
app.use('/board', board)
app.use('/user', user)
app.use('/zujm', zujm)


const apiTopic = require('./api/topic')
app.use('/api/topic', apiTopic)

const apiMovie = require('./api/movie')
app.use('/api/movie', apiMovie)


// 注意, 404 和 500 的路由一定是放在所有路由后面的
app.use((request, response) => {
    response.status(404)
    response.render('404.html')
})

// 500 错误的回调有四个参数, 最后的 next 是一个套路
app.use((error, request, response, next) => {
    console.error(error.stack)
    response.status(500)
    response.send('定制的 500 错误')
})

// 把逻辑放在单独的函数中, 这样可以方便地调用
// 指定了默认的 host 和 port, 因为用的是默认参数, 当然可以在调用的时候传其他的值
const run = (port=3000, host='') => {
    // app.listen 方法返回一个 http.Server 对象, 这样使用更方便
    // 实际上这个东西的底层是我们以前写的 net.Server 对象
    const server = app.listen(port, host, () => {
        // 非常熟悉的方法
        const address = server.address()
        host = address.address
        port = address.port
        log(`listening server at http://${host}:${port}`)
    })
}

if (require.main === module) {
    const port = 2333
    // host 参数指定为 '0.0.0.0' 可以让别的机器访问你的代码
    const host = '0.0.0.0'
    run(port, host)
}