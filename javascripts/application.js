var Qck = (Qck == undefined) ? {} : Qck;

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
"javascripts/qck.user.js",
"javascripts/qck.category.js",
"javascripts/qck.product.js",
"javascripts/qck.cart.js",
"javascripts/qck.breadcrumb.js", function() {
    $("body").application({});
	Qck.app_controller = $("body").controller();
	$("#navigation").breadcrumb({});
	Qck.bread_controller = $("#navigation").controller();
	$("#sidebar").categories({});
	$("#main-content").products({});
});