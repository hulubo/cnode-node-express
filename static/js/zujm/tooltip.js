class Tooltip extends Widget {
    constructor() {
        super()
        this.bindEvents()
        this.renderHtml()
    }

    bindEvents() {
        var key = 'item'
        var event = eventMapper[key]
        var singleStore = Store.single()
        singleStore.on(event, () => {
            var m = singleStore.find(key)
            console.log('debug value', m)
        })
    }

    renderHtml() {

    }
}