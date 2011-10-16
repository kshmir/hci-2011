/**
 * Created by JetBrains RubyMine.
 * User: maximo
 * Date: 10/15/11
 * Time: 4:38 PM
 * To change this template use File | Settings | File Templates.
 */
/**
 * Created by JetBrains RubyMine.
 * User: maximo
 * Date: 10/15/11
 * Time: 4:38 PM
 * To change this template use File | Settings | File Templates.
 */
                              var locale = {
	id : "2",
	code : "es",
	web : {
		l_loading: "Please wait a moment, loading.",
		l_success: "The operation  had ended successfully.",
		"l_search" : "Search",
		"l_language" : "Change language: ",
		"b_asc" : "Ascending order.",
		"b_desc" : "Descending order.",
		"p_copyright" : "All rights reserved.",
		"l_cart" : "Cart",
		"p_noitems": "The cart has no items.",
		"l_loading" : "Processing",
		"l_newaccount" : "Create Account",
		"l_search_results" : "Results for",
		"l_category" : "Categories",
		"l_subcategory" : "Subcategories",
		"l_user_panel" : "User panel",
		"l_order_list" : "Orders",
	},
	template : {
		product_thumb : {
			"l_sales_rank" : "Sales Rank"
		},
		paginator : {
			"l_prev" : "Previous",
			"l_next" : "Next"
		},
		product : {
			"l_category" : "Category",
			"l_subcategory" : "Subcategory",
			"l_name" : "Name",
			"l_sales_rank" : "Sales Rank",
			"l_actors" : "Actors",
			"l_format" : "Format",
			"l_language" : "Language",
			"l_subtitles" : "Subtitles",
			"l_region" : "Region",
			"l_aspect_ratio" : "Aspect Ratio",
			"l_number_discs" : "Number of discs",
			"l_release_date" : "Release Date",
			"l_run_time" : "Run time",
			"l_ASIN" : "ASIN(Amazon Single Identification Number)",
			"l_authors" : "Authors",
			"l_publisher" : "Publisher",
			"l_published_date" : "Published date",
			"l_ISBN_10" : "ISBN 10",
			"l_ISBN_13" : "ISBN 13",
			"b_buy" : "Buy",
			"b_for" : "For",
			"b_back" : "Go",
			"b_to" : "to"
		},
		signIn : {
			"l_signIn" : "Sign In",
			"l_username" : "User",
			"l_password" : "Password",
			"b_login" : "Log In",
			"l_register" : "New Customer?",
			"b_register" : "Register"
		},

		userNav : {
			"l_user_data" : "User Info",
			"l_username" : "Username",
			"l_full_name" : "User First Name",
			"l_last_login" : "User Last Name",
			"b_signout" : "Sing Out",
			p_userpanel: "User Panel"
		},

		cart : {
			"b_subtotal" : "Subtotal",
			"b_checkout" : "Check Out",
			"b_clear" : "Clear",
			"p_loading" : "loading..."
		},
		register:{
			l_update: "Update User info",
			l_register: "Create a new account",
			l_username: "User",
			l_password: "Password",
			l_confirm_password: "Confirm Password",
			l_name: "Name",
			l_email: "Email",
			l_date: "Date of birth",
			h_required: "required",
			b_submit: "Submit",
			b_submit_update: "Update",
			b_back: "Back"
		},
		address_form:{
			l_title: "Addresses",
			l_full_name: "Full name",
			l_address_line: "line Address",
			l_zip_code:"Zip Code",
			l_phone_number:"Phone number",
			l_country:"Country",
			l_state:"State",
			l_city:"City",
			l_new_name:"New address name",
			b_update: "Update",
			b_delete: "Clear",
			l_new: "New Address",
			b_new: "New",
			b_back: "Back"
		},
		order_detail:{
		    l_order: "Order",

		    l_address: "Address",
		    l_status: "Status",
		    l_progress: "progress",
		    l_products: "products",
		    l_unconfirmed: "Unconfirmed",
		    l_status_1: "Unconfirmed",
		    l_status_2: "Confirmed",
		    l_status_3: "On the go",
		    l_status_4: "Delivered"

		},
		change_password:{
			l_changepassword: "Change Password",
			l_currpassword: "Current Password",
			l_password: "New Password",
			l_confirm_password: "Confirm Password",
			h_required: "required",
			b_submit: "Submit"
		},
		checkout: {
			l_your_order: "Your order",
			b_confirm: "Confirm Order"
		}
	},
	validator : {
		  required: "This is a mandatory field.",
		  remote: "Please fill this field.",
		  email: "Please, insert a valid email address",
		  url: "Please, insert a valid URL.",
		  date: "Please, insert a valid date.",
		  dateISO: "Please, date must be in (ISO) format. (yyyy-mm-dd)",
		  number: "Please, insert a valid integer number.",
		  digits: "Please, insert only digits.",
		  creditcard: "Please, isert a valid Credit Card ID number.",
		  equalTo: "Please, repeat the same value.",
		  accept: "Please, insert a valid extention value.",
		  maxlength: $.validator.format("Please, do not insert more than {0} characters."),
		  minlength: $.validator.format("Please, do not insert less than {0} characters ."),
		  rangelength: $.validator.format("Please, insert a value between {0} and {1} characters."),
		  range: $.validator.format("Please, insert a value between {0} and {1}."),
		  max: $.validator.format("Please, insert a value minor or equal than {0}."),
		  min: $.validator.format("Please, insert a value grater o equal than {0}.")
	},
	error : {
		"1" : "La solicitud requiere de un mÃ©todo el cual no fue provisto.",
		"2" : "La solicitud requiere de un identificador de lenguaje el cual no fue provisto.",
		"3" : "La solicitud requiere de un identificador de paÃ­s el cual no fue provisto.",
		"4" : "La solicitud requiere de usuario el cual no fue provisto.",
		"5" : "La solicitud requiere la contraseÃ±a la cual no fue provista.",
		"6" : "La solicitud requiere el token de autenticaciÃ³n el cual no fue provisto.",
		"7" : "La solicitud requiere la informaciÃ³n de la cuenta de usuario la cual no fue provista.",
		"8" : "La solicitud requiere la nueva contraseÃ±a la cual no fue provista.",
		"9" : "La solicitud requiere de un identificador de categorÃ­a el cual no fue provisto.",
		"10" : "La solicitud requiere de un identificador de sub-categorÃ­a el cual no fue provisto.",
		"11" : "La solicitud requiere de un criterio de bÃºsqueda el cual no fue provisto.",
		"12" : "La solicitud requiere de un identificador de producto el cual no fue provisto.",
		"13" : "La solicitud requiere de un identificador de orden el cual no fue provisto.",
		"14" : "La solicitud requiere de un identificador de direcciÃ³n el cual no fue provisto.",
		"15" : "La solicitud requiere la informaciÃ³n del Ã­tem el cual no fue provisto.",
		"16" : "La solicitud requiere la informaciÃ³n de la direcciÃ³n la cual no fue provista.",
		"17" : "La solicitud requiere de un valor a almacenar que no fue provisto.",
		"101" : "El mÃ©todo solicitado suministrado es invÃ¡lido.",
		"102" : "El identificador de lenguaje suministrado es invÃ¡lido.",
		"103" : "El identificador de paÃ­s suministrado es invÃ¡lido.",
		"104" : "El usuario es invÃ¡lido.",
		"105" : "El token de autenticaciÃ³n es invÃ¡lido.",
		"106" : "",
		"107" : "El nombre de usuario es invÃ¡lido (longitud mÃ­nima 1 y mÃ¡xima 15 caracteres).",
		"108" : "La contraseÃ±a es invÃ¡lida (longitud mÃ­nima 8 y mÃ¡xima 15 caracteres).",
		"109" : "El nombre es invÃ¡lido (longitud mÃ­nima 1 y mÃ¡xima 80 caracteres).",
		"110" : "La direcciÃ³n de email es invÃ¡lida (longitud mÃ­nima 1 y mÃ¡xima 128 caracteres).",
		"111" : "La fecha de nacimiento es invÃ¡lida.",
		"112" : "El identificador de categorÃ­a suministrado es invÃ¡lido.",
		"113" : "El identificador de sub-categorÃ­a suministrado es invÃ¡lido.",
		"114" : "El identificador de producto suministrado es invÃ¡lido.",
		"115" : "El identificador de orden suministrado es invÃ¡lido.",
		"116" : "La operaciÃ³n solicitada es invÃ¡lida para el estado de la orden.",
		"117" : "El identificador de la direcciÃ³n suministrado es invÃ¡lido.",
		"118" : "El nombre de referencia suministrado es invÃ¡lido (longitud mÃ­nima 1 y mÃ¡xima 80 caracteres).",
		"119" : "La direcciÃ³n principal suministrada es invÃ¡lida (longitud mÃ­nima 1 y mÃ¡xima 80 caracteres).",
		"120" : "La direcciÃ³n secundaria suministrada es invÃ¡lida (longitud mÃ­nima 1 y mÃ¡xima 80 caracteres).",
		"121" : "El identificador de estado suministrado es invÃ¡lido.",
		"122" : "La ciudad suministrada es invÃ¡lida (longitud mÃ­nima 1 y mÃ¡xima 80 caracteres).",
		"123" : "El cÃ³digo postal suministrado es invÃ¡lido (longitud mÃ­nima 1 y mÃ¡xima 8 caracteres).",
		"124" : "El nÃºmero de telÃ©fono suministrado es invÃ¡lido (longitud mÃ­nima 1 y mÃ¡xima 25 caracteres).",
		"125" : "",
		"201" : "El nombre de usuario ya se encuentra en uso.",
		"202" : "La direcciÃ³n ya se encuentra en uso.",
		"999" : "Se produjo un error inesperado procesando la solicitud."
	}
};