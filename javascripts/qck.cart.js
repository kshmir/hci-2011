$.Controller("CartController", {
    init: function() {
        var self = this;
        this.list_products = [];
        this.cart_price = 0.0;         // Cache...
        this.cart_items = 0;
        this.update_total_label(false);
        this.update_items_label(false);
        this.operation_queue = [];

        if ($.jStorage.get('current_cart')) {
            var cart = $.jStorage.get('current_cart');
            this.cached_cart = new Order(cart, true);
        }

        this.selector = "#cart";

        setInterval(function() {
            if (!self.inside) {
                $(self.selector).removeClass('hovered');
                $(".list", self.selector).hide();
                $(".fix", self.selector).hide();
                self.inside = true;
            }
        }, 50);


        this.queue_locked = false;

        this.queue_changed = false;

        // Magic sauce... well... syncs the cart here with the online one.
        setInterval(function() {
            if (!self.queue_locked && self.operation_queue.length > 0 && Qck.current_user && self.current_order) {
                self.allow_confirm(false, 'processing');
                self.queue_locked = true;
                var action = self.operation_queue.shift();
                if (action.operation == 'add_product') {
                    Qck.app_controller.show_loader();
                    Order.addOrderItem({
                        username: Qck.current_user.username,
                        authentication_token: Qck.current_user.token,
                        order_id: self.current_order.order_id,
                        order_item: {
                            product_id: action.data.id,
                            count: action.amount
                        }
                    }, function(data) {
                        Qck.app_controller.hide_loader();
                        self.allow_confirm(true);
                        self.queue_locked = false;
                    }); //TODO: Place error handler
                } else if (action.operation == 'remove_product') {
                    Qck.app_controller.show_loader();
                    Order.deleteOrderItem({
                        username: Qck.current_user.username,
                        authentication_token: Qck.current_user.token,
                        order_id: self.current_order.order_id,
                        order_item: {
                            product_id: action.data.id,
                            count: action.amount
                        }
                    }, function(data) {
                        self.queue_locked = false;
                        Qck.app_controller.hide_loader();
                        self.allow_confirm(true);
                    });
                }
                // Shrinks the queue to minimize calls.
            } else if (self.queue_changed) {
                var i = 0, j = 0;
                for (; i < self.operation_queue.length; i++) {
                    var op = self.operation_queue[i];
                    j = i + 1;
                    for (; j < self.operation_queue.length;) {
                        var next_op = self.operation_queue[j];
                        if (op.data.id == next_op.data.id) {
                            var amount = op.amount * ((op.operation == 'add_product') ? 1 : -1);
                            var next_amount = next_op.amount * ((next_op.operation == 'add_product') ? 1 : -1);
                            amount = amount + next_amount;
                            op.amount = amount;
                            if (op.operation == 'add_product' && amount < 0) {
                                op.operation = 'remove_product';
                            } else if (op.operation == 'remove_product' && amount > 0) {
                                op.operation = 'add_product';
                            } else if (amount == 0) {
                                self.operation_queue.remove(i, i);
                            }

                            if (amount < 0) {
                                op.amount = -1 * op.amount;
                            }
                            self.operation_queue.remove(j, j);
                        } else {
                            j++;
                        }
                    }
                }
                self.queue_changed = false;
            } else {

            }

        }, 50);


        this.create_cart();
    },
    on_login: function() {
        this.create_cart();
    },
    on_logout: function() {
        this.current_order = undefined;
        $('body .cart-item').slideUp('slow', function() {
            $(this).remove();
        });
        $.each(this.list_products, function(index, e) {
            e.amount = undefined;
        });
        this.list_products = [];
        this.update_labels();
    },
    current_order_instance : function() {
        return this.current_order;
    }
    ,
    create_cart: function() {
        if (Qck.current_user) {
            var self = this;
            Qck.app_controller.show_loader();
            Order.getOrderList({
                username : Qck.current_user.username,
                authentication_token : Qck.current_user.token
            }, function(data) {
                var unconfirmed_orders = [];
                $.each(data, function(index, e) {
                    if (!e.confirmed_date) {
                        unconfirmed_orders.push(e);
                    }
                });
                if (unconfirmed_orders.length > 0) {
                    Qck.app_controller.hide_loader();
                    self.set_current_order(unconfirmed_orders[0]);
                } else {
                    Order.createOrder({
                        username : Qck.current_user.username,
                        authentication_token : Qck.current_user.token
                    }, function(order) {
                        Qck.app_controller.hide_loader();
                        self.set_current_order(order);
                    });
                }
            });
        }
    },
    set_current_order: function(order, override_cache) {
        var self = this;

        Qck.app_controller.show_loader();

        var order_callback = function(data) {
            $.jStorage.set('current_cart', data);
            Qck.current_order = data;
            var len = data.items.length;
            var cont = 0;

            if (len) {

                var _call = function() {

                    $.each(data.items, function(index, item) {

                        Product.findOne({
                            product_id : item.product_id
                        }, function(prod) {


                            prod.amount = item.count;

                            self.add_product(prod, true);

                            if (cont == len - 1) {
                                self.current_order = data;
                                Qck.app_controller.hide_loader();
                            } else {
                                cont++;
                            }
                        });
                    });
                };

                if (self.list_products.length > 0) {

                    var prods_value = 0;
                    var prods_count = 0;
                    $.each(self.list_products, function(i, el) {
                        prods_value += el.amount * el.price;
                        prods_count += el.amount;
                    });

                    var items_value = 0;
                    var items_count = 0;
                    $.each(data.items, function(i, item) {
                        items_value += item.count * item.price;
                        items_count += item.count;
                    });


                    $("#sync-message .current-cart-n").text(prods_count);
                    $("#sync-message .unconfirmed-cart-n").text(items_count);

                    $("#sync-message .current-cart-value").text(prods_value.toFixed(2));
                    $("#sync-message .unconfirmed-cart-value").text(items_value.toFixed(2));

                    $("#sync-message").dialog({
                        modal: true,
                        close : function() {
                            _call();
                        },
                        buttons: {
                            'Add Items': function() {
                                $(this).dialog("close");
                            },
                            'Forget Them': function() {
                                self.list_products = [];
                                self.operation_queue = [];
                                $('body .cart-item').slideUp('slow', function() {
                                    $(this).remove();
                                });
                                $.each(self.list_products, function(index, e) {
                                    e.amount = undefined;
                                });
                                $(this).dialog("close");
                            }
                        }
                    });
                } else {
                    _call();
                }


            } else {
                self.current_order = data;
                Qck.app_controller.hide_loader();
            }
        };

        if (!$.jStorage.get('current_cart') || override_cache) {
            if (override_cache) {
                this.list_products = [];
                this.on_logout();
            }
            Order.getOrder({
                username : Qck.current_user.username,
                authentication_token : Qck.current_user.token,
                order_id : order.order_id
            }, order_callback);
        } else {
            var cart = $.jStorage.get('current_cart');
            this.cached_cart = new Order(cart, true);
            order_callback(this.cached_cart);
        }
    },
    "#cart mouseover": function() {
        $(this.selector).addClass('hovered');
        $(".list", this.selector).show();
        $(".fix", this.selector).show();
        this.inside = true;
    },
    "#cart mouseout": function() {
        this.inside = false;
    },
    '.cart-item .item-up-btn click': function(el) {
        var product = $(el).parents(".cart-item:first").data('product');
        product.amount++;
        $('.cart-item-' + product.id + ' .cart-n-value').text(product.amount);
        this.operation_queue.push({
            operation:'add_product',
            data: product,
            amount: 1
        });
        this.queue_changed = true;
        this.update_labels();
    },
    '.cart-item .item-down-btn click': function(el) {
        var product = $(el).parents(".cart-item:first").data('product');
        if (product.amount > 1) {
            product.amount--;
            $('.cart-item-' + product.id + ' .cart-n-value').text(product.amount);
            this.operation_queue.push({
                operation:'remove_product',
                data: product,
                amount: 1
            });
            this.queue_changed = true;

        }
        this.update_labels();
    },
    '.cart-item .remove-btn click': function(el) {
        el = $(el).parents(".cart-item:first");
        var product = el.data('product');
        this.remove_product(product);
        $('.cart-item').each(function(index, e) {
            e = $(e);
            if (e.data('product').id == product.id) {
                e.slideUp('slow', function() {
                    e.remove();
                });
            }
        });

        this.update_labels();
    },
    add_product : function(product, only_visuals) {
        var i;
        if ((i = $.inArrayCust(product, this.list_products, Product.comparer)) == -1) {

            this.list_products.push(product);
            product.amount = product.amount || 1;
            this.render_new_product(product);

        } else {
            product = this.list_products[i];
            product.amount++;

            if (!$('.cart-item-' + product.id + ' .cart-n-value').length) {
                this.render_new_product(product);
            }

            $('.cart-item-' + product.id + ' .cart-n-value').text(product.amount);
            this.update_labels();
        }


        if (!only_visuals) {
            this.operation_queue.push({
                operation:'add_product',
                data: product,
                amount: 1
            });
            this.queue_changed = true;
        }


    },
    remove_product : function(item) {
        var prod = $.inArrayCust(item, this.list_products, Product.comparer);
        if (prod != -1) {
            var i = prod;
            prod = this.list_products[prod];

            this.operation_queue.push({
                operation:'remove_product',
                data: prod,
                amount: prod.amount
            });
            this.queue_changed = true;

            prod.amount--;
            this.list_products.remove(i, i);
        }

        this.update_labels();
    },
    render_new_product : function(product) {
        $('.list ul', this.selector).prepend(
                $.View('views/cart_item.ejs', {item:product, amount: product.amount || 1})
                ).find('li:first').data('product', product);
        $(".cart-item:first .remove-btn").button({ icons: { secondary: "ui-icon-trash" } });
        $(".cart-item:first .item-up-btn").button({ icons: { secondary: "ui-icon-plus" }, text: false });
        $(".cart-item:first .item-down-btn").button({ icons: { secondary: "ui-icon-minus" }, text: false });
        this.update_labels();
    },
    update_labels : function() {
        var self = this;
        this.update_total_label();
        this.update_items_label();
        var _callback = function(addresses) {
            if (!addresses || (addresses && !addresses.length)) {
                self.allow_confirm(false, 'address');
            }
            else
            if (!self.list_products.length) {
                self.allow_confirm(false);
            }
        };
        if (Qck.current_user) {
            Address.getAddressList({
                username: Qck.current_user.username,
                authentication_token: Qck.current_user.token
            }, function(addresses) {
                _callback(addresses);
            });
        } else {
            _callback();
        }
    },
    update_total_label : function(anim) {
        var total = 0.0;
        $.each(this.list_products, function(index, el) {
            total += el.amount * el.price;
        });
        if (anim || anim == undefined) {
            $('.cart-total', this.element).stop(true, true).fadeOut('fast', function() {
                $(this).text(total.toFixed(2));
                $(this).fadeIn('fast');
            });
        } else {
            $('.cart-total').text(total.toFixed(2));
        }
        $('.cart-container-total-price').text(total.toFixed(2));
    },
    update_items_label : function(anim) {
        var total = 0;
        $.each(this.list_products, function(index, el) {
            total += el.amount;
        });
        if (anim || anim == undefined) {
            $('.cart-items-n', this.element).stop(true, true).fadeOut('fast', function() {
                $(this).text(total);
                $(this).fadeIn('fast');
            });
        } else {
            $('.cart-items-n').text(total);
        }
        $('.cart-container-n-items').text(total);
    },

    // Cart List
    "history.cart.index subscribe":function() {
        var self = this;
        Qck.app_controller.show_loader();
        $('#main-content').fadeOut("slow", function() {

            var _callback = function(addresses) {
                $('#main-content').html($.View("views/cart.ejs", {
                    addresses : addresses || [], items : self.list_products.reverse() || []
                }));

                $(".cart-item", '#main-content').each(function(index, el) {
                    var id = parseInt($(el).attr('id').replace(/sp\-cart\-item\-/, ""));
                    var prod = $.inArrayCust({id:id}, self.list_products, Product.comparer);
                    if (prod != -1) {
                        prod = self.list_products[prod];
                    }
                    $(el).data('product', prod);
                });

                $(".cart-item .remove-btn").button({ icons: { secondary: "ui-icon-trash" } });
                $(".cart-item .item-up-btn").button({ icons: { secondary: "ui-icon-plus" }, text: false });
                $(".cart-item .item-down-btn").button({ icons: { secondary: "ui-icon-minus" }, text: false });

                self.update_labels();

                self.allow_confirm(Qck.current_user != undefined && self.list_products.length);

                Qck.app_controller.hide_loader();

                $('#cart-addresses').change();

                $('#main-content').fadeIn('slow');
            };

            if (Qck.current_user) {
                Address.getAddressList({
                    username: Qck.current_user.username,
                    authentication_token: Qck.current_user.token
                }, function(addresses) {
                    _callback(addresses);
                });
            } else {
                _callback();
            }
        });
    },

    allow_confirm: function(val, why) {
        if (!val) {
            $('#cart-confirm-button').attr('disabled', 'disabled');

            if (!why) {
                why = (!Qck.current_user) ? 'login' :
                        (!this.list_products.length) ? 'items' : undefined;

            }
            if (why == 'address' && !Qck.current_user) {
                why = undefined;
            }
            if (why) {
                $('#not-confirmed-alert-' + why).slideDown('slow');
            }
        } else if (val) {
            $('#cart-confirm-button').removeAttr('disabled');
            $('.cart-alert').slideUp('slow');
        }
    },
    ".create-address-link click": function() {
        history.go(-1);
        return false;
    },

    "#cart-addresses change": function() {

        if (this.current_order) {
            var selected_address = $("#cart-addresses").val();
            Order.changeOrderAddress({
                username: Qck.current_user.username,
                authentication_token: Qck.current_user.token,
                order_id: this.current_order.order_id,
                address_id : selected_address
            }, function(status) {
                console.log('address changed ' + status);
            });
        }

        return false;
    },
    "#cart-confirm-button click": function() {
        var selected_address = $("#cart-addresses").val();

        Order.confirmOrder({
            username: Qck.current_user.username,
            authentication_token: Qck.current_user.token,
            order_id: this.current_order.order_id,
            address_id : selected_address
        }, function(data) {
            alert(data);
            // TODO: Change to next order and discard this current one.
        });

        return false;
    }
    ,
    ".clear-cart click" : function() {
        var self = this;
        $.each(this.list_products, function(i, prod) {
            self.operation_queue.push({
                operation:'remove_product',
                data: prod,
                amount: prod.amount
            });
        });

        $('.cart-item').slideUp('slow', function(el){
            $(el).remove();
        });
        this.list_products = [];

        this.update_labels();

        return false;
    }
});


// Use this plus an interval for tab sync... maybe some other day, it'd be a big hell.
window.onfocus = function() {
};

window.onblur = function() {
};