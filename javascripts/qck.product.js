// Controller Definition.
$.Controller("ProductsController", {
    init: function() {
        this.index();
    },
    index : function() {
        var self = this;
        var _callback = function(call) {
            Product.findAll({}, function(data) {
                self.list(data);
                call();
            });
        };
        Qck.app_controller.change_view(this.element, _callback);
    },
    list: function(products_list) {
        $(this.element).html($.View("views/product_list.ejs", {products : products_list}));
    },
    "history.products.show subscribe" : function(called, data) {
        this.show(data);
    },
    show: function(product) {
        var self = this;
        // Eye candy
        var _callback = function(call) {
            Product.findOne({id: product.id}, function(data) {
                $(self.element).html($.View("views/product_show.ejs", {product: data}));
                call();
            });

        };

        Qck.app_controller.change_view(this.element, _callback);

        // TODO: Poner cartelito ajax.
    }
});


// Model Definition.

$.Model("Product", {
    // Static Methods
    // !!!!!! These ones are declared just for the JSON API of the Rails prototype app.
    // Look for encapsulation in http://javascriptmvc.com/docs.html#&who=jQuery.Model for XML compatibility
    findAll : function(params, success, error) {
        params.method = "GetProductListByName";
        params.criteria = "a";
        this.findByName(params, success, error);
    }
    ,
    findByName : function(params, success, error){
        params.method = "GetProductListByName";
        $.get(Qck.services.catalog, params, function(data) {
            var resp = [];
            var prods = $("product",data);
            if (prods.length) {
                prods.each(function(index, el){
                    resp.push(new Product(el));
                });
                success(resp);
            }
            else {
                success(resp);
            }
        }, error);
    },
    findOne : function(params, success, error){
        params.method = "GetProduct";
        if (params.id && !params.product_id) {
            params.product_id = params.id;
        }
        $.get(Qck.services.catalog, params, function(data) {
            var prod = $("product",data);
            if (prod.length) {
                success(new Product(prod));
            }
            else {
                success(undefined);
            }
        }, error);
    }
}, {
    setup: function(data){
        this.id =               $(data).attr("id");
        this.category_id =      $(data).find("category_id").text();
        this.subcategory_id =   $(data).find("subcategory_id").text();
        this.name =             $(data).find("name").text();
        this.sales_rank =       parseInt($(data).find("sales_rank").text());
        this.price =            parseFloat($(data).find("price").text());
        this.image_url =        $(data).find("image_url").text();
    },
    // Instance methods
    toString: function() {
        this.name
    }
});


