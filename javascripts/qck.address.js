// Model Definition.

$.Model("Address", {

    set_cache_address: function(address, username){
        $.jStorage.deleteKey('address-' + address.address_id, address);
        $.jStorage.set('address-' + address.address_id, address);
        if (username && $.jStorage.get('user-' +username + '-addresses')){
            var addresses = $.jStorage.get('user-' +username + '-addresses');
            var _addresses = [];
            $.each(addresses, function(index, addr){
               if (addr.address_id == address.address_id) {
                   _addresses.push(address);
               } else {
                   _addresses.push(addr);
               }
            });
            $.jStorage.deleteKey('user-' +username + '-addresses');
            $.jStorage.set('user-' +username + '-addresses', _addresses);
        }
    },

    // Static Methods
    //createAddress method
    //createAddress params:
    //username : is a mandatory param
    //authentication_token : is a mandatory param
    //address: is a mandatory param
    //this method transform the address param into a XML, and creates a new address

    createAddress : function(params, success, error) {
        var self = this;
        var addr = params.address;
        params.method = "CreateAddress";
        params.address = $.View("xml_renders/address.ejs", params.address);
        $.ajax({
            url: Qck.services.order,
            data: params,
            type : "POST",
            success: function(data) {
                if ($("response", data).attr("status") == "ok") {
                    self.set_cache_address(addr, params.username);
                    //if the address is correctly create it retrieves the address_id
                    success($("address", data).attr("id"));
                }
                else {
                   error($("error", data).attr("code"));
                }
            },
            error: error

        });

    },
    //getAddressList method
    //getAddressList params:
    //username : is a mandatory param
    //authentication_token : is a mandatory param
    //this method retrieves all the address in a  List of address structure

    getAddressList : function(params, success, error) {
        params.method = "GetAddressList";
        if (!$.jStorage.get('user-' + params.username + '-addresses')) {
            $.ajax({
                url: Qck.services.order,
                data: params,

                success: function(data) {
                    if ($("response", data).attr("status") == "ok") {
                        //it retrieves de Address List
                        var address_list = [];
                        $('address', data).each(function(index, item) {
                            var addr = new Address(item);
                            $.jStorage.set('address-' + addr.address_id, addr);
                            address_list.push(addr) ;
                        });
                        $.jStorage.set('user-' + params.username + '-addresses', address_list);
                        success(address_list);
                    }
                    else {
                        error();
                    }
                },
                error: error

            });
        } else {
            success($.jStorage.get('user-' + params.username + '-addresses'));
        }
    },

    //getAddress method
    //getAddress params:
    //username : is a mandatory param
    //authentication_token : is a mandatory param
    //this method retrieves an specific address structure

    getAddress : function(params, success, error) {
        var self = this;
        params.method = "GetAddress";

        if (!$.jStorage.get('address-' + params.address_id)) {
            $.ajax({
                url: Qck.services.order,
                data: params,

                success: function(data) {
                    if ($("response", data).attr("status") == "ok") {
                        //it retrieves an Address
                        var address = new Address(data);
                        self.set_cache_address(params.address, params.username);
                        success(address);
                    }
                    else {
                        error();
                    }
                },
                error: error

            });
        } else {
            success($.jStorage.get('address-' + params.address_id));
        }

    }
    ,
    updateAddress : function(params, success, error) {
        var self = this;
        var addr = params.address;
        params.method = "UpdateAddress";
        params.address = $.View("xml_renders/address.ejs", params.address);


        $.ajax({
            url: Qck.services.order,
            data: params,
            type : "POST",
            success: function(data) {
                if ($("response", data).attr("status") == "ok") {
                    self.set_cache_address(addr, params.username);
                    //if the address is correctly create it retrieves and OK message
                    success("OK");
                }
                else {
                    error();
                }
            },
            error: error

        });

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

    //Constructor
    setup: function(data, json) {
        if (!json) {
            this.address_id = $(data).find("address").attr("id") || $(data).attr("id");
            this.full_name = $(data).find("full_name").text();
            this.address_line_1 = $(data).find("address_line_1").text();
            this.address_line_2 = $(data).find("address_line_2").text();
            this.country_id = $(data).find("count_id").text();
            this.state_id = $(data).find("state_id").text();
            this.city = $(data).find("city").text();
            this.zip_code = $(data).find("zip_code").text();
            this.phone_number = $(data).find("phone_number").text();
        } else {
            this.address_id =     data.address_id;
            this.full_name =      data.full_name;
            this.address_line_1 = data.address_line_1;
            this.address_line_2 = data.address_line_2;
            this.country_id =     data.country_id;
            this.state_id =       data.state_id;
            this.city =           data.city;
            this.zip_code =       data.zip_code;
            this.phone_number =   data.phone_number;
        }
    }
});


