// Model Definition.

$.Model("Language", {
        // Static Methods

 }
,


    {
// Instance methods

     //Constructor
     setup: function(data) {

            this.language_id = $(data).find("language_id").attr("id");
            this.product_id = $(data).find("product_id").text();
            this.count = parseInt($(data).find("count").text());
            this.price= parseFloat($(data).find("price").text());
     }
   }
);

