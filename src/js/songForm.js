{
    let view = {
        el: '.editSong',
        init() {
            this.$el = $(this.el)
        },
        template: `
        <h1>编辑歌曲</h1>
        <form action="" id="songForm">
            <div class="row">
                <label>
                    歌曲
                    <input name="songName" type="text" value="__songName__">
                </label>
            </div>
            <div class="row">
                <label>
                    歌手
                    <input name="singer" type="text" value="__singer__">
                </label>
            </div>
            <div class="row">
                <label>
                    外链
                    <input name="url" type="text" value="__url__">
                </label>
                <button class="btn-submit" type="submit">保存</button>
            </div>
            <div id="uploadStatus"></div>
        </form>
        `,
        render(data = {}) {
            let placeholders = ['songName', 'singer', 'url', 'id'];
            let html = this.template;
            placeholders.map((str) => {
                html = html.replace(`__${str}__`, data[str] || ' ')
            });
            $(this.el).html(html);
        },
        reset() {
            this.render({});
        }
    };
    let model = {
        data: {
            songName: '',
            singer: '',
            url: '',
            id: ''
        },
        create(data) {
            // 声明类型
            var Song = AV.Object.extend('Song');
            // 新建对象
            var song = new Song();
            // 设置名称
            song.set('songName', data.songName);
            song.set('singer', data.singer);
            song.set('url', data.url);
            return song.save().then((newSong) => {
                let {id, attributes} = newSong;
                this.data = {id, ...attributes};
            }, (error) => {
                console.error(error);
            });
        }
    };
    let controller = {
        init(view, model) {
            this.view = view;
            this.view.init();
            this.model = model;
            this.view.render(this.model.data);
            this.bindEvents();
            window.eventHub.on('upload', (data) => {
                this.model.data = data;
                this.view.render(this.model.data);
            })
        },
        bindEvents() {
            this.view.$el.on('submit', 'form', (e) => {
                e.preventDefault();
                let needs = 'songName singer url'.split(' ');
                let data = {};
                needs.map((str) => {
                    data[str] = this.view.$el.find(`[name="${str}"]`).val();
                });
                this.model.create(data)
                    .then(() => {
                        this.view.reset();
                        let str = JSON.stringify(this.model.data);// JavaScript 值转换为 JSON 字符串
                        let obj = JSON.parse(str);//JSON 字符串变对象
                        window.eventHub.emit('create', obj);
                    })
            })
        }
    };
    controller.init(view, model);
}