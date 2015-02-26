
function  get_schema_keys_by_type(schema, key, key_type, callback) {
    var schema_type = undefined;
    if (schema.hasOwnProperty('type'))  schema_type = schema.type;
    if (schema.hasOwnProperty('enum'))  schema_type = 'enum';
    if (schema_type == key_type) callback(key);
    if (schema_type == 'object') {
        if (schema.hasOwnProperty('properties')) {
            for (var k in schema.properties) {
                var newkey = key;
                if (newkey) newkey += '.';
                newkey += k;
                get_schema_keys_by_type(schema.properties[k], newkey, key_type, callback);    
            }
        }
    }
}

function get_schema_key_containers(schema, key, callback) {
    var schema_type = undefined;
    if (schema.hasOwnProperty('type'))  schema_type = schema.type;
    if (schema.hasOwnProperty('enum'))  schema_type = 'enum';
    if (schema_type == 'object') {
        callback(key);
        if (schema.hasOwnProperty('properties')) {
            for (var k in schema.properties) {
                var newkey = key;
                if (newkey) newkey += '.';
                newkey += k;
                get_schema_key_containers(schema.properties[k], newkey, callback);    
            }
        }
        if (schema.hasOwnProperty('additionalProperties')) {
            var newkey = key;
            if (newkey) newkey += '.';
            newkey += '*'
            get_schema_key_containers(schema.additionalProperties, newkey, callback);    
        }
    }
    if (schema_type == 'array') {
        if (schema.hasOwnProperty('items')) {
            for (var k in schema.items) {
                var newkey = key;
                if (newkey) newkey += '.';
                newkey += '[]';
                get_schema_key_containers(schema.items, newkey, callback);    
            }
        }        
    }
}

function get_schema_keys(schema, key, callback) {
    var schema_type = undefined;
    callback(key);
    if (schema.hasOwnProperty('type'))  schema_type = schema.type;
    if (schema.hasOwnProperty('enum'))  schema_type = 'enum';
    if (schema_type == 'object') {    
        if (schema.hasOwnProperty('properties')) {
            for (var k in schema.properties) {
                var newkey = key.slice();
                newkey.push(k);
                get_schema_keys(schema.properties[k], newkey, callback);    
            }
        }
        if (schema.hasOwnProperty('additionalProperties')) {
            var newkey = key.slice();
            newkey.push(k);
            get_schema_keys(schema.additionalProperties, newkey, callback);    
        }
    }
    if (schema_type == 'array') {
        if (schema.hasOwnProperty('items')) {
            for (var k in schema.items) {
                var newkey = key.slice();
                newkey.push('[]');
                get_schema_keys(schema.items, newkey, callback);    
            }
        }        
    }
}



function schemakeys(schema, obj) {
    var schema_type = undefined;
    if (schema.hasOwnProperty('type'))  schema_type = schema.type;
    if (schema.hasOwnProperty('enum'))  schema_type = 'enum';
    if (schema_type == 'object') {    
        if (schema.hasOwnProperty('properties')) {
            for (var k in schema.properties) {
                obj[k] = {}
                schemakeys(schema.properties[k], obj[k]);    
            }
        }
        if (schema.hasOwnProperty('additionalProperties')) {
            obj['*'] = {}
            schemakeys(schema.additionalProperties, obj['*']);    
        }
    }
    if (schema_type == 'array') {
        if (schema.hasOwnProperty('items')) {
            obj['[]'] = {}
            schemakeys(schema.items, obj['[]']);    
        }        
    }
}