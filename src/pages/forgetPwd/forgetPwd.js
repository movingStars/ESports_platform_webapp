/**
 * 注册页
 */
import _ from 'underscore';
import Util from '../../common-component/util/util.js';
import API from '../../api/Api.js';
import ForgetPwdTpl from './forgetPwd.html';

import "./forgetPwd.scss";

export default function Login() {

	const handlers = {
		init: function() {
			$("#app-container").html( ForgetPwdTpl({ title: '忘记密码' }) );
			this.bindEvent();
		},
		bindEvent: function() {
			let _this = this;
            //公共事件添加
            $(".forgetPwd-page .js-handle").on("click",function(e){
                let handle = $(this).data('handle');
                _this[handle] && _this[handle](e, $(this));
            });
		},
		handleForgetPwd: function(e) {
			let params = this.verification();

			params && $.ajax({
				url: API.resetPwd,
				data: {
					Body: { ...params }
				},
				success: function(req) {
                    if(!req.IsError){
                        alert('密码修改成功！');
                        Util.linkTo('/login');
                    }else{
                        alert(req.Message);
                    }
				},
				error: function(msg) {
					console.log(msg);
				}
			})
		},
		handleGetCode: function(e,$this) {
			let _this = this;
			let time = 60;
			let loginName = $("input[name='registerPhone']").val();
			let phoneNum = $("input[name='phone']").val();

			if($this.hasClass('disabled')){
				return;
			} 

			if(!loginName || !/^1[3|4|5|7|8][0-9]\d{4,8}$/.test(loginName)){
				// Util.alertMessage('请输入手机号！');
				alert('请输入正确格式的注册手机号！');
				return;
			}			

			if(!phoneNum || !/^1[3|4|5|7|8][0-9]\d{4,8}$/.test(phoneNum)){
				// Util.alertMessage('请输入手机号！');
				alert('请输入正确格式的手机号！');
				return;
			}

			//获取验证码
			$.ajax({
				url: API.sendResetPwdMsg,
				data: {
					Body: {
						LoginName: loginName,
						MobilePhone: phoneNum
					}
				},
				success: function(result) {
					alert('验证码发送成功！');
				},
				error: function(msg){
					console.log(msg);
				}
			})			

			$this.html(time + 's').css({
				backgroundColor: '#c0c0c0'
			})
			this.countdown(time - 1,function(overTime) {
				if(overTime < 0){
					$this
					.html('获取验证码')
					.removeClass('disabled')
					.css({
						backgroundColor: '#ffaf00'
					});
				}else{
					$this.addClass("disabled").html(overTime + 's');
				}
			})
		},
		countdown: function(time,callback) {
			let myInterval = setInterval(function() {
				callback && callback(time);

				if(time < -1){
					clearInterval(myInterval);
				}
				time--;
			},1000)
		},
		verification: function() {
			let LoginName = $("input[name='registerPhone']").val(),
				MobilePhone = $("input[name='phone']").val(),
				AuthCode = $("input[name='smsCode']").val(),
				NewPwd = $("input[name='password']").val(),
				AffirmNewPwd = $("input[name='conPassword']").val();

			if(!LoginName || !/^1[3|4|5|7|8][0-9]\d{4,8}$/.test(LoginName)){
				alert('请输入正确格式的注册手机号码！');
				return false;
			}

			if(!MobilePhone || !/^1[3|4|5|7|8][0-9]\d{4,8}$/.test(MobilePhone)){
				alert('请输入正确格式的手机号码！');
				return false;
			}

			if(!AuthCode){
				alert('获取并输入验证码！');
				return false;
			}

			if(!NewPwd){
				alert('请输入密码！');
				return false;
			}

			if(!AffirmNewPwd){
				alert('请输入确认密码！');
				return false;
			}

			if(AffirmNewPwd !== NewPwd){
				alert('两次密码不一致，请重新输入！');
				return false;
			}

			return {
				LoginName,
				MobilePhone,
				AuthCode,
				NewPwd,
				AffirmNewPwd
			};
		}		
	}   

	handlers.init(); 
}
