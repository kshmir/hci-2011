var Qck = (Qck == undefined) ? {} : Qck;
var current_user = null;
var sign_in_unique = false;
var current_language = 1;

if (!window.console) {
    window.console = {
        log: function() {
        }
    };
}

if (window.location.toString().match(/eiffel/)) {
    Qck.api_path = "/hci/service/{servicio}.groovy";
}
else {
    Qck.api_path = "service/{servicio}.groovy";
}

Qck.services = {
    catalog : Qck.api_path.replace(/\{servicio\}/, "Catalog"),
    common : Qck.api_path.replace(/\{servicio\}/, "Common"),
    security : Qck.api_path.replace(/\{servicio\}/, "Security"),
    order : Qck.api_path.replace(/\{servicio\}/, "Order")
};


head.js("javascripts/qck.address.js",
        "javascripts/qck.application.js",
        "javascripts/qck.breadcrumb.js",
        "javascripts/qck.cart.js",
        "javascripts/qck.category.js",
        "javascripts/qck.country.js",
        "javascripts/qck.item.js",
        "javascripts/qck.language.js",
        "javascripts/qck.order.js",
        "javascripts/qck.product.js",
        "javascripts/qck.state.js",
        "javascripts/qck.user.js", function() {


            $("body").application({});
            Qck.app_controller = $("body").controller();
            $("html").user({});
            Qck.user_controller = $("html").controller();
            $("#navigation").breadcrumb({});
            Qck.bread_controller = $("#navigation").controller();
            $("#sidebar").categories({});
            $("#main-content").products({});
            $("#container").cart({});
            Qck.cart_controller = $("#container").controller();

            $(window).hashchange();


        });


// Override of inArray, it should have a comparer!!!
$.inArrayCust = function(value, array, comparer) {
    if (!comparer) {
        comparer = function(a, b) {
            return (a == b) ? 0 : 1;
        }
    }
    var i = 0;
    for (; i < array.length; i++) {
        if (!comparer(value, array[i])) {
            return i;
        }
    }
    return -1;
};

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};
