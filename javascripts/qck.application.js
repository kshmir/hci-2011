$.Controller("ApplicationController", {
    init: function(params) {
        this.guide_animation();
        var self = this;
        this.set_language(current_language);
        this.set_color();


        this.hides = 0;

        var last_interval;

        $(this.element).find(".search").live('keypress', function(e) {
            var _self = this;
            if (e.which == 13 && !$('.ui-autocomplete .ui-state-hover').length) {
                $(this).blur();
                window.location.hash = '#products/search&criteria=' + $(this).val();
                e.preventDefault();
                $(_self).qtip('hide');
                return false;
            } else if (e.which == 13) {
                $(this).blur();
                e.preventDefault();
                $(_self).qtip('hide');
                return false;
            } else {
                if (!Qck.current_user || !Qck.current_user.helped || !Qck.current_user.helped.search) {
                    clearTimeout(last_interval);
                    last_interval = setTimeout(function() {
                        $(_self).qtip({
                            content: {
                                text: $('guide search_advice', Qck.locale[current_language]).text()
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
                return false;
            },
            select: function(event, ui) {
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

        if ($.jStorage.get('current_language')) {
            current_language = $.jStorage.get('current_language');
            $('#l_languages').val(current_language).change();
        }
    },
    "#l_languages change" : function() {
        var oldlang = current_language;

        current_language = $('#l_languages').val();
        $.jStorage.set('current_language', current_language);
        this.load_language(oldlang != current_language);
    },
    set_language: function(language) {
        if (languages == null) {
            languages = [];
            var success2 = function(vara) {
                languages = vara;
                $('#languages').html($.View("views/languages.ejs", languages));
            };
            var error2 = function(aux) {
                console.log(aux);
            };
            var aux = {};

            Language.getLanguageList(aux, success2, error2);

        } else {
            $('#languages').html($.View("views/languages.ejs", languages));
        }
    },
    load_language: function(nocache) {

        var change_labels = function(data) {
            //TOPBAR
            $('#sign_in').text($('topbar sign_in', data).text());
            $('#sign_up').text($('topbar sign_up', data).text());
            $('#or').text($('topbar or', data).text());
            if (Qck.current_user) {
                $('#welcome').text($('topbar welcome', data).text() + ' ' + Qck.current_user.name);
            }
            $('#user_panel').text($('topbar user_panel', data).text());
            $('#sign_out').text($('topbar sign_out', data).text());
            //GUIDE
            $('#quick_search').val($('guide search_box', data).text());

            //REGISTER
            $('.register-username-title').text($('header register', data).text());
            $('.label.register-username-label').text($('reg_labels username', data).text());
            $('.label.register-name-label').text($('reg_labels name', data).text());
            $('.label.register-password-label').text($('reg_labels password', data).text());
            $('.label.register-password2-label').text($('reg_labels re_password', data).text());
            $('.label.register-email-label').text($('reg_labels email', data).text());
            $('.label.register-birth-date-label').text($('reg_labels birth_date', data).text());
            $('.form_button.register-button-label').val($('reg_labels reg_button', data).text());


            //BIRTH DATE
            Qck.app_controller.load_birth_date_drop_down();

            //USERPANEL
            $('.label.panel-new-name-label').text($('header register', data).text());
            $('.label.panel-new-email-label').text($('reg_labels username', data).text());
            $('.label.update-birth-date-label').text($('reg_labels name', data).text());
            $('.update-user-information').text($('reg_labels password', data).text());
            $('.label.register-password2-label').text($('reg_labels re_password', data).text());
            $('.label.register-email-label').text($('reg_labels email', data).text());
            $('.label.register-birth-date-label').text($('reg_labels birth_date', data).text());
            $('.form_button.register-button-label').val($('reg_labels reg_button', data).text());


            if (window.location.toString().match(/sign_up/)) {
                $('.label.register-password-label').qtip('hide');
                $('.label.register-username-label').qtip('hide');
                $('.label.register-email-label').qtip('hide');
                $('.label.register-name-label').qtip('hide');
                $('.label.register-birth-date-label').qtip('hide');
                $('input.register-button-label.form_button').qtip('hide');
            }


            $('#categories').text($('sidebar categories', data).text());
            $('#filter').text($('header filter', data).text());
            $('#name_asc_label span').text($('header ascending', data).text());
            $('#name_desc_label span').text($('header descending', data).text());
            $('#check_my_cart').text($('cart check_cart', data).text());
            $('#clear_my_cart').text($('cart clear_cart', data).text());
            $("#filter_name_label span").text($('header name', data).text());
            $("#filter_rank_label span").text($('header rank', data).text());
            $("#filter_price_label span").text($('header price', data).text());
            $('.product_item .price_label, .product_show .price_label').text($('product_label price', data).text());
            $('.product_item .sales_rank_label, .product_show .sales_rank_label').text($('product_label rank', data).text());
            $('.product_item .addcart, .product_show .addcart').text($('product_label add_to_cart', data).text());

            $('.product_show .authors-label').text($('product_info authors', data).text());
            $('.product_show .publisher-label').text($('product_info publisher', data).text());
            $('.product_show .published_date-label').text($('product_info published_date', data).text());
            $('.product_show .isbn10-label').text($('product_info isbn_10', data).text());
            $('.product_show .isbn13-label').text($('product_info isbn_13', data).text());
            $('.product_show .language-label').text($('product_info language', data).text());

            $('.product_show .actors-label').text($('product_info actors', data).text());
            $('.product_show .format-label').text($('product_info format', data).text());
            $('.product_show .region-label').text($('product_info region', data).text());
            $('.product_show .aspect_ratio-label').text($('product_info aspect_ratio', data).text());
            $('.product_show .number_discs-label').text($('product_info number_of_discs', data).text());
            $('.product_show .release_date-label').text($('product_info release_date', data).text());
            $('.product_show .run_time-label').text($('product_info run_time', data).text());
            $('.product_show .ASIN-label').text($('product_info ASIN', data).text());

            if (window.location.hash.match(/cart/)) {
                window.location.hash += "&reload"
            }

            if (window.location.hash.match(/create_address/)) {
                window.location.hash += "&reload"
            }


            if (Qck.cats_controller) {
                Qck.cats_controller.load(nocache);
            }
            /*
             <guide>
             <search_box>Quick search</search_box>
             <search_advice>Press enter for a complete search</search_advice>
             </guide>
             */
            Qck.locale[current_language] = data;
        };
        var params;
        //   if(!$.jStorage.get('current_language_data_' + current_language)){
        $.ajax({
            url: 'languages/lang-' + current_language + '.xml',
            data: params,
            success: function(data) {
                $.jStorage.set('current_language_data_' + current_language, data);
                change_labels($.jStorage.get('current_language_data_' + current_language));
            }
        });
//        }else{
//            change_labels($.jStorage.get('current_language_data_' + current_language));
//        }


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
    add_err_qtip: function(el, msg) {
        el.qtip('hide').removeData('qtip')
                .qtip({
                          content: {
                              text: msg,
                              title: {
                                  text: '',
                                  button: true
                              }
                          },
                          position: {
                              my: 'center right', // Use the corner...
                              at: 'center left' // ...and opposite corner
                          },
                          show: {
                              event: false, // Don't specify a show event...
                              effect: function(offset) {
                                  $(this).slideDown(200); // "this" refers to the tooltip
                                  $('#username').click();
                              }
                          },
                          hide: function(event, api) {
                              self.sign_in_unique = true;
                          }, // Don't specify a hide event either!
                          style: {
                              classes: 'ui-tooltip-shadow ui-tooltip-' + 'red'
                          }
                      }).qtip('show');

    },
    load_birth_date_drop_down :function() {
        var months = $('months', Qck.locale[current_language]);
        var monthtext = [$('jan', months).text(),$('feb', months).text(),$('mar', months).text(),$('apr', months).text(),$('may', months).text(),$('jun', months).text(),$('jul', months).text(),$('aug', months).text(),$('sept', months).text(),$('oct', months).text(),$('nov', months).text(),$('dec', months).text()];
        var today = new Date();

        var dayfield = document.getElementById('day_drop_down');
        if (!dayfield) {
            return;
        }
        var monthfield = document.getElementById('month_drop_down');
        var yearfield = document.getElementById('year_drop_down');
        for (var i = 1; i < 32; i++) {
            dayfield.options[i - 1] = new Option(i, i);
        }
        //dayfield.options[today.getDate()]=new Option(today.getDate(), today.getDate(), true, true) //select today's day
        for (var m = 0; m < 12; m++) {
            monthfield.options[m] = new Option(monthtext[m], m + 1);
        }
        //monthfield.options[today.getMonth()]=new Option(monthtext[today.getMonth()], monthtext[today.getMonth()], true, true) //select today's month
        var thisyear = today.getFullYear() - 18;
        for (var y = 0; y < 125; y++) {
            yearfield.options[y] = new Option(thisyear, thisyear);
            thisyear -= 1;
        }
        //yearfield.options[0]=new Option(today.getFullYear(), today.getFullYear(), true, true) //select today's year
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
        if (!el.data("old")) {
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

