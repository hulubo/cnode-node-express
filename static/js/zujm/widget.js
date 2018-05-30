const log = console.log.bind(console)

class Widget {
    constructor() {
        // 使用 this.handlers 作为一个容器, 存放相应的事件处理函数
        this.handlers = {}
    }

    on(type, handler) {
        // off 函数里是将 this.handlers[type] 设置为 null
        // 所以这里需要判断 this.handlers[type] 是 undefined 或者 null 这两种情况
        if (typeof this.handlers[type] === 'undefined' || this.handlers[type] === null) {
            this.handlers[type] = []
        }
        this.handlers[type].push(handler)
        // return this 之后，就可以继续调用，这个就是所谓链式调用法
        //console.log('on_this',this)
        return this
    }

    fire(...args) {
        // 第一个 type 是 event type, 也就是触发的事件类型
        // 剩下的所有参数都放在 rest 中
        console.log('args', args)
        const [type, ...rest] = args

        const handlers = this.handlers[type]
        console.log('handlers', handlers)
        // 如果 handlers 是数组, 就掉用
        if (Array.isArray(handlers)) {
            handlers.forEach((k) => {
                const func = k
                func.apply(this, rest)
            })
        }
        return this
    }

    off(type) {
        // 如果传入了 type, 就移除 type 对应的 handlers
        // 否则移除所有的 handlers
        if (type !== undefined) {
            this.handlers[type] = null
        } else {
            this.handlers = null
        }
        return this
    }

    destroy() {
        // 如果 this.
        if (Object.keys(this.handlers).length > 0) {
            this.fire('destroyed')
        }
        this.handlers = null
    }

    static single() {
        const cls = this
        if (cls.instance === undefined) {
            cls.instance = new cls()
        }
        return cls.instance
    }
}

const test = () => {
    const log = console.log.bind(console)
    const w = new Widget()
    const eventType = 'message'

    w.on(eventType, () => {
        log('message event')
    })

    w.on(eventType, () => {
        log('message event 1')
    })

    w.fire(eventType)
    //
    // w.off(eventType)
    // //
    // w.fire(eventType)

    // w.on(eventType, () => {
    //     log('message event 3')
    // })

    // w.fire(eventType)
}

const main = () => {
    test()
}

main()
