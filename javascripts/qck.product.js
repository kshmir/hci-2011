// Controller Definition.
$.Controller("ProductsController", {
    index : function(data) {
        var self = this;
        Product.findAll(data || {}, function(data) {
            self.list(data);
        });
    },
    fix_heights: function() {

        $(".filter a").click(function() {

            $('.items').isotope({
                sortBy : 'sales_rank',
                sortAscending : false
            }, function() {
                self.fix_heights();
            });

            return false;
        });
    },
    list: function(products_list, title, filter, orderby) {
        if (!filter) {
            filter = '.box'; // Isotope doesn't like having an undefined filter.
        }

        if (!$(".items").length) {
            $(this.element).html($.View("views/product_list.ejs", {products : products_list, title:title}));
            $("#radio").buttonset();
            this.products = products_list;
            this.title = title;

            var engine = 'best-available';

            $('.items').isotope({
                getSortData : {
                    name : function ($elem) {
                        return $elem.find('h3 a').text();
                    }
                },
                sortBy: 'name', sortAscending: true,
                animationEngine:engine
            });

            // M*****ing fix
            setTimeout(function() {
                $('.items').isotope('reLayout');
            }, 1000);
        } else {

            var to_delete_products = ([].union(this.products, Product.comparer)).subtract(products_list, Product.comparer);
            var to_add_products = ([].union(products_list, Product.comparer)).subtract(this.products, Product.comparer);
            var remaining_products = ([].union(products_list, Product.comparer)).intersect(this.products, Product.comparer);
            this.products = products_list;


            var to_delete_products_ids = $.map(to_delete_products, function(item) {
                return item.id;
            });
            var dom_delete_items = [];
            $(".items .product_item").each(function(index, item) {
                if ($.inArrayCust($(item).attr('id').split(/-/)[1], to_delete_products_ids) != -1) {
                    dom_delete_items.push(item);
                }
            });

            var dom_add_items = "";
            for (var i = 0; i < to_add_products.length; i++) {
                dom_add_items += $.View('views/product_item.ejs', {product:to_add_products[i]});
            }
            dom_add_items = $(dom_add_items).filter('.box');

            if (dom_delete_items.length) {
                $('.items').isotope('remove', $(dom_delete_items).parent());
            }
            $('.items').isotope('insert', dom_add_items, function() {
                $('.items').isotope({
                    filter: filter
                }).isotope('reLayout');
            });
            if (orderby) {
                $('.items').isotope({ sortBy: 'name', sortAscending: (orderby == 'ASC')});
            }
            setTimeout(function() {
                $('.items').isotope('reLayout');
            }, 1000);
        }


        // Bind the product to the view for further use.
        for (var i = 0; i < this.products.length; i++) {
            var prod = this.products[i];
            var item = $('.items #product-' + prod.id);
            item.data("product", prod);

            if (!item.data('loaded')) {
                $(item.find('img').css('opacity', 0)[0]).load(function() {
                    $(this).css('opacity', 1).hide().fadeIn("slow");
                });
            }
            item.data("loaded", true);
        }


        this.fix_heights();
    },
    "#name_asc click": function() {
        var hash = window.location.hash.toString();
        if (hash.indexOf("DESC") != -1) {
            hash = hash.replace(/DESC/g, "ASC");
        } else {
            hash += "&order=ASC"
        }
        window.location.hash = hash;
        if (!$.browser.mozilla) {
            $('.items').isotope({ sortBy: 'name', sortAscending: true});
        }

    },
    "#name_desc click": function() {
        var hash = window.location.hash.toString();
        if (hash.indexOf("ASC") != -1) {
            hash = hash.replace(/ASC/g, "DESC");
        } else {
            hash += "&order=DESC"
        }
        window.location.hash = hash;
        if (!$.browser.mozilla) {
            $('.items').isotope({ sortBy: 'name', sortAscending: false });
        }
    },

    ".addcart click": function(e) {
        var el = $(e).parents(".product_item:first,.product_show:first");
        prod = el.data('product');
        Qck.cart_controller.add_product(prod);
        el.effect('transfer', {
            to:'#cart', className:'cart-animation-box'
        }, 200);
        return false;
    },

    // Show event
    "history.products.search subscribe" : function(called, query) {
        var self = this;
        var ajax = function(callback) {
            Product.findByName(query, function(data) {
                self.list(data, '', '.box');
                callback();
            });
        };
        Qck.app_controller.change_view("#main-content", ajax, 'isotope');
        Qck.bread_controller.loadHashes([
            {
                url:window.location.hash, refname:'Busqueda rápida'
            }
        ]);
        $('.search').val(query.criteria);
    },

    // Show event
    "history.products.show subscribe" : function(called, data) {
        this.show(data);
    },
    show: function(product) {
        var self = this;
        // TODO: Breadcrumbs
        var ajax_callback = function(callback) {
            $(self.element).html("");
            Product.findOne({id: product.id}, function(data) {
                $(self.element).html($.View(data.showView(), {product: data}));
                $('.product_show', self.element).data('product', data);
                var cat;
                Category.findOne({subcat_id:data.subcategory_id}, function(data) {
                    cat = data;
                });
                Qck.bread_controller.loadHashes([
                    { refname:cat.name, url:'#categories/show&subcat_id=' + cat.id  },
                    { refname:data.name, url:'#products/show&id=' + data.id  }
                ]);
                callback();
            });
        };

        Qck.app_controller.change_view(this.element, ajax_callback, "isotope");
    }
});


// Model Definition.

$.Model("Product", {
    comparer : function(p1, p2) {
        return p1.id - p2.id;
    },
    // Static Methods
    // Look for encapsulation in http://javascriptmvc.com/docs.html#&who=jQuery.Model for XML compatibility
    findAll : function(params, success, error) {
        params.method = "GetProductListByName";
        params.criteria = "a"; // It's a shame we have to do this...
        this.findByName(params, success, error);
    },
    findByName : function(params, success, error) {
        params.method = "GetProductListByName";
        $.get(Qck.services.catalog, params, function(data) {
            var resp = [];
            var prods = $("product", data);
            if (prods.length) {
                prods.each(function(index, el) {
                    var _p = new Product(el);
                    $.jStorage.set('product-' + _p.id, _p);
                    resp.push(_p);
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
        if (!$.jStorage.get('product-' + params.product_id)) {
            $.get(Qck.services.catalog, params, function(data) {
                var prod = $("product", data);
                if (prod.length) {
                    var _p = new Product(prod);
                    $.jStorage.set('product-' + _p.id, _p);
                    success(_p);
                }
                else {
                    success(undefined);
                }
            }, error);
        } else {
            var prod = new Product($.jStorage.get('product-' + params.product_id), true);
            success(prod);
        }
    }
}, {
    setup: function(data, json) {

        if (!json) {
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
        } else {
            this.id = data.id;
            this.category_id = data.category_id;
            this.subcategory_id = data.subcategory_id;
            this.name = data.name;
            this.sales_rank = data.sales_rank;
            this.price = data.price;
            this.image_url = data.image_url;
            this.authors = data.authors;
            this.publisher = data.publisher;
            this.published_date = data.published_date;
            this.ISBN_10 = data.ISBN_10;
            this.ISBN_13 = data.ISBN_13;
            this.language = data.language;
            this.type = data.type;
            this.actors = data.actors;
            this.format = data.format;
            this.language = data.language;
            this.subtitles = data.subtitles;
            this.region = data.region;
            this.aspect_ratio = data.aspect_ratio;
            this.number_discs = data.number_discs;
            this.release_date = data.release_date;
            this.run_time = data.run_time;
            this.ASIN = data.ASIN;
        }


    },
    // Instance methods
    toString: function() {
        return this.name;
    },
    showView: function() {
        if (!this.type) {
            return "views/product_show.ejs";
        } else if (this.type == "book") {
            return "views/book_product_show.ejs";
        } else if (this.type == "movie") {
            return "views/movie_product_show.ejs";
        }
    }
});


