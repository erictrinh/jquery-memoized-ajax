(function (factory) {
  if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module.
      define(['jquery'], factory);
  } else {
      // Browser globals
      factory(jQuery);
  }
}(function ($) {
  var inMemory = {};

  $.memoizedAjax = function memoizedAjax(opts) {
    var memo,
      key = opts.cacheKey || opts.url,
      hash = hashFunc(opts.data),
      storage = storageObject(opts);

    if (storage) {
      memo = store(storage, getStorageAddress()) || {};
    } else {
      memo = inMemory[key] || {};
    }

    if (memo[hash]) {
      return $.Deferred().resolve(memo[hash])
        // store this in localStorage to deal with calling with
        // `localStorage: false` and then `localStorage: true` later
        // ensures syncing between memory and localStorage
        .done(function() {
          if (storage) {
            store(storage, getStorageAddress(), memo);
          }
        })
        // no error callback, since this should never fail...theoretically
        .done(opts.success)
        .always(opts.complete);
    }

    return $.ajax.call(this, opts).done(function(result) {
      memo[hash] = result;

      if (storage) {
        store(storage, getStorageAddress(), memo);
      } else {
        inMemory[key] = memo;
      }
    });

    function getStorageAddress() {
      return opts.cacheKey || ('memoizedAjax | ' + opts.url);
    }
  };

  function store(storage, key, value) {
    if (!storage) { throw new Error("Storage object is undefined"); }

    // get
    if (value === undefined) {
      var item = storage.getItem(key);
      return item && JSON.parse(item);
    // set
    } else {
      try {
        storage.setItem(key, JSON.stringify(value));
      } catch (err) {
        // prevent catching old values
        storage.removeItem(key);
      }
    }
  }

  function storageObject(opts) {
    if (opts.localStorage) {
      return localStorage;
    } else if (opts.sessionStorage) {
      return sessionStorage;
    }
  }

  function hashFunc(hash) {
    return JSON.stringify(hash);
  }

}));
