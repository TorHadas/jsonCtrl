"use strict";


function append_element(parent, element, children) {
    var _depth = 0;
    var div = $('<div class="hidden_object">[object]</div>');

    function toggle_recursivly(depth) {
        var ret = false;
        
        for (var i=0; i<children.length;i++) {
                ret |= children[i].toggle(depth);    
            }
        return ret;
    }
    
    function toggle_element_depth(depth) {
        if (depth>=0) {
            element.css("display", "block");
            div.css("display", "none"); 
            if (!depth) return true;
            // positive depth - send to children
            return toggle_recursivly(depth-1);
        }
        switch(depth) {        
            case -1: // hide all
                element.css("display", "none");
                div.css("display", "block");
                return toggle_recursivly(depth);
            case -2: // show all
            case -3: // edit all
                element.css("display", "block");
                div.css("display", "none"); 
                return toggle_recursivly(depth);
        }
    }
    
    function toggle_element(depth) {
        if ('[object Number]' == Object.prototype.toString.call(depth)) {
            // One of my ancestors is being toggled
            _depth = depth;
            if (_depth == -1) _depth = 0;
            return toggle_element_depth(depth);
        } else { 
            // I am being toggled
            if (_depth >= 0) {
                if (toggle_element_depth(_depth)) {
                    _depth++;
                } else {
                    toggle_element_depth(-3);
                    _depth = -3;
                }
            } else  {
                toggle_element_depth(-1);
                _depth = 0;
            } 
        }
    }
    //div.click(toggle_element);
    parent.append(div);    
    element.css("display", "none");
    parent.append(element);
    //e.colResizable();
    return toggle_element;   
}

//shows text input feild but when pressed disappears
function append_detail(parent, detail) {
    var _depth = 0;
    
    function get_detail_val(){
        return detail.val()    
    }
    
    function toggle_detail(depth) {
        if ('[object Number]' == Object.prototype.toString.call(depth)) {
            _depth = depth;
        } else {
            // I am being toggled
            if (_depth == -3) _depth = 0;
            else _depth = -3;    
        }
        if (_depth == -3) {
            detail.removeAttr('disabled');
        } else {
            detail.attr('disabled', 'disabled');
        }
        return false;
    }
    detail.attr('disabled', 'disabled');
    parent.append(detail);    
    return {toggle: toggle_detail, val:get_detail_val};   
}

function append_additionalProperty(tr_1, td_1, tr_2, td_2) {
    function toggle(depth) {
        if (depth == -3) {
            td_1.css('display', 'block'); 
            td_2.css('display', 'block'); 
        } else {
            td_1.css('display', 'none'); 
            td_2.css('display', 'none'); 
        }
        return false;        
    }        
    td_1.css('display', 'none');    
    td_2.css('display', 'none');    
    tr_1.append(td_1);
    tr_2.append(td_2);

    return toggle;    
}

function buildObject(parent, obj, schema, options) {
    var tr_1, tr_2, td_1, td_2, toggle;
    var child_schema;
    var properties = [];
    var children = [];
    var child;
    var tbl = $('<table></table>');
    
    function get_obj_val() {
        var results = {};
        for (var i=0; i<children.length; i++) {
            if (children[i].hasOwnProperty('val'))
                results[children[i].key] = children[i].val();    
        }
        return results;
    }
    
    function add_element(last_1, last_2) {
        var childk;
        var input  = $('<input  class="detail_in" type="text" placeholder="key"/>');
        td_1 = $('<td class="key"></td>');
        td_2 = $('<td class="val"></td>');
        td_1.addClass('schema_property');
        td_1.append(input);
        last_1.before(td_1);
        last_2.before(td_2);
        options.parent = 'object';
        child = build(td_1, undefined, td_2, empty_obj(child_schema), child_schema, options); 
        child.toggle(-3);
        children.push(child);
    }
    
    if (Object.prototype.toString.call(obj) != '[object Object]') {
        return buildError(parent, obj, schema);
    }

    tbl.addClass('table_object');
    tr_1 = $('<tr></tr>');
    tr_2 = $('<tr></tr>');
    tbl.append(tr_1, tr_2);
    for (var key in obj) {
        if (options.hide_keys.indexOf(key) > -1) continue;
        td_1 = $('<td class="key"></td>');
        td_2 = $('<td class="val"></td>');
        tr_1.append(td_1);
        tr_2.append(td_2);
        if (schema && schema.hasOwnProperty('properties') && schema.properties.hasOwnProperty(key)) {
            properties.push(key); 
            td_1.addClass('schema_property');
            child_schema = schema.properties[key];
        } else {
            if (schema && schema.hasOwnProperty('additionalProperties') && schema.additionalProperties) {
                td_1.addClass('schema_additionalProperty');
                child_schema = schema.additionalProperties;
            } else {
                td_1.addClass('schema_none');
                child_schema = undefined;
            }
        }
        options.parent = 'object';
        child = build(td_1, key, td_2, obj[key], child_schema, options);
        children.push(child);
    }
    for (var key in schema.properties) {
        if ((options.hide_keys.indexOf(key) > -1) || (properties.indexOf(key)  > -1)) continue; 
        td_1 = $('<td class="key"></td>');
        td_2 = $('<td class="val"></td>');
        tr_1.append(td_1);
        tr_2.append(td_2);
        td_1.addClass('schema_missing');
        child_schema = schema.properties[key];
        options.parent = 'object';
        child = build(td_1, key, td_2, empty_obj(child_schema), child_schema, options); 
        children.push(child);
    }
    if (options.edit && schema.hasOwnProperty('additionalProperties') && schema.additionalProperties) {
        child_schema = schema.additionalProperties;        
        td_1 = $('<td  colspan="2" class="add_to_object">+</td>');
        td_2 = $('<td  colspan="2" class=""></td>');
        td_1.click(function() {add_element(td_1, td_2);})
        child = {}
        child['toggle'] = append_additionalProperty(tr_1, td_1, tr_2, td_2);
        children.push(child);
    }

    //parent.append(tbl);
    return {toggle: append_element(parent,tbl, children), val: get_obj_val};
}

function buildArray(parent, arr, schema, options) {
    function get_arr_val() {
        var results = [];
        for (var i=0; i<children.length; i++) {
            if (children[i].hasOwnProperty('val')) 
                results.push(children[i].val());    
        }
        return results;
    }

    function get_keys() {
        var keys = ''
        if (schema_keys) {
            for (var j=0; j<schema_keys.length;j++) {
                if (keys.length>0) keys += '.';
                keys += element[schema_keys[j]];
            }
        } else {
            keys = i.toString();
        }
        return keys;
    }
    
    function add_element(last) {
        var child;
        td_1 = $('<td class="key"></td>');
        td_2 = $('<td class="val"></td>');
        tr_1 = $("<tr></tr>");
        tr_1.append(td_1, td_2);
        td_1.addClass('schema_property');
        last.before(tr_1);
        options.parent = 'array';
        child = build(td_1, '', td_2, empty_obj(child_schema), child_schema, options); 
        child.toggle(-3);
        children.push(child);
    }
    
    var key, element, i;
    var tr_1, tr_2, td_1, td_2;
    var child_schema, toggle;
    var child_schema = undefined;
    var schema_keys = undefined;
    var tbl = $('<table></table>');
    var header = '';
    var children = [];
    var child;
    
    if (Object.prototype.toString.call(arr) != '[object Array]') {
        return buildError(parent, arr, schema);
    }
    
    tbl.addClass('table_array');
            
    if (schema && schema.hasOwnProperty('items')) {
        child_schema = schema.items;    
        if (child_schema.hasOwnProperty('keys')) {
            schema_keys = child_schema.keys;    
        }
    }
    td_1 = $('<td class="header"></td>');
    td_2 = $('<td class="header"></td>');
    if (schema_keys) {
        for (i=0;i<schema_keys.length;i++) {
            if (header.length>0) header += '.';
            header = schema_keys[i];    
        }
    } else {
        header = '#';
    }
        
    td_1.text(header)
    td_2.text('attributes')
    tr_1 = $('<tr></tr>');
    tr_1.append(td_1, td_2);
    tbl.append(tr_1);
    for (i=0;i<arr.length;i++) {            
        td_1 = $('<td class="key"></td>');
        td_2 = $('<td class="val"></td>');
        tr_1 = $("<tr></tr>");
        tr_1.append(td_1, td_2);
        tbl.append(tr_1);
        element = arr[i];
        key = get_keys(element);
        if (schema && schema.hasOwnProperty('items')) {
            td_1.addClass('schema_property');
            child_schema = schema.items;
        } else {
            td_1.addClass('schema_none');
            child_schema = undefined;
        }
        options.parent = 'array';
        child = build(td_1, key, td_2, element, child_schema, options);
        children.push(child);
    }    
    if (options.edit && child_schema) {
        tr_1 = $("<tr></tr>");
        td_1 = $('<td  colspan="2" class="add_to_array">+</td>');
        tr_1.append(td_1);
        tbl.append(tr_1);
        td_1.click(function() {add_element(tr_1);})
    }
    return {toggle: append_element(parent,tbl, children), val: get_arr_val};
}

function buildEnum(parent, enum_val, schema, options) {
    var enums = schema.enum; 
    if (Object.prototype.toString.call(enum_val) != '[object String]') {
        return buildError(parent, enum_val, schema);
    }  
    
    var select = $('<select class="enum_out"></select>');
    for (var i=0; i<enums.length; i++) {
        var option = $('<option></option>');
        option.text(enums[i]);
        option.val(enums[i]);
        select.append(option);
    }
    select.val(enum_val);
    return append_detail(parent, select);
}

function buildString(parent, str, schema, options) {
    var input;
    
    if (Object.prototype.toString.call(str) != '[object String]') {
        return buildError(parent, str, schema);
    }
    input  = $('<input  class="detail_in" type="text" placeholder="[string]"/>');
    input.val(str);
    return append_detail(parent,input);
}

function buildNumber(parent, num, schema, options) {
    var input;
    if (Object.prototype.toString.call(num) != '[object Number]') {
        return buildError(parent, num, schema);
    }
    input  = $('<input  class="detail_in" type="number" step="0.1" placeholder="[number]"/>');
    input.val(num);
    return append_detail(parent,input);
}


function buildInteger(parent, num, schema, options) {
    var input;
    if (Object.prototype.toString.call(num) != '[object Number]') {
        return buildError(parent, num, schema);
    }
    input  = $('<input  class="detail_in" type="number" step="0.1 placeholder="[integer]""/>');
    input.val(num);
    return append_detail(parent,input);
}

function buildUnknown(parent, item) {
    var div = $('<div class="hidden_object">[Unknown]</div>');
    parent.append(div);    
    return {toggle: function () {}};
}

function buildError(parent, item) {
    var div = $('<div class="hidden_object">[Wrong Data]</div>');
    parent.append(div);
    return {toggle: function () {}};
}

function build(key_parent, key, item_parent, item, schema, prev_options) {
    
    var schema_type = undefined;
    var edit_toggle = undefined;
    var options = {edit:false, depth:0, hide_keys:[], path:'', parent:''}
    var toggle = function (){ return 0;};
    
    var ret_child = {toggle:toggle, key:key};
    var child, child_edit = false;
    
    if (prev_options) {
        if (prev_options.hasOwnProperty('edit')) {  
            options.edit = prev_options.edit;
        }
        if (prev_options.hasOwnProperty('show')) {  
            options.show = prev_options.show;
        }
        if (prev_options.hasOwnProperty('depth')) {  
            options.depth = 1 + prev_options.depth;
            if (options.depth > 30) return toggle;
        }
        if (prev_options.hasOwnProperty('parent')) {
            if (key && prev_options.parent == 'object') {
                if (prev_options.hasOwnProperty('path') && prev_options.path.length>0) {  
                    options.path = prev_options.path+'.'+key;
                } else {
                    options.path = key;    
                }                
            }
            
        }
        
    }
    
    if (schema) {
        if (schema.lang) {
           options.lang = schema.lang;
        }
        if (schema.hasOwnProperty('keys')) {
            options.hide_keys = schema.keys;    
        }
    }
    //if (prev_properties.hasOwnProperty('lang') && (prev_properties.lang.indexOf(key) > -1)) {
    //    schema = {type:"object", additionalProperties:schema}    
    //}
    if (key) {
        key_parent.text(key+': ');
        key_parent.prop('title', options.path);
    }
    if (schema && schema.hasOwnProperty('type'))  schema_type = schema.type;
    if (schema && schema.hasOwnProperty('enum'))  schema_type = 'enum';
    switch (schema_type) {
        case 'string':
            child_edit = buildString(item_parent, item, schema, options);
            break;
        case 'integer':
            child_edit = buildInteger(item_parent, item, schema, options);
            break;
        case 'number':
            child_edit = buildNumber(item_parent, item, schema, options);
            break;
        case 'enum':
            child_edit = buildEnum(item_parent, item, schema, options);
            break;
        case 'array':
            child = buildArray(item_parent, item, schema, options);
            break;
        case 'object':
            child = buildObject(item_parent, item, schema, options);
            break;
        default:
            child = buildUnknown(item_parent, item);
    }
    if(child_edit) {
        if (options.edit) {
            ret_child.toggle = child_edit.toggle;
        }
        if (child_edit.hasOwnProperty('val'))
            ret_child.val = child_edit.val;
    } else {
        if (child.hasOwnProperty('val'))
            ret_child.val = child.val;
        ret_child.toggle = child.toggle;
    }
    if (key && ret_child.toggle) key_parent.click(ret_child.toggle);
    if (options.hasOwnProperty('show') && ret_child.val) { 
        key_parent.dblclick(function () {options.show(ret_child.val);});
    }
    return ret_child;
}



function empty_obj(schema) {
    var schema_type = undefined;
    var obj;
    if (schema && schema.hasOwnProperty('type'))  schema_type = schema.type;
    if (schema && schema.hasOwnProperty('enum'))  schema_type = 'enum';
    switch (schema_type) {
        case 'string':
            obj = '';
            break;
        case 'integer':
            obj = 0;
            break;
        case 'number':
            obj = 0.0;
            break;
        case 'enum':
            obj = schema.enum[0];
            break;
        case 'array':
            obj = [];
            obj.push(empty_obj(schema.items));
            break;
        case 'object':
            obj = {};
            for (var key in schema.properties) {
                obj[key] =  empty_obj(schema.properties[key]);
            }
            if (schema.hasOwnProperty('additionalProperties')) {
                obj[''] =  empty_obj(schema.additionalProperties);
            }
            break;
    }
    return obj;
}
