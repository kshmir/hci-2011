head.js("/javascripts/qck.application.js",
        "/javascripts/qck.user.js",
        "/javascripts/qck.category.js",
        "/javascripts/qck.product.js",
        "/javascripts/qck.cart.js", function() {
            $("#sidebar").categories({});
            $("#main-content").products({});
            $("body").application({});
        });
