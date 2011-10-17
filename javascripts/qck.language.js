// Model Definition.

$.Model("Language", {
    // Static Methods
    init: function() {
        this.language_list = $.jStorage.get('language_list');
    },
    getLanguageList : function(params, success, error) {
        var self = this;
        if (!$.jStorage.get('language_list')) {
            if (!params) {
                params = {};
            }
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
                        $.jStorage.set('language_list', language_list);
                        self.language_list = language_list;
                        success(language_list);
                    }
                    else {
                        if (error) {
                            error($("error", data).attr("code"));
                        }
                    }
                },
                error: error
            });
        } else {
            success(self.language_list);
        }
    }
}
        , {
    // Instance methods
    //Constructor
    setup: function(data) {
        this.id = $(data).attr("id");
        this.code = $(data).find("code").text();
        this.name = $(data).find("name").text();

    }
}
        );