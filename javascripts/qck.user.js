$.Controller("UserController", {
    init: function() {
        var self = this;

        this.sign_in_unique = false;

        if ($.jStorage.get('current_user')) {
            Qck.current_user = new User($.jStorage.get('current_user'), true);
            $('.topbar').html($.View("views/logged.ejs", {username: Qck.current_user.name, lang: Qck.locale[current_language]}));
            Qck.app_controller.set_language(current_language);
        }
        $('.topbar').fadeIn("slow");

        $(".login-form input").live('keypress', function(e) {
            if (e.which == 13) {
                $(this).blur();
                self.login_submit($('.topbar'));
                e.preventDefault();
                return false;
            }

        });
    },
    "history.users.sign_up subscribe" : function(called, data) {
        $('#main-content').fadeOut("slow", function() {
            $('#main-content')
                    .html($.View("views/register.ejs", {}))
                    .fadeIn("slow", Qck.app_controller.load_birth_date_drop_down);
        });
        Qck.bread_controller.loadHashes([
            { url: "#users/sign_up", refname : "Sign Up" }
        ]);
    },

    login_submit: function(el) {

        $(el).fadeOut("slow", function(callback) {
            var user = $(".login-form").find('#username').val();
            var password = $(".login-form").find('#pass').val();
            var success = function(user) {
                $.jStorage.set('current_user', user);
                Qck.current_user = user;
                $("#sign_in").qtip('hide');
                $(el).html($.View("views/logged.ejs", {username: user.name, lang: Qck.locale[current_language]}))
                        .fadeIn("slow", function() {
                    Qck.app_controller.set_language(current_language);
                });
                $(".login-form").remove();
                Qck.cart_controller.on_login();
                window.location.hash = "#";
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
            User.signIn({
                username: user,
                password: password
            }, success, error);
        });

    },

    ".login-form #login_submit click": function(called, data) {
        this.login_submit($('.topbar'));
    },
    ".register-button-label.form_button click" : function () {
        var no_error = true;
        var self = this;

        var add_err_qtip = function(el, msg) {
            el.qtip('hide').removeData('qtip').qtip({
                content: {
                    text: msg,
                    title: {
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
        };

        var validate_date = function(dd, mm, yy) {
            var day = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);

            dd = parseFloat(dd);
            mm = parseFloat(mm);
            yy = parseFloat(yy);
            if (yy < 100) yy += 2000;
            if (yy < 1582 || yy > 4881) return false;
            if (mm == 2 && (yy % 400 == 0 || (yy % 4 == 0 && yy % 100 != 0))) day[1] = 29; else day[1] = 28;
            if (mm < 1 || mm > 12) return false;
            if (dd < 1 || dd > day[mm - 1]) return false;
            return true;

        };

        $('.label.register-password-label').qtip('hide');
        $('.label.register-username-label').qtip('hide');
        $('.label.register-email-label').qtip('hide');
        $('.label.register-name-label').qtip('hide');
        $('.label.register-birth-date-label').qtip('hide');
        $('.register-button-label').qtip('hide');
        if ($('#reg-password').val() != $('#reg-password2').val()) {
            no_error = false;
            Qck.app_controller.add_err_qtip($('.label.register-password-label'), $('errors passwords_must_match', Qck.locale[current_language]).text());

        } else {
            if ($('#reg-password').val() == "") {
                no_error = false;
                Qck.app_controller.add_err_qtip($('.label.register-password-label'), $('errors #108', Qck.locale[current_language]).text());
            }
        }
        if (!validate_date($('#day_drop_down').val(), $('#month_drop_down').val(), $('#year_drop_down').val())) {
            no_error = false;
            Qck.app_controller.add_err_qtip($('.label.register-birth-date-label'),$('errors #111',Qck.locale[current_language]).text());
        }


        if (!no_error) {
            $('#reg-password').val("");
            $('#reg-password2').val("");
        }

        User.createAccount({
            username: $('#reg-username').val(),
            name:$('#reg-name').val(),
            password:$('#reg-password').val(),
            email:$('#reg-email').val(),
            birth_date: $('#year_drop_down').val() + '-' + $('#month_drop_down').val() + '-' + $('#day_drop_down').val()
        } , function() {
                    window.location.hash = "#users/sign_in"
                }, function(error) {
                    $.each(error, function(index, item) {
                        if (item == "4") {
                            Qck.app_controller.add_err_qtip($('.label.register-username-label'), $('errors #4', Qck.locale[current_language]).text());
                        }
                        if (item == "201") {
                            Qck.app_controller.add_err_qtip($('.label.register-username-label'), $('errors #201', Qck.locale[current_language]).text());
                        }
                        if (item == "109") {
                            Qck.app_controller.add_err_qtip($('.label.register-name-label'), $('errors #109', Qck.locale[current_language]).text());
                        }
                        if (item == "110") {
                            Qck.app_controller.add_err_qtip($('.label.register-email-label'), $('errors #110', Qck.locale[current_language]).text());
                        }
                    });
                    Qck.app_controller.add_err_qtip($('input.register-button-label.form_button'), $('errors user_not_created', Qck.locale[current_language]).text());


                });

        return false;
    },

    "#sign_in click": function(called, data) {
        var self = this;

        try {
            $("#sign_in")
                    .qtip({
                              content: {
                                  text: $.View("views/login.ejs", {}),
                                  title: {
                                      text: $('sign_in_qtip sign_in', Qck.locale[current_language]).text(),
                                      button: true
                                  }
                              },
                              events: {
                                  hide: function(event, api) {
                                      api.destroy();
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
                              hide: false,
                              style: {
                                  classes: 'ui-tooltip-shadow ui-tooltip-' + 'dark'
                              }
                          });
        }
        catch (e) {
            console.log(e);
        }
        return false;
    },

    "#sign_out click" : function() {
        if (Qck.current_user) {
            Qck.current_user.signOut(function() {
                $('.topbar').fadeOut("slow", function() {
                    $('.topbar')
                            .html($.View("views/sign_in.ejs", {}))
                            .fadeIn("slow", function() {
                        Qck.app_controller.set_language(current_language);
                    });
                });
                Qck.current_user = undefined;

                $.jStorage.deleteKey('current_user');
                Qck.cart_controller.on_logout();
                Qck.app_controller.set_color('blue');
                window.location.hash = "#";
            }, function() {
            });
        }
        return false;
    },
    ".login-form input[type!=button] focus": function(el) {
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

    // User Settings
    "history.users.user_panel subscribe":function(called, data) {
        var self = this;
        var usr = {name: Qck.current_user.name,email:Qck.current_user.email};
        Qck.app_controller.show_loader();
        $('#main-content').fadeOut("slow", function() {
            var view = $.View("views/user_settings.ejs", usr);
            $('#main-content')
                    .html(view).show();
                Qck.app_controller.load_birth_date_drop_down();
                /*#TODO: completar fecha con la del usuaro.*/
                $('#day_drop_down').val(5);
                $('#month_drop_down').val(5);
                $('#year_drop_down').val(1990);

            Address.getAddressList({
                username: Qck.current_user.username,
                authentication_token: Qck.current_user.token
            }, function(data) {
                Order.getOrderList({
                    username: Qck.current_user.username,
                    authentication_token: Qck.current_user.token
                }, function(data) {
                    if (data.length > 0) {
                        var cont = 0;
                        var len = data.length - 1;
                        $.each(data, function(i, order) {
                            var _addr_callback = function(address) {
                                $("ul.order-list").prepend(
                                        $.View('views/order_item.ejs', {
                                            order: order,
                                            address: address
                                        }));
                                $('ul.order-list li:first').data('order', order);

                                if (cont == len) {
                                    Qck.app_controller.hide_loader();
                                    $('#main-content').fadeIn('slow');
                                }
                                else {
                                    cont++;
                                }
                            };
                            if (order.address_id) {
                                Address.getAddress({
                                    address_id : order.address_id,
                                    username : Qck.current_user.username,
                                    authentication_token: Qck.current_user.token
                                }, _addr_callback);
                            } else {
                                _addr_callback();
                            }
                        });
                    } else {
                        $('#main-content').fadeIn('slow');
                        Qck.app_controller.hide_loader();
                    }
                });

                $(data).each(function(index, el) {
                    $("ul.address-list").prepend(
                            $.View('views/address_item.ejs', el)
                    );
                });

            });
        });
    },


    // User Address
    "history.users.create_address subscribe":function(called, data) {
        Qck.current_language = Qck.current_language || 1;
        Qck.app_controller.show_loader();
        $('#main-content').fadeOut("slow", function() {
            $('#main-content')
                    .html($.View("views/address_register.ejs", {}));
            Country.getCountryList({language_id:Qck.current_language}, function(data) {
                $(data).each(function(index, e) {
                    $("#reg-country-select").append("<option value=\"" + e.country_id + "\">" + e.name + "</option>");
                    if (index == 0) {
                        $("#reg-country-select option:first").attr("selected", "selected");
                    }
                });
                $("#reg-country-select").change();
                Qck.app_controller.hide_loader();
                $('#main-content').fadeIn('slow');
            });
        });
    },
    "history.users.edit_address subscribe":function(called, data) {
        Qck.current_language = Qck.current_language || 1;
        Qck.app_controller.show_loader();

        $('#main-content').fadeOut("slow", function() {
            Address.getAddress({
                address_id : data.id,
                username : Qck.current_user.username,
                authentication_token: Qck.current_user.token
            }, function(addr) {
                $('#main-content')
                        .html($.View("views/address_register.ejs"));

                Country.getCountryList({language_id:Qck.current_language}, function(data) {
                    $(data).each(function(index, e) {
                        $("#reg-country-select").append("<option value=\"" + e.country_id + "\">" + e.name + "</option>");
                        if (e.country_id == addr.country_id) {
                            $("#reg-country-select option:first").attr("selected", "selected");
                        }
                    });

                    $('#reg-full_name').val(addr.full_name);
                    $('#reg-address-1').val(addr.address_line_1);
                    $('#reg-address-2').val(addr.address_line_2);
                    $('#reg-city').val(addr.city);
                    $('#reg-zip').val(addr.zip_code);
                    $('#reg-phone').val(addr.phone_number);

                    $("#reg-country-select").change();
                    $("#addr-button").data('edit', addr.address_id);
                    $("#addr-button").val("Update Address");
                    Qck.app_controller.hide_loader();
                    $('#main-content').fadeIn('slow');
                });
            });
        });

    },
    "#reg-country-select change" : function(el) {
        State.getStateList({language_id:Qck.current_language, country_id:$(el).val()}, function(data) {
            $("#reg-state-select option").remove();
            $(data).each(function(index, e) {
                $("#reg-state-select").append("<option value=\"" + e.state_id + "\">" + e.name + "</option>");
                if (index == 0) {
                    $("#reg-state-select option:first").attr("selected", "selected");
                }
            });
            $('#main-content').fadeIn('slow');
        });
    }
    ,
    "#addr-button click": function(el) {
        $('#reg-full_name').qtip('hide');
        $('#reg-address-1').qtip('hide');
        $('#reg-address-2').qtip('hide');
        $('#reg-country-select').qtip('hide');
        $('#reg-state-select').qtip('hide');
        $('#reg-city').qtip('hide');
        $('#reg-zip').qtip('hide');
        $('#reg-phone').qtip('hide');
        $('#addr-button').qtip('hide');
        var errors= function(errs){
            $.each(errs,function(index,err){
                if(err=="1"){ //missing method
                    Qck.app_controller.add_err_qtip($('#addr-button'),$('errors #1',Qck.locale[current_language]).text());
                }
                if(err=="4"){ //missing username
                    Qck.app_controller.add_err_qtip($('.addr-full_name-label'),$('errors #4',Qck.locale[current_language]).text());
                }
                if(err=="6"){ //missing authentication token
                    Qck.app_controller.add_err_qtip($('#addr-button'),$('errors #6',Qck.locale[current_language]).text());
                }
                if(err=="16"){ //missing address
                    Qck.app_controller.add_err_qtip($('.addr-address-1-label'),$('errors #16',Qck.locale[current_language]).text());
                }
                if(err=="101"){ //invalid method
                    Qck.app_controller.add_err_qtip($('#addr-button'),$('errors #101',Qck.locale[current_language]).text());
                }
                if(err=="103"){ //invalid country id
                    Qck.app_controller.add_err_qtip($('.addr-country-label'),$('errors #103',Qck.locale[current_language]).text());
                }
                if(err=="104"){ //invalid user
                    Qck.app_controller.add_err_qtip($('#addr-button'),$('errors #104',Qck.locale[current_language]).text());
                }
                if(err=="105"){ //Invalid token
                    Qck.app_controller.add_err_qtip($('#addr-button'),$('errors #105',Qck.locale[current_language]).text());
                }
                if(err=="118"){ //Invalid full name
                    Qck.app_controller.add_err_qtip($('#addr-button'),$('errors #118',Qck.locale[current_language]).text());
                }
                if(err=="119"){ //Invalid address line 1
                    Qck.app_controller.add_err_qtip($('.addr-address-1-label'),$('errors #119',Qck.locale[current_language]).text());
                }
                if(err=="120"){ //Invalid address line 2
                    Qck.app_controller.add_err_qtip($('.addr-address-2-label'),$('errors #120',Qck.locale[current_language]).text());
                }
                if(err=="121"){ //Invalid state id
                    Qck.app_controller.add_err_qtip($('.addr-state-label'),$('errors #121',Qck.locale[current_language]).text());
                }
                if(err=="122"){ //Invalid city
                    Qck.app_controller.add_err_qtip($('.addr-city-label'),$('errors #122',Qck.locale[current_language]).text());
                }
                if(err=="123"){ //Invalid zip code
                    Qck.app_controller.add_err_qtip($('.addr-zip-code-label'),$('errors #123',Qck.locale[current_language]).text());
                }
                if(err=="124"){ //Invalid phone number
                    Qck.app_controller.add_err_qtip($('.addr-phone-label'),$('errors #124',Qck.locale[current_language]).text());
                }
                if(err=="202"){ //address already exists
                    Qck.app_controller.add_err_qtip($('#addr-button'),$('errors #202',Qck.locale[current_language]).text());
                }
                if(err=="999"){ //Unknown
                    Qck.app_controller.add_err_qtip($('#addr-button'),$('errors #999',Qck.locale[current_language]).text());
                }
            });
        };
        if(!Qck.current_user){
            alert($('errors must_be_logged',Qck.locale[current_language]).text());
            window.location.hash="#";
            return;
        }
        var params = {
            address :{
                full_name:      $('#reg-full_name').val(),
                address_line_1: $('#reg-address-1').val(),
                address_line_2: $('#reg-address-2').val(),
                country_id:     $('#reg-country-select').val(),
                state_id:       $('#reg-state-select').val(),
                city:           $('#reg-city').val(),
                zip_code:       $('#reg-zip').val(),
                phone_number:   $('#reg-phone').val()
            },
            username: Qck.current_user.username,
            authentication_token: Qck.current_user.token
        };

        if (!$("#addr-button").data('edit')) {
            Address.createAddress(params, function(response) {
                alert($('messages addr_created',Qck.locale[current_language]).text());
                window.history.go(-1);
            },errors);
        } else {
            params.address.address_id = $(el).data('edit');
            Address.updateAddress(params, function(response) {
                alert(response);
                window.history.go(-1);
            });
        }
    },


    // Order ABM
    ".create-order-link click" : function() {
        if (Qck.current_user) {
            Qck.app_controller.show_loader();
            Order.createOrder({
                username : Qck.current_user.username,
                authentication_token : Qck.current_user.token
            }, function(order) {
                Qck.app_controller.hide_loader();
                order = {
                    order_id : order,
                    status: 1
                };
                $("ul.order-list li:last").before(
                        $.View('views/order_item.ejs', {
                            order: order
                        }));
                $("ul.order-list li:last").prev().data('order', order);
            });
        }
        return false;
    }
    ,
    "history.users.order subscribe":function(called, data) {
        if (Qck.current_user) {
            var _call = function(fadeIn) {
                Order.getOrder({
                    username: Qck.current_user.username,
                    authentication_token: Qck.current_user.token,
                    order_id : data.id
                }, function(order) {
                    var _callback = function(address) {
                        $('#main-content').html(
                                $.View('views/order_show.ejs', {
                                    order: order,
                                    address: address
                                }));
                        $(".order-delete-button").data('order', order);
                        if (address) {
                            $(".order-map").gMap({
                                zoom: 11,
                                markers:[
                                    {
                                        address: address.address_line_1,
                                        html: address.full_name
                                    }
                                ]});
                        } else {
                            $(".order-map").hide();
                        }
                        fadeIn();
                    };

                    if (order.address_id) {
                        Address.getAddress({
                            username: Qck.current_user.username,
                            authentication_token: Qck.current_user.token,
                            address_id: order.address_id
                        }, _callback);
                    } else {
                        _callback();
                    }

                });
            };

            Qck.app_controller.change_view('#main-content', _call, 'isotope');
        }
    }
    ,
    ".order-delete-button click": function(el) {
        if (Qck.current_user) {
            var order = $(el).data('order');
            var _confirm = confirm("Are you sure you want to delete the order?");
            if (_confirm) {
                Qck.app_controller.show_loader();
                Order.deleteOrder({
                    username : Qck.current_user.username,
                    authentication_token : Qck.current_user.token,
                    order_id : order.order_id
                }, function(response) {
                    Qck.app_controller.hide_loader();
                    window.history.go(-1);
                });
            }
        }
        return false;
    },
    ".select-order click": function(el) {
        if (Qck.current_user && Qck.current_order) {
            $(el).parents('ul:first').find('li').removeClass('selected');
            $(el).parents('li:first').addClass('selected');
            var order = $(el).parents('li:first').data('order');
            Order.getOrder({
                username : Qck.current_user.username,
                authentication_token : Qck.current_user.token,
                order_id : order.order_id
            }, function(order) {
                Qck.updater = false;
                Qck.cart_controller.set_current_order(order, true);
            });
        }
        return false;
    },
    '.color-list li click': function(el) {
        var col = $(el).attr("class").replace(/color-/, '');
        Qck.app_controller.set_color(col);
    },
    '.change-pass-button click': function(el) {
        if (Qck.current_user) {
            var old_pass = $("#panel-password").val();
            var new_pass = $("#panel-password2").val();

            Qck.current_user.changePassword({
                username: Qck.current_user.username,
                password: old_pass,
                new_password: new_pass
            }, function() {
                alert("Password changed successfully");
            }, function() {
                alert('The password you specified didn\'t match the user\'s');
            });

        }
    },
    "history.users.update subscribe" : function(called, data) {
        $('#main-content').fadeOut("slow", function() {
            $('#main-content')
                    .html($.View("views/update_user.ejs"))
                    .fadeIn("slow", function() {
                var monthtext = [$('jan', months).text(),$('feb', months).text(),$('mar', months).text(),$('apr', months).text(),$('may', months).text(),$('jun', months).text(),$('jul', months).text(),$('aug', months).text(),$('sept', months).text(),$('oct', months).text(),$('nov', months).text(),$('dec', months).text()];
                var today = new Date();
                var dayfield = document.getElementById('day_drop_down');
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

            });
        });
        Qck.bread_controller.loadHashes([
            { url: "#users/update_user", refname : "Update User" }
        ]);
    },
    ".update-user-button click" : function () {
        if (Qck.current_user) {
            Qck.current_user.updateAccount({
                authentication_token: Qck.current_user.token,
                username: Qck.current_user.username,
                name:$('#panel-new-name').val(),
                email:$('#panel-new-email').val(),
                birth_date: $('#year_drop_down').val() + '-' + $('#month_drop_down').val() + '-' + $('#day_drop_down').val()
            }

                    , function() {
                        window.location.hash = "#"
                    }, function(error) {
                        alert('usuario no actualizado: ' + error);
                    });
        }
        return false;
    }



});

// Model Definition.

// Model Definition.

$.Model("User", {
    // Static Methods

    //signIn method
    //signIn params:
    //username : is a mandatory param
    //password : is a mandatory param
    //this method validates de user and password, and then make a call to GetAccount method.

    signIn : function(params, success, error) {
        params.method = "SignIn";
        var self = this;
        $.ajax({
            url: Qck.services.security,
            data: params,
            success: function(data) {
                if ($("response", data).attr("status") == "ok") {

                    var data2 = {
                        authentication_token : $("token", data).text(),
                        username : params.username
                    };
                    self.getAccount(data2, success, error);
                }
                else {
                    error($("error", data).attr("code"));
                }
            },
            dataType: "XML",
            error: error
        });


    },

    //CreateAccount method
    //createAccount params:
    //account: is a mandatory param
    //this method receives an account and creates an User
    createAccount : function(params, success, error) {
        var errors = [];
        if (params.username == "") {
            errors.push("4");
        }
        //validates de amount of characters in the field name
        if (!(params.name && params.name.length > 0 && params.name.length <= 80)) {
            errors.push("109");
        }
        //validates de amount of characters in the field email
        if (!(params.email && params.email.length > 0 && params.email.length <= 80)) {
            errors.push("110");
        }

        if (errors.length) {
            error(errors);
        } else {
            params.method = "CreateAccount";
            params.account = $.View("xml_renders/user.ejs", params);

            $.ajax({
                url: Qck.services.security,
                data: params,
                type : "POST",
                success: function(data) {

                    if ($("response", data).attr("status") == "ok") {
                        success("OK"); // en caso de crear correctamente el usuario devuelve el string OK
                    }
                    else {
                        error($("error", data).attr("code"));
                    }
                },
                error: error

            });
        }

    },

    //getAccount method
    //getAccount params:
    //username : is a mandatory param
    //authentication_token : is a mandatory param
    //this method validates de user and token, and construct a User.
    getAccount : function(params, success, error) {

        //validates user field is not empty
        var errors = [];
        var bool = false;
        if (params.username == "") {
            errors.push("4");
            bool = true;
        }

        //validates token field is not empty
        if (params.token == "") {
            errors.push("6");
            bool = true;
        }
        if (bool) {
            error(errors);
        }

        params.method = "GetAccount";

        $.ajax({
            url: Qck.services.security,
            data: params,
            success: function (data) {
                var usr = $("account", data);

                if (usr.length && $("response", data).attr("status") == "ok") {
                    var params2 = {
                        param : params,
                        user : usr
                    };
                    success(new User(params2));
                }
                else {
                    error($("error", data).attr("code"));
                }
            },
            error : error

        }
                );
    }

},
{
// Instance methods

    //UpdateAccount method
    //UpdateAccount params:
    //account: is a mandatory param
    //this method receives an account and updates an User.
    updateAccount : function(params, success, error) {
        //validates user field is not empty
        var errors = [];
        var bool = false;
        if (params.username == "") {
            errors.push("4");
            bool = true;

        }

        console.log(params);

        //validates token field is not empty
        if (params.token == "") {
            errors.push("6");
        }
        //validates account field is not empty
        if (!params) {
            errors.push("7");
        }

        //validates de amount of characters in the field name
        if (!(params.name && params.name.length > 0 && params.name.length <= 80)) {
            errors.push("109");
        }
        //validates de amount of characters in the field email
        if (!(params.email && params.email.length > 0 && params.email.length <= 128)) {
            errors.push("110");
        }
        if (errors.length) {
            error(errors);
        } else {
            params.account = $.View("xml_renders/user.ejs", params);

            params.method = "UpdateAccount";

            $.ajax({
                url: Qck.services.security,
                data: params,
                type : "POST",
                success: function(data) {

                    if ($("response", data).attr("status") == "ok") {
                        success("OK"); // en caso de crear correctamente el usuario devuelve el string OK
                    }
                    else {
                        error($("error", data).attr("code"));
                    }
                },
                error: error

            });
        }

    }
    ,
    //changePassword method
    //changePassword params:
    //password : is a mandatory param
    //new_password : is a mandatory param
    //this method validates de user and password, and modifies.
    changePassword : function(params, success, error) {
        params.method = "ChangePassword";
        params.username = this.username;
        $.ajax({
            url: Qck.services.security,
            data: params,

            success: function(data) {

                if ($("response", data).attr("status") == "ok") {
                    success("OK"); // en caso de crear correctamente el usuario devuelve el string OK
                }
                else {
                    error($("error", data).attr("code"));
                }
            },
            error: error

        });

    }
    ,

    //signOut method
    //signOut has no params
    //this method logout user.
    signOut : function(success, error) {
        var params = {};
        params.method = "SignOut";
        params.username = this.username;
        params.authentication_token = this.token;
        $.ajax({
            url: Qck.services.security,
            data: params,

            success: function(data) {

                if ($("response", data).attr("status") == "ok") {
                    success("OK"); // en caso de crear correctamente el usuario devuelve el string OK
                }
                else {
                    error($("error", data).attr("code"));
                }
            },
            error: error

        });

    }
    ,

    //Constructor
    setup: function(data, json) {

        if (!json) {
            this.token = data.param.authentication_token;
            this.id = $(data.user).find("account").attr("id");
            this.username = $(data.user).find("username").text();
            this.name = $(data.user).find("name").text();
            this.email = $(data.user).find("email").text();
            this.birth_date = new Date($(data.user).find("birth_date").text());
            this.created_date = new Date($(data.user).find("created_date").text());
            this.last_login_date = new Date($(data.user).find("last_login_date").text());
            this.last_password_change = $(data.user).find("last_password_change").text();
        } else {
            this.token = data.token;
            this.id = data.id;
            this.username = data.username;
            this.name = data.name;
            this.email = data.email;
            this.birth_date = data.birth_date;
            this.created_date = data.created_date;
            this.last_login_date = data.last_login_date;
            this.last_password_change = data.last_password_change;
            this.helped = data.helped;
        }
    }
});

