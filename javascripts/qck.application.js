$.Controller("ApplicationController", {
    init: function(params) {
        this.guide_animation();

        var self = this;
        $(this.element).find(".login-form input").live('keypress', function(e) {
            if (e.which == 13) {
                $(this).blur();

                self.login_submit($('.topbar'));
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
        $('#main-content').fadeOut("slow", function() {
            $('#main-content')
                .html($.View("views/register.ejs"))
                .fadeIn("slow");
        });
        Qck.bread_controller.loadHashes([
            { url: "#users/sign_up", refname : "Sign Up" }
        ]);
    },
    ".login-form #login_submit click": function(called, data) {
        this.login_submit($('.topbar'));
    },
    ".register-button-label.form_button click" : function () {
        var no_error = true;
        $('#reg-password').qtip('hide');
        if ($('#reg-password').val() != $('#reg-password2').val()) {
            no_error = false;
            $('#reg-password').qtip('hide').removeData('qtip')
                .qtip({
                    content: {
                        text: 'Passwords are different',
                        title: {
                            text: 'Input error:',
                            button: true
                        }
                    },
                    position: {
                        my: 'center left', // Use the corner...
                        at: 'center right' // ...and opposite corner
                    },
                    show: {
                        event: false, // Don't specify a show event...
                        ready: true, // ... but show the tooltip when ready
                        effect: function(offset) {
                            $(this).slideDown(200); // "this" refers to the tooltip
                            $('#username').click();
                        }
                    },
                    hide: function(event, api) {
                        sign_in_unique = true;
                    }, // Don't specify a hide event either!
                    style: {
                        classes: 'ui-tooltip-shadow ui-tooltip-' + 'red'
                    }
                });
        } else {
            if ($('#reg-password').val() == "") {
                no_error = false;
                $('#reg-password').qtip('hide').removeData('qtip')
                    .qtip({
                        content: {
                            text: 'You must write a password',
                            title: {
                                text: 'Input error:',
                                button: true
                            }
                        },
                        position: {
                            my: 'center left', // Use the corner...
                            at: 'center right' // ...and opposite corner
                        },
                        show: {
                            event: false, // Don't specify a show event...
                            ready: true, // ... but show the tooltip when ready
                            effect: function(offset) {
                                $(this).slideDown(200); // "this" refers to the tooltip
                                $('#username').click();
                            }
                        },
                        hide: function(event, api) {
                            sign_in_unique = true;
                        }, // Don't specify a hide event either!
                        style: {
                            classes: 'ui-tooltip-shadow ui-tooltip-' + 'red'
                        }
                    });
            }
        }
        //var emailReg = "/^([\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4})?$/";
        $('#reg-email').qtip('hide').removeData('qtip');
        if ($('#reg-email').val() == "" || !emailReg.test($('#reg-email').val())) {
            no_error = false;
            $('#reg-email').qtip('hide').removeData('qtip')
                .qtip({
                    content: {
                        text: 'You must write a valid email',
                        title: {
                            text: 'Input error:',
                            button: true
                        }
                    },
                    position: {
                        my: 'center left', // Use the corner...
                        at: 'center right' // ...and opposite corner
                    },
                    show: {
                        event: false, // Don't specify a show event...
                        ready: true, // ... but show the tooltip when ready
                        effect: function(offset) {
                            $(this).slideDown(200); // "this" refers to the tooltip
                            $('#username').click();
                        }
                    },
                    hide: function(event, api) {
                        sign_in_unique = true;
                    }, // Don't specify a hide event either!
                    style: {
                        classes: 'ui-tooltip-shadow ui-tooltip-' + 'red'
                    }
                });
        }
        if (no_error) {

            User.createAccount({account: {
                username: $('#reg-username').val(),
                name:$('#reg-name').val(),
                password:$('#reg-password').val(),
                email:$('#reg-email').val(),
                birth_date: $('#reg-birth-date').val()
            }

            }, function() {
                alert('usuario creado');
            }, function() {
                alert('usuario no creado');
            });
        }
        return false;
    },
    "#sign_in click": function(called, data) {
        if (sign_in_unique == false) {
            sign_in_unique = true;

            $("#sign_in").removeData('qtip')
                .qtip({
                    content: {
                        text: $.View("views/login.ejs"),
                        title: {
                            text: 'Sign in:',
                            button: true
                        }
                    },
                    events: {
                        hide: function(event, api) {
                            sign_in_unique = false;
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
                            $('#username').click();
                        }
                    },
                    hide: true, // Don't specify a hide event either!
                    style: {
                        classes: 'ui-tooltip-shadow ui-tooltip-' + 'dark'
                    }
                });
        }
        return false;
    }
    ,
    "#sign_out click" : function() {
        current_user.signOut(function() {
            $('.topbar').fadeOut("slow", function() {
                $('.topbar')
                    .html($.View("views/sign_in.ejs"))
                    .fadeIn("slow");
            });
            current_user = undefined;
        }, function() {
        });
        return false;
    }
    ,
    change_view: function(selector, ajax, method) {
        if (!method || method == 'fade') {

            $(selector).fadeOut("slow", function() {
                $(".loader").show();
                $(selector).show().html($.View("views/loading.ejs"));
                var appear_callback = function(post_callback) {
                    $(selector).hide().fadeIn("slow", function() {
                        $(".loader").hide();
                        if (post_callback) {
                            post_callback();
                        }
                    });
                };
                ajax(appear_callback);
            });
        } else if (method == 'isotope') {
            $(".loader").show();
            var appear_callback = function(post_callback) {
                $(".loader").hide();
                if (post_callback) {
                    post_callback();
                }
            };
            ajax(appear_callback);
        }
    }
    ,

    login_submit: function(el) {

        $(el).fadeOut("slow", function(callback) {
            var user = $(".login-form").find('#username').val();
            var password = $(".login-form").find('#pass').val();
            var success = function(user) {
                current_user = user;
                $("#sign_in").qtip('hide');
                $(el)
                    .html($.View("views/logged.ejs", {username: user.name }))
                    .fadeIn("slow");
                $(".login-form").remove();

            };
            var error = function(error_number) {
                var msg = '';
                $("#sign_in").qtip('show');
                if (error_number == '4') {
                    msg = 'Por favor ingrese un usuario';
                } else {
                    if (error_number == '5') {
                        msg = 'Por favor ingrese una contraseña';
                    } else {
                        if (error_number == '104') {
                            msg = 'Usuario o Contraseña invalidos';
                        } else {
                            msg = 'No se puede ingresar en este momento, por favor compruebe la conexion'
                        }
                    }
                }
                $(el).fadeIn("slow", function() {
                    $(".login-form").removeData('qtip')
                        .qtip({
                            content: {
                                text: 'Intente nuevamente.',
                                title: {
                                    text: msg,
                                    button: true
                                }
                            },
                            position: {
                                my: 'top right', // Use the corner...
                                at: 'center left' // ...and opposite corner
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
            };
            console.log(user);
            User.signIn({
                username: user,
                password: password
            }, success, error);
        });

    }
    ,
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
                    .parents(".login-form:first").find('#pass').show().focus();
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
                el = el.parents(".login-form:first").find('#password').show();

            }
            el.val(el.data("old"));
            el.addClass("soft");
        }
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

