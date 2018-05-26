$(document).ready(function() {
	var contractAddress = "n1pzf9GLbD4Gfnd3ehPWm9bgq4dBSZa38xK";
	var NebPay = require("nebpay");
	var nebPay = new NebPay();

	toPaidOrder();
	setInterval(toPaidOrder, 3000);

	function toPaidOrder() {
		var callFunction = "payOrder";
		var to = contractAddress;
		var value = 0;
		var callArgs = "";
		nebPay.simulateCall(to, value, callFunction, callArgs,  {
			listener:cbPayOrder,
		})
	}

	function cbPayOrder(resp) {
		var s = JSON.stringify(resp);
		var m = JSON.parse(s);
	    var s1 =m.result;
	    s1 = JSON.parse(s1);
	    var payment = s1.payment;
	    var realPayment = s1.realPayment;
	    var amount = s1.amount;
	    s1= s1.list;
	    console.log(s);
	   	$(".eat-list").empty();
	    for (var i = 0; i < s1.length; i++) {
	    	$(".eat-list").append(`<li>
	    		<span class="name">${s1[i].name}</span>
	    		<em class="price">￥${s1[i].price}</em>
	    		<div class="d-stock ">
	                <input id="num" readonly="" class="text_box" name="" type="text" value="1">
			    </div>
	    	</li>`);
	    }
	    $(".pricebox i").text(`￥${realPayment}(原价:￥${payment})`);
	    $(".pricebox em").text(amount);

	    console.log("s1 = " + s1.length + " " + payment);
	}

	$(".paybtn").click(function(event) {
		alert("支付功能待开发,此处模拟支付完成!");
		window.location.href = 'javascript:history.back()';
	});
});
