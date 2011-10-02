$.Controller("ApplicationController", {
    init: function(params) {
        this.guide_animation();
        var self = this;
        $(this.element).find(".login-form input").live('keypress', function(e) {
            if (e.which == 13) {
                alert('sigo aca vieja');
                $(this).blur();
                self.login_submit($(this).parent(".login-form:first"));
                e.preventDefault();
            }

        });
        $(this.element).find(".search-form input").live('keypress', function(e) {
            if (e.which == 13) {
                $(this).blur();
                self.search_submit($(this).parent(".search-form:first"));
                e.preventDefault();
            }

        });
    },
    guide_animation: function() {
        // Scroll Animation of guide... TODO: Put on application controller
        var guide = $("#guide");
        var guideBottom = guide.offset().top;
        var didScroll = false;
        $(window).scroll(function() {
            var currentScroll = $(this).scrollTop();
            didScroll = true;

            if (currentScroll < guideBottom && guide.css("position") == "fixed") {
                guide.css("position", "relative");
            }

        });
        var lastScroll = 0;

        var _onScroll = false;
        var onScroll = function() {
            var currentScroll = $(this).scrollTop();
            if (didScroll && !_onScroll) {
                _onScroll = true;
                if (currentScroll != lastScroll || currentScroll < guideBottom) {
                    if (!isScrolledIntoView(guide)) {
                        guide.css("position", "fixed")
                            .css("top", "0")
                            .css("width", "100%")
                            .css("z-index", "1000")
                            .css("background-color", "transparent")
                        _onScroll = false;
                    }
                    else {
                        _onScroll = false;
                    }
                } else {
                    _onScroll = false;
                }

                didScroll = false;
            }
            lastScroll = currentScroll;
        };

        setInterval(onScroll, 50);

        // http://stackoverflow.com/questions/487073/jquery-check-if-element-is-visible-after-scroling
        function isScrolledIntoView(elem) {
            var docViewTop = $(window).scrollTop();
            var docViewBottom = docViewTop + $(window).height();

            var elemTop = $(elem).offset().top;
            var elemBottom = elemTop + $(elem).height();

            return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom) // 40: magic number
                && (elemBottom <= docViewBottom) && (elemTop >= docViewTop) );
        }
    }
    ,
    "history.users.sign_up subscribe" : function(called, data) {
        // Hides all categories expanded.
        $(this.element).find("ul ul.subcat").hide("slow");
        $("#main-content").controller().index();
        Qck.bread_controller.loadHashes([]);
    },
    ".login-form #login_submit click": function(called, data) {
        $('#sigin_in').click;
        return false;
    },
    "#sign_in click" : function(called, data) {

        $("#sign_in").removeData('qtip')
            .qtip({
                content: {
                    text: $.View("views/login.ejs"),
                    title: {
                        text: 'Sign in:',
                        button: true
                    }
                },
                position: {
                    my: 'top right', // Use the corner...
                    at: 'bottom center' // ...and opposite corner
                },
                show: {
                    event: false, // Don't specify a show event...
                    ready: true, // ... but show the tooltip when ready
                    effect: function(offset) {
                        $(this).slideDown(200); // "this" refers to the tooltip
                    }
                },
                hide: false, // Don't specify a hide event either!
                style: {
                    classes: 'ui-tooltip-shadow ui-tooltip-' + 'dark'
                }
            });
        return false;
    },
    change_view: function(selector, ajax) {
        $(selector).fadeOut("slow", function() {
            $(selector).show().html($.View("views/loading.ejs"));
            var appear_callback = function(post_callback) {
                $(selector).hide().fadeIn("slow", function(){
                    if (post_callback) {
                        post_callback();
                    }
                });
            };
            ajax(appear_callback);
        });
    }
    ,
    login_submit: function(el) {
        $(el).parent(".login:first").fadeOut("slow", function(callback) {
            var user = $(el).find('#username').val();
            var password = $(el).find('#pass').val();
            var success = function(user) {

                $(el).parent(".login:first")
                    .html($.View("views/logged.ejs", {username: user.name }))
                    .attr("class", "logout prefix_4 grid_5").fadeIn("slow");
            };
            var error = function(error_number) {
                if (error_number) {
                    $(el).parent(".login:first").fadeIn("slow", function() {
                        $(".login-form").removeData('qtip')
                            .qtip({
                                content: {
                                    text: 'Por favor intente nuevamente.',
                                    title: {
                                        text: 'Usuario o Contraseña invalidos',
                                        button: true
                                    }
                                },
                                position: {
                                    my: 'top right', // Use the corner...
                                    at: 'bottom center' // ...and opposite corner
                                },
                                show: {
                                    event: false, // Don't specify a show event...
                                    ready: true // ... but show the tooltip when ready
                                },
                                hide: false, // Don't specify a hide event either!
                                style: {
                                    classes: 'ui-tooltip-shadow ui-tooltip-' + 'red'
                                }
                            });

                    });
                }
            };

            User.signIn({
                username: user,
                password: password
            }, success, error);
        });

    },
    search_submit: function(el) {
        alert(
            "HANDLER DEL ENTER :D"
        );

    },
    ".login-form input focus": function(el) {
        el = $(el);
        if (!(el.attr("id") == "pass")) {
            if (el.attr("id") == "password") {
                el.hide()
                    .parent(".login-form:first").find('#pass').show().focus();
            }
            if (!el.data("old") || el.data("old") == el.val()) {
                el.data("old", el.val())
                    .val("");
            }
        }
    },
    ".login-form input blur": function(el) {
        el = $(el);
        if (el.val() == "") {
            if (el.attr("id") == "pass") {
                el.hide();
                el = el.parent(".login-form:first").find('#password').show();

            }
            el.val(el.data("old"));
        }
    },
    ".search focus": function(el) {
        el = $(el);
        if (!el.data("old") || el.data("old") == el.val()) {
            el.data("old", el.val())
                .val("");
        }
    },
    ".search blur": function(el) {
        el = $(el);
        if ($(el).val() == "") {
            $(el).val($(el).data("old"));
        }
    }
});