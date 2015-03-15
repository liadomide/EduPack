/** description for an hashtable object, for the mapping of variable names of the parameters and the value in html 
 *  http://www.mojavelinux.com/articles/javascript_hashes.html
 * 

var h = new HashTable({one: 1, two: 2, three: 3, "i'm no 4": 4});
alert('original length: ' + h.length);
alert('value of key "one": ' + h.getItem('one'));
alert('has key "foo"? ' + h.hasItem('foo'));
alert('previous value of key "foo": ' + h.setItem('foo', 'bar'));
alert('length after setItem: ' + h.length);
alert('value of key "foo": ' + h.getItem('foo'));
alert('value of key "i'm no 4": ' + h.getItem("i'm no 4"));
h.clear();
alert('length after clear: ' + h.length);
        
These calls should produce the following output:
original length: 4
value of key "one": 1
has key "foo"? false
previous value of key "foo": undefined
length after setItem: 5
value of key "foo": bar
value of key "i'm no 4": 4
length after clear: 0


Iterating the items, filtering out members inherited from the Object.prototype:
for (var k in h.items) {
    if (h.hasItem(k)) {
        alert('key is: ' + k + ', value is: ' + h.items[k]);
    }
}
        
        
Iterating the entries using each: (notice we don't have to use hasOwnProperty in this case)
h.each(function(k, v) {
    alert('key is: ' + k + ', value is: ' + v);
});
        
        
Iterating the collection of keys:
for (var i = 0, keys = h.keys(), len = keys.length; i < len; i++) {
    alert('key is: ' + keys[i] + ', value is: ' + h.getItem(keys[i]));
}
        
        
Iterating the collection of values:
for (var i = 0, v = h.values(), len = v.length; i < len; i++) {
    alert('value is: ' + v[i]);
}
        
        
You can also find out the size of the hash table:
alert('size of hash table: ' + h.length);


 * @param {Object} obj
 */
function HashTable(obj) {
    this.length = 0;
    this.items = {};
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            this.items[p] = obj[p];
            this.length++;
        }
    }

    this.setItem = function(key, value)
    {
        var previous = undefined;
        if (this.hasItem(key)) {
            previous = this.items[key];
        }
        else {
            this.length++;
        }
        this.items[key] = value;
        return previous;
    }

    this.getItem = function(key) {
        return this.hasItem(key) ? this.items[key] : undefined;
    }

    this.hasItem = function(key)
    {
        return this.items.hasOwnProperty(key);
    }
    

    this.removeItem = function(key)
    {
        if (this.hasItem(key)) {
            previous = this.items[key];
            this.length--;
            delete this.items[key];
            return previous;
        }
        else {
            return undefined;
        }
    }

    this.keys = function()
    {
        var keys = [];
        for (var k in this.items) {
            if (this.hasItem(k)) {
                keys.push(k);
            }
        }
        return keys;
    }

    this.values = function()
    {
        var values = [];
        for (var k in this.items) {
            if (this.hasItem(k)) {
                values.push(this.items[k]);
            }
        }
        return values;
    }

    this.each = function(fn) {
        for (var k in this.items) {
            if (this.hasItem(k)) {
                fn(k, this.items[k]);
            }
        }
    }

    this.clear = function()
    {
        this.items = {}
        this.length = 0;
    }
}