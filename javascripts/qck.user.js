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
                    .html($.View("views/register.ejs",{}))
                    .fadeIn("slow",Qck.app_controller.load_birth_date_drop_down);
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
                        .fadeIn("slow",function(){Qck.app_controller.set_language(current_language);});
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
        var add_err_qtip = function(el,msg){
            el.qtip('hide').removeData('qtip')
                    .qtip({
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
                                  ready: true, // ... but show the tooltip when ready
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
                          });
        };
        $('.label.register-password-label').qtip('hide');
        if ($('#reg-password').val() != $('#reg-password2').val()) {
            no_error = false;
            add_err_qtip($('.label.register-password-label'),$('errors passwords_must_match',Qck.locale[current_language]).text());

        } else {
            if ($('#reg-password').val() == "") {
                no_error = false;
                add_err_qtip($('.label.register-password-label'),$('errors #108',Qck.locale[current_language]).text());
            }
        }

        if (no_error) {

            User.createAccount({
                username: $('#reg-username').val(),
                name:$('#reg-name').val(),
                password:$('#reg-password').val(),
                email:$('#reg-email').val(),
                birth_date: $('#year_drop_down').val() + '-' + $('#month_drop_down').val() + '-' + $('#day_drop_down').val()
            }

                    , function() {
                        window.location.hash = "#users/sign_in"
                    }, function(error) {

                        alert('usuario no creado: ' + error);
                    });
        }
        return false;
    },

    "#sign_in click": function(called, data) {
        var self = this;

        try {
        $("#sign_in")
                .qtip({
                          content: {
                              text: $.View("views/login.ejs",{} ),
                              title: {
                                  text: $('sign_in_qtip sign_in',Qck.locale[current_language]).text(),
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
                            .html($.View("views/sign_in.ejs",{}))
                            .fadeIn("slow",function(){
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
        var usr = {name: Qck.current_user.name,email:Qck.current_user.email}
        Qck.app_controller.show_loader();
        $('#main-content').fadeOut("slow", function() {
            $('#main-content')
                    .html($.View("views/user_settings.ejs",usr)).fadeIn('slow',function(){
                    Qck.app_controller.load_birth_date_drop_down();
                    /*#TODO: completar fecha con la del usuaro.*/
                    $('#day_drop_down').val(5);
                    $('#month_drop_down').val(5);
                    $('#year_drop_down').val(1990);
                });
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
                    .html($.View("views/address_register.ejs",Qck.locale[current_language]));
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
                alert(response);
                window.history.go(-1);
            });
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
                    .fadeIn("slow",function(){
                        var monthtext = [$('jan',months).text(),$('feb',months).text(),$('mar',months).text(),$('apr',months).text(),$('may',months).text(),$('jun',months).text(),$('jul',months).text(),$('aug',months).text(),$('sept',months).text(),$('oct',months).text(),$('nov',months).text(),$('dec',months).text()];
                        var today=new Date();
                        var dayfield=document.getElementById('day_drop_down');
                        var monthfield=document.getElementById('month_drop_down');
                        var yearfield=document.getElementById('year_drop_down');
                        for (var i=1; i<32; i++){

                        dayfield.options[i-1]=new Option(i, i);
                        }
                        //dayfield.options[today.getDate()]=new Option(today.getDate(), today.getDate(), true, true) //select today's day
                        for (var m=0; m<12; m++){
                        monthfield.options[m]=new Option(monthtext[m], m+1);
                        }
                        //monthfield.options[today.getMonth()]=new Option(monthtext[today.getMonth()], monthtext[today.getMonth()], true, true) //select today's month
                        var thisyear=today.getFullYear()-18;
                        for (var y=0; y<125; y++){
                        yearfield.options[y]=new Option(thisyear, thisyear);
                        thisyear-=1;
                        }
                        //yearfield.options[0]=new Option(today.getFullYear(), today.getFullYear(), true, true) //select today's year

                    });
        });
        Qck.bread_controller.loadHashes([
            { url: "#users/update_user", refname : "Update User" }
        ]);
    },
    ".update-user-button click" : function () {
         User.updateAccount({

                //TODO donde se guarda el token
                authentication_token: Qck.current_user.authentication_token,
                username: Qck.current_user.username,
                name:$('#reg-name').val(),
                email:$('#reg-email').val(),
                birth_date: $('#year_drop_down').val() + '-' + $('#month_drop_down').val() + '-' + $('#day_drop_down').val()
            }

                    , function() {
                        window.location.hash = "#"
                    }, function(error) {
                        alert('usuario no actualizado: ' + error);
                    });
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
        if (bool){
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

        //validates token field is not empty
        if (params.token == "") {
            errors.push("6");
            bool = true;
        }
        //validates account field is not empty
        if (params === undifined || params == null) {
            errors.push("7");
            bool = true;
        }
        //validates de amount of characters in the field name
        if ($.Model.validateLengthOf(param.name, 1, 80) === undefined) {
            errors.push("109");
            bool = true;
        }
        //validates de amount of characters in the field email
        if ($.Model.validateLengthOf(param.email, 1, 128) === undefined) {
            errors.push("110");
            bool = true;
        }
        //validates de Date format
        if ($.Model.validateFormatOf(param.date, "^(19|20)[0-9][0-9]([-])(0[1-9]|1[012])\2(0[1-9]|[12][0-9]|3[01])$") === undefined) {
            errors.push("111");
            bool = true;
        }
        if (bool){
            error(errors);
        }
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

