$.Controller("CartController", {
        init: function() {
            this.list_products = [];
            this.cart_price = 0;
            this.cart_items = 0;
        },
        "mouseenter": function(el) {
            el.removeData('qtip')
                .qtip({
                    content: {
                        text: 'You must write a password',
                        title: {
                            text: 'Input error:',
                            button: true
                        }
                    },
                    position: {
                        adjust: {
                            method: 'fixed'
                        }
                    },
                    position: {
                        my: 'center left', // Use the corner...
                        at: 'center right' // ...and opposite corner
                    },
                    show: {
                        event: false, // Don't specify a show event...
                        ready: true, // ... but show the tooltip when ready
                        effect: function(offset) {
                            $(this).slideDown(200); // "this" refers to the tooltip
                            $('#username').click();
                        }
                    },
                    hide: function(event, api) {
                        sign_in_unique = true;
                    }, // Don't specify a hide event either!
                    style: {
                        classes: 'ui-tooltip-shadow ui-tooltip-' + 'red'
                    }
                });

        },
         "mouseleave": function(el) {
            el.qtip('hide').removeData('qtip');
         },
        addProduct : function(item) {
            this.list_products.push(item);
            var aux_price = this.cart_price;
            this.cart_price = aux_price + (item.count * item.price);
            var aux_items = this.cart_items;
            this.cart_items = aux_items + item.count;
        },
        removeProduct : function(item) {
            this.list_products.pop(item);
            var aux_price = this.cart_price;
            this.cart_price = aux_price - (item.count * item.price);
            var aux_items = this.cart_items;
            this.cart_items = aux_items - item.count;
        }


    }

);
