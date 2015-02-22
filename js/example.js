"use strict";

var jdata = {
    "objName": {
        "title": "this is an object",
        "_id": "234ret56det64",
        "object2": {
            "title": "S",
            "list": [1, 2, 3, 4, 5.6],
            "myEnum": "option3",
            "object3": {
                "objectception": {
                    "string1": "blah",
                    "string2": "blah blah",
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
                "title": {
                    type: "string"
                },
                "object2": {
                    "type": "object",
                    "properties": {
                        "title": {
                            "type": "string"
                        },
                        "list": {
                            "type": "array",
                            "items": {
                                "type": "number"
                            }
                        },
                        "myEnum": {
                            "enum": ["option1", "option2", "option3", "option4", "LOL"]
                        },
                        "object3": {
                            "type": "object",
                            "properties": {
                                "objectception": {
                                    "type": "object",
                                    "additionalProperties": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
var child = build($('#data_title'), 'My Data', $('#data'), jdata, jschema, {
    edit: true,
    show: show_object
});
child.toggle();

function show_object(valfunc) {
    var val = valfunc();
    var show = $('#show_object');
    var text = JSON.stringify(val, undefined, 4);

    show.html(text);
    show.css('display', 'block');
    show.click(function() {
        show.css('display', 'none');
    })
}
