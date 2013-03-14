//  Colour.js
//
//  By PAEz
//
//  Mainly built from the code of Tiny Color....
//  TinyColor.js - <https://github.com/bgrins/TinyColor> - 2011 Brian Grinstead - v0.5
//  ...with some extra bits from colour.js....
//  http://n3dst4.github.com/colour.js/
//  ...and the other stuff is me ;)
//
//  Quick example on how to use it....
//  color = new Colour()
//  color.hsl.h = 60
//  color.hsl.s = 100
//  color.hsl.l = 50
////  Or you could have done...
////  color.hsl.hsl = [60, 100, 50]
////  or
////  color.hsl.hsl = {h:60, s:100, l:50}
////  or
////  color.hsl([60, 100, 50]) ...or... color.hsl({h:60, s:100, l:50})
////  or
////  color.object = {hsl:{h:60, s:100, l:50}}
////  or
////  color.JSON = '{hsl:{h:60, s:100, l:50}}'
////  or
////  color.css = 'hsl{60, 100%, 50%}'
////  or
////  color.name='yellow'
////  ... and keep in mind that all those variables are gettable aswell
//  color.rgb.rgb  		// equals {r:255, g:255, b:0}
//  color.alpha = 0.5
//  color.rgb.rgba 		// equals {r:255, g:255, b:0, a:0.5}
//  color.rgb.rgb 		// equals {r:255, g:255, b:0}
//  color.rgb()			// returns {r:255, g:255, b:0, a:0.5}
//  color.rgb.css  		// equals 'rgba(255, 255, 0, 0.5)'
//  color.name			// equals 'yellow'
(function(root) {

	Colour = function(c) {
		if (!(this instanceof Colour)) {
			return new Colour(c);
		}

		var self = this;

		// Some vars for the dirty test
		var RGB = 1,
			HSL = 2,
			HSV = 4;

		var RGBHSL = 3,
			RGBHSV = 5,
			HSLHSV = 6,
			HSLRGB = RGBHSL,
			HSVRGB = RGBHSV,
			HSVHSL = HSLHSV;

		self.dirty = HSVHSL;

		var mathRound = Math.round;

		var mathMin = Math.min;

		var mathMax = Math.max;

		self.onChange = null;

		var _alpha = 1;

		var _hue = -1;

		self.cssDetails = {};

		self.__defineGetter__("object", function() {
			var obj = {
				hsl: self.hsl.hsl,
				hsv: self.hsv.hsv,
				rgb: self.rgb.rgb,
				hex: self.hex.toCSS(),
				alpha: self.alpha,
				name: self.name === undefined ? '' : self.name,

			};
			obj.hsl.css = self.hsl.toCSS();
			obj.hsv.css = self.hsv.toCSS();
			obj.rgb.css = self.rgb.toCSS();
			return obj;
		});

		self.__defineSetter__("object", function(c) {
			if (c.rgb) {
				self.rgb.rgb = c.rgb;
			} else if (c.hsl) {
				self.hsl.hsl = c.hsl;
			} else if (c.hsv) {
				self.hsv.hsv = c.hsv;
			} else if (c.hex) {
				self.hex.rgb = c.hex;
			} else if (c.name) {
				self.name = c.name;
			}
			if (c.alpha) {
				self.alpha = c.alpha;
			}
		});

		self.__defineGetter__("JSON", function() {
			return JSON.stringify(self.object, null, '\t');
		});

		self.__defineSetter__("JSON", function(c) {
			self.object = JSON.parse(c);
		});

		self.__defineSetter__("alpha", function(c) {
			if (c > 1) {
				_alpha = 1;
			} else if (c < 0) {
				_alpha = 0;
			} else {
				_alpha = c;
			}
			if (self.onChange) self.onChange();
		});

		self.__defineGetter__("alpha", function(c) {
			return _alpha;
		});

		self.__defineGetter__("luma", function(c) {
			return (0.3 * self.rgb.r + 0.59 * self.rgb.g + 0.11 * self.rgb.b) / 255;
		});

		self.__defineSetter__("luma", function(c) {
			//
		})
self.__defineGetter__("huesLuma", function(){
					var h = self.hsl.h/60;

					var i = h | 0,
						f = h - i,
						p = 0,
						q = 1 - f,
						mod = i % 6;
					return (0.3*[1, q, p, p, f, 1][mod])+(0.59*[f, 1, 1, q, p, p][mod])+(0.11*[p, p, f, 1, 1, q][mod]);
				});
		var _rgb = {
			r: 0,
			g: 0,
			b: 0
		};
		self.RGB = _rgb;

		self.rgb = function(c) {
			if (c) {
				self.rgb.rgb = c;
			} else {
				return _alpha === 1 ? self.rgb.rgb : self.rgb.rgba;
			}
		}
		//self.rgb={};
		self.rgb.__proto__ = {
			get a() {
				return _alpha;
			},

			set a(c) {
				if (c > 1) {
					_alpha = 1;
				} else if (c < 0) {
					_alpha = 0;
				} else {
					_alpha = c;
				}
			},
			// Red
			get r() {
				return mathRound(_rgb.r * 255);
			},

			set r(c) {
				_hue = -1;
				if (c > 255) {
					_rgb.r = 1;
				} else if (c < 0) {
					_rgb.r = 0;
				} else {
					_rgb.r = c / 255;
				}
				self.dirty = HSVHSL;
				if (self.onChange) self.onChange();
			},
			// Green
			get g() {
				return mathRound(_rgb.g * 255);
			},

			set g(c) {
				_hue = -1;
				if (c > 255) {
					_rgb.g = 1;
				} else if (c < 0) {
					_rgb.g = 0;
				} else {
					_rgb.g = c / 255;
				}
				self.dirty = HSVHSL;
				if (self.onChange) self.onChange();
			},
			// Blue
			get b() {
				return mathRound(_rgb.b * 255);
			},

			set b(c) {
				_hue = -1;
				if (c > 255) {
					_rgb.b = 1;
				} else if (c < 0) {
					_rgb.b = 0;
				} else {
					_rgb.b = c / 255;
				}
				self.dirty = HSVHSL;
				if (self.onChange) self.onChange();
			},
			// [Red, Green, Blue]
			set rgb(c) {
				if (!Array.isArray(c)) {
					var r = c.r;
					var g = c.g;
					var b = c.b;
					if (c.a !== 1) self.alpha = c.a;
				} else {
					var r = c[0];
					var g = c[1];
					var b = c[2];
					if (c[3] !== undefined) self.alpha = c[3];
				}
				if (r > 255) {
					r = 255
				} else if (r < 0) {
					r = 0;
				}
				if (g > 255) {
					g = 255
				} else if (g < 0) {
					g = 0;
				}
				if (b > 255) {
					b = 255
				} else if (b < 0) {
					b = 0;
				}
				_hue = -1;
				_rgb.r = r / 255;
				_rgb.g = g / 255;
				_rgb.b = b / 255;
				self.dirty = HSVHSL;
				if (self.onChange) self.onChange();
			},

			set rgba(c) {
				self.rgb.rgb = c;
			},

			get rgb() {
				return {
					r: self.rgb.r,
					g: self.rgb.g,
					b: self.rgb.b
				};
			},

			get rgba() {
				return {
					r: self.rgb.r,
					g: self.rgb.g,
					b: self.rgb.b,
					a: _alpha
				};
			},

			get css() {
				return self.rgb.toCSS(_alpha != 1, self.cssDetails.percentages);
			},

			toCSS: function(useAlpha, usePercentage) {
				if (!usePercentage) {
					if (useAlpha === true || (useAlpha === undefined && self.alpha != 1)) {
						return 'rgba(' + self.rgb.r + ', ' + self.rgb.g + ', ' + self.rgb.b + ', ' + _alpha + ')';
					} else {
						return 'rgb(' + self.rgb.r + ', ' + self.rgb.g + ', ' + self.rgb.b + ')';
					}
				} else {
					if (useAlpha === true || (useAlpha === undefined && self.alpha != 1)) {
						return 'rgba(' + mathRound(_rgb.r * 100) + '%, ' + mathRound(_rgb.g * 100) + '%, ' + mathRound(_rgb.b * 100) + '%, ' + _alpha + ')';
					} else {
						return 'rgb(' + mathRound(_rgb.r * 100) + '%, ' + mathRound(_rgb.g * 100) + '%, ' + mathRound(_rgb.b * 100) + '%)';
					}
				}
			},

			updateFrom: function(from) {

				if (from == 'HSV') {
					var h = _hsv.h * 6;
					_hue = _hsv.h;
					var s = _hsv.s;
					var v = _hsv.v;

					var i = h | 0,
						f = h - i,
						p = v * (1 - s),
						q = v * (1 - f * s),
						t = v * (1 - (1 - f) * s),
						mod = i % 6;
					_rgb.r = [v, q, p, p, t, v][mod];
					_rgb.g = [t, v, v, q, p, p][mod];
					_rgb.b = [p, p, t, v, v, q][mod];

				} else if (from == 'HSL') {
					var h = _hsl.h;
					_hue = _hsl.h;
					var s = _hsl.s;
					var l = _hsl.l;

					function hue2rgb(p, q, t) {
						if (t < 0) t += 1;
						if (t > 1) t -= 1;
						if (t < 1 / 6) return p + (q - p) * 6 * t;
						if (t < 1 / 2) return q;
						if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
						return p;
					}

					if (s == 0) {
						_rgb.r = _rgb.g = _rgb.b = l; // achromatic
					} else {
						var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
						var p = 2 * l - q;
						_rgb.r = hue2rgb(p, q, h + 1 / 3);
						_rgb.g = hue2rgb(p, q, h);
						_rgb.b = hue2rgb(p, q, h - 1 / 3);
					}
				}
			},
			compare: function(c) {
				if (_alpha < 1) {
					return difference(self.rgb.rgba, c.rgb.rgba);
				} else {
					return difference(self.rgb.rgb, c.rgb.rgb);
				}
			}
		}

		self.rgba = self.rgb;

		var _hsl = {
			h: 0,
			s: 0,
			l: 0
		};
		self.HSL = _hsl;

		self.hsl = function(c) {
			if (c) {
				self.hsl.hsl = c;
			} else {
				return _alpha === 1 ? self.hsl.hsl : self.hsl.hsla;
			}
		}

		self.hsl.__proto__ = {
			get a() {
				return _alpha;
			},

			set a(c) {
				if (c > 1) {
					_alpha = 1;
				} else if (c < 0) {
					_alpha = 0;
				} else {
					_alpha = c;
				}
			},
			// Hue
			get h() {
				if (self.dirty & HSL) {
					self.hsl.update();
				}
				return mathRound(_hsl.h * 360);
			},

			set h(c) {
				if (self.dirty & HSL) {
					self.hsl.update();
				}
				if (c > 360) {
					_hsl.h = 1;
				} else if (c < 0) {
					_hsl.h = 0;
				} else {
					_hsl.h = c / 360;
				}
				self.rgb.updateFrom('HSL');
				self.dirty = HSV;
				if (self.onChange) self.onChange();
			},
			// Saturation
			get s() {
				if (self.dirty & HSL) {
					self.hsl.update();
				}
				return mathRound(_hsl.s * 100);
			},

			set s(c) {
				if (self.dirty & HSL) {
					self.hsl.update();
				}
				if (c > 100) {
					_hsl.s = 1;
				} else if (c < 0) {
					_hsl.s = 0;
				} else {
					_hsl.s = c / 100;
				}
				self.rgb.updateFrom('HSL');
				self.dirty = HSV;
				if (self.onChange) self.onChange();
			},
			// Luminance
			get l() {
				if (self.dirty & HSL) {
					self.hsl.update();
				}
				return mathRound(_hsl.l * 100);
			},

			set l(c) {
				if (self.dirty & HSL) {
					self.hsl.update();
				}
				if (c > 100) {
					_hsl.l = 1;
				} else if (c < 0) {
					_hsl.l = 0;
				} else {
					_hsl.l = c / 100;
				}
				self.rgb.updateFrom('HSL');
				self.dirty = HSV;
				if (self.onChange) self.onChange();
			},
			// {h:Hue, s:Saturation, l:Luminance}
			set hsl(c) {
				if (!Array.isArray(c)) {
					var h = c.h;
					var s = c.s;
					var l = c.l;
					if (c.a !== 1) self.alpha = c.a;
				} else {
					var h = c[0];
					var s = c[1];
					var l = c[2];
					if (c[3] !== undefined) self.alpha = c[3];
				}

				if (h > 360) {
					h = 360;
				} else if (h < 0) {
					h = 0;
				}
				if (s > 100) {
					s = 100;
				} else if (s < 0) {
					s = 0;
				}
				if (l > 100) {
					l = 100;
				} else if (l < 0) {
					l = 0;
				}
				_hsl.h = h / 360;
				_hsl.s = s / 100;
				_hsl.l = l / 100;
				self.rgb.updateFrom('HSL');
				self.dirty = HSV;
				if (self.onChange) self.onChange();
			},

			set hsla(c) {
				self.hsl.hsl = c;
			},

			get hsl() {
				return {
					h: self.hsl.h,
					s: self.hsl.s,
					l: self.hsl.l
				};
			},

			get hsla() {
				return {
					h: self.hsl.h,
					s: self.hsl.s,
					l: self.hsl.l,
					a: _alpha
				};
			},

			get css() {
				return self.hsl.toCSS();
			},

			toCSS: function(useAlpha) {
				if (useAlpha === true || (useAlpha === undefined && self.alpha != 1)) {
					return 'hsla(' + self.hsl.h + ', ' + self.hsl.s + '%, ' + self.hsl.l + '%, ' + _alpha + ')';
				} else {
					return 'hsl(' + self.hsl.h + ', ' + self.hsl.s + '%, ' + self.hsl.l + '%)';
				}
			},

			update: function() {

				var r = _rgb.r;
				var g = _rgb.g;
				var b = _rgb.b;

				var max = mathMax(r, g, b),
					min = mathMin(r, g, b);

				var h, s, l = (max + min) / 2;

				if (max == min) {
					//h = s = 0; // achromatic
					if (_hue !== -1) h = _hue;
					else h = 0;
					s = 0;
				} else {
					var d = max - min;
					s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
					switch (max) {
					case r:
						h = (g - b) / d + (g < b ? 6 : 0);
						break;
					case g:
						h = (b - r) / d + 2;
						break;
					case b:
						h = (r - g) / d + 4;
						break;
					}

					h /= 6;
				}
				if ((s === 0 || l === 0 || l === 100) && _hue !== -1) {
					_hsl.h = _hue;
				} else {
					_hue = h;
					_hsl.h = h;
				}
				_hsl.s = s;
				_hsl.l = l;

				self.dirty = self.dirty ^ HSL;
			},
			compare: function(c) {
				if (_alpha < 1) {
					return difference(self.hsl.hsla, c.hsl.hsla);
				} else {
					return difference(self.hsl.hsl, c.hsl.hsl);
				}
			}
		}

		self.hsla = self.hsl;

		var _hsv = {
			h: 0,
			s: 0,
			v: 0
		};
		self.HSV = _hsv;

		self.hsv = function(c) {
			if (c) {
				self.hsv.hsv = c;
			} else {
				return _alpha === 1 ? self.hsv.hsv : self.hsv.hsva;
			}
		}

		self.hsv.__proto__ = {
			get a() {
				return _alpha;
			},

			set a(c) {
				if (c > 1) {
					_alpha = 1;
				} else if (c < 0) {
					_alpha = 0;
				} else {
					_alpha = c;
				}
			},
			// Hue
			get h() {
				if (self.dirty & HSV) {
					self.hsv.update();
				}
				return mathRound(_hsv.h * 360);
			},

			set h(c) {
				if (self.dirty & HSV) {
					self.hsv.update();
				}
				if (c > 360) {
					_hsv.h = 1;
				} else if (c < 0) {
					_hsv.h = 0;
				} else {
					_hsv.h = c / 360;
				}
				self.rgb.updateFrom('HSV');
				self.dirty = HSL;
				if (self.onChange) self.onChange();
			},
			// Saturation
			get s() {
				if (self.dirty & HSV) {
					self.hsv.update();
				}
				return mathRound(_hsv.s * 100);
			},

			set s(c) {
				if (self.dirty & HSV) {
					self.hsv.update();
				}
				if (c > 100) {
					_hsv.s = 1;
				} else if (c < 0) {
					_hsv.s = 0;
				} else {
					_hsv.s = c / 100;
				}
				self.rgb.updateFrom('HSV');
				self.dirty = HSL;
				if (self.onChange) self.onChange();
			},
			// Vibrance
			get v() {
				if (self.dirty & HSV) {
					self.hsv.update();
				}
				return mathRound(_hsv.v * 100);
			},

			set v(c) {
				if (self.dirty & HSV) {
					self.hsv.update();
				}
				if (c > 100) {
					_hsv.v = 1;
				} else if (c < 0) {
					_hsv.v = 0;
				} else {
					_hsv.v = c / 100;
				}
				self.rgb.updateFrom('HSV');
				self.dirty = HSL;
				if (self.onChange) self.onChange();
			},
			// {h:Hue, s:Saturation, v:Vibrance, a:Alpha} or [Hue, Saturation, Vibrance, Alpha] .. alpha is optional the rest are not 
			set hsv(c) {
				if (!Array.isArray(c)) {
					var h = c.h;
					var s = c.s;
					var v = c.v;
					if (c.a) self.alpha = c.a;
				} else {
					var h = c[0];
					var s = c[1];
					var v = c[2];
					if (c[3] !== undefined) self.alpha = c[3];
				}
				
				if (h > 360) {
					h = 360;
				} else if (h < 0) {
					h = 0;
				}
				if (s > 100) {
					s = 100;
				} else if (s < 0) {
					s = 0;
				}
				if (v > 100) {
					v = 100;
				} else if (v < 0) {
					v = 0;
				}
				_hsv.h = h / 360;
				_hsv.s = s / 100;
				_hsv.v = v / 100;
				self.rgb.updateFrom('HSV');
				self.dirty = HSL;
				if (self.onChange) self.onChange();
			},

			set hsva(c) {
				self.hsv.hsv = c;
			},

			get hsv() {
				return {
					h: self.hsv.h,
					s: self.hsv.s,
					v: self.hsv.v
				};
			},

			get hsva() {
				return {
					h: self.hsv.h,
					s: self.hsv.s,
					v: self.hsv.v,
					a: _alpha
				};
			},

			get css() {
				return self.hsv.toCSS();
			},

			toCSS: function(useAlpha) {
				if (useAlpha === true || (useAlpha === undefined && self.alpha != 1)) {
					return 'hsva(' + self.hsv.h + ', ' + self.hsv.s + '%, ' + self.hsv.v + '%, ' + _alpha + ')';
				} else {
					return 'hsv(' + self.hsv.h + ', ' + self.hsv.s + '%, ' + self.hsv.v + '%)';
				}
			},

			update: function() {

				var r = _rgb.r;
				var g = _rgb.g;
				var b = _rgb.b;

				var max = mathMax(r, g, b),
					min = mathMin(r, g, b);
				var h, s, v = max;
				// the ".toPrecision(15)" is to deal with an error....
				// 1 - 0.9999999999999999 = 1.1102230246251565e-16  ?!?!?!....what the hell is that?
				// this seems to fix it, but I have no idea if it will cause more problems....I really hope not
				// if anyone knows of a proper fix, Id really appreciate to hear it cdkpaez@gmail.com
				var d = max - min.toPrecision(15);
				//var d = max - min;
				s = max == 0 ? 0 : d / max;
				if (max == min) {
					//h = 0; // achromatic
					if (_hue !== -1) h = _hue;
					else h = 0;
				} else {
					switch (max) {
					case r:
						h = (g - b) / d + (g < b ? 6 : 0);
						break;
					case g:
						h = (b - r) / d + 2;
						break;
					case b:
						h = (r - g) / d + 4;
						break;
					}
					h /= 6;
				}
				if ((s === 0 || v === 0 || v === 100) && _hue !== -1) {
					_hsv.h = _hue;
				} else {
					_hue = h;
					_hsv.h = h;
				}
				_hsv.s = s;
				_hsv.v = v;

				self.dirty = self.dirty ^ HSV;
			},
			compare: function(c) {
				if (_alpha < 1) {
					return difference(self.hsv.hsva, c.hsv.hsva);
				} else {
					return difference(self.hsv.hsv, c.hsv.hsv);
				}
			}
		}

		self.hsva = self.hsv;

		self.hex = function(c) {
			if (c) {
				self.hex.rgb = c;
			} else {
				return self.hex.rgb;
			}
		}

		self.hex.__proto__ = {
			get r() {
				var c = mathRound(_rgb.r * 255).toString(16);
				return c = "00".substr(0, 2 - c.length) + c;
			},

			set r(c) {
				c = parseInt(c, 16);
				if (c > 255) {
					_rgb.r = 1;
				} else if (c < 0) {
					_rgb.r = 0;
				} else {
					_rgb.r = c / 255;
				}
				self.dirty = HSVHSL;
				if (self.onChange) self.onChange();
			},
			// Green
			get g() {
				var c = mathRound(_rgb.g * 255).toString(16);
				return c = "00".substr(0, 2 - c.length) + c;
			},

			set g(c) {
				c = parseInt(c, 16);
				if (c > 255) {
					_rgb.g = 1;
				} else if (c < 0) {
					_rgb.g = 0;
				} else {
					_rgb.g = c / 255;
				}
				self.dirty = HSVHSL;
				if (self.onChange) self.onChange();
			},
			// Blue
			get b() {
				var c = mathRound(_rgb.b * 255).toString(16);
				return c = "00".substr(0, 2 - c.length) + c;
			},

			set b(c) {
				c = parseInt(c, 16);
				if (c > 255) {
					_rgb.b = 1;
				} else if (c < 0) {
					_rgb.b = 0;
				} else {
					_rgb.b = c / 255;
				}
				self.dirty = HSVHSL;
				if (self.onChange) self.onChange();
			},
			// [Red, Green, Blue]
			set rgb(c) {
				if (Array.isArray(c)) {
					var r = parseInt(c[0], 16);
					var g = parseInt(c[1], 16);
					var b = parseInt(c[2], 16);
				} else if (typeof c === 'string') {
					if (c.charAt(0) === '#') c = c.substr(1);
					if (c.length === 3) c = c.charAt(0) + c.charAt(0) + c.charAt(1) + c.charAt(1) + c.charAt(2) + c.charAt(2);
					var r = parseInt(c.substr(0, 2), 16);
					var g = parseInt(c.substr(2, 2), 16);
					var b = parseInt(c.substr(4, 2), 16);
				} else {
					var r = parseInt(c.r, 16);
					var g = parseInt(c.g, 16);
					var b = parseInt(c.b, 16);

				}
				if (r > 255) {
					r = 255
				} else if (r < 0) {
					r = 0;
				}
				if (g > 255) {
					g = 255
				} else if (g < 0) {
					g = 0;
				}
				if (b > 255) {
					b = 255
				} else if (b < 0) {
					b = 0;
				}
				_rgb.r = r / 255;
				_rgb.g = g / 255;
				_rgb.b = b / 255;
				self.dirty = HSVHSL;
				if (self.onChange) self.onChange();
			},

			get rgb() {
				return self.hex.r + self.hex.g + self.hex.b;
			},

			set hex(c) {
				self.hex.rgb = c;
			},

			get hex() {
				return self.hex.rgb;
			},

			get css() {
				return self.hex.toCSS();
			},

			toCSS: function(excludeHash) {
				var hex = self.hex.r + self.hex.g + self.hex.b;
				if (hex.charAt(0) === hex.charAt(1) && hex.charAt(2) === hex.charAt(3) && hex.charAt(4) === hex.charAt(5)) {
					hex = hex.charAt(0) + hex.charAt(2) + hex.charAt(4);
				}
				if (excludeHash) {
					return hex;
				} else {
					return '#' + hex;
				}
			}

		}
		self.__defineSetter__("name", function(c) {
			if (_names[c]) {
				self.hex.rgb = _names[c];
			}
		});

		self.__defineGetter__("name", function(c) {
			if (_names.hex[self.hex.toCSS(true)]) {
				return _names.hex[self.hex.toCSS(true)];
			} else {
				return undefined;
			}
		});

		var _names = {
			aliceblue: "f0f8ff",
			antiquewhite: "faebd7",
			aqua: "0ff",
			aquamarine: "7fffd4",
			azure: "f0ffff",
			beige: "f5f5dc",
			bisque: "ffe4c4",
			black: "000",
			blanchedalmond: "ffebcd",
			blue: "00f",
			blueviolet: "8a2be2",
			brown: "a52a2a",
			burlywood: "deb887",
			burntsienna: "ea7e5d",
			cadetblue: "5f9ea0",
			chartreuse: "7fff00",
			chocolate: "d2691e",
			coral: "ff7f50",
			cornflowerblue: "6495ed",
			cornsilk: "fff8dc",
			crimson: "dc143c",
			cyan: "0ff",
			darkblue: "00008b",
			darkcyan: "008b8b",
			darkgoldenrod: "b8860b",
			darkgray: "a9a9a9",
			darkgreen: "006400",
			darkgrey: "a9a9a9",
			darkkhaki: "bdb76b",
			darkmagenta: "8b008b",
			darkolivegreen: "556b2f",
			darkorange: "ff8c00",
			darkorchid: "9932cc",
			darkred: "8b0000",
			darksalmon: "e9967a",
			darkseagreen: "8fbc8f",
			darkslateblue: "483d8b",
			darkslategray: "2f4f4f",
			darkslategrey: "2f4f4f",
			darkturquoise: "00ced1",
			darkviolet: "9400d3",
			deeppink: "ff1493",
			deepskyblue: "00bfff",
			dimgray: "696969",
			dimgrey: "696969",
			dodgerblue: "1e90ff",
			firebrick: "b22222",
			floralwhite: "fffaf0",
			forestgreen: "228b22",
			fuchsia: "f0f",
			gainsboro: "dcdcdc",
			ghostwhite: "f8f8ff",
			gold: "ffd700",
			goldenrod: "daa520",
			gray: "808080",
			green: "008000",
			greenyellow: "adff2f",
			grey: "808080",
			honeydew: "f0fff0",
			hotpink: "ff69b4",
			indianred: "cd5c5c",
			indigo: "4b0082",
			ivory: "fffff0",
			khaki: "f0e68c",
			lavender: "e6e6fa",
			lavenderblush: "fff0f5",
			lawngreen: "7cfc00",
			lemonchiffon: "fffacd",
			lightblue: "add8e6",
			lightcoral: "f08080",
			lightcyan: "e0ffff",
			lightgoldenrodyellow: "fafad2",
			lightgray: "d3d3d3",
			lightgreen: "90ee90",
			lightgrey: "d3d3d3",
			lightpink: "ffb6c1",
			lightsalmon: "ffa07a",
			lightseagreen: "20b2aa",
			lightskyblue: "87cefa",
			lightslategray: "789",
			lightslategrey: "789",
			lightsteelblue: "b0c4de",
			lightyellow: "ffffe0",
			lime: "0f0",
			limegreen: "32cd32",
			linen: "faf0e6",
			magenta: "f0f",
			maroon: "800000",
			mediumaquamarine: "66cdaa",
			mediumblue: "0000cd",
			mediumorchid: "ba55d3",
			mediumpurple: "9370db",
			mediumseagreen: "3cb371",
			mediumslateblue: "7b68ee",
			mediumspringgreen: "00fa9a",
			mediumturquoise: "48d1cc",
			mediumvioletred: "c71585",
			midnightblue: "191970",
			mintcream: "f5fffa",
			mistyrose: "ffe4e1",
			moccasin: "ffe4b5",
			navajowhite: "ffdead",
			navy: "000080",
			oldlace: "fdf5e6",
			olive: "808000",
			olivedrab: "6b8e23",
			orange: "ffa500",
			orangered: "ff4500",
			orchid: "da70d6",
			palegoldenrod: "eee8aa",
			palegreen: "98fb98",
			paleturquoise: "afeeee",
			palevioletred: "db7093",
			papayawhip: "ffefd5",
			peachpuff: "ffdab9",
			peru: "cd853f",
			pink: "ffc0cb",
			plum: "dda0dd",
			powderblue: "b0e0e6",
			purple: "800080",
			red: "f00",
			rosybrown: "bc8f8f",
			royalblue: "4169e1",
			saddlebrown: "8b4513",
			salmon: "fa8072",
			sandybrown: "f4a460",
			seagreen: "2e8b57",
			seashell: "fff5ee",
			sienna: "a0522d",
			silver: "c0c0c0",
			skyblue: "87ceeb",
			slateblue: "6a5acd",
			slategray: "708090",
			slategrey: "708090",
			snow: "fffafa",
			springgreen: "00ff7f",
			steelblue: "4682b4",
			tan: "d2b48c",
			teal: "008080",
			thistle: "d8bfd8",
			tomato: "ff6347",
			turquoise: "40e0d0",
			violet: "ee82ee",
			wheat: "f5deb3",
			white: "fff",
			whitesmoke: "f5f5f5",
			yellow: "ff0",
			yellowgreen: "9acd32"
		}
		_names.hex = function(a) {
			var b = {},
				c;
			for (c in a) a.hasOwnProperty(c) && (b[a[c]] = c);
			return b
		}(_names);

		self.compare = function(c) {
			if (c.object) return difference(self.object, c.object);
			else return {};
		}

		// This trys to return a css string that matches (as much as validly possible) the original css string parsed, including the stuff before and after the css
		self.__defineGetter__("cssFull", function(c) {
			var type = self.cssDetails.type;
			var details = self.cssDetails;
			var value;
			if (type) {
				value = self[type].css;
				if (!details.endBracket) {
					value = value.substring(0, value.indexOf(')'));
				} else if (details.suffix) {
					value += details.suffix;
				}
				if (!details.startBracket) {
					value = value.substring(value.indexOf('(') + 1);
				} else if (details.prefix) {
					value = details.prefix + value;
				}
				return value;
			} else {
				return self.rgb.css;
			}
		});

		self.__defineGetter__("css", function(c) {
			if (self.cssDetails.type) {
				return self[self.cssDetails.type].css;
			} else {
				return self.rgb.css;
			}
		});

		// Parses a css string and gets the values ready to pass to Colour
		// Im no good at regex's and all the ones I looked at couldnt do what I wanted...so its out with the steak knives, slice and dice ;)
		// It may not be as fast as the regex stuff (last time I checked it was about 3 times slower), but handles errors alot better and doesnt just give fail if it cant understand it.  This will use what it can with what youve given so far, making it nice for updating as you type
		// Because this is going to be used in a text editor I made it accept crap before and after the css color so I can have lazy selecting.  It records the crap so I can add it back later...cssFull will add it back
		// It does its best to figure what you wanted/meant if there is stuff wrong or missing.  Any thing missing will be replaced with 0, except the alpha which gets 1
		self.__defineSetter__("css", function(value) {
			var lastWord = /(.*[\s;}])(\S+)/; // http://stackoverflow.com/a/5673942/189093
			var onlyNumbers = /[^0-9\.%,]+/g; // ...well, not just numbers but whats valid in the values area
			var cleanHex = /[^0-9aAbBcCdDeEfF#]+/g;
			var types = {
				rgb: 'rgb',
				gb: 'rgb',
				b: 'rgb',
				rgba: 'rgba',
				gba: 'rgba',
				ba: 'rgba',
				a: 'rgba',
				hsl: 'hsl',
				sl: 'hsl',
				l: 'hsl',
				hsla: 'hsla',
				sla: 'hsla',
				la: 'hsla',
				hsv: 'hsv',
				sv: 'hsv',
				v: 'hsv',
				hsva: 'hsva',
				sva: 'hsva',
				va: 'hsva'
			};
			var limits = {
				r: 255,
				g: 255,
				b: 255,
				h: 360,
				s: 100,
				l: 100,
				v: 100,
				a: 1
			};

			var split, prefix, suffix, type, startBracket, endBracket, hash, limit, temp, percentages;
			startBracket = value.indexOf('(');
			endBracket = value.indexOf(')', startBracket);
			if (startBracket !== -1 && endBracket !== -1) {
				type = value.substring(0, startBracket).trim();
				suffix = value.substring(endBracket + 1);
				value = value.substring(startBracket + 1, endBracket);
				startBracket = true;
				endBracket = true;
			} else if (startBracket !== -1) {
				type = value.substring(0, startBracket).trim();
				if (!type) type = 'rgb';
				value = value.substring(startBracket + 1);
				startBracket = true;
				endBracket = false;
			} else if (endBracket !== -1) {
				suffix = value.substring(endBracket + 1);
				value = value.substring(0, endBracket);
				startBracket = false;
				endBracket = true;
				type = 'rgb';
			}
			if (type) {
				split = lastWord.exec(type);
				if (split) {
					prefix = split[1];
					type = split[2];
				}
				value = value.replace(onlyNumbers, '');
				value = value.split(',');
				if (types[type]) type = types[type];
				else type = 'rgb';
				if (value.length > 3) {
					if (type.length === 3) type = type + 'a';
					value.length = 4;
				} else if (value.length < 4) {
					if (type.length === 4) type = type.substring(0, 3);
					value.length = 3;
				}
			} else {
				split = value.indexOf(',');
				if (split === -1) {
					type = 'hex';
					value = value.replace(cleanHex, '');
				} else {
					value = value.replace(onlyNumbers, '');
					value = value.split(',');
					if (value.length > 3) {
						type = 'rgba';
						value.length = 4;
					} else if (value.length < 4) {
						type = 'rgb';
						value.length = 3;
					}
				}
			}
			if (type !== 'hex') {
				for (var i = 0, end = value.length; i < end; i++) {
					if (value[i]) temp = value[i].trim();
					else temp = i === 3 ? '1' : '0';
					limit = limits[type.charAt(i)];
					if (temp.charAt(temp.length - 1) === '%') {
						temp = temp.slice(0, -1);
						if (type.charAt(0) === 'r') {
							temp = mathRound((temp / 100) * limit);
							percentages = true;
						}
					}
					if (temp.charAt(temp.length - 1) === '.') temp = temp + '0';
					if (temp > limit) value[i] = limit;
					else value[i] = Number(temp);
				}
			} else {
				if (value.charAt(0) === '#') {
					value = value.substring(1);
					hash = true;
				} else {
					hash = false;
				}
				if (value.length !== 3 && value.length !== 6) {
					value = value + '000000'.substring(value.length);
				}
			}
			self.cssDetails = {
				value: value,
				suffix: suffix,
				prefix: prefix,
				startBracket: startBracket,
				endBracket: endBracket,
				hash: hash,
				type: type
			}
			self[type](value);
		});

		if (c instanceof Colour) {
			self.rgb.rgba = c.rgb.rgba;
		}
	}


	// http://blog.vjeux.com/2011/javascript/object-difference.html

	function difference(object1, object2) {
		var ret = {};
		for (var name in object1) {
			if (name in object2) {
				if (typeof object2[name] === 'object' && !Array.isArray(object2[name])) {
					var diff = difference(object1[name], object2[name]);
					if (Object.keys(diff).length !== 0) {
						ret[name] = diff;
					}
				} else if (object1[name] !== object2[name]) {
					ret[name] = object2[name];
				}
			}
		}
		return ret;
	}

	root.Color = root.Colour = Colour;
})(this);