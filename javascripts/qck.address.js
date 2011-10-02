// Model Definition.

$.Model("Address", {
        // Static Methods

        //createAddress method
        //createAddress params:
        //username : is a mandatory param
        //authentication_token : is a mandatory param
        //address: is a mandatory param
        //this method transform the address param into a XML, and creates a new address

        createAddress : function(params, success, error) {
                params.method = "CreateAddress";
                params.address = $.View("xml_renders/address.ejs", params.address);
                $.ajax({
                    url: Qck.services.order,
                    data: params,
                    type : "POST",
                    success: function(data) {
                           if ($("response", data).attr("status") == "ok") {
                                    //if the address is correctly create it retrieves the address_id
                                    success($("address", data).attr("id"));
                                }
                                else {
                                    error();
                                }
                            },
                             error: error

                        } );

            },
        //getAddressList method
        //getAddressList params:
        //username : is a mandatory param
        //authentication_token : is a mandatory param
        //this method retrieves all the address in a  List of address structure

        getAddressList : function(params, success, error) {
                params.method = "GetAddressList";
                $.ajax({
                    url: Qck.services.order,
                    data: params,

                    success: function(data) {
                           if ($("response", data).attr("status") == "ok") {
                                    //it retrieves de Address List
                                     var address_list = [];
                                     $('address', data).each(function(index, item) {
                                            address_list.push(new Address(item));
                                     });
                                     success(address_list);
                                }
                                else {
                                    error();
                                }
                            },
                             error: error

                        } );

            },

        //getAddress method
        //getAddress params:
        //username : is a mandatory param
        //authentication_token : is a mandatory param
        //this method retrieves an specific address structure

        getAddress : function(params, success, error) {
                params.method = "GetAddress";
                $.ajax({
                    url: Qck.services.order,
                    data: params,

                    success: function(data) {
                           if ($("response", data).attr("status") == "ok") {
                                    //it retrieves an Address
                                     var address = new Address(item);
                                     success(address);
                                }
                                else {
                                    error();
                                }
                            },
                             error: error

                        } );

            }


 }
,


    {
// Instance methods

        //updateAddress method
        //updateAddress params:
        //username : is a mandatory param
        //authentication_token : is a mandatory param
        //address: is a mandatory param (the new address)
        //this method transform the address param into a XML, and updates the address

        updateAddress : function(params, success, error) {
                params.method = "UpdateAddress";
                params.address = $.View("xml_renders/address.ejs", params.address);
                params.address_id = this.address_id;
                $.ajax({
                    url: Qck.services.order,
                    data: params,
                    type : "POST",
                    success: function(data) {
                           if ($("response", data).attr("status") == "ok") {
                                    //if the address is correctly create it retrieves and OK message
                                    success("OK");
                                }
                                else {
                                    error();
                                }
                            },
                             error: error

                        } );

            } ,


     //Constructor
     setup: function(data) {

            this.address_id = $(data).find("address").attr("id");
            this.full_name = $(data).find("full_name").text();
            this.address_line_1 = $(data).find("address_line_1").text();
            this.address_line_2 = $(data).find("address_line_2").text();
            this.country_id = $(data).find("count_id").text();
            this.state_id = $(data).find("state_id").text();
            this.city = $(data).find("city").text();
            this.zip_code = $(data).find("zip_code").text();
            this.phone_number = $(data).find("phone_number").text();

     }
   }
);


