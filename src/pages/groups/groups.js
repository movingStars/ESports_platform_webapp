/**
 * 圈子页
 */
import _ from 'underscore';
import Swiper from 'swiper';
import MeScroll from 'mescroll.js';
import Util from '../../common-component/util/util.js';
import API from '../../api/Api.js';
import GroupsTpl from './groups.html';
import GroupInfoList from '../../common-component/groupInfoList/groupInfoList.js';

import "./groups.scss";

export default function Groups() {
    const userInfo = localStorage.getItem('UserInfo');
    const userId = userInfo && JSON.parse(userInfo).Id;

    const handlers = {

        params:{
            UserId: userId,
            CircleId: null,
            CommentDataCount: 3,
            PageIndex: 1,
            PageSize: 10
        },

        init: function() {

            const that = this;

            that.getUserCircle(function(data){

                $(".container").html(GroupsTpl({circleList:data}));

                that.params.CircleId = data[0].Id;
                // that.getUserPostMsgList(that.params, that.renderMsgList.bind(that), 'loadMore');
                that.renderMescroll.call(that);
                var swiper = new Swiper('.group-list',{
                    slidesPerView: 4
                });
                
                $(".group-list .swiper-slide").eq(0).addClass("active");

                that.bindEvent();

            });

            Util.setTitle('圈子');
        },
        bindEvent: function() {
            let _this = this;
            //公共事件添加
            $(".groups-layout").on("click", ".js-handle", function(e){
                let handle = $(this).data('handle');
                _this[handle] && _this[handle](e,$(this));
			});
            $('.group-list .swiper-wrapper').on('click','.swiper-slide',function(){
                let $this = $(this);
                if($this.hasClass('active')){
                    return;
                }else{
                    $this.parent().find('.swiper-slide.active').removeClass('active');
                    $this.addClass('active');

                    _this.params.CircleId = $this.data('id');

                    _this.getUserPostMsgList(_this.params,_this.renderMsgList.bind(_this),'refresh');

                }
            });
        },
        renderMescroll: function() {
            const _this = this;
            this.mescroll = new MeScroll("mescroll", { //第一个参数"mescroll"对应上面布局结构div的id
                down: {
                    auto: false,
                    htmlContent: '<p class="downwarp-progress"></p><p class="downwarp-tip" style="font-size:0.32rem;">下拉刷新</p>',
                    callback: function(page){
                        _this.params.pageIndex = 1;
                        setTimeout(function(){
                            _this.getUserPostMsgList(_this.params,_this.renderMsgList.bind(_this),'refresh');
                        },1000);
                    }
                },
                up: {
                    isBoth: false,
                    isBounce: false,
                    noMoreSize: 1,
                    htmlLoading: '<p class="upwarp-progress mescroll-rotate"></p><p class="upwarp-tip" style="font-size:0.32rem;">加载中..</p>',
                    htmlNodata:"<p class='upwarp-nodata' style='font-size:0.32rem;'>没有更多了-_-</p>",
                    callback: function(page){
                        _this.params.pageIndex = page.num;
                        setTimeout(function(){
                            _this.getUserPostMsgList(_this.params,_this.renderMsgList.bind(_this),'loadMore');
                        },1000);
                        
                    }
                }
            });
        },
        getUserCircle: function(cb){

            $.ajax({
                url: API.circleList,
                type: 'post',
                data: {Body:null},
                success: function(req){

                    if(!req.IsError){
                        cb && cb(req.Data || []);
                    }

                },
                error: function(msg){
                    console.log(msg);
                }
            })

        },
        getUserPostMsgList:function(params, cb, type){
            $.ajax({
                url: API.userPostMsgList,
                type: 'post',
                data: {Body:params},
                success: function(req){

                    if(!req.IsError){
                        cb && cb(req || {}, type);
                    }

                },
                error: function(msg){
                    console.log(msg);
                }
            })

        },
        renderMsgList:function(req,type){
            type == 'refresh' && $(".group-info-list").html('');
            GroupInfoList($(".group-info-list"), req.Result);
            this.params.PageIndex = req.PageIndex;

            this.mescroll && this.mescroll.endBySize(req.Result.length, req.TotalCount);
        },
        addGroups: function() {
            let token = Util.getCookie('AccessToken');

            if(!!token){
                Util.linkTo('/edit-dynamic');
            }else{
                Util.linkTo('/login');
            }
        }
    }

    handlers.init();
}
