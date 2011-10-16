// Model Definition.

$.Model("Language", {
        // Static Methods
    init: function(){},
    getLanguageList : function(params, success, error) {

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