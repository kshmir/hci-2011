$.Controller("ApplicationController", {
    init: function(params) {
        this.guide_animation();
        var self = this;
        $(this.element).find(".login-form input").keypress(function(e) {
            if (e.which == 13) {
                $(this).blur();
                self.login_submit($(this).parent(".login-form:first"));
                e.preventDefault();
            }

        });
        $(this.element).find(".search-form input").keypress(function(e) {
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
        var guideBottom = guide.offset().top + guide.height();
        var didScroll = false;
        $(window).scroll(function() {
            didScroll = true;
        });
        var lastScroll = 0;

        var _onScroll = false;
        var onScroll = function() {
            var currentScroll = $(this).scrollTop();
            if (didScroll && !_onScroll) {
                _onScroll = true;
                if (currentScroll != lastScroll || currentScroll < guideBottom) {
                    if (currentScroll < guideBottom && guide.css("position") == "fixed") {
                        guide.slideUp("fast", function() {
                            guide.css("position", "relative")
                                .css("width", "960px")
                                .css("margin-top", "10px")
                                .slideDown("fast", function() {
                                    _onScroll = false;
                                });
                        });
                    }
                    else if (!isScrolledIntoView(guide)) {
                        guide.slideUp("fast", function() {
                            guide.css("position", "fixed")
                                .css("top", "0")
                                .css("width", "100%")
                                .css("margin-top", "0")
                                .css("z-index", "1000")
                                .slideDown("fast", function() {
                                    _onScroll = false;
                                });
                        });
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

            return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom)
                && (elemBottom <= docViewBottom) && (elemTop >= docViewTop) );
        }
    }
    ,
    change_view: function(selector, ajax) {
        $(selector).fadeOut("slow", function() {
            $(selector).show().html($.View("views/loading.ejs"));
            var appear_callback = function() {
                $(selector).hide().fadeIn("slow");
            };
            ajax(appear_callback);
        });
    }
    ,
    login_submit: function(el) {

        var success = function(callback) {
            $(el).parent(".login:first").fadeOut("slow", function(callback) {
                $(el).parent(".login:first")
                    .html($.View("views/logged.ejs", {username: ($(el).find('#username').val())}))
                    .attr("class", "logout prefix_4 grid_5").fadeIn("slow");
            });
             callback();
        };
        success({});
        //Qck.app_controller.change_view($(el),success);
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
    ".search-form input focus": function(el) {
        el = $(el);

        if (!el.data("old") || el.data("old") == el.val()) {
            el.data("old", el.val())
                .val("");
        }
    },
    ".search-form input blur": function(el) {
        el = $(el);
        if ($(el).val() == "") {
            if ($(el).attr("id") == "pass") {
                $(el).hide();
                el = $(el).parent(".login-form:first").find('#password').show();

            }
            $(el).val($(el).data("old"));
        }
    }
});