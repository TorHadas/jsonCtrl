
function search(search_parent, schema, callback) {
    search_by_data_type(search_parent, schema, 'string', callback);
    search_by_data_type(search_parent, schema, 'number', callback);
    search_by_data_type(search_parent, schema, 'integer', callback);
    search_for_keys(search_parent, schema, callback);
}

function search_for_keys(parent, schema, callback) {
    var keys = [];
    
    function found_key(key) {
        keys.push(key);
    }
    
    function search_btn_callback() {
        var search;
        var str = search_input.val();
        if (str == '') return;
        
        var key = search_key.val();  
        var where = {};
        key += '.'; 
        key += str;
        search = {exists:key};
        callback(search);     
    }
    
    get_schema_key_containers(schema, '', found_key);
    
    var search_area = $("<div class='search_area'></div>");
    search_area.attr('id', 'search_by_key');
    var search_title = $("<div class='search_title'></div>");
    search_title.text('Search for keys');
    search_title.attr('id', 'search_title_key');
    var search_key = $("<select class='search_key'></select>");
    search_key.attr('id', 'search_key_key');
    
    var key_option;
    for (var i=0;i<keys.length;i++) {
        key_option = $("<option></option>");
        key_option.val(keys[i]);
        key_option.text(keys[i]);
        search_key.append(key_option)
    }
    
    var search_input = $("<input class='search_input'></input>");
    search_input.attr('id', 'search_input_key');

    var search_btn = $("<div class='search_btn'>Search</div>")
    search_btn.attr('id', 'search_btn_key');
    search_btn.click(search_btn_callback);

    search_area.append(search_title, search_key, search_input, search_btn);
    parent.append(search_area);
}


function search_by_data_type(parent, schema, data_type, callback) {
    var keys = [];
    
    function found_key(key) {
        keys.push(key);
    }
    
    function search_btn_callback() {
        var search;
        var str = search_input.val();
        if (str == '') return;
        if (data_type == 'integer') {
            if (parseInt(str, 10).toString() !== str) { // TBD - what is the correct te=st here?
                alert("Ilegal integer");
                return;
            }
        }
        if (data_type == 'number') {
            if (Number(str).toString() !== str) { // TBD - what is the correct te=st here? 
                alert("Ilegal number");
                return;
            }
        }
        
        var key = search_key.val();  
        var where = {}
        where[key] = str;
        search = {where:where};
        callback(search);     
    }
    
    get_schema_keys_by_type(schema, '', data_type, found_key);
    var search_area = $("<div class='search_area'></div>");
    search_area.attr('id', 'search_by_'+data_type);
    
    var search_title = $("<div class='search_title'></div>");
    search_title.text('Search for '+data_type);
    search_title.attr('id', 'search_data_title_'+data_type);
    
    var search_key = $("<select class='search_key'></select>");
    search_key.attr('id', 'search_data_key_'+data_type);
    
    var key_option;
    for (var i=0;i<keys.length;i++) {
        key_option = $("<option></option>");
        key_option.val(keys[i]);
        key_option.text(keys[i]);
        search_key.append(key_option)
    }
    
    var search_input = $("<input class='search_input'></input>");
    search_input.attr('id', 'search_data_input_'+data_type);

    var search_btn = $("<div class='search_btn'>Search</div>")
    search_btn.attr('id', 'search_data_btn_'+data_type);
    search_btn.click(search_btn_callback);

    search_area.append(search_title, search_key, search_input, search_btn);
    parent.append(search_area);
}

