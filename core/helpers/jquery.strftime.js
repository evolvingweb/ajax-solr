/*
 * JQuery strftime plugin
 * Version 1.0.1 (12/06/2008)
 *
 * No documentation at this point, sorry.
 *
 * Home page: http://projects.nocternity.net/jquery-strftime/
 * Examples: http://projects.nocternity.net/jquery-strftime/demo.html
 *
 * Copyright (c) 2008 Emmanuel Benoît
 * 
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

(function($) {

	var _defaults = {
		'days_short' : [ 'Sun', 'Mon' , 'Tue' , 'Wed' , 'Thu' ,
				'Fri' , 'Sat' ] ,
		'days_long' : [ 'Sunday' , 'Monday' , 'Tuesday' ,
				'Wednesday' , 'Thursday' , 'Friday' ,
				'Saturday' ] ,
		'months_short' : [ 'Jan' , 'Feb' , 'Mar' , 'Apr' ,
				'May' , 'Jun' , 'Jul' , 'Aug' ,
				'Sep' , 'Oct' , 'Nov' , 'Dec' ] ,
		'months_long' : [ 'January' , 'February' , 'March' ,
				'April' , 'May' , 'June' , 'July' ,
				'August' , 'September' , 'October' ,
				'November' , 'December' ] ,
		'period' : [ 'AM' , 'PM' ] ,
		'format' : '%m/%d/%Y'
	};

	var _useText = _defaults;

	var _finaliseObj = function ( _obj , _month , _dow , _period ) {
		_obj.a = _useText.days_short[ _dow ];
		_obj.A = _useText.days_long[ _dow ];
		_obj.b = _useText.months_short[ _month ];
		_obj.B = _useText.months_long[ _month ];
		_obj.p = _useText.period [ _period ];
		_obj.m = _month + 1;

		var _tmp;

		if ( _obj.Y > 0 ) {
			_tmp = _obj.Y.toString( );
			if ( _tmp.length < 2 ) {
				_tmp = '0' + _tmp;
			} else if ( _tmp.length > 2 ) {
				_tmp = _tmp.substring( _tmp.length - 2 );
			}
			_obj.y = _tmp;
		} else {
			_obj.y = _obj.Y;
		}

		var _check = [ 'd' , 'm' , 'H' , 'I' , 'M' , 'S' ];
		for ( var i in _check ) {
			_tmp = _obj[ _check[ i ] ];
			_tmp = _tmp.toString( );
			if ( _tmp.length < 2 ) {
				_tmp = '0' + _tmp;
			}
			_obj[ _check[ i ] ] = _tmp;
		}

		return _obj;
	};

	var _dateTimeToDtObj = function ( dateTime , utc ) {
		var _obj, _month, _dow, _period;
		if ( utc ) {
			_obj = {
				'H' : dateTime.getUTCHours( ) ,
				'I' : dateTime.getUTCHours( ) < 13 ? dateTime.getUTCHours( ) : dateTime.getUTCHours( ) - 12,
				'l' : dateTime.getUTCHours( ) < 13 ? dateTime.getUTCHours( ) : dateTime.getUTCHours( ) - 12,
				'M' : dateTime.getUTCMinutes( ) ,
				'S' : dateTime.getUTCSeconds( ) ,
				'e' : dateTime.getUTCDate( ) ,
				'd' : dateTime.getUTCDate( ) ,
				'Y' : dateTime.getUTCFullYear( )
			};
			_month = dateTime.getUTCMonth( );
			_dow = dateTime.getUTCDay( );
			_period = dateTime.getUTCHours( ) < 13 ? 0 : 1;
		} else {
			_obj = {
				'H' : dateTime.getHours( ) ,
				'I' : dateTime.getHours( ) < 13 ? dateTime.getHours( ) : dateTime.getHours( ) - 12,
				'l' : dateTime.getHours( ) < 13 ? dateTime.getHours( ) : dateTime.getHours( ) - 12,
				'M' : dateTime.getMinutes( ) ,
				'S' : dateTime.getSeconds( ) ,
				'e' : dateTime.getDate( ) ,
				'd' : dateTime.getDate( ) ,
				'Y' : dateTime.getFullYear( )
			};
			_month = dateTime.getMonth( );
			_dow = dateTime.getDay( );
			_period = dateTime.getHours( ) < 13 ? 0 : 1;
		}
		return _finaliseObj( _obj , _month , _dow , _period );
	};

	var _objToDtObj = function ( obj ) {
		var _defs = {
			'H' : 0 ,
			'I' : 0 ,
			'l' : 0 ,
			'M' : 0 ,
			'S' : 0 ,
			'e' : 1 ,
			'd' : 1 ,
			'Y' : 1 ,
			'm' : 1
		};
		var _dtObj = {};

		for ( var i in _defs ) {
			if ( typeof obj[ i ] != 'number' || obj[ i ] % 1 != 0 ) {
				_dtObj[ i ] = _defs[ i ];
			} else {
				_dtObj[ i ] = obj[ i ];
			}
		}

		_dtObj.m --;

		var _dow;
		if ( typeof obj.dow == 'number' && obj.dow % 1 == 0 ) {
			_dow = obj.dow;
		} else {
			_dow = 0;
		}

		return _finaliseObj( _dtObj , _dtObj.m , _dow );
	};

	$.strftime = function ( fmt , dateTime , utc ) {

		if ( fmt && typeof fmt == 'object' ) {
			dateTime = fmt.dateTime;
			utc = fmt.utc;
			fmt = fmt.format;
		}

		if ( !fmt || ( typeof fmt != 'string' ) ) {
			fmt = _useText.format;
		}

		var _dtObj;
		if ( dateTime && ( typeof dateTime == 'object' ) ) {
			if ( dateTime instanceof Date ) {
				_dtObj = _dateTimeToDtObj( dateTime , utc );
			} else {
				_dtObj = _objToDtObj( dateTime );
			}
		} else {
			_dtObj = _dateTimeToDtObj( new Date( ) , utc );
		}

		var _text = '' , _state = 0;
		for ( var i = 0 ; i < fmt.length ; i ++ ) {
			if ( _state == 0 ) {
				if ( fmt.charAt(i) == '%' ) {
					_state = 1;
				} else {
					_text += fmt.charAt( i );
				}
			} else {
				if ( typeof _dtObj[ fmt.charAt( i ) ] != 'undefined' ) {
					_text += _dtObj[ fmt.charAt( i ) ];
				} else {
					_text += '%';
					if ( fmt.charAt( i ) != '%' ) {
						_text += fmt.charAt( i );
					}
				}
				_state = 0;
			}
		}
		if ( _state == 1 ) {
			_text += '%';
		}

		return _text;
	};

	$.extend( $.strftime , {
		setText: function ( obj ) {
			if ( typeof obj != 'object' ) {
				throw new Error( '$.strftime.setText() : invalid parameter' );
			}

			var _count = 0;
			for ( var i in obj ) {
				if ( typeof _defaults[ i ] == 'undefined' ) {
					throw new Error( '$.strftime.setText() : invalid field "' + i + '"' );
				} else if ( i == 'format' && typeof obj[ i ] != 'string' ) {
					throw new Error( '$.strftime.setText() : invalid type for the "format" field' );
				} else if ( i != 'format' && ! ( obj[ i ] instanceof Array ) ) {
					throw new Error( '$.strftime.setText() : field "' + i + '" should be an array' );
				} else if ( obj[ i ].length != _defaults[ i ].length ) {
					throw new Error( '$.strftime.setText() : field "' + i + '" has incorrect length '
							+ obj[ i ].length + ' (should be ' + _defaults[ i ].length + ')'
					       );
				}
				_count ++;
			}
			if ( _count != 5 ) {
				throw new Error( '$.strftime.setText() : 5 fields expected, ' + _count + ' found' );
			}

			_useText = obj;
		},

		defaults: function ( ) {
			_useText = _defaults;
		}
	} );

	$.fn.strftime = function ( fmt , dateTime , utc ) {
		var _text = $.strftime( fmt , dateTime , utc );
		return this.each( function( ) {
			$(this).html( _text );
		});
	};

})(jQuery);
