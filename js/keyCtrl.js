function keys(search_parent, schema, data) {
    control_keys(search_parent, schema, data);
}

function control_keys(parent, schema, data) {
    var keys = [];
    
    function found_key(key) {
        if (!key) key = ['<Entire Object>'];
        keys.push(key);
    }
    
 
    function key_change() {
        var edit, show, show_checked, edit_checked;
        var id = $(this).attr('id');
        var id_splits = id.split('.');
        var keys = id_splits.slice(1);
        
        edit = $(this);
        edit_checked = edit.is(":checked"); 
        id_splits[0] = 'show_key'
        id = id_splits.join('\\.');
        id_splits[0] = 'toggle_key'
        id = id_splits.join('\\.');
        var show =  $('#'+id);
        show_selected = show.attr("data-selected");
        show_selected = (show_selected == "1")?1:0; 
        var txt = "key: " + keys.join('.') 
        if (show_checked) txt += " show" 
        if (edit_checked) txt += " edit" 
        alert(txt)
    }
    
    
    
    
    function key_toggle() {
        var id = $(this).attr('id');
        var id_splits = id.split('.');
        var keys = id_splits.slice(1);
        var show_selected = $(this).attr("data-selected");
        show_selected = (show_selected == "1")?0:1; // reverse show
        $(this).attr("data-selected", show_selected?1:0);
        id_splits[0] = 'edit_key'
        id = id_splits.join('\\.');
        var edit =  $('#'+id);
        if (!show_selected) {
            edit.attr("checked", false);
            edit_checked = false;
            edit.hide();
        } else {
            edit_checked = edit.is(":checked");
            edit.show();
        }
        var txt = "key: " + keys.join('.') 
        if (show_selected) txt += " show" 
        if (edit_checked) txt += " edit" 
        alert(txt)
        
    }
    
    function browse(parent, obj, parent_key) {
        for (var key in  obj) {
            var newkey = parent_key + '.' + key;
            select_key_div = $("<div class='select_key_div'></div>");
            select_key_name = $("<span class='select_key_name'></span>");
            select_key_name.text(key);
            select_key_name.attr('id', 'toggle_key.'+newkey);
            select_key_name.click(key_toggle);
            
            select_key_edit = $("<input type='checkbox' class='select_key_cbox select_key_edit'></input>");
            select_key_edit.attr('id', 'edit_key.'+newkey);
            select_key_edit.hide();
            select_key_edit.change(key_change);
            select_key_div.append(select_key_name, select_key_edit)
            parent.append(select_key_div);
            browse(select_key_div, obj[key], newkey);
        }
    }
    
    
    obj = {};
    schemakeys(schema, obj);
    
    get_schema_keys(schema, [], found_key);
    
    var keys_area = $("<div class='keys_area'></div>");
    keys_area.attr('id', 'keys_area');
    var keys_area_title = $("<div class='keys_area_title'></div>");
    keys_area_title.text('select keys');
    keys_area_title.attr('id', 'key_tree');
    var key_tree = $("<div class='select_key'></div>");
    key_tree.attr('id', 'key_tree');
    browse(key_tree, obj, 'base');    
    
    
    var select_key = $("<div class='select_key'></div>");
    select_key.attr('id', 'select_key');
    
    var select_key_div;
    var select_key_name;
    var select_key_show;
    var select_key_edit;
    
    
    for (var i=0;i<keys.length;i++) {
        var key = keys[i];
        select_key_div = $("<div></div>");
        select_key_name = $("<span class='select_key_name'></span>");
        select_key_name.text(key.join('.'));
        select_key_show = $("<input type='checkbox' class='select_key_cbox select_key_show'></input>");
        select_key_show.attr('id', 'show_key.'+key.join('.'));
        select_key_show.change(key_change);
        select_key_edit = $("<input type='checkbox' class='select_key_cbox select_key_edit'></input>");
        select_key_edit.attr('id', 'edit_key.'+key.join('.'));
        select_key_edit.change(key_change);
        select_key_div.append(select_key_name, select_key_show, select_key_edit)
        select_key.append(select_key_div);
    }
    keys_area.append(keys_area_title, key_tree, select_key);
    parent.append(keys_area);
}
