// Model Definition.

$.Model("Item", {
        // Static Methods

 }
,


    {
// Instance methods

     //Constructor
     setup: function(data) {

            this.item_id = $(data).find("item_id").text();
            this.product_id = $(data).find("product_id").text();
            this.count = parseInt($(data).find("count").text());
            this.price= parseFloat($(data).find("price").text());
     }
   }
);


