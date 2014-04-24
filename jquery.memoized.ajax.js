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
      url = opts.url,
      cacheKey = opts.cacheKey,
      hash = hashFunc(opts.data);

    if (inMemory[url]) {
      memo = inMemory[url];
    } else {
      memo = inMemory[url] = (opts.localStorage ? store(getStorageAddress(url,cacheKey)) : {}) || {};
    }

    if (memo[hash]) {
      return $.Deferred().resolve(memo[hash])
        // store this in localStorage to deal with calling with
        // `localStorage: false` and then `localStorage: true` later
        // ensures syncing between memory and localStorage
        .done(function() {
          if (opts.localStorage) {
            store(getStorageAddress(url,cacheKey), memo);
          }
        })
        // no error callback, since this should never fail...theoretically
        .done(opts.success)
        .always(opts.complete);
    }

    return $.ajax.call(this, opts).done(function(result) {
      memo[hash] = result;

      if (opts.localStorage) {
        store(getStorageAddress(url,cacheKey), memo);
      }
    });
  };

  function getStorageAddress(url,cacheKey) {
    if( cacheKey ) {
      return cacheKey + ' | ' + url;
    } else {
      return 'memoizedAjax | ' + url;
    }
  }

  function store(key, value) {
    var item;
    // get
    if (value === undefined) {
      item = localStorage.getItem(key);
      return item && JSON.parse(item);
    // set
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  function hashFunc(hash) {
    return JSON.stringify(hash);
  }
}));
