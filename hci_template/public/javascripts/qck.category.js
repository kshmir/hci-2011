$.Controller("CategoriesController",{
    init: function() {
        var self = this;
        Category.findAll({}, function(data) {
            self.render_list(data);
        });

    },
    render_list: function(data) {
        $(this.element).html($.View("/views/sidebar.ejs", {categories: data}));
    },
    "history.index subscribe" : function(called, data){
        $(this.element).find("ul ul").hide("slow");
        $("#main-content").controller().index();
    },
    "history.categories.show subscribe" : function(called, data){
        this.show(data);
    },
    show: function(data) {
        var self = this;
        var _id = data.id;
        Category.findProducts({category:data.id}, function(list){
           var products = $.map(list, function(el) {
              return new Product(el.product);
           });
           $("#main-content").controller().list(products);
           $("#category-" + _id.toString() + "-subcats").show("slow");
        });
    }
});

$.Model("Category", {
    // Static Methods

    init : function() {
        this.hasMany("Product", "products");
    },

    // !!!!!! These ones are declared just for the JSON API of the Rails prototype app.
    // Look for encapsulation in http://javascriptmvc.com/docs.html#&who=jQuery.Model for XML compatibility
    findAll : "/categories.json",
    findOne : "/categories/{id}.json",
    findProducts : function(params, success, error) {
        $.get("/products.json", params, success, error);
    }
}, {
    // Instance methods
    toString: function() {
        this.name
    }
});