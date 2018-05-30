class Movie extends Widget {
    constructor(options) {
        super()
        this._options = options
        this.body = this._options.wrapper
        this._components = {}
        this.renderHtml()
        this.bindEvents()
    }

    bindEvents() {
        this.body.on('click', 'a', (e) => {
            e.preventDefault()
            var singleStore = this._options.store.single()
            var self = e.target
            var value = $(self).closest('a').find('span').text()
            singleStore.add('item', value)
            this._components['item'].fire('item')
        })
    }

    renderHtml() {
        this.renderItems()
    }

    renderItems() {
        var movies = this._options.data
        var ms = movies.map((m) => {
            var cover = m.cover
            var title = m.title
            var score = m.rate
            var s = (`
                <li>
                    <a href="">
                        <div>
                            <img src="${cover}" alt="${title}">
                        </div>
                        <p>
                            <span>${title}</span>
                            <strong>${score}</strong>
                        </p>
                    </a>
                </li>
            `)
            return s
        }).join('')
        var t = (`
            <ul class="movie-list">
                ${ms}
            </ul>
        `)
        var container = this._options.wrapper
        container.html(t)
        this._components['item'] = new Tooltip(this._options)
    }
}