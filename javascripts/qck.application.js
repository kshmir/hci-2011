$.Controller("ApplicationController", {
    init: function(params) {
        this.guide_animation();
        var self = this;

        this.set_color();

        this.hides = 0;

        var last_interval;

        var changed = false;
        $(this.element).find(".search").live('keypress', function(e) {
            var _self = this;
            if (e.which == 13 && !changed) {
                $(this).blur();
                window.location.hash = '#products/search&criteria=' + $(this).val();
                e.preventDefault();
                $(_self).qtip('hide');
                return false;
            } else {
                if (!Qck.current_user || !Qck.current_user.helped || !Qck.current_user.helped.search) {
                    clearTimeout(last_interval);
                    last_interval = setTimeout(function() {
                        $(_self).qtip({
                            content: {
                                text: 'Presione enter para una busqueda completa.'
                            },
                            position: {
                                my: 'left center', // Use the corner...
                                at: 'right center' // ...and opposite corner
                            },show: false,
                            hide: false, // Don't specify a hide event either!
                            style: {
                                classes: 'ui-tooltip-shadow ui-tooltip-' + 'blue'
                            }
                        });
                        $(_self).qtip('show');
                        if (Qck.current_user) {
                            Qck.current_user.helped = Qck.current_user.helped || {};
                            Qck.current_user.helped.search = true;
                        }
                        setTimeout(function() {
                            $(_self).qtip('hide');
                        }, 10000);

                    }, 1000);
                }

            }
        });

        $('.search').autocomplete({
            appendTo: '#guide',
            focus: function(event, ui) {
                return false;
            },
            change: function(event, ui) {
                changed = true;
                return false;
            },
            select: function(event, ui) {
                changed = false;
                self.change_view("#main-content", function(callback) {
                    window.location.hash = "#products/show&id=" + ui.item.id;
                    callback();
                }, 'isotope');
                return false;
            },
            source: function(request, response) {
                Product.findByName({criteria:request.term, items_per_page:5, page:1}, response);
            }
        }).data("autocomplete")._renderItem = function(ul, item) {
            el = $($.View("views/autocomplete_item.ejs", {item:item}));
            el.data('autocomplete.item', item)
                    .data('item', item)
                    .appendTo(ul);
            el.find("*").data('item', item);
            return  el;
        };
    },
    set_color: function(color) {
        if (!color) {
            color = $.jStorage.get('color') || 'blue';
        }

        if (color == 'red') {
            $("#header").css('background-color', '#931100');
        } else if (color == 'blue') {
            $("#header").css('background-color', '#0099f7');
        } else if (color == 'green') {
            $("#header").css('background-color', '#008e00');
        }


        $.jStorage.set('color', color);
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
                        $('.search').autocomplete('close');
                        guide.css("position", "fixed")
                                .css("top", "0")
                                .css("width", "100%")
                                .css("z-index", "1000")
                                .css("background-color", "transparent");
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
    },
    change_view: function(selector, ajax, method) {
        var self = this;
        if (!method || method == 'fade') {

            $(selector).fadeOut("slow", function() {
                self.show_loader();
                $(selector).show().html($.View("views/loading.ejs"));
                var appear_callback = function(post_callback) {
                    $(selector).hide().fadeIn("slow", function() {
                        self.hide_loader();
                        if (post_callback) {
                            post_callback();
                        }
                    });
                };
                ajax(appear_callback);
            });
        } else if (method == 'isotope') {
            self.show_loader();
            var appear_callback = function(post_callback) {
                self.hide_loader();
                if (post_callback) {
                    post_callback();
                }
            };
            ajax(appear_callback);
        }
    },

    hide_loader: function() {
        --this.hides;
        console.log('hide');
        if (this.hides == 0) {
            $(".loader").hide();
        } else if (this.hides < 0) {
            this.hides = 1;
        }
    },
    show_loader: function() {
        console.log('show');
        this.hides++;
        $(".loader").show();
    },
    search_submit: function(text) {
        window.location.hash = "products/search&criteria=" + text;
    },

    ".search focus": function(el) {
        el = $(el);
        if (!el.data("old") || el.data("old") == el.val()) {
            el.data("old", el.val())
                    .val("");
        }
        el.removeClass("soft");
    },
    ".search blur": function(el) {
        el = $(el);
        if ($(el).val() == "") {
            $(el).val($(el).data("old"));
            el.addClass("soft");
        }
    }
});

