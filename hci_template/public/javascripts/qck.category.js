$.Controller("CategoriesController", {
    init: function() {
        var self = this;
        // Starts by rendering all the categories.
        // We should cache this to speed this up.

        var _callback = function(call) {
            Category.findAll({}, function(data) {
                self.render_list(data);
                call();
            });
        };

        Qck.app_controller.change_view(this.element, _callback);
    },
    // We should cache this to speed this up.
    render_list: function(data) {
        $(this.element).html($.View("/views/sidebar.ejs", {categories: data}));
    },
    // We should cache this to speed this up.
    "history.index subscribe" : function(called, data) {
        // Hides all categories expanded.
        $(this.element).find("ul ul.subcat").hide("slow");
        $("#main-content").controller().index();
    },
    // Hashchange subscription to show.
    "history.categories.show subscribe" : function(called, data) {
        this.show(data);
    },
    show: function(data) {
        var self = this;
        var _id = data.id;

        var _param = function(callback) {
            // Fetches all products as JSON.
            Category.findProducts({category:data.id}, function(list) {
                // Instanciates them as a Product object.
                var products = $.map(list, function(el) {
                    return new Product(el.product);
                });
                // Uses the product controller to render them.
                $("#main-content").controller().list(products);
                callback();
            });
            // TODO: Catch error.
        };

        $("body").controller().change_view("#main-content", _param);

    },
    // Renders toggle of category. We should add a button for this.
    "ul li a click": function(ev) {
        var _id = parseInt($(ev).parents("li:first").attr("id").split("-")[1]);
        // Calls a toggle function since we might call it from other events.
        this.item_toggle(_id);
    },
    item_toggle : function(id) {
        // Hides all categories expanded.
        $("#category-" + id.toString() + "-subcats").toggle("slow");
    }
});

$.Model("Category", {
    // Static Methods
    init : function() {
        this.hasMany("Product", "products"); // Medio de adorno.
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
        return this.name;
    }
});

















