// Model Definition.

$.Model("Order", {
        // Static Methods

        //signIn method
        //signIn params:
        //username : is a mandatory param
        //password : is a mandatory param
        //this method validates de user and password, and then make a call to GetAccount method.

        signIn : function(params, success, error) {
            params.method = "SignIn";
            self = this;
            $.get(Qck.services.security, params, function(data) {
                if ($("response",data).attr("status") == "ok") {

                    var data2 = {
                        authentication_token : $("token", data).text(),
                        username : params.username
                    };

                    self.getAccount(data2, success, error);
                }
                else {
                    error($("error",data).attr("code"));
                }
            }, error);


        }

    },
    {
// Instance methods


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
);

