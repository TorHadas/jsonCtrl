
function  get_schema_keys(schema, key, key_type, callback) {
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
                get_schema_keys(schema.properties[k], newkey, key_type, callback);    
            }
        }
    }
}
