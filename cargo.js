(function(window, undefined) {

var localStorage = window.localStorage,
    JSON = window.JSON,
    toJSON = JSON.stringify,
    fromJSON = JSON.parse,
    supported = (typeof localStorage !== 'undefined') ? true : false;

function Cargo(key, value, options) {
    if (arguments.length > 1 && Object.prototype.toString.call(value) !== '[object Object]') {
        options = typeof options === 'object' ? options : {};
        if (value === null || value === undefined) {
            return supported ? localStorage.removeItem(key) : cookie(key, null);
        }
        value = toJSON(value);
        return supported ? localStorage.setItem(key, value) : cookie(key, value, options);
    }
    options = value || {};
    return parse(supported ? localStorage.getItem(key) : cookie(key));
}

function cookie(key, value, options) {
    if (arguments.length > 1 && Object.prototype.toString.call(value) !== '[object Object]') {
        options = typeof options === 'object' ? options : {};
        if (value === null || value === undefined) {
            options.expires = -1;
        }
        if (typeof options.expires === 'number') {
            var date = new Date();
            date.setDate(date.getDate() + options.expires);
            options.expires = date;
        }
        value = String(value); // TODO is this faster than ("" + value)?
        return (document.cookie = [
            encodeURIComponent(key) + '=' + (options.raw ? value : encodeURIComponent(value)),
            options.expires ? '; Expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
            options.path ? '; Path=' + options.path : '',
            options.domain ? '; Domain=' + options.domain : '',
            options.secure ? '; Secure' : ''
        ].join(''));
    }
    options = value || {};
    var results = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie);
    return results && options.raw ? results[1] : results ? decodeURIComponent(results[1]) : null;
}

function parse(res) {
    ret = fromJSON(res);
    if (ret === 'true') {
        return true;
    }
    else if (ret === 'false') {
        return false;
    }
    else if (parseFloat(ret) === ret && typeof ret !== 'object') {
        return parseFloat(ret);
    }
    return ret;
}

if (typeof define !== 'undefined' && define.amd) { define(function() { return Cargo; }); }
else if (typeof module !== 'undefined' && module.exports) { module.exports = Cargo; }
else { window.Cargo = Cargo; }

})(window);