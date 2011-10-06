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
    "mouseout": function() {
        this.inside = false;
    },
    '.cart-item .item-up-btn click': function(el) {
        var product = $(el).parents(".cart-item:first").data('product');
        product.amount++;
        $('.cart-item-' + product.id + ' .cart-n-value').text(product.amount);
        this.update_labels();
    },
    '.cart-item .item-down-btn click': function(el) {
        var product = $(el).parents(".cart-item:first").data('product');
        if (product.amount > 1) {
            product.amount--;
            $('.cart-item-' + product.id + ' .cart-n-value').text(product.amount);
        }
        this.update_labels();
    },
    '.cart-item .remove-btn click': function(el){
        el = $(el).parents(".cart-item:first");
        var product = el.data('product');
        var i = $.inArray(product, this.list_products, Product.comparer);
        this.list_products.remove(i);
        el.slideUp('slow', function(){
            el.remove();
        });
        this.update_labels();
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
            this.list_products.push(product);
        } else {
            product.amount++;
            $('.cart-item-' + product.id + ' .cart-n-value').text(product.amount);
        }
        this.update_labels();
    },
    remove_product : function(item) {
        var prod = $.inArray(item, this.list_products, Product.comparer);
        if (prod != -1) {
            prod = this.list_products[prod];
        }

        prod.amount--;
        this.update_labels();
    },
    update_labels : function(){
        this.update_total_label();
        this.update_items_label();
    },
    update_total_label : function() {
        var total = 0.0;
        $.each(this.list_products, function(index, el) {
            total += el.amount * el.price;
        });
        $('.cart-total', this.element).stop(true, true).fadeOut('fast', function() {
            $(this).text(total.toFixed(2));
            $(this).fadeIn('fast');
        });
    },
    update_items_label : function() {
        var total = 0;
        $.each(this.list_products, function(index, el) {
            total += el.amount;
        });
        $('.cart-items-n', this.element).stop(true, true).fadeOut('fast', function() {
            $(this).text(total);
            $(this).fadeIn('fast');
        });
    }
});
