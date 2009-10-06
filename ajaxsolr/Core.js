// $Id$

AjaxSolr = function() {};
/**
 * Returns whether an item is in the given array or not.
 * Don't add this to Array.prototype as it breaks for loops.
 *
 * @param items The array.
 * @param item An item that may or may not be in the array.
 * @return True if the item is in the given array.
 * @see http://www.prototypejs.org/api/array
 */
AjaxSolr.contains = function(items, item) {
  for (var i = 0; i < items.length; i++) {
    if (items[i] == item) {
      return true;
    }
  }
  return false;
}

/**
 * @see Drupal.theme
 * Theme function from drupal.js.
 */
AjaxSolr.theme = function(func) {
  for (var i = 1, args = []; i < arguments.length; i++) {
    args.push(arguments[i]);
  }

  return (AjaxSolr.theme[func] || AjaxSolr.theme.prototype[func]).apply(this, args);
};

/**
 * can't use jQuery's toString.call(obj) === "[object Array]", as it will may
 * return "[xpconnect wrapped native prototype]".
 *
 * @see http://thinkweb2.com/projects/prototype/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
 * @see http://ajax.googleapis.com/ajax/libs/prototype/1.6.0.3/prototype.js
 */
AjaxSolr.isArray = function (obj) {
  return obj != null && typeof obj == 'object' && 'splice' in obj && 'join' in obj;
}

AjaxSolr.Class = function() {};
/**
 * A class 'extends' itself into a subclass.
 *
 * @param properties The properties of the subclass.
 * @return A function that represents the subclass.
 */
AjaxSolr.Class.extend = function(properties) {
  var klass = this; // Safari dislikes 'class'
  // The subclass is just a function that when called, instantiates itself.
  // Nothing is _actually_ shared between _instances_ of the same class.
  var subClass = function(options) {
    // 'this' refers to the subclass, which starts life as an empty object.
    // Add its parent's properties, its own properties, and any passed options.
    AjaxSolr.extend(this, new klass(options), properties, options);
  }
  // Allow the subclass to extend itself into further subclasses.
  subClass.extend = this.extend;
  return subClass;
}

/**
 * Extract extend() from jQuery.
 * @see jQuery.extend()
 */
AjaxSolr.extend = function() {
  var target = arguments[0] || {}, i = 1, length = arguments.length, options;
  for (; i < length; i++) {
    if ((options = arguments[i]) != null) {
      for (var name in options) {
        var src = target[name], copy = options[name];
        if (target === copy) {
          continue;
        }
        if (copy && typeof copy == 'object' && !copy.nodeType) {
          target[name] = AjaxSolr.extend(src || (copy.length != null ? [] : {}), copy);
        }
        else if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }
  }
  return target;
}
