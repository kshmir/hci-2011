// Model Definition.

$.Model("Address", {
        // Static Methods


 }
,


    {
// Instance methods

     //Constructor
     setup: function(data) {

            this.address_id = $(data).find("address_id").text();
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


