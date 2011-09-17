$(document).ready(function() {
	
	$("form").append("<div class='hola'>HOLA</div>")
	$(".hola").live("click",function() {
		$(this).css("background-color", "white");

	});
	
	$("form").click(function() { 
		$.getJSON("/products/1", undefined, function(a) {
			console.log(a);
		});
	});
	
});