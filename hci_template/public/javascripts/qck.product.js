// Controller Definition.
$.Controller("ProductsController", {
    init: function() {
        this.index();
    },
    index : function() {
        var self = this;
        Product.findAll({}, function(data) {
            self.list(data);
        });
    },
    list: function(products_list) {
        $(this.element).html($.View("/views/product_list.ejs", {products : products_list}));
    },
    "history.products.show subscribe" : function(called, data) {
        this.show(data);
    },
    show: function(product) {
        var self = this;
        // Eye candy
        $(self.element).fadeOut("slow", function() {
            Product.findOne({id: product.id}, function(data) {
                $(self.element).html($.View("/views/product_show.ejs", {product: data}));

                $(self.element).fadeIn("slow");
            });
            // TODO: Catch error.
        });
        // TODO: Poner cartelito ajax.
    }
});


// Model Definition.

$.Model("Product", {
    // Static Methods

    // !!!!!! These ones are declared just for the JSON API of the Rails prototype app.
    // Look for encapsulation in http://javascriptmvc.com/docs.html#&who=jQuery.Model for XML compatibility
    findAll : "/products.json",
    findOne : "/products/{id}.json"
}, {
    // Instance methods
    toString: function() {
        this.name
    }
});


