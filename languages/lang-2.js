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
		l_loading: "Cargando, aguarde unos momentos por favor.",
		l_success: "La operación ha sido exitosa.",
		"l_search" : "Buscar",
		"l_language" : "Cambiar idioma: ",
		"b_asc" : "Ordenar Ascendente",
		"b_desc" : "Ordenar Descendente",
		"p_copyright" : "Todos los derechos reservados.",
		"l_cart" : "Carrito",
		"p_noitems": "No hay items en el carrito.",
		"l_loading" : "Procesando",
		"l_newaccount" : "Crear Cuenta",
		"l_search_results" : "Resultados de",
		"l_category" : "Categoría",
		"l_subcategory" : "Subcategoría",
		"l_user_panel" : "Panel de usuario",
		"l_order_list" : "Órdenes",
	},
	template : {
		product_thumb : {
			"l_sales_rank" : "Ranking de ventas"
		},
		paginator : {
			"l_prev" : "Anterior",
			"l_next" : "Siguiente"
		},
		product : {
			"l_category" : "Categoría",
			"l_subcategory" : "Subcategoría",
			"l_name" : "Nombre",
			"l_sales_rank" : "Ranking de Ventas",
			"l_actors" : "Actores",
			"l_format" : "Formato",
			"l_language" : "Idioma",
			"l_subtitles" : "Subtítulos",
			"l_region" : "Region",
			"l_aspect_ratio" : "Proporciones",
			"l_number_discs" : "Número de discos",
			"l_release_date" : "Fecha de lanzamiento",
			"l_run_time" : "DuraciÃ³n",
			"l_ASIN" : "ASIN(Código de identificación Única de Amazon)",
			"l_authors" : "Autores",
			"l_publisher" : "Publicador",
			"l_published_date" : "Fecha de publicación",
			"l_ISBN_10" : "ISBN 10",
			"l_ISBN_13" : "ISBN 13",
			"b_buy" : "Comprar",
			"b_for" : "por",
			"b_back" : "Ir",
			"b_to" : "a"
		},
		signIn : {
			"l_signIn" : "Autenticarse",
			"l_username" : "Usuario",
			"l_password" : "Contraseña",
			"b_login" : "Iniciar Sesión",
			"l_register" : "No estas registrado?",
			"b_register" : "Registrarse"
		},

		userNav : {
			"l_user_data" : "Datos de usuario",
			"l_username" : "Nombre de usuario",
			"l_full_name" : "Nombre completo",
			"l_last_login" : "Último ingreso",
			"b_signout" : "Cerrar sessión",
			p_userpanel: "Panel del usuario"
		},

		cart : {
			"b_subtotal" : "Subtotal",
			"b_checkout" : "Confirmar",
			"b_clear" : "Limpiar",
			"p_loading" : "cargando..."
		},
		register:{
			l_update: "Actualizar cuenta",
			l_register: "Registrar nueva cuenta",
			l_username: "Usuario",
			l_password: "Contraseña",
			l_confirm_password: "Confirmar contraseña",
			l_name: "Nombre",
			l_email: "Email",
			l_date: "Fecha de Nacimiento",
			h_required: "requerido",
			b_submit: "Registrar",
			b_submit_update: "Actualizar",
			b_back: "Atrás"
		},
		address_form:{
			l_title: "Direcciones",
			l_full_name: "Nombre completo",
			l_address_line: "Dirección línea",
			l_zip_code:"Código postal",
			l_phone_number:"Telófono",
			l_country:"País",
			l_state:"Provincia",
			l_city:"Ciudad",
			l_new_name:"Nombre de una nueva dirección",
			b_update: "Actualizar",
			b_delete: "Borrar",
			l_new: "Nueva dirección",
			b_new: "Crear Nueva",
			b_back: "Atrás"
		},
		order_detail:{
		    l_order: "Orden",

		    l_address: "Dirección",
		    l_status: "Estado",
		    l_progress: "Ver progreso",
		    l_products: "Ver productos",
		    l_unconfirmed: "No confirmada",
		    l_status_1: "No confirmada",
		    l_status_2: "Confirmada",
		    l_status_3: "En viaje",
		    l_status_4: "Entregada"

		},
		change_password:{
			l_changepassword: "Cambiar contraseña",
			l_currpassword: "Contraseña actual",
			l_password: "Nueva Contraseña",
			l_confirm_password: "Confirmar contraseña",
			h_required: "requerido",
			b_submit: "Cambiar"
		},
		checkout: {
			l_your_order: "Tu orden",
			b_confirm: "Confirmar orden"
		}
	},
	validator : {
		  required: "Este campo es obligatorio.",
		  remote: "Por favor, rellena esta campo.",
		  email: "Por favor, escribe una dirección de correo válida",
		  url: "Por favor, escribe una URL válida.",
		  date: "Por favor, escribe una fecha válida.",
		  dateISO: "Por favor, escribe una fecha (ISO) válida. (yyyy-mm-dd)",
		  number: "Por favor, escribe un número entero válido.",
		  digits: "Por favor, escribe sólo dígitos.",
		  creditcard: "Por favor, escribe un número de tarjeta válido.",
		  equalTo: "Por favor, escribe el mismo valor de nuevo.",
		  accept: "Por favor, escribe una valor con una extensión aceptada.",
		  maxlength: $.validator.format("Por favor, no escribas más de {0} caracteres."),
		  minlength: $.validator.format("Por favor, no escribas menos de {0} caracteres."),
		  rangelength: $.validator.format("Por favor, escribe un valor entre {0} y {1} caracteres."),
		  range: $.validator.format("Por favor, escribe un valor entre {0} y {1}."),
		  max: $.validator.format("Por favor, escribe un valor igual o menor que {0}."),
		  min: $.validator.format("Por favor, escribe un valor igual o mayor que {0}.")
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