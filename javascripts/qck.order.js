// Model Definition.

$.Model("Order", {
        // Static Methods

        //createOrder method
        //createOrder params:
        //username : is a mandatory param
        //authentication_token : is a mandatory param
        //this method validates de user and toke, and then it instantiates a new .

        createOrder : function(params, success, error) {
            params.method = "CreateOrder";
            self = this;
            $.post(Qck.services.order, params, function(data) {
                    if ($("response",data).attr("status") == "ok") {
                        success($("order",data));
                    }
                    else {
                        error($("error",data).attr("code"));
                    }
                }, error);
            }

 }
,


    {
// Instance methods

      //deleteOrder method
      //deleteOrder params:
      //username : is a mandatory param
      //authentication_token : is a mandatory param
      //this method validates de user and toke, and then it instantiates a new .

        deleteOrder : function(params, success, error) {
            params.method = "DeleteOrder";
            params.order_id = this.order_id;
            self = this;
            $.post(Qck.services.order, params, function(data) {
                    if ($("response",data).attr("status") == "ok") {
                        success($("order",data));
                    }
                    else {
                        error($("error",data).attr("code"));
                    }
                }, error);
            },
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


