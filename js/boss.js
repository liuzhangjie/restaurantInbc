$(document).ready(function() {
	var contractAddress = "n1pzf9GLbD4Gfnd3ehPWm9bgq4dBSZa38xK";
	var NebPay = require("nebpay");
	var nebPay = new NebPay();
	$(".content-list").css('display', 'none');

	checkup();
	function checkup() {
		var callFunction = "checkup";
		var to = contractAddress;
		var value = 0;
		var callArgs = "";
		nebPay.simulateCall(to, value, callFunction, callArgs,  {
			listener:cbCheckup,
		})
	}

	function cbCheckup(resp) {
		var s = JSON.stringify(resp);
		var m = JSON.parse(s);
        var s1 =m.result;

		console.log(s1);

		if (parseInt(s1) === 1) {
			$(".content-list").css('display', 'block');
			showAllFoods();
		} else {
			$(".boss-title").text('抱歉,您没有权限!');
		}
	}


	function showAllFoods() {
		var callFunction = "queryF";
		var to = contractAddress;
		var value = 0;
		var callArgs = "";
		nebPay.simulateCall(to, value, callFunction, callArgs,  {
			listener:cbQueryF,
		})
	}

	function cbQueryF(resp) {
		var s = JSON.stringify(resp);
		var m = JSON.parse(s);
        var s1 =m.result;
        s1 = JSON.parse(s1);
        var myobjArray = eval(s1);
        $(".list-pro").empty();
        for (var i = 0; i < myobjArray.length; i++) {
        	var price = myobjArray[i].price;
        	var url = myobjArray[i].url;
        	var name = myobjArray[i].name;
        	$(".list-pro").append(`<li>
			    		<a><img src="${url}" class="list-pic" /></a>
			    		<div class="shop-list-mid">
		                	<div class="tit"><input type = "input" class="name" value =${name}></input></div>
		                	<div class="am-gallery-desc"><input type="input" class="price" value = "￥${price}"></input></div>
		                </div>
		                <div class="list-cart">
			                <div class="">
					             <button style ="background:#39b867;color:#fff;" class="increase">保存</button>
			                </div>
		                </div>
			    	</li>`);
        }

        $('.increase').click(function(){
			var self = $(this);
			var name = self.parent().parent().prev().children('.tit').children('.name').val();
			var price = self.parent().parent().prev().children('.am-gallery-desc').children('.price').val().substring(1);
			name = JSON.stringify(name);
			price = JSON.stringify(price);

			var callFunction = "updateF";
			var to = contractAddress;
			var value = 0;
			var callArgs = `[${name}, ${price}]`;
			nebPay.call(to, value, callFunction, callArgs,  {
				listener:cbUpdateF,
			})
		})

        function cbUpdateF(resp) {
        	var s = JSON.stringify(resp);
    		var a = JSON.parse(s);
	   		if (a == "Error: Transaction rejected by user") {
	   			showAllFoods();
	    	}
        }

        $('.decrease').click(function(){
        	var self = $(this);
        	var name = self.parent().parent().prev().children('.tit').children('.name').val();
        	name = JSON.stringify(name);
        	var callFunction = "deleteF";
			var to = contractAddress;
			var value = 0;
			var callArgs = `[${name}]`;
			nebPay.call(to, value, callFunction, callArgs,  {
				listener:cbDeleteF,
			})
        })

        function cbDeleteF(resp) {
        	var s = JSON.stringify(resp);
    		var a = JSON.parse(s);
	   		if (a == "Error: Transaction rejected by user") {
	    	} else {
	    		var self = $(this);
        		self.parent().parent().parent().remove();
	    	}
        }
	}

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
            showAllFoods();
        });

        $(".historyOrders").click(function(event) {
        	$ul.css('display','none');
        	$(".registeBox").css('display', 'none');
			$(".custom-orders").css('display', 'block');
        	var callFunction = "ordersOfHost";
			var to = contractAddress;
			var value = 0;
			var callArgs = "";
			nebPay.simulateCall(to, value, callFunction, callArgs,  {
				listener:cbOrdersOfHost,
			})

        });

        $(".add-food").click(function(event) {
        	$ul.css('display','none');
        	$(".registeBox").css('display', 'block');
        });

        function cbOrdersOfHost(resp) {
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
    })

    $(".registe-button").click(function(event) {
    	var callFunction = "addF";
		var to = contractAddress;
		var value = 0;
		var callArgs = `["${$(".input-name").val()}", "${$(".input-password").val()}", "${$(".input-URL").val()}"]`;
		nebPay.call(to, value, callFunction, callArgs,  {
			listener:cbAddF,
		})
    });

    function cbAddF(resp) {

    }

})
