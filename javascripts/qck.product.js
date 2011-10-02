// Controller Definition.
$.Controller("ProductsController", {
    init: function() {

    },
    index : function() {
        var self = this;
        var ajax_callback = function(callback) {
            Product.findAll({}, function(data) {
                self.list(data);
                callback(self.fix_heights);
            });
        };
        Qck.app_controller.change_view(this.element, ajax_callback);
    },
    fix_heights: function() {
        $('.box-table').each(function() {
            var max_height = 0;
            $(this).find('.box-cell').each(function() {
                if ($(this).height() > max_height) {
                    max_height = $(this).height();
                }
            });
            $(this).find('.box-cell .product_item, .box-cell').height(max_height);
        });

    },
    list: function(products_list, title) {
        $(this.element).html($.View("views/product_list.ejs", {products : products_list, title:title}));
    },
    "history.products.show subscribe" : function(called, data) {
        this.show(data);
    },
    show: function(product) {
        var self = this;

        var ajax_callback = function(callback) {
            Product.findOne({id: product.id}, function(data) {
                $(self.element).html($.View(data.showView(), {product: data}));
                callback();
            });
        };

        Qck.app_controller.change_view(this.element, ajax_callback);
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
    },
    findByName : function(params, success, error) {
        params.method = "GetProductListByName";
        $.get(Qck.services.catalog, params, function(data) {
            var resp = [];
            var prods = $("product", data);
            if (prods.length) {
                prods.each(function(index, el) {
                    resp.push(new Product(el));
                });
                success(resp);
            }
            else {
                success(resp);
            }
        }, error);
    },
    findOne : function(params, success, error) {
        params.method = "GetProduct";
        if (params.id && !params.product_id) {
            params.product_id = params.id;
        }
        $.get(Qck.services.catalog, params, function(data) {
            var prod = $("product", data);
            if (prod.length) {
                success(new Product(prod));
            }
            else {
                success(undefined);
            }
        }, error);
    }
}, {
    setup: function(data) {
        this.id = $(data).attr("id");
        this.category_id = $(data).find("category_id").text();
        this.subcategory_id = $(data).find("subcategory_id").text();
        this.name = $(data).find("name").text();
        this.sales_rank = parseInt($(data).find("sales_rank").text());
        this.price = parseFloat($(data).find("price").text());
        this.image_url = $(data).find("image_url").text();

        // We couldn't find a way to make inheritance work on a model....
        if ($(data).find("ISBN_10").length) {
            this.authors = $(data).find("authors").text();
            this.publisher = $(data).find("publisher").text();
            this.published_date = $(data).find("published_date").text();
            this.ISBN_10 = $(data).find("ISBN_10").text();
            this.ISBN_13 = $(data).find("ISBN_13").text();
            this.language = $(data).find("language").text();
            this.type = "book";
        } else if ($(data).find("ASIN").length) {
            this.actors = $(data).find("actors").text();
            this.format = $(data).find("format").text();
            this.language = $(data).find("language").text();
            this.subtitles = $(data).find("subtitles").text();
            this.region = $(data).find("region").text();
            this.aspect_ratio = $(data).find("aspect_ratio").text();
            this.number_discs = $(data).find("number_discs").text();
            this.release_date = $(data).find("release_date").text();
            this.run_time = $(data).find("run_time").text();
            this.ASIN = $(data).find("ASIN").text();
            this.type = "movie";
        }


    },
    // Instance methods
    toString: function() {
        return this.name;
    },
    showView: function(){
        if (!this.type) {
            return "views/product_show.ejs";
        } else if (this.type == "book") {
            return "views/book_product_show.ejs";
        } else if (this.type == "movie") {
            return "views/movie_product_show.ejs";
        }
    }
});


