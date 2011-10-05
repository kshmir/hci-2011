var Qck = (Qck == undefined) ? {} : Qck;
var current_user = null;
var sign_in_unique = false;
if (window.location.toString().match(/eiffel/)) {
	Qck.api_path = "/hci/service/{servicio}.groovy";
}
else{
	Qck.api_path = "service/{servicio}.groovy";
}

Qck.services = {
	catalog : Qck.api_path.replace(/\{servicio\}/, "Catalog"),
	common : Qck.api_path.replace(/\{servicio\}/, "Common"),
	security : Qck.api_path.replace(/\{servicio\}/, "Security"),
	order : Qck.api_path.replace(/\{servicio\}/, "Order")
};


head.js("javascripts/qck.application.js",
"javascripts/qck.cart.js",
"javascripts/qck.user.js",
"javascripts/qck.category.js",
"javascripts/qck.product.js",
"javascripts/qck.breadcrumb.js", function() {
    $("body").application({});
	Qck.app_controller = $("body").controller();
	$("#navigation").breadcrumb({});
	Qck.bread_controller = $("#navigation").controller();
	$("#sidebar").categories({});
	$("#main-content").products({});
    $("#cart").cart({});
    Qck.cart_controller = $("#cart").controller();
});

$.fn.inArray = function(value, array, comparer) {
    if(!comparer){
        comparer = function(a,b) { return (a == b) ? 0 : 1; }
    }
    var i = 0;
    for(; i < array.length; i++) {
        if(comparer(value, array[i])) {
            return i;
        }
    }
    return -1;
};
