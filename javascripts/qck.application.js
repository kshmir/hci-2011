$.Controller("ApplicationController", {
    init: function() {
        this.guide_animation();
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
                            guide.css("position", "relative");
                            guide.css("width", "960px");
                            guide.css("margin-top", "10px");
                            guide.slideDown("fast", function() {
                                _onScroll = false;
                            });
                        });
                    }
                    else if (!isScrolledIntoView(guide)) {
                        guide.slideUp("fast", function() {
                            guide.css("position", "fixed");
                            guide.css("top", "0");
                            guide.css("width", "100%");
                            guide.css("margin-top", "0");
														guide.css("z-index", "1000");
                            guide.slideDown("fast", function() {
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
    change_view: function(selector, f) {
        $(selector).fadeOut("slow", function() {
            $(selector).show().html($.View("views/loading.ejs"));
            var callback = function() {
                $(selector).hide().fadeIn("slow");
            };
            f(callback);
        });
    }
});