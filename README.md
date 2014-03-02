# jQuery Memoized Ajax

Memoization is a technique for caching the results of expensive function calls so that subsequent calls (given the same inputs) are very fast. This property is also useful for expensive AJAX calls. This plugin adds a method called `$.memoizedAjax` that behaves exactly like `$.ajax`, but caches the result in localStorage. The next time `memoizedAjax` is called with the same `data` and `url` arguments, it will return the result immediately, in the form of a resolved `$.Deferred`. (If you have no idea what a deferred is, that's ok. Just treat this exactly like `$.ajax`...with a few caveats. See below.)

## Install

Two options:

  * Install via bower with `bower install jquery-memoized-ajax`
  * Clone the repo and grab `jquery.memoized.ajax.js`.

This plugin is dependent on jQuery, so include this after jQuery on your page with a script tag, or use RequireJS.

## Example Usage

Use it exactly how you would use `$.ajax`.

```javascript
// this goes and does the ajax call and logs the result after some time
$.memoizedAjax({
  url: '/reallyFreakinSlowLookup',
  type: 'GET',
  data: { name: 'Bobby Tables' },
  success: function(person) { console.log(person.age); }
});

// this resolves immediately, with no ajax call, and logs the result
$.memoizedAjax({
  url: '/reallyFreakinSlowLookup',
  type: 'GET',
  data: { name: 'Bobby Tables' },
  success: function(person) { console.log(person.age); }
});
```

## Caveats

Some things to watch out for when using `memoizedAjax` instead of regular `ajax`:

When `memoizedAjax` returns a cached result, it will actually return a resolved jQuery deferred object, **not** a jqXHR. Most of the time, this distinction is no big deal. There are times, however, where you'd like to `abort` a jqXHR object that you've stored in a variable. In those cases, you should check for the `abort` method before calling it, as a jQuery deferred object doesn't have an `abort` method, and your program will throw an error if the result happens to be cached.

```javascript
var ajaxCall = $.memoizedAjax({
  url: '/reallyFreakinSlowLookup',
  type: 'GET',
  data: { name: 'Bobby Tables' }
});

// DON'T DO THIS
ajaxCall.abort(); // will throw an error if $.memoizedAjax() returns a cached result

// DO THIS INSTEAD
ajaxCall.abort && ajaxCall.abort();
```

One other thing to keep in mind is that **accessing localStorage is a blocking process**. Thus, it's not a good idea to do 10 `memoizedAjax` calls in a row, as this can lock up your web page.

## Development

Clone this repo, then `npm install` and `bower install`. Tests and builds are run using gulp, so you'll need to install that with `npm install gulp -g`. You may need `sudo`.

Running `gulp` will watch files for changes and run tests on change. `gulp build` will run tests and then minify the script.
