// Model Definition.

$.Model("Order", {
    // Static Methods

    init: function() {
        if ($.jStorage.get('current_order')) {
            var order = $.jStorage.get('current_order');
            this.cached_order = new Order(order, true);
            this.got_array = true;
        }
    },
    clear_cache : function() {
    },
    //createOrder method
    //createOrder params:
    //username : is a mandatory param
    //authentication_token : is a mandatory param
    //this method validates de user and token, and then it instantiates a new .

    createOrder : function(params, success, error) {
        params.method = "CreateOrder";
        $.ajax({
            url: Qck.services.order,
            data: params,
            type : "POST",
            success: function(data) {
                if ($("response", data).attr("status") == "ok") {
                    success($("order", data).attr("id"));
                }
                else {
                    error($("error", data).attr("code"));
                }
            },
            error: error
        });
    },


    //getOrder method
    //getOrder params:
    //username : is a mandatory param
    //authentication_token : is a mandatory param
    //order_id : is a mandatory param
    //this method retrieves an Order searching it by order_id

    getOrder : function(params, success, error) {
        params.method = "GetOrder";
        $.ajax({
            dataType: "xml",
            url: Qck.services.order,
            data: params,
            success: function(data) {

                if ($("response", data).attr("status") == "ok") {

                    success(new Order(data));
                }
                else {
                    error($("error", data).attr("code"));
                }
            },
            error: error

        });

    },

    //getOrderList method
    //getOrderList params:
    //username : is a mandatory param
    //authentication_token : is a mandatory param
    //this method retrieves an Order List based on the user information

    getOrderList : function(params, success, error) {
        params.method = "GetOrderList";
        $.ajax({
            url: Qck.services.order,
            data: params,
            dataType: "xml",
            success: function(data) {

                if ($("response", data).attr("status") == "ok") {

                    var order_list = [];
                    $('order', data).each(function(index, item) {
                        order_list.push(new Order(item));
                    });
                    success(order_list);
                }
                else {
                    error($("error", data).attr("code"));
                }
            },
            error: error

        });

    },
    //deleteOrder method
    //deleteOrder params:
    //username : is a mandatory param
    //authentication_token : is a mandatory param
    //this method validates de user and token, and then it delete the Order .

    deleteOrder : function(params, success, error) {
        params.method = "DeleteOrder";
        $.ajax({
            dataType: "xml",
            url: Qck.services.order,
            data: params,
            type : "POST",
            success: function(data) {

                if ($("response", data).attr("status") == "ok") {
                    success("OK");
                }
                else {
                    error($("error", data).attr("code"));
                }
            },
            error: error

        });

    },
    //changeAddressOrder method
    //changeAddressOrder params:
    //username : is a mandatory param
    //authentication_token : is a mandatory param
    //address_id : is a mandatory param
    //this method validates de user and token, and then it edit the order address  .

    changeOrderAddress : function(params, success, error) {
        params.method = "ChangeOrderAddress";
        $.ajax({
            dataType: "xml",
            url: Qck.services.order,
            data: params,
            type : "POST",
            success: function(data) {

                if ($("response", data).attr("status") == "ok") {
                    success("OK");
                }
                else {
                    error($("error", data).attr("code"));
                }
            },
            error: error

        });

    },
    //confirmOrder method
    //confirmOrder params:
    //username : is a mandatory param
    //authentication_token : is a mandatory param
    //address_id : is a mandatory param
    //this method validates de user and token and the order shipping address.

    confirmOrder : function(params, success, error) {
        params.method = "ConfirmOrder";
        $.ajax({
            dataType: "xml",
            url: Qck.services.order,
            data: params,
            type : "POST",
            success: function(data) {

                if ($("response", data).attr("status") == "ok") {
                    success("OK");
                }
                else {
                    error($("error", data).attr("code"));
                }
            },
            error: error

        });

    },

    //addOrderItem method
    //addOrderItem params:
    //username : is a mandatory param
    //authentication_token : is a mandatory param
    //order_item :is a mandatory param
    //this method receives a product and creates an order item and adds it to the list
    addOrderItem : function(params, success, error) {
        params.method = "AddOrderItem";
        params.order_item = $.View("xml_renders/order_item.ejs", params.order_item);
        $.ajax({
            url: Qck.services.order,
            data: params,
            dataType: "xml",
            type : "POST",
            success: function(data) {

                if ($("response", data).attr("status") == "ok") {
                    success("OK");
                }
                else {
                    error($("error", data).attr("code"));
                }
            },
            error: error
        });

    },

    //deleteOrderItem method
    //deleteOrderItem params:
    //username : is a mandatory param
    //authentication_token : is a mandatory param
    //order_item :is a mandatory param
    //this method receives an item and deletes it from the order List
    deleteOrderItem : function(params, success, error) {
        params.method = "DeleteOrderItem";
        params.order_item = $.View("xml_renders/order_item.ejs", params.order_item);
        $.ajax({
            url: Qck.services.order,
            data: params,
            dataType: "xml",
            type : "POST",
            success: function(data) {

                if ($("response", data).attr("status") == "ok") {
                    success("OK");
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


{
    // Instance methods



    //Constructor
    setup: function(data, json) {
        var self = this;


        if (!json) {
            this.order_id = $(data).find("order").attr("id") || $(data).attr("id");
            this.address_id = $(data).find("address_id").text();
            this.status = $(data).find("status").text();
            this.created_date = $(data).find("created_date").text();
            this.confirmed_date = $(data).find("confirmed_date").text();
            this.shipped_date = $(data).find("shipped_date").text();
            this.latitude = $(data).find("latitude").text();
            this.longitude = $(data).find("longitude").text();
            this.items = [];
            $('item', data).each(function(index, item) {
                self.items.push(new Item(item));
            });
        } else {
            this.order_id = data.order_id;
            this.address_id = data.address_id;
            this.status = data.status;
            this.created_date =  data.created_date;
            this.confirmed_date = data.confirmed_date;
            this.shipped_date = data.shipped_date;
            this.latitude =  data.latitude;
            this.longitude = data.longitude;
            this.items = [];
            $.each(data.items,function(index, item) {
                self.items.push(new Item(item, true));
            });
        }

    },

    getStatus : function() {
        if (this.status == 1) {
            return "created";
        } else if (this.status == 2) {
            return "confirmed";
        } else if (this.status == 3) {
            return "shipped";
        } else if (this.status == 4) {
            return "delivered";
        } else return undefined;
    }
});


