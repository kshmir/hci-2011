// Model Definition.

$.Model("Language", {
        // Static Methods
    getLanguageList : function(params, success, error) {
        params.method = "GetLanguageList";
        $.ajax({
            url: Qck.services.common,
            data: params,
            contentType: "text/xml; charset=utf-8",
            success: function(data) {

                if ($("response", data).attr("status") == "ok") {

                    var language_list = [];
                    $('language', data).each(function(index, item) {
                        language_list.push(new Language(item));
                    });
                    success(language_list);
                }
                else {
                    error($("error", data).attr("code"));
                }
            },
            error: error

        });

    }
 }
,   {
     // Instance methods
     //Constructor
     setup: function(data) {
            this.id = $(data).attr("id");
            this.code=$(data).find("code").text();
            this.name=$(data).find("name").text();

     }
   }
);