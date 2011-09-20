var Qck = (Qck == undefined) ? {} : Qck;

head.js("/javascripts/qck.application.js",
        "/javascripts/qck.user.js",
        "/javascripts/qck.category.js",
        "/javascripts/qck.product.js",
        "/javascripts/qck.cart.js", function() {
            $("body").application({});
            Qck.app_controller = $("body").controller();
            $("#sidebar").categories({});
            $("#main-content").products({});
        });
