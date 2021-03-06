import CommentTpl from "./comment.html";

import "./comment.scss";

export default function Comment($el, commentData, callback) {
    const handlers = {
        init: function() {
            $el.append(CommentTpl(commentData));
            this.bindEvent();
        },
        bindEvent: function() {
            let _this = this;
            //公共事件添加
            $(".comment-info-list .js-handle").on("click",function(e){
                let $this = $(this);
                let handle = $this.data('handle');
                _this[handle] && _this[handle](e,$this);
            });

            //评论操作
            let $container = $(".container");
            let currentScrollTop = 0;
            $(".input-box")
            .on('focus',function(e){
                currentScrollTop = $container.scrollTop();
                $(this).parent().css({position: 'absolute'});
                $container.on('touchmove',function(event){
                    event.preventDefault();
                }).scrollTop(0);
            })
            .on('blur',function(e){
                $(this).html('').parent().css({position: 'fixed'});
                $container.off('touchmove').scrollTop(currentScrollTop);
                $(".dynamicDetails-layout").removeClass("hasCommentInput");
                $(".comment-input").hide();
            })
            .on("keypress",function(e){
                e.preventDefault();
                if(e.keyCode == 13){//回车提交
                    let $this = $(this);
                    let type = $this.data('type');
                    callback && callback({
                        CommentReplyType: type,
                        ReplyUserId: $this.data('userId'),
                        Content: $this.html()
                    });
                    $this.blur();
                }
            })
        },
        handleComment: function(e,$this) {
            $(".comment-input")
                .show()
                .find(".input-box")
                .attr('data-type','1')
                .attr('data-user-id',$this.parents("li").data('userId'))
                .focus();
            $(".dynamicDetails-layout").addClass("hasCommentInput");
        }
    }

    handlers.init();
}

