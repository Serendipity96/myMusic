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
                return $('<li></li>').text(song.songName).attr('data-song-id', song.id);
            });
            $el.find('ul').empty();
            liList.map((domLi) => {
                $el.find('ul').append(domLi);
            });
        },
        activeLiItem(li) {
            $(li).addClass('wordActive')
                .siblings().removeClass('wordActive');
        }
    };
    let model = {
        data: {
            songs: []
        },
        find() {
            var query = new AV.Query('Song');
            return query.find().then((songs) => {
                //leancloud进行了封装，里面有很多方法，只要几个需要的属性，so这里map了一下
                this.data.songs = songs.map((song) => {
                    return {id: song.id, ...song.attributes}
                });
                return songs;//promise的特点，得到什么就return什么
            })
        }
    };
    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            this.view.render(this.model.data);
            this.bindEvents();
            this.bindEventHub();
            this.getAllSongs();
        },
        getAllSongs() {
            return this.model.find().then(() => {
                this.view.render(this.model.data)
            })
        },
        bindEvents() {
            $(this.view.el).on('click', 'li', (e) => {
                this.view.activeLiItem(e.currentTarget);
                let songId = e.currentTarget.getAttribute('data-song-id');
                let data;
                let songs = this.model.data.songs;
                for (let i = 0; i < songs.length; i++) {
                    if (songId === songs[i].id) {
                        data = songs[i];
                        break;
                    }
                }
                //深拷贝，防止改了之后有bug
                let str = JSON.stringify(data);
                let obj = JSON.parse(str);
                window.eventHub.emit('select', obj);
            })
        },
        bindEventHub() {
            window.eventHub.on('create', (songData) => {
                this.model.data.songs.push(songData);
                this.view.render(this.model.data);
            });
            window.eventHub.on('update', (song) => {
                let songs = this.model.data.songs;
                for (let i = 0; i < songs.length; i++) {
                    if (songs[i].id === song.id) {
                        Object.assign(songs[i], song);
                    }
                }
                this.view.render(this.model.data);
            })
        }
    };
    controller.init(view, model)
}