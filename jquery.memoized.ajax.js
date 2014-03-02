(function (factory) {
  if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module.
      define(['jquery'], factory);
  } else {
      // Browser globals
      factory(jQuery);
  }
}(function ($) {
  $.memoizedAjax = function memoizedAjax(opts) {
    var memo = store(getLocalStorageAddress(opts.url)) || {},
      hash = hashFunc(opts.data);

    if (memo[hash]) {
      return $.Deferred().resolve(memo[hash])
        // no error callback, since this should never fail...theoretically
        .done(opts.success)
        .always(opts.complete);
    }

    return $.ajax.call(this, opts).done(function(result) {
      // have to re-get memo from localStorage in case there are other
      // ajax requests that will have added new keys before this runs
      var memo = store(getLocalStorageAddress(opts.url)) || {};
      memo[hash] = result;
      store(getLocalStorageAddress(opts.url), memo);
    });
  };

  function getLocalStorageAddress(url) {
    return 'memoizedAjax | ' + url;
  }

  function store(key, value) {
    var item;
    if (value === undefined) {
      item = localStorage.getItem(key);
      return item && JSON.parse(item);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  function hashFunc(hash) {
    return JSON.stringify(hash);
  }
}));
