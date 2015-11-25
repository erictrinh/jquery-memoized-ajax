describe('memoizedAjax', function() {

  before(function() {
    localStorage.clear();
    sessionStorage.clear();
  });

  beforeEach(function() {
    var returnVal = {
      message: 'this is a successful ajax request'
    };

    sinon.stub($, 'ajax')
      .yieldsTo('success', returnVal)
      .returns($.Deferred().resolve(returnVal));
  });

  afterEach(function() {
    $.ajax.restore();
  });

  after(function() {
    localStorage.clear();
    sessionStorage.clear();
  });

  var ajaxOptions = {
    url: '/test',
    data: { test: 'test' },
    success: function() {}
  };

  it('should call the ajax method the first time', function(done) {
    $.memoizedAjax(extend(ajaxOptions, {
      success: function() {
        expect($.ajax.calledOnce).to.be.true;
        done();
      }
    }));
  });

  it('should call the ajax method again if url is different', function(done) {
    $.memoizedAjax(extend(ajaxOptions, {
      url: '/test2',
      success: function() {
        expect($.ajax.calledOnce).to.be.true;
        done();
      }
    }));
  });

  it('should not call the ajax method again if url is the same', function(done) {
    $.memoizedAjax(extend(ajaxOptions, {
      success: function() {
        expect($.ajax.calledOnce).to.be.false;
        done();
      }
    }));
  });

  it('should return the results in the success callback', function(done) {
    $.memoizedAjax(extend(ajaxOptions, {
      success: function(results) {
        expect($.ajax.calledOnce).to.be.false;
        expect(results).to.deep.equal({
          message: 'this is a successful ajax request'
        });
        done();
      }
    }));
  });

  it('should return the results in the returned promise', function(done) {
    $.memoizedAjax(extend(ajaxOptions)).done(function(results) {
      expect(results).to.deep.equal({
        message: 'this is a successful ajax request'
      });
      done();
    });
  });

  it('should not have the results in localStorage if no option passed', function() {
    expect(localStorage.getItem('memoizedAjax | /test')).to.be.null;
  });

  it('should store the results in localStorage if option is passed', function(done) {
    $.memoizedAjax(extend(ajaxOptions, {
      localStorage: true,
    })).done(function(results) {
      expect(localStorage.getItem('memoizedAjax | /test')).to.not.be.null;
      done();
    });
  });

  it('should call the ajax method if localStorage option is passed, but no localStorage item exists', function(done) {
    localStorage.removeItem('memoizedAjax | /test');
    $.memoizedAjax(extend(ajaxOptions, {
      localStorage: true,
    })).done(function() {
      expect($.ajax.calledOnce).to.be.true;
      done();
    });
  });

  it('should not have the results in sessionStorage if no option passed', function() {
    expect(sessionStorage.getItem('memoizedAjax | /test')).to.be.null;
  });

  it('should store the results in sessionStorage if option is passed', function(done) {
    $.memoizedAjax(extend(ajaxOptions, {
      sessionStorage: true,
    })).done(function(results) {
      expect(sessionStorage.getItem('memoizedAjax | /test')).to.not.be.null;
      done();
    });
  });

  var localCacheKeyParams = {
    url: '/cacheKey',
    localStorage: true,
    cacheKey: 'testKey'
  };

  it('should call ajax the first time, using cacheKey for localStorage', function(done) {
    $.memoizedAjax(extend(ajaxOptions, localCacheKeyParams, {
      success: function() {
        expect($.ajax.calledOnce).to.be.true;
        done();
      }
    }));
  });

  it('should not store results in default localStorage location if using cacheKey', function(done) {
    $.memoizedAjax(extend(ajaxOptions, localCacheKeyParams)).done(function(results) {
      expect(localStorage.getItem('memoizedAjax | /cacheKey')).to.be.null;
      done();
    });
  });

  it('should store results in localStorage location defined by cacheKey', function() {
    expect(localStorage.getItem('testKey')).to.not.be.null;
  });

  var sessionCacheKeyParams = {
    url: '/cacheKey',
    sessionStorage: true,
    cacheKey: 'testKey'
  };

  it('should call ajax the first time, using cacheKey for sessionStorage', function(done) {
    $.memoizedAjax(extend(ajaxOptions, sessionCacheKeyParams, {
      success: function() {
        expect($.ajax.calledOnce).to.be.true;
        done();
      }
    }));
  });

  it('should not store results in default sessionStorage location if using cacheKey', function(done) {
    $.memoizedAjax(extend(ajaxOptions, sessionCacheKeyParams)).done(function(results) {
      expect(localStorage.getItem('memoizedAjax | /cacheKey')).to.be.null;
      done();
    });
  });

  it('should store results in sessionStorage location defined by cacheKey', function() {
    expect(sessionStorage.getItem('testKey')).to.not.be.null;
  });

  // utility functions
  // =================

  // non-mutating extend
  function extend() {
    var args = Array.prototype.slice.call(arguments, 0);
    return _extend.apply(null, [{}].concat(args));
  }

  // adapted from underscore.js
  function _extend(obj) {
    _each(Array.prototype.slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  }

  function _each(obj, iterator, context) {
    if (obj == null) return obj;
    if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      var keys = _.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
      }
    }
    return obj;
  }
});
