$.Controller("CartController", {
    init: function() {
        var self = this;
        this.list_products = [];
        this.cart_price = 0.0;         // Cache...
        this.cart_items = 0;
        this.update_total_label(this.cart_price);
        this.update_items_label(this.cart_items);
        setInterval(function() {
            if (!self.inside) {
                $(self.element).removeClass('hovered');
                $(".list", self.element).hide();
                $(".fix", self.element).hide();
                self.inside = true;
            }
        }, 50);
    },
    "mouseover": function(el) {
        $(this.element).addClass('hovered');
        $(".list", this.element).show();
        $(".fix", this.element).show();
        this.inside = true;
    },
    "mouseout": function(el) {
        this.inside = false;
    },
    '.cart-item .item-up-btn click': function(el) {
        var product = $(el).parents(".cart-item:first").data('product');
        product.amount++;
        $('.cart-item-' + product.id + ' .cart-n-value').text(product.amount);
        this.update_total_label();
    },
    '.cart-item .item-down-btn click': function(el) {
        var product = $(el).parents(".cart-item:first").data('product');
        if (product.amount > 1) {
            product.amount--;
            $('.cart-item-' + product.id + ' .cart-n-value').text(product.amount);
        }
        this.update_total_label();
    },
    add_product : function(product) {
        if ($.inArray(product, this.list_products, Product.comparer) == -1) {
            $('.list ul', this.element).prepend(
                    $.View('views/cart_item.ejs', {item:product, amount:1})
                    ).find('li:first').data('product', product);
            $(".cart-item:first .remove-btn").button({
                icons: {
                    secondary: "ui-icon-trash"
                }
            });
            $(".cart-item:first .item-up-btn").button({
                icons: {
                    secondary: "ui-icon-plus"
                },
                text: false
            });

            $(".cart-item:first .item-down-btn").button({
                icons: {
                    secondary: "ui-icon-minus"
                },
                text: false
            });

            product.amount = 1;
        } else {
            product.amount++;
            $('.cart-item-' + product.id + ' .cart-n-value').text(product.amount);
        }
        this.list_products.push(product);
        this.update_total_label();
    },
    remove_product : function(item) {
        this.list_products.pop(item);
        var aux_price = this.cart_price;
        this.cart_price = aux_price - (item.count * item.price);
        var aux_items = this.cart_items;
        this.cart_items = aux_items - item.count;
    },
    update_total_label : function() {
        var total = 0.0;
        $.each((this.list_products), function(index, el) {
            total += el.amount * el.price;
        });
        $('.cart-total', this.element).stop(true, true).fadeOut('fast', function() {
            $(this).text(total.toFixed(2));
            $(this).fadeIn('fast');
        });
    },
    update_items_label : function() {
        var total = 0;
        $('.cart-items-n', this.element).stop(true, true).fadeOut('fast', function() {
            $(this).text(total);
            $(this).fadeIn('fast');
        });
    }
});
