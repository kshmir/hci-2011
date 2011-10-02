// Model Definition.

$.Model("Language", {
        // Static Methods

        //getLanguageList method
        //getLanguageList params: this method does not receive any parameter
        //this method retrieves an Language List

        getLanguageList : function(params, success, error) {
            params.method = "GetLanguageList";
            $.ajax({
                            url: Qck.common.order,
                            data: params,
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

                        } );

            }
 }
,


    {
// Instance methods

     //Constructor
     setup: function(data) {

            this.language_id = $(data).find("language").attr("id");
            this.code = $(data).find("code").text();
            this.name = $(data).find("name").text();

     }
   }
);

