# jQuery Memoized Ajax

Memoization is a technique for caching the results of expensive function calls so that subsequent calls (given the same inputs) are very fast. This property is also useful for expensive AJAX calls. This plugin adds a method to jQuery called `$.memoizedAjax` that behaves exactly like `$.ajax`, but caches the result in memory (and optionally, localStorage or sessionStorage). The next time `memoizedAjax` is called with the same `data` and `url` arguments, it will return the result immediately, in the form of a resolved `$.Deferred`. (If you have no idea what a deferred is, that's ok. Just treat this exactly like `$.ajax`...with a few caveats. See below.)

## Install

Two options:

  * Install via bower with `bower install jquery-memoized-ajax`
  * Clone the repo and grab `jquery.memoized.ajax.js`.

**This plugin is dependent on jQuery**, so include this after jQuery on your page with a script tag, or use RequireJS.

## Example Usage

Use it exactly how you would use `$.ajax`. Optionally, pass in `localStorage: true` or `sessionStorage: true` as one of the key-value pairs to cache the result in localStorage or sessionStorage. An example:

```javascript
// this goes and does the ajax call and logs the result after some time
$.memoizedAjax({
  url: '/reallyFreakinSlowLookup',
  localStorage: true, // this is optional (and defaults to false)
  type: 'GET',
  data: { name: 'Bobby Tables' },
  success: function(person) { console.log(person.age); }
});

// this resolves immediately (reading from localStorage), and logs the result
$.memoizedAjax({
  url: '/reallyFreakinSlowLookup',
  localStorage: true,
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

One other thing to keep in mind is that **accessing localStorage or sessionStorage is a blocking process**. Thus, it's not a good idea to do 10 `memoizedAjax` calls in a row with storage enabled, as this can lock up your web page.

## Advanced

### Customizing storage location

By default, `$.memoizedAjax` will store the results of ajax calls in storage with `memoizedAjax | url` as the key. For example, if you do this:

```javascript
$.memoizedAjax({
  url: '/really/long/url',
  localStorage: true,
  ...
});
```

The result is stored under `localStorage['memoizedAjax | /really/long/url']`.

In some cases, you will want to customize the key that memoizedAjax uses to cache the results of an ajax call. This might be useful if you want to clear the cache for specific ajax calls within your application. Use the `cacheKey` parameter, like this:

```javascript
$.memoizedAjax({
  url: '/lookup',
  localStorage: true,
  cacheKey: 'foobar'
});
```

Now, the result is cached under `localStorage.foobar`.

## Development

Clone this repo, then `npm install` and `bower install`. Tests and builds are run using gulp, so you'll need to install that with `npm install gulp -g`. You may need `sudo`.

Running `gulp` will watch files for changes and run tests on change. `gulp build` will run tests and then minify the script.
