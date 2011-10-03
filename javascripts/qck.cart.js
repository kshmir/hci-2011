$.Controller("CartController", {
        init: function() {
          this.list_products = [];
          this.cart_price = 0;
          this.cart_items = 0;
        },
        "mouseover": function(el) {
            alert("Items: "+this.cart_items.toString()+'\n'+
                "Price: "+this.cart_price.toString()
            );

        },
    addProduct : function(item){
        this.list_products.push(item);
        var aux_price = this.cart_price;
        this.cart_price = aux_price + (item.count*item.price);
        var aux_items = this.cart_items;
        this.cart_items = aux_items + item.count;
     },
     removeProduct : function(item){
        this.list_products.pop(item);
        var aux_price = this.cart_price;
        this.cart_price = aux_price - (item.count*item.price);
        var aux_items = this.cart_items;
        this.cart_items = aux_items - item.count;
     }


    }

);
