/**
 * 动态详情
 */
import _ from 'underscore';
import Util from '../../common-component/util/util.js';
import API from '../../api/Api.js';
import DynamicDetailsTpl from './dynamic-details.html';
import GroupInfoItem from '../../common-component/groupInfoItem/groupInfoItem.js';
import Comment from '../../common-component/comment/comment.js';

import "./dynamic-details.scss";

export default function DynamicDetails(id) {

    const handlers = {
        init: function() {
            this.renderDetails();
            Util.setTitle('动态详情');
            this.bindEvent();
        },
        bindEvent: function() {
            
        },
        renderDetails: function() {
            let _this = this;
            this.getDetails(id,function(data){
                $(".container").html(DynamicDetailsTpl());
                GroupInfoItem($(".groupItem-layout"),data,true);
                Comment($(".comment-layout"),{
                    commentList: data.CommentReplyList,
                    commentCount: data.CommentCount,
                    likeCount: data.LikeCount
                },_this.sendInfo.bind(_this));
            })
        },
        getDetails: function(id,callback) {
            let _this = this;
            $.ajax({
                url: API.getPostMsgDetail,
                type: 'post',
                data: { Body: id },
                success: function(req){
                    req = typeof(req) == 'string' ? JSON.parse(req) : req;
                    if(!req.IsError){
                        _this.detailsData = req.Data;
                        callback && callback(req.Data || []);
                    }
                },
                error: function(msg){
                    console.log(msg);
                }
            })
        },
        sendInfo: function(options = {}) {
            let _this = this;
            const UserId = JSON.parse(localStorage.getItem('UserInfo')).Id;
            
            $.ajax({
                url: API.addCommentReply,
                data: {
                    Body: {
                        ...options,
                        PostMessageId: id,
                        UserId
                    }
                },
                success: function(req){

                    if(!req.IsError){
                        Util.alertMessage('评论/回复成功！');
                        _this.renderDetails();
                    }

                },
                error: function(msg){
                    console.log(msg);
                }
            })
        }
    }

    handlers.init();
}
