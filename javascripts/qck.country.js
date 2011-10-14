// Model Definition.

$.Model("Country", {
    // Static Methods

    //getCountryList method
    //getCountryList params:
    //language_id : this is a mandatory param
    //this method retrieves a Country List

    getCountryList : function(params, success, error) {
        params.method = "GetCountryList";
        $.ajax({
            url: Qck.services.common,
            data: params,
            contentType: "text/xml; charset=utf-8",
            success: function(data) {

                if ($("response", data).attr("status") == "ok") {

                    var country_list = [];
                    $('country', data).each(function(index, item) {
                        country_list.push(new Country(item));
                    });
                    success(country_list);
                }
                else {
                    error($("error", data).attr("code"));
                }
            },
            error: error

        });

    }
}
        ,


{
// Instance methods

    //Constructor
    setup: function(data) {

        this.country_id = $(data).attr("id");
        this.code = $(data).find("code").text();
        this.name = $(data).find("name").text();

    }
}
        );

