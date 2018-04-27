{
    let view = {
        el: '.songList',
        template: `
        <h1>歌曲列表</h1>
        <ul> 
        </ul>
        `,
        render(data) {
            let $el = $(this.el);
            $el.html(this.template);
            let {songs} = data;
            let liList = songs.map((song) => {
                return $('<li></li>').text(song.songName);
            });
            $el.find('ul').empty();
            liList.map((domLi) => {
                $el.find('ul').append(domLi);
            });
        }
    };
    let model = {
        data: {
            songs: []
        }
    };
    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            this.view.render(this.model.data);
            window.eventHub.on('create', (songData) => {
                this.model.data.songs.push(songData);
                console.log(songData)
                this.view.render(this.model.data);
            })
        }
    };
    controller.init(view, model)
}