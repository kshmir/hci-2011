var Qck = (Qck == undefined) ? {} : Qck;

head.js("/javascripts/qck.application.js",
        "/javascripts/qck.user.js",
        "/javascripts/qck.category.js",
        "/javascripts/qck.product.js",
        "/javascripts/qck.cart.js",
				"/javascripts/qck.breadcrumb.js", function() {
			
						$("body").application({});
						Qck.app_controller = $("body").controller();
						$("#navigation").breadcrumb({});
						Qck.bread_controller = $("#navigation").controller();
						$("#sidebar").categories({});
						$("#main-content").products({});
        });
