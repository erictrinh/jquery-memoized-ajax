describe('ajax', function() {
  before(function() {
    localStorage.clear();
  });

  beforeEach(function() {
    sinon.stub($, 'ajax')
      .yieldsTo('success', {
        message: 'this is a successful ajax request'
      })
      .returns({
        done: function() {}
      });
  });

  afterEach(function() {
    $.ajax.restore();
  });

  var ajaxOptions = {
    url: '/test',
    data: { test: 'test' },
    success: function() {}
  };

  it('should call the ajax method', function(done) {
    $.memoizedAjax(ajaxOptions);
    expect($.ajax.calledOnce).to.be.true;
    done();
  });

  it('should not call the ajax method', function(done) {
    $.memoizedAjax(ajaxOptions);
    expect($.ajax.calledTwice).to.be.false;
    done();
  });

  it('should resolve with the correct stuff', function(done) {
    $.memoizedAjax({
      url: '/test',
      data: { test: 'test' },
      success: function(results) {
        expect(results).to.deep.equal({
          message: 'this is a successful ajax request'
        });
        done();
      }
    });
  })
});
