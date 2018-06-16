/**
 * 新闻列表页
 */

import _ from 'underscore';
import Util from '../../common-component/util/util.js';
import API from '../../api/Api.js';
import ClassesTpl from './classes.html';
import Videos from './components/videos/videos.js';

import "./classes.scss";

export default function Classes() {

	const handlers = {
		init: function() {
			$(".container").html( ClassesTpl() );
			Videos($('.classes-item-container'),{});
			this.bindEvent();
		},
		bindEvent: function() {
			let _this = this;
            //公共事件添加
            $(".classes-page").on("click", ".classes-item .js-handle", function(e){
                let handle = $(this).data('handle');
                _this[handle] && _this[handle](e);
            });
			this.handleChangeTab();
		},
		handleChangeTab: function() {
			$(".classes-page .classes-page-tabBar").on("click", "span", function(e){
				let $this = $(this);
				if($this.hasClass('active')){
					return;
				}else{
					$this.parent().find('span.active').removeClass('active');
					$this.addClass('active');

					let index = $this.index();
					let $container = $(".classes-item-container");
					switch (index){
						case 0 : Videos($container,{}); break;
						default : console.log('错误')
					}

				}
			});
		}
	}   

	handlers.init(); 
}
