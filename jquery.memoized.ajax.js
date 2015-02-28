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
      hash = hashFunc(opts.data);

    if (inMemory[key]) {
      memo = inMemory[key];
    } else {
      var storage = storageObject(opts);
      memo = inMemory[key] = (storage ? store(storage, getStorageAddress()) : {}) || {};
    }

    if (memo[hash]) {
      return $.Deferred().resolve(memo[hash])
        // store this in localStorage to deal with calling with
        // `localStorage: false` and then `localStorage: true` later
        // ensures syncing between memory and localStorage
        .done(function() {
          var storage = storageObject(opts);
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

      var storage = storageObject(opts);

      if (storage) {
        store(storage, getStorageAddress(), memo);
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
      storage.setItem(key, JSON.stringify(value));
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
