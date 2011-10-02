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
            params.account = $.View("views/user.ejs", params.account);

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
                 error: error,
                 dataType: "XML"
            } );

        },

        //getAccount method
        //getAccount params:
        //username : is a mandatory param
        //authentication_token : is a mandatory param
        //this method validates de user and token, and construct a User.
        getAccount : function(params, success, error) {
            params.method = "GetAccount";
           $.ajax({
                url: Qck.services.security,
                data: params,
                success: function (data){
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
            params.method = "UpdateAccount";
            params.account = $.View("views/user.ejs", params.account);

            $.post(Qck.services.security, params, function(data) {
                if ($("response", data).attr("status") == "ok") {
                    success("OK"); // en caso de actualizar correctamente el usuario devuelve el string OK
                }
                else {
                    error($("error", data).attr("code"));
                }
            }, error);

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
            $.get(Qck.services.security, params, function(data) {
                if ($("response", data).attr("status") == "ok") {
                    success("OK");  //en caso de modificar los datos correctamente se devuelve el string OK
                }
                else {
                    error($("error", data).attr("code"));
                }
            }, error);


        }
        ,

        //signOut method
        //signOut has no params
        //this method logout user.
        signOut : function(params, success, error) {
            params.method = "SignOut";
            params.username = this.username;
            params.authentication_token = this.token;
            $.get(Qck.services.security, params, function(data) {
                if ($("response", data).attr("status") == "ok") {
                    success("OK"); //en caso de Desloguearse correctamente devuelve el string "OK"
                }
                else {
                    error($("error", data).attr("code"));
                }
            }, error);

        }
        ,

        //Constructor
        setup: function(data) {

            this.token = data.param.authentication_token;
            this.id = $(data.user).find("category_id").text();
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

