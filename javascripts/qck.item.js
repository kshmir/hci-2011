// Model Definition.

$.Model("Item", {
        // Static Methods
        init: function(){
            this.counter = 0;
        }
 }
,   {
     // Instance methods
     //Constructor
     setup: function(data, json) {
         if (!json) {
            this.item_id= $(data).attr("id");
            this.product_id= $(data).find("product_id").text();
            this.count= parseInt($(data).find("count").text());
            this.price= parseFloat($(data).find("price").text());
         } else {
             this.item_id = data.item_id;
             this.product_id = data.product_id;
             this.count = data.count;
             this.price = data.price;
         }
     }
   }
);


