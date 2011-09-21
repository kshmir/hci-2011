 var total_items = 0;
 var total_price = 0;
 $(document).ready(function() {

     $(".product_item").draggable({
         revert: true            
     });
     $("#cart_items").draggable({
         axis: "x"
     });

     $("#cart_items").droppable({
         accept: ".product_item",
         activeClass: "drop-active",
         hoverClass: "drop-hover",
         drop: function(event, ui) {
             var item = ui.draggable.html();
             var itemid = ui.draggable.attr("id");
             var html = '<div class="item icart">';
             html = html + '<div class="divrm">';
             html = html + '<a onclick="remove(this)" class="remove '+itemid+'">&times;</a>';
             html = html + '<div/>'+item+'</div>';
             $("#cart_items").append(html);

             // update total items
             total_items++;
             $("#citem").html(total_items);

             // update total price
             var price = parseInt(ui.draggable.find(".price").html().replace("$ ", ""));
             total_price = total_price + price;
             $("#cprice").html("$ " + total_price);

             // expand cart items
             if (total_items > 4) {
                 $("#cart_items").animate({width: "+=120"}, 'slow');
             }
         }
     });
    

     $("#btn_next").click(function() {
         $("#cart_items").animate({left: "-=100"}, 100);
         return false;
     });
     $("#btn_prev").click(function() {
         $("#cart_items").animate({left: "+=100"}, 100);
         return false;
     });
     $("#btn_clear").click(function() {
         $("#cart_items").fadeOut("2000", function() {
            $(this).html("").fadeIn("fast").css({left: 0});
         });
         $("#citem").html("0");
         $("#cprice").html("$ 0");
         total_items = 0;
         total_price = 0;
         return false;
     });
 });
 function remove(el) {
     $(el).hide();
     $(el).parent().parent().effect("highlight", {color: "#ff0000"}, 1000);
     $(el).parent().parent().fadeOut('1000');
     setTimeout(function() {
         $(el).parent().parent().remove();
         // collapse cart items
         if (total_items > 3) {
             $("#cart_items").animate({width: "-=120"}, 'slow');
         }
     }, 1100);

     // update total item
     total_items--;
     $("#citem").html(total_items);

     // update totl price
     var price = parseInt($(el).parent().parent().find(".price").html().replace("$ ", ""));
     total_price = total_price - price;
     $("#cprice").html("$ " + total_price);
 }