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
				Qck.bread_controller.loadHashes([]);
    },
    // Hashchange subscription to show.
    "history.categories.show subscribe" : function(called, data) {
        this.show(data);
    },
		"history.categories.index subscribe" : function(called, data) {
				Qck.bread_controller.loadHashes([{
						url:"#categories",
						refname:"Categorias"
					}]);
        $("#main-content").controller().index();
    },
    show: function(data) {
        var self = this;
        var _id = data.id;
				self.current_category = Category.findOne({id:_id});
				if (self.current_category != undefined){
					Qck.bread_controller.loadHashes(self.current_category.buildBreadCrumbsHash());
				}
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
				var self = this;
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
		buildRecursively: function(el) {
			var ret = new Category(el);
			ret.subcategories = []
			if (el.subcategories) {
				for(var i = 0; i < el.subcategories.length; i++){
					ret.subcategories.push(Category.buildRecursively(el.subcategories[i]));
				}
			}
			return ret;
		}
		,
    // !!!!!! These ones are declared just for the JSON API of the Rails prototype app.
    // Look for encapsulation in http://javascriptmvc.com/docs.html#&who=jQuery.Model for XML compatibility
    findAll : function(params, success, error) {
					var self = this;
					if (!self.cached_array) {
						$.getJSON("/categories.json", params, function(data) {
						
								self.cached_array = $.map(data, function(el) {
									// Recursive... wohoo!
									var _ret = undefined;
									
									_ret = Category.buildRecursively(el.category)
									
									return _ret;
								});
							success(self.cached_array);
						}, error);
					} else {
						success(self.cached_array);
					}
		},
    findOne : function(params, success, error) {
					var self = this;
					if (!self.cached_array) {
						$.getJSON("/categories/" + params.id + ".json", params, success, error);
					} else {
						
						var _stack = []
						for (category in self.cached_array){
							_stack.push(self.cached_array[category]);
						}
						
						while(_stack.length > 0) {
							var current = _stack.pop();
							
							if(current.id == params.id){
								if (success) {
									success(current);
								}
								return current;
							}
							
							if(current.subcategories) {
								for(subcategory in current.subcategories) {
									_stack.push(current.subcategories[subcategory]);
								}
							}
						}
						
						if (error) {
							error("Category ID not found");
							return;
						} else { 
							return; 
						}
					}
		},
    findProducts : function(params, success, error) {
        $.get("/products.json", params, success, error);
    }
}, {
    // Instance methods
    toString: function() {
        return this.name;
    }
		,
		buildBreadCrumbsHash: function() {
			var current = this;
			var array = [];
			array.push({
					url:"#categories/show&id=" + current.id.toString(),
					refname:current.name
			});
			do {
				current = Category.findOne({id:current.parent_id});
				if (current) {
					array.push({
							url:"#categories/show&id=" + current.id.toString(),
							refname:current.name
					});
				}
			} while(current && current.parent_id != undefined && current.parent_id != null);
			array.push({
				url:"#categories",
				refname:"Categorias"
			});
			return array.reverse();
		}
});


$(document).hashchange(function(ev) {
	ev.preventDefault();
});















