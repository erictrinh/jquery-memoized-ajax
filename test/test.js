describe('memoizedAjax', function() {
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

  it('should call the ajax method the first time', function(done) {
    $.memoizedAjax(ajaxOptions);
    expect($.ajax.calledOnce).to.be.true;
    done();
  });

  it('should not call the ajax method the second time', function(done) {
    $.memoizedAjax(ajaxOptions);
    expect($.ajax.calledTwice).to.be.false;
    done();
  });

  it('should return the results in the success callback', function(done) {
    $.memoizedAjax({
      url: '/test',
      data: { test: 'test' },
      success: function(results) {
        expect($.ajax.calledTwice).to.be.false;
        expect(results).to.deep.equal({
          message: 'this is a successful ajax request'
        });
        done();
      }
    });
  })
});
