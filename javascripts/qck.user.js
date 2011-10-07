$.Controller("UserController", {
    init: function() {
        var self = this;

        this.sign_in_unique = false;


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
                    .html($.View("views/register.ejs"))
                    .fadeIn("slow");
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
                Qck.current_user = user;
                $("#sign_in").qtip('hide');
                $(el).html($.View("views/logged.ejs", {username: user.name}))
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
                                  self.sign_in_unique = true;
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
                                      self.sign_in_unique = true;
                                  }, // Don't specify a hide event either!
                                  style: {
                                      classes: 'ui-tooltip-shadow ui-tooltip-' + 'red'
                                  }
                              });
            }
        }

        if (no_error) {

            User.createAccount({
                username: $('#reg-username').val(),
                name:$('#reg-name').val(),
                password:$('#reg-password').val(),
                email:$('#reg-email').val(),
                birth_date: $('#reg-birth-date').val()
            }

                    , function() {
                        alert('usuario creado');
                    }, function() {
                        alert('usuario no creado');
                    });
        }
        return false;
    },

    "#sign_in click": function(called, data) {
        var self = this;
        if (!this.sign_in_unique) {
            this.sign_in_unique = true;

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
                                      self.sign_in_unique = false;
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
    },

    "#sign_out click" : function() {
        Qck.current_user.signOut(function() {
            $('.topbar').fadeOut("slow", function() {
                $('.topbar')
                        .html($.View("views/sign_in.ejs"))
                        .fadeIn("slow");
            });
            Qck.current_user = undefined;
        }, function() {
        });
        return false;
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
        self = this;
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
        if (params.username == "") {
            error:("4");
        }

        //validates token field is not empty
        if (params.token == "") {
            error:("6");
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
        if (params.username == "") {
            error:("4");
        }

        //validates token field is not empty
        if (params.token == "") {
            error:("6");
        }
        //validates account field is not empty
        if (params === 'undifined' || params == null) {
            error:("7");
        }
        //validates de amount of characters in the field name
        if ($.Model.validateLengthOf(param.name, 1, 80) === 'undifined') {
            error:("109");
        }
        //validates de amount of characters in the field email
        if ($.Model.validateLengthOf(param.email, 1, 128) === 'undifined') {
            error:("110");
        }
        //validates de Date format
        if ($.Model.validateFormatOf(param.name, "^(19|20)[0-9][0-9]([-])(0[1-9]|1[012])\2(0[1-9]|[12][0-9]|3[01])$") === 'undifined') {
            error:("111");
        }

        params.method = "UpdateAccount";
        params.account = $.View("xml_renders/user.ejs", params.account);
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
    setup: function(data) {

        this.token = data.param.authentication_token;
        this.id = $(data.user).find("account").attr("id");
        this.username = $(data.user).find("username").text();
        this.name = $(data.user).find("name").text();
        this.email = $(data.user).find("email").text();
        this.birth_date = new Date($(data.user).find("birth_date").text());
        this.created_date = new Date($(data.user).find("created_date").text());
        this.last_login_date = new Date($(data.user).find("last_login_date").text());
        this.last_password_change = $(data.user).find("last_password_change").text();
    }




}
        )
        ;

