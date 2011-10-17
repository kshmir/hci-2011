/**
 * Created by JetBrains RubyMine.
 * User: maximo
 * Date: 10/15/11
 * Time: 4:38 PM
 * To change this template use File | Settings | File Templates.
 */
/**
 * Created by JetBrains RubyMine.
 * User: EzeOrtiz
 * Date: 10/16/11
 * Time: 3:34 AM
 * To change this template use File | Settings | File Templates.
 */
{
	id : "1",
	code : "en",
	web : {
		"l_loading1": "Please wait a moment, loading.",
		"l_success": "The operation  had ended successfully.",
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
			"l_sign_in" : "Sign In",
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
			"p_userpanel": "User Panel"
		},

		cart : {
			"b_subtotal" : "Subtotal",
			"b_checkout" : "Check Out",
			"b_clear" : "Clear",
			"p_loading" : "loading..."
		},
		register:{
			"l_update": "Update User info",
			"l_register": "Create a new account",
			"l_username": "User",
			"l_password": "Password",
			"l_confirm_password": "Confirm Password",
			"l_name": "Name",
			"l_email": "Email",
			"l_date": "Date of birth",
			"h_required": "required",
			"b_submit": "Submit",
			"b_submit_update": "Update",
			"b_back": "Back"
		},
		address_form:{
			"l_title": "Addresses",
			"l_full_name": "Full name",
			"l_address_line": "line Address",
			"l_zip_code":"Zip Code",
			"l_phone_number":"Phone number",
			"l_country":"Country",
			"l_state":"State",
			"l_city":"City",
			"l_new_name":"New address name",
			"b_update": "Update",
			"b_delete": "Clear",
			"l_new": "New Address",
			"b_new": "New",
			"b_back": "Back"
		},
		order_detail:{
		    "l_order": "Order",
            "l_address": "Address",
		    "l_status": "Status",
		    "l_progress": "progress",
		    "l_products": "products",
		    "l_unconfirmed": "Unconfirmed",
		    "l_status_1": "Unconfirmed",
		    "l_status_2": "Confirmed",
		    "l_status_3": "On the go",
		    "l_status_4": "Delivered"

		},
		change_password:{
			"l_changepassword": "Change Password",
			"l_currpassword": "Current Password",
			"l_password": "New Password",
			"l_confirm_password": "Confirm Password",
			"h_required": "required",
			"b_submit": "Submit"
		},
		checkout: {
			"l_your_order": "Your order",
			"b_confirm": "Confirm Order"
		}
	},
	validator : {
		  "required": "This is a mandatory field.",
		  "remote": "Please fill this field.",
		  "email": "Please, insert a valid email address",
		  "url": "Please, insert a valid URL.",
		  "date": "Please, insert a valid date.",
		  "dateISO": "Please, date must be in (ISO) format. (yyyy-mm-dd)",
		  "number": "Please, insert a valid integer number.",
		  "digits": "Please, insert only digits.",
		  "creditcard": "Please, isert a valid Credit Card ID number.",
		  "equalTo": "Please, repeat the same value.",
		  "accept": "Please, insert a valid extention value.",
		  "maxlength": $.validator.format("Please, do not insert more than {0} characters."),
		  "minlength": $.validator.format("Please, do not insert less than {0} characters ."),
		  "rangelength": $.validator.format("Please, insert a value between {0} and {1} characters."),
		  "range": $.validator.format("Please, insert a value between {0} and {1}."),
		  "max": $.validator.format("Please, insert a value minor or equal than {0}."),
		  "min": $.validator.format("Please, insert a value grater o equal than {0}.")
	},
	error : {
		"1" : "The method this application requires has not been provide.",
		"2" : "The language identifier this application requires has not been provide.",
		"3" : "The country identifier this application requires has not been provide.",
		"4" : "The user identifier this application requires has not been provide.",
		"5" : "The password this application requires has not been provide.",
		"6" : "The authentication token this application requires has not been provide.",
		"7" : "The user account information this application requires has not been provide.",
		"8" : "The new password this application requires has not been provide.",
		"9" : "The category identifier this application requires has not been provide.",
		"10" : "The subcategory identifier this application requires has not been provide.",
		"11" : "The search criteria this application requires has not been provide.",
		"12" : "The product identifier this application requires has not been provide.",
		"13" : "The order identifier this application requires has not been provide.",
		"14" : "The address identifier this application requires has not been provide.",
		"15" : "The item information this application requires has not been provide.",
		"16" : "The address information this application requires has not been provide.",
		"17" : "The storage value this application requires has not been provide.",
		"101" : "The submit provided method this application requires is invalid.",
		"102" : "The Language identifier is invalid.",
		"103" : "The country identifier is invalid.",
		"104" : "The user is invalid.",
		"105" : "The authentication token is invalid.",
		"106" : "",
		"107" : "The username is invalid (it must have between 1 and 15 characters).",
		"108" : "The password is invalid (it must have between 8 and 15 characters).",
		"109" : "The name is invalid (it must have between 1 and 80 characters).",
		"110" : "The email is invalid (it must have between 1 and 128 characters).",
		"111" : "The date of birth is invalid.",
		"112" : "The submitted category identifier is invalid.",
		"113" : "The submitted subcategory identifier is invalid.",
		"114" : "The submitted product identifier is invalid.",
		"115" : "The submitted order identifier is invalid.",
		"116" : "The operation request is invalid for that order status.",
		"117" : "The submitted address identifier is invalid.",
		"118" : "The submitted reference name is invalid (it must have between 1 and 80 characters).",
		"119" : "The submitted first address is invalid (it must have between 1 and 80 characters).",
		"120" : "The submitted second address is invalid (it must have between 1 and 80 characters).",
		"121" : "The submitted status identifier is invalid.",
		"122" : "The submitted city is invalid (it must have between 1 and 80 characters).",
		"123" : "The submitted zip code is invalid (it must have between 1 and 8 characters).",
		"124" : "The submitted telephone number is invalid (it must have between 1 and 25 characters).",
		"125" : "",
		"201" : "The username already exists.",
		"202" : "The address already exists.",
		"999" : "Un error occurs while processing your application."
	}
};