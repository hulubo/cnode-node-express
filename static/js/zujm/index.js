var renderMovie = (data) => {
    var options = {
        wrapper: $('.wrapper'),
        data: data,
        store: Store,
        components: Tooltip,
    }
    new Movie(options)

}

var __main = () => {
    const m = MovieApi.single()
    m.fetchMovies().then((r) => {
        renderMovie(r.data)
    })
}

$(document).ready(() => {
    __main()
})
