// Model Definition.

$.Model("State", {
    // Static Methods

    //getStateList method
    //getStateList params:
    //language_id: this is a mandatory param
    //country_id: this is a mandatory param
    //this method retrieves a State List

    getStateList : function(params, success, error) {
        params.method = "GetStateList";
        $.ajax({
            contentType: "text/xml; charset=utf-8",
            url: Qck.services.common,
            data: params,
            success: function(data) {

                if ($("response", data).attr("status") == "ok") {

                    var state_list = [];
                    $('state', data).each(function(index, item) {
                        state_list.push(new State(item));
                    });
                    success(state_list);
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

        this.state_id = $(data).attr("id");
        this.country_id = $(data).find("country_id").text();
        this.code = $(data).find("code").text();
        this.name = $(data).find("name").text();

    }
}
        );

