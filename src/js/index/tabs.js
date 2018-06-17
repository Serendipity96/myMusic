{
    let view = {
        el:'#tabs',
        init(){
            this.$el = $(this.el);
        }
    };
    let model = {};
    let controller = {
        init(view,model){
            this.view = view;
            this.view.init();
            this.model = model;
            this.bindEvents();
            this.Module1();
            this.Module2();
        },
        bindEvents(){
            this.view.$el.on('click','.tabs-nav li',(e)=>{
                let $li = $(e.currentTarget);
                let tabName = $li.attr('data-tab-name');
                $li.addClass('active').siblings().removeClass('active');
                window.eventHub.emit('selectTab',tabName)
            })
        },
        Module1(){
            let script1 = document.createElement('script');
            script1.src='js/index/page-1-1.js';
            script1.onload = function () {
                console.log('1')
            }
            document.body.appendChild(script1)
        },
        Module2(){
            let script2 = document.createElement('script');
            script2.src='js/index/page-1-2.js';
            script2.onload = function () {
                console.log('2')
            }
            document.body.appendChild(script2)
        }
    }

    controller.init(view,model)
}