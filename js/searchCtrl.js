
function search(search_parent, schema, callback) {
    search_by_data_type(search_parent, schema, 'string', callback);
    search_by_data_type(search_parent, schema, 'number', callback);
    search_by_data_type(search_parent, schema, 'integer', callback);
    
    
}


function search_by_data_type(parent, schema, data_type, callback) {
    var keys = [];
    
    function found_key(key) {
        keys.push(key);
    }
    
    function search_btn_callback() {
        var search;
        var str = search_input.val();
        var key = keys_select.val();  
        var where = {}
        where[key] = str;
        search = {where:where};
        callback(search);     
    }
    
    get_schema_keys(schema, '', data_type, found_key);
    var search_data_type = $("<div class='search_by_data_type'></div>")    
    search_data_type.attr('id', 'search_by_'+data_type);
    var keys_select = $("<select class='search_data_key'></select>");
    keys_select.attr('id', 'search_data_key_'+data_type);
    
    var key_option;
    for (var i=0;i<keys.length;i++) {
        key_option = $("<option></option>");
        key_option.val(keys[i]);
        key_option.text(keys[i]);
        keys_select.append(key_option)
    }
    
    var search_input = $("<input class='search_data_input'></input>");
    search_input.attr('id', 'search_data_input_'+data_type);

    var search_btn = $("<div class='search_data_btn'>Search</div>")
    search_btn.attr('id', 'search_data_btn_'+data_type);
    search_btn.click(search_btn_callback);

    search_data_type.append(keys_select, search_input, search_btn);
    parent.append(search_data_type);
}

