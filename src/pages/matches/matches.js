import _ from 'underscore';
import Swiper from 'Swiper';
import Util from '../../common-component/util/util.js';
import API from '../../api/Api.js';
import MatchesTpl from './matches.html';
import 'swiper/dist/css/swiper.min.css';

import "./matches.scss";

export default function Matches() {

    const handlers = {

        videoList:[],
        compList:[],
        newsList:[],
        count:3,

        init: function() {

            const _that = this;

            this.getCompetitionList(function(data){
                _that.compList = data;
                _that.renderHtml();
            });

            this.getVideoList(function(data){
                _that.videoList = data;
                _that.renderHtml();
            });

            this.getNewsList(function(data){
                _that.newsList = data;
                _that.renderHtml();
            });        

        },
        bindEvent: function() {
            let _this = this;
            //公共事件添加
            $(".matches-page").on("click",".js-handle",function(e){
                let handle = $(this).data('handle');
                _this[handle] && _this[handle](e, $(this));
            });
        },
        renderHtml:function(){
            this.count--;
            if(this.count === 0){
                $(".container").html(MatchesTpl({videoList:this.videoList,compList:this.compList,newsList:this.newsList}));
                var swiper = new Swiper('.video-list', {
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true
                    }
                });
    
                Util.setTitle('比赛');
    
                this.bindEvent();

            }
        },
        getCompetitionList: function(cb){

            $.ajax({
                url: API.getCompetitionList,
                type: 'post',
                data: {Body:2},
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
        getVideoList: function(cb){

            $.ajax({
                url: API.getVideoList,
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
        getNewsList: function(cb){

            $.ajax({
                url: API.getNewsList,
                type: 'post',
                data: {Body:10},
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
        toSignUpInfo:function(e,$this){
            const id = $this.parents(".event-item").data("id");
            Util.linkTo('/game-sign-up-info/' + id);
        },
        toMatchDetails:function(e,$this){
            const id = $this.parents(".event-item").data("id");
            Util.linkTo('/match-details/' + id);
        },
        toAllMatches:function(e,$this){
            Util.linkTo('/all-matches');
        }
    }

    handlers.init();
}
