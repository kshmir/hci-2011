$.Controller("CategoriesController", {
    init: function() {
        var self = this;

        Category.init();

        // Starts by rendering all the categories.
        // We should cache this to speed this up.

        var ajax_callback = function(show_callback) {
            Category.findAll({}, function(data) {
                self.render_list(data);
                show_callback();
            });
        };
        Qck.app_controller.change_view(this.element, ajax_callback);

    },
    // We should cache this to speed this up.
    render_list: function(data) {

        $(this.element).html($.View("views/sidebar.ejs", {categories: data}));

    },
    // We should cache this to speed this up.
    "history.index subscribe" : function(called, data) {
        // Hides all categories expanded.
        $("#main-content").controller().index(data);
        Qck.bread_controller.loadHashes([]);
    },
    // Hashchange subscription to show.
    "history.categories.show subscribe" : function(called, data) {
        this.show(data);
    },
    show: function(data) {
        var self = this;
        Category.findOne({cat_id : data.cat_id, subcat_id : data.subcat_id}, function(cat) {
            self.last_category = self.current_category;
            self.current_category = cat;
        });
        if (self.current_category != undefined) {
            Qck.bread_controller.loadHashes(self.current_category.buildBreadCrumbsHash());
        }
        var _param = function(callback) {
            // Fetches all products as JSON.
            Category.findProducts({cat_id:data.cat_id, subcat_id: data.subcat_id, order : data.order}, function(products) {
                // Uses the product controller to render them.
                var filter;
                if (data.cat_id) {
                    filter = ".category-" + data.cat_id;
                } else if (data.subcat_id) {
                    filter = ".subcategory-" + data.subcat_id;
                }
                $("#main-content").controller().list(products, (self.current_category) ? 'Category: ' + self.current_category.name : undefined, filter, data.order);
                callback($("#main-content").controller().fix_heights());
            });
        };

        Qck.app_controller.change_view("#main-content", _param, 'isotope');

    },
    // Renders toggle of category. We should add a button for this.
    'ul li[class="category"] a click': function(ev) {
        var _id = parseInt($(ev).parents("li:first").attr("id").split("-")[1]);
        // Calls a toggle function since we might call it from other events.
        this.item_toggle(_id, ev);

    },
    item_toggle : function(id, clickd) {
        // Hides all categories expanded.


        var el = $("#category-" + id.toString() + "-subcats");
        if ($(el).css("display") != "none") {
            $(el).hide("slow");
            $(clickd).parent().find('.ui-icon').removeClass("ui-icon-triangle-1-s")
                    .addClass("ui-icon-triangle-1-e");
        }
        else {
            $(el).show("slow");
            $(clickd).parent().find('.ui-icon').removeClass("ui-icon-triangle-1-e")
                    .addClass("ui-icon-triangle-1-s");
        }


    }
});


$.Model("Category", {

    init: function() {
        if ($.jStorage.get('cached_categories')) {
            var array = $.jStorage.get('cached_categories');
            this.cached_array = $.map(array, function(e) {
                return new Category(e, true);
            });
            this.got_array = true;
        }
    },

    // Static Methods
    buildRecursively: function(node, depth, callback) {
        var self = this;
        var _ret = new Category(node);

        if (depth == 0) {
            $.get(Qck.services.catalog, { language_id : 1, method : "GetSubcategoryList", category_id: _ret.id },
                    function(data) {
                        $("subcategory", data).each(function(index, el) {
                            self.buildRecursively(el, 1, function(ret) {
                                _ret.subcategories.push(ret);
                                if (index == $("subcategory", data).length - 1) {
                                    callback(_ret);
                                }
                            });
                        });
                    });
        } else {
            callback(_ret);
        }
    }
    ,
    // !!!!!! These ones are declared just for the JSON API of the Rails prototype app.
    // Look for encapsulation in http://javascriptmvc.com/docs.html#&who=jQuery.Model for XML compatibility
    findAll : function(params, success, error) {
        var self = this;

        if (!self.cached_array) {
            self.got_array = false;

            self.cached_array = [];
            $.get(Qck.services.catalog, { language_id : 1, method : "GetCategoryList" },
                    function(data) {
                        var hits = $("category", data).length - 1;
                        $("category", data).each(function(index, el) {
                            self.buildRecursively(el, 0, function(ret) {
                                self.cached_array.push(ret);
                                if (hits == 0) {
                                    $.jStorage.set('cached_categories', self.cached_array);
                                    self.got_array = true;
                                    success(self.cached_array);
                                } else {
                                    hits--;
                                }
                            });
                        });
                    }, error);
        } else {
            if (self.got_array) {
                success(self.cached_array);
            } else {
                var wait_id = setInterval(function() {
                    if (self.got_array) {
                        success(self.cached_array);
                        clearInterval(wait_id);
                    }
                }, 50);


            }
        }
    },
    findOne : function(params, success, error) {
        var self = this;
        var wait_id = -1;
        var back = function() {
            clearInterval(wait_id);
        };
        var run = function(callback) {
            if (params.cat_id) {
                self.findAll({}, function() {
                    for (i in self.cached_array) {
                        var cat = self.cached_array[i];
                        if (cat.id == params.cat_id) {
                            success(cat);
                            if (callback) {
                                callback();
                            }

                            return;
                        }
                    }
                    if (callback) {
                        callback();
                    }
                }, error);
            } else if (params.subcat_id) {
                self.findAll({}, function() {
                    for (i in self.cached_array) {
                        var cat = self.cached_array[i];
                        for (j in cat.subcategories) {
                            var subcat = cat.subcategories[j];
                            if (subcat.id == params.subcat_id) {
                                success(subcat);
                                if (callback) {
                                    callback();
                                }
                                return;
                            }
                        }
                    }
                    if (callback) {
                        callback();
                    }
                }, error);
            }
        };

        if (self.got_array) {
            run();
        } else {
            run(back);
        }

    },
    findProducts : function(params, success, error) {
        var self = this;
        var p = {};
        if (params.subcat_id) {
            p.method = "GetProductListBySubcategory";
            p.subcategory_id = params.subcat_id;
            p.language_id = 1;
            self.findOne({subcat_id : params.subcat_id}, function(category) {
                p.category_id = category.parent_id;
            });
        } else if (params.cat_id) {
            p.method = "GetProductListByCategory";
            p.category_id = params.cat_id;
            p.language_id = 1;
        }

        p.order = params.order;
        p.items_per_page = params.items_per_page;
        p.page = params.page;
        $.get(Qck.services.catalog, p, function(data) {
            var arr = [];
            var sel = $("product", data);

            sel.each(function(index, prod) {
                arr.push(new Product(prod));
                if (index == sel.length - 1) {
                    success(arr);
                }
            });
        }, error);
    }
}, {

    // Instance methods
    setup: function(data, json) {
        if (!json) {
            this.code = $(data).find("code").text();
            this.name = $(data).find("name").text();
            if ($(data).find("category_id").length) {
                this.parent_id = parseInt($(data).find("category_id").text());
            }
            this.subcategories = [];
            this.id = parseInt($(data).attr("id"));
        } else {
            this.code = data.code;
            this.name = data.name;
            this.parent_id = data.parent_id;
            this.subcategories = $.map(data.subcategories, function(e) {
                return new Category(e, true);
            });
            this.id = data.id;
        }
    }
    ,
    toString: function() {
        return this.name;
    }
    ,

    buildBreadCrumbsHash: function() {
        var current = this;
        var array = [];
        if (current.parent_id) {
            array.push({
                url:"#categories/show&subcat_id=" + current.id.toString(),
                refname:current.name
            });
        }
        else {
            array.push({
                url:"#categories/show&cat_id=" + current.id.toString(),
                refname:current.name
            });
        }
        while (current && current.parent_id != undefined && current.parent_id != null) {

            Category.findOne({cat_id:current.parent_id}, function(ret) {
                current = ret;
            });

            if (current) {
                if (current.parent_id) {
                    array.push({
                        url:"#categories/show&subcat_id=" + current.id.toString(),
                        refname:current.name
                    });
                }
                else {
                    array.push({
                        url:"#categories/show&cat_id=" + current.id.toString(),
                        refname:current.name
                    });
                }
            }
        }
        return array.reverse();
    }
});


$(document).hashchange(function(ev) {
    ev.preventDefault();
});















