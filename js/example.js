"use strict";

var jdata = {
    "objName": {
        "title": "this is an object",
        "Num1": 24.2,
        "Int1": 22,
		"object2": {
            "latlat": "S",
            "list": [1,2,3,4,5.6],
            "Num2": 34.2,
            "Int2": 32,
			"object3": {
                "objectception": {
                    "string1": "blah",
					"string2": "blah blah",
				    "Num3": 64.2, //"this is where the json does not meet the schema"
                    "Int3": 62, //"this is where the json does not meet the schema"
                    "string23453": "c2n387rc2",
					"NotAString": {
                        "para": "this is where the json does not meet the schema"
                    }
                }
            }
        }
    }
};
var jschema = {
    "type": "object",
    "properties": {
        "objName": {
            "type": "object",
            "properties": {
                "title": {type:"string"},
                "Num1": {type:"number"},
                "Int1": {type:"integer"},
                "object2": {
                    "type": "object", 
                    "properties": {
                        "latlat": {"type": "string"},
                        "Num2": {type:"number"},
                        "Int2": {type:"integer"},
                        "list": {
                            "type": "array",
                            "items": {
                                "type": "number"
                            }
                        },
                        "object3": {
                            "type": "object", 
                            "properties": {
                                "objectception": {
                                    "type": "object", 
                                    "additionalProperties": {"type": "string"}
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

function search_callback(where) {
    alert("searching for: "+JSON.stringify(where))
}




var search = search($('#search'), jschema, search_callback);
var child = build($('#data_title'), 'My Data',  $('#data'), jdata, jschema,{edit:true, show:show_object});
var keys = keys($('#search'), jschema, $('#data'))
child.toggle();

function show_object(valfunc) {
    var val = valfunc();
    var show = $('#show_object');
    var text = JSON.stringify(val, undefined, 4);
  
    show.html(text);
    show.css('display', 'block');
    show.click(function() {show.css('display', 'none');})
}



