$(document).ready(function() {
	var contractAddress = "n1pzf9GLbD4Gfnd3ehPWm9bgq4dBSZa38xK";
	var NebPay = require("nebpay");
	var nebPay = new NebPay();
	var things = new Array();

	queryFood();

	function queryFood() {
		var callFunction = "queryFood";
		var to = contractAddress;
		var value = 0;
		var callArgs = "";
		nebPay.simulateCall(to, value, callFunction, callArgs,  {
			listener:cbQueryFood,
		})
	}

	//查询食物的回调
	function cbQueryFood(resp) {
		var s = JSON.stringify(resp);
		var m = JSON.parse(s);
        var s1 =m.result;
        s1 = JSON.parse(s1);
        var myobjArray = eval(s1);

        for (var i = 0; i < myobjArray.length; i++) {
        	var price = myobjArray[i].price;
        	var url = myobjArray[i].url;
        	var name = myobjArray[i].name;
        	$(".list-pro").append(`<li>
			    		<a><img src="${url}" class="list-pic" /></a>
			    		<div class="shop-list-mid">
		                	<div class="tit"><a>${name}</a></div>
		                	<div class="am-gallery-desc">￥${price}</div>
		                </div>
		                <div class="list-cart">
			                <div class="d-stock ">
					                <a class="decrease">-</a>
					                <input id="num" readonly="" class="text_box" name="" type="text" value="0">
					                <a class="increase">+</a>
			                </div>
		                </div>
			    	</li>`);
        	var food = new Object();
        	food.name = name;
        	food.number = 0;
        	food.price = price;
        	things[i] = food;
        }

        //购物数量加减
		$(function(){
			$('.increase').click(function(){
				var self = $(this);
				var current_num = parseInt(self.siblings('input').val());
				current_num += 1;
				if(current_num > 0){
					self.siblings(".decrease").fadeIn();
					self.siblings(".text_box").fadeIn();
					$(".list-jsk").css({
						cursor: 'pointer',
						opacity: '1'
					});

					$(".list-jsk").attr('href', `#`);
				}
				self.siblings('input').val(current_num);

				//更新金额
				var currentAmounts = $("#amounts").text();
				var currentNumbers = $("#numbers").text();
				var price = self.parent().parent().prev().children('.am-gallery-desc').text();
				var priceInt = parseInt(price.substring(1));
				$("#amounts").text(parseInt(currentAmounts) + parseInt(priceInt));
				$("#numbers").text(parseInt(currentNumbers) + 1);

				var index = self.parent().parent().parent().index();
				things[index].number = current_num;
				console.log(JSON.stringify(things));
			})
			$('.decrease').click(function(){
				var self = $(this);
				var current_num = parseInt(self.siblings('input').val());
				if(current_num > 0){
					current_num -= 1;
		            if(current_num < 1){
		                self.fadeOut();
						self.siblings(".text_box").fadeOut();
		            }
					self.siblings('input').val(current_num);

					var currentAmounts = $("#amounts").text();
					var currentNumbers = $("#numbers").text();
					var price = self.parent().parent().prev().children('.am-gallery-desc').text();
					var priceInt = parseInt(price.substring(1));
					$("#amounts").text(parseInt(currentAmounts) - parseInt(priceInt));
					$("#numbers").text(parseInt(currentNumbers) - 1);

					if (parseInt(currentAmounts) - parseInt(priceInt) == 0) {
						$(".list-jsk").css({
							cursor: 'auto',
							opacity: '0.5'
						});
						$(".list-jsk").attr('href', '#');
					}
					var index = self.parent().parent().parent().index();
					things[index].number = current_num;
					console.log(JSON.stringify(things));
				}
			})
		})
	}



	//删除提示信息
    $(function() {
  		$('.empty').add('#doc-confirm-toggle').
    	on('click', function() {
    		var opacity = parseInt($(".empty").css("opacity"));
	    	console.log(opacity);
	    	if (opacity != 1) {
	    		return;
	    	}

	     	$('#my-confirm').modal({
	        relatedTarget: this,
	        onConfirm: function(options) {
				var $link = $(this.relatedTarget).prev('a');
				var msg = $link.length ? '你要删除的饮品 为 ' + $link.data('id') :
				'确定了';

				$(".text_box").fadeOut();
				$(".decrease").fadeOut();
				$("#amounts").text(0);
				$("#numbers").text(0);
				$(".text_box").val(0);
				$(".list-jsk").css({
					cursor: 'auto',
					opacity: '0.5'
				});
	        },
	        onCancel: function() {
	        }
	      });
    	});
	});

	//tab切换
    $(function(){
        var $li = $('#tab li');
        var $ul = $('#content ul');
        $li.click(function(){
            var $this = $(this);
            var $t = $this.index();
            $li.removeClass();
            $this.addClass('current');
         })

        $(".order").click(function(event) {
        	var $this = $(this);
            var $t = $this.index();
            $ul.eq($t).css('display','block');
            $(".registeBox").css('display', 'none');
            $(".custom-orders").css('display', 'none');
        });

        $(".historyOrders").click(function(event) {
        	$ul.css('display','none');
        	$(".registeBox").css('display', 'none');
			$(".custom-orders").css('display', 'block');
        	var callFunction = "ordersOfUser";
			var to = contractAddress;
			var value = 0;
			var callArgs = "";
			nebPay.simulateCall(to, value, callFunction, callArgs,  {
				listener:cbOrdersOfUser,
			})

        });

        $(".registe").click(function(event) {
        	$ul.css('display','none');
        	$(".registeBox").css('display', 'block');
        });

        function cbOrdersOfUser(resp) {
        	var s = JSON.stringify(resp);
    		var a = JSON.parse(s);
	    	if (a == "Error: Transaction rejected by user") {
	    		console.log("error!");
	    	} else {
	    		var s = JSON.stringify(resp);
				var m = JSON.parse(s);
			    var s1 =m.result;
			    s1 = JSON.parse(s1);
			    $(".custom-orders").empty();
			    for (var i = 0; i < s1.length; i++) {
			    	var info = s1[i];
			    	var list = info.list;

		    	 	var content = "<ul>";
			    	for (var j = 0; j < list.length; j++) {
			    		content = content + `<li>${list[j].name}<em>x</em>${list[j].number} <span>${list[j].price}元</span></li>`;
			    	}
			    	content = content + "</ul>";
			    	$(".custom-orders").append(`<li class = "order-detail" style = "">${content}<span>总计:${info.payment}元(实付:${info.realPayment}元)</span></li>`);

			    }
	    	}
	    }
    });

    //老板管理
    $("#boss-management").click(function(event) {
    	window.location.href = "boss.html";
    });

    //注册
    $(".registe-button").click(function(event) {
    	var callFunction = "register";
		var to = contractAddress;
		var value = 0;
		var callArgs = `["${$(".input-name").val()}", "${$(".input-password").val()}"]`;
		nebPay.call(to, value, callFunction, callArgs,  {
			listener:cbRegister,
		})
    });

    function cbRegister(resp) {
    	var s = JSON.stringify(resp);
    	var a = JSON.parse(s);
    	if (a == "Error: Transaction rejected by user") {
	    	console.log("rejected by user!");
	    } else {
	    	alert("注册成功!");
	    }
  //   	$(".registeBox").fadeOut();
  //   	$(".user-info").fadeIn();
  //   	var callFunction = "userOf";
		// var to = contractAddress;
		// var value = 0;
		// var callArgs = "";
		// nebPay.simulateCall(to, value, callFunction, callArgs,  {
		// 	listener:cbUserOf,
		// })
    }

    $(".calculate").click(function(event) {
    	var opacity = parseInt($(".calculate").css("opacity"));
    	console.log(opacity);
    	if (opacity != 1) {
    		return;
    	}
    	var callFunction = "orderF";
		var to = contractAddress;
		var value = 0;
		var date = dateFtt("yyyy-MM-dd hh:mm:ss", new Date());
		var callArgs = JSON.stringify([JSON.stringify(things), JSON.stringify(date)]);
		nebPay.call(to, value, callFunction, callArgs,  {
			listener:cbOrderF,
		})
    });

    function cbUserOf(resp) {
    	console.log("userOf = " + JSON.stringify(resp));
    }

    function cbOrderF(resp) {
    	var s = JSON.stringify(resp);
    	var a = JSON.parse(s);
	   	if (a == "Error: Transaction rejected by user") {
	   		console.log("error!");
	    } else {
	    	setTimeout(function () {window.location.href = 'order.html';}, 10000);

	   	}
    }

    /**************************************时间格式化处理************************************/
	function dateFtt(fmt,date) {
	  var o = {
	    "M+" : date.getMonth()+1,                 //月份
	    "d+" : date.getDate(),                    //日
	    "h+" : date.getHours(),                   //小时
	    "m+" : date.getMinutes(),                 //分
	    "s+" : date.getSeconds(),                 //秒
	    "q+" : Math.floor((date.getMonth()+3)/3), //季度
	    "S"  : date.getMilliseconds()             //毫秒
	  };
	  if(/(y+)/.test(fmt))
	    fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
	  for(var k in o)
	    if(new RegExp("("+ k +")").test(fmt))
	  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
	  return fmt;
	}
})
