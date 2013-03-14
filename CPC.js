CPC = function(root, options) {

	var self = this;
	
	if (!root) root = document;
	else root = document.querySelectorAll(root);

	
	self.onUpdate='';
	self.updateDelay=36;
	self.bullsEye='';
	if (options) {
		$mergeObj(options, self);
	}

	var elements = new Elements();

	self.color = new Colour();
	var hsl = self.color.hsl;
	var hsv = self.color.hsv;
	var rgb = self.color.rgb;

	self.hsvWells = [];
	self.hueWells = [];
	self.colorWells = [];
	self.lightnessWells = [];
	self.saturationWells = []; // I go by the saturation of hsl, not hsv....might add hsv later
	self.alphaWells = [];

	//	PAEz - Following is the simplist drag selecting I could come up with ;)
	var draggingElement = '';

	window.addEventListener('mouseup', function() {
		if (draggingElement !== '') {
			draggingElement = '';
		}
	});
	window.addEventListener('mousemove', function(e) {
		if (draggingElement !== '') {
			draggingElement.dragUpdate(e);
		}
	});
	self.addDragSelector = function(Element) {
		Element.onmousedown = function(e) {
			draggingElement = Element;
			draggingElement.dragUpdate(e);
			e.preventDefault();
		}
	}

	self.hsvWellOverlayDraw = function() {
		a = document.createElement('canvas');
		a.width = 256;
		a.height = 256;
		var context = a.getContext('2d');
		var gradient = context.createLinearGradient(1, 1, 255, 1);
		gradient.a=gradient.addColorStop;
		gradient.a(0, "rgba(255 , 255, 255,1)");
		gradient.a(1, "rgba(255, 255, 255,0)");
		context.fillStyle = gradient;
		context.fillRect(0, 0, 256, 256);
		gradient = context.createLinearGradient(0, 0, 1, 255);
		gradient.a=gradient.addColorStop;
		gradient.a(0, "rgba(0, 0, 0,0)");
		gradient.a(1, "rgba(0, 0, 0,1)");
		context.fillStyle = gradient;
		context.fillRect(0, 0, 256, 256);
		a.context = context;
		return a;
	}

	self.hsvWellOverlay = self.hsvWellOverlayDraw();

	self.addHSVWells = function(root) {
		var wells = root.querySelectorAll('canvas[data-cpc_hsvWell]');
		var well;
		for (var i = 0, end = wells.length; i < end; i++) {
			well = wells[i];
			well.uid = elements.add(well);
			well.context = well.getContext('2d');
			well.dragUpdate = function(e) {
				var relCoords = relMouseCoords(e, this);
				// need to pause the onChange when updating 2 or more values....hmmmm, maybe I should dump that?
				//self.color.onChange='';
				//hsv.s = (relCoords.x / this.clientWidth) * 100;
				//self.color.onChange=self.update;
				//hsv.v = ((this.clientHeight - relCoords.y) / this.clientHeight) * 100;
				
				// Or lets try it this way....
				var _hsv = hsv();
				_hsv.s = (relCoords.x / this.clientWidth) * 100;
				_hsv.v = ((this.clientHeight - relCoords.y) / this.clientHeight) * 100;
				hsv(_hsv);
				
			}
			self.addDragSelector(well);
			self.hsvWells.push(well);
		}
	}

	self.drawHSVWells = function() {
		for (var i = 0, end = self.hsvWells.length; i < end; i++) {
			var well = self.hsvWells[i];
			well.style.background = "hsl( " + hsv.h + ", 100%, 50%)";
			well.context.clearRect(0, 0, well.width, well.height);  // FF cant copy, so we clear instead?!?!?
			//well.context.globalCompositeOperation = 'copy';
			well.context.drawImage(self.hsvWellOverlay, 0, 0, well.clientWidth, well.clientHeight);
			
			self.updateBullsEye(well);
		}
	}
	// Start Alpha
	self.alphaWellBackgroundDraw = function(size,color1,color2) {
		a = document.createElement('canvas');
		a.width = size*2;
		a.height = size*2;
		var context = a.getContext('2d');
		context.clearRect(0, 0, a.width, a.height);
		context.fillStyle = color1;
		context.fillRect(size,0,size*2,size);
		context.fillRect(0,size,size,size*2);
		context.fillStyle = color2;
		context.fillRect(size,size,size*2,size*2);
		context.fillRect(0,0,size,size);
		a.context = context;
		return a;
	}

	self.alphaWellBackground = self.alphaWellBackgroundDraw(8,'rgb(0,0,0)','rgb(255,255,255)');
	self.alphaBullsEyeBackground = self.alphaWellBackgroundDraw(8,'rgb(255,255,255)','rgb(0,0,0)');

	self.addAlphaWells = function(root) {
		var wells = root.querySelectorAll('canvas[data-cpc_alphawell]');
		var well;
		for (var i = 0, end = wells.length; i < end; i++) {
			well = wells[i];
			well.uid = elements.add(well);
			well.context = well.getContext('2d');
			if (well.clientHeight > well.clientWidth) {
				well.orientation = 'y';
			} else {
				well.orientation = 'x';
			}
			well.dragUpdate = function(e) {
				var relCoords = relMouseCoords(e, this);
				var h;
				if (this.orientation === 'x') {
					self.color.alpha = relCoords.x / this.clientWidth;
				} else {
					self.color.alpha = 1-(relCoords.y / this.clientHeight);
				}
			}
			self.addDragSelector(well);
			self.alphaWells.push(well);
		}
	}
	

	self.drawAlphaWells = function() {
		for (var i = 0, end = self.alphaWells.length; i < end; i++) {
			var well = self.alphaWells[i];
			var ctx = well.context;
			well.context.clearRect(0, 0, well.width, well.height);
			var pattern = well.context.createPattern(self.alphaWellBackground, "repeat");
			well.context.fillStyle = pattern;
			ctx.fillRect(0,0,well.width,well.height);
			var gradient = ctx.createLinearGradient(0, 0, well.width, well.height);
			var _color = "" + rgb.r + "," + rgb.g + "," + rgb.b;
			if (well.orientation==='y'){
				gradient.addColorStop(0, "rgba("+_color+",1)");
				gradient.addColorStop(1, "rgba("+_color+",0)");
			} else {
				gradient.addColorStop(0, "rgba("+_color+",0)");
				gradient.addColorStop(1, "rgba("+_color+",1)");
				
			}
			ctx.fillStyle = gradient;
			ctx.fillRect(0, 0, well.width, well.height);
			self.updateBullsEye(well);
		}
	}
	// End Alpha
	self.lightnessWellOverlayDraw = function(orientation) {
		a = document.createElement('canvas');
		a.width = orientation === 'x' ? 256 : 1;
		a.height = orientation === 'y' ? 256 : 1;
		var context = a.getContext('2d');
		context.clearRect(0, 0, a.width, a.height);
		var gradient = context.createLinearGradient(0, 0, a.width, a.height);
		if (orientation==='y'){
			gradient.addColorStop(0, "rgba(255 , 255, 255,1)");
			gradient.addColorStop(0.5, "rgba(255 , 255, 255,0)");
			gradient.addColorStop(0.500000000000001, "rgba(0 , 0, 0,0)");
			gradient.addColorStop(1, "rgba(0, 0, 0,1)");
		} else {
			gradient.addColorStop(0, "rgba(0, 0, 0,1)");
			gradient.addColorStop(0.5, "rgba(0 , 0, 0,0)");
			gradient.addColorStop(0.500000000000001, "rgba(255 , 255, 255,0)");
			gradient.addColorStop(1, "rgba(255 , 255, 255,1)");
			
		}
		context.fillStyle = gradient;
		context.fillRect(0, 0, a.width, a.height);
		a.context = context;
		return a;
	}
	self.addLightnessWells = function(root) {
		var wells = root.querySelectorAll('canvas[data-cpc_lightnesswell]');
		var well;
		for (var i = 0, end = wells.length; i < end; i++) {
			well = wells[i];
			well.uid = elements.add(well);
			well.context = well.getContext('2d');
			if (well.clientHeight > well.clientWidth) {
				well.orientation = 'y';
			} else {
				well.orientation = 'x';
			}
			well.dragUpdate = function(e) {
				var relCoords = relMouseCoords(e, this);
				var h;
				if (this.orientation === 'x') {
					hsl.l = (relCoords.x / this.clientWidth) * 100;
				} else {
					hsl.l = 100-((relCoords.y / this.clientHeight) * 100);
				}
				//hsl.l = h === 360 ? 359.999 : h;
				//console.debug(relCoords.x);
			}
			self.addDragSelector(well);
			self.lightnessWells.push(well);
		}
	}
	self.lightnessWellOverlay = {};
	self.lightnessWellOverlay.x = self.lightnessWellOverlayDraw('x');
	self.lightnessWellOverlay.y = self.lightnessWellOverlayDraw('y');

	self.drawLightnessWells = function() {
		for (var i = 0, end = self.lightnessWells.length; i < end; i++) {
			var well = self.lightnessWells[i];
			well.context.clearRect(0, 0, well.width, well.height);  // FF cant 'copy', so we clear instead?!?!?
			//well.context.globalCompositeOperation = 'copy';
			//console.debug(well.height)
			well.context.drawImage(self.lightnessWellOverlay[well.orientation], 0, 0, well.width, well.height);
			well.style.background = "hsl( " + hsv.h + ", 100%, 50%)";
			self.updateBullsEye(well);
		}
	}
	self.saturationWellOverlayDraw = function(orientation) {
		a = document.createElement('canvas');
		a.width = orientation === 'x' ? 256 : 1;
		a.height = orientation === 'y' ? 256 : 1;
		var context = a.getContext('2d');
		context.clearRect(0, 0, a.width, a.height);
		var gradient = context.createLinearGradient(0, 0, a.width, a.height);
		if (orientation==='y'){
			gradient.addColorStop(1, "rgba(128 , 128, 128,1)");
			gradient.addColorStop(0, "rgba(128, 128, 128,0)");
		} else {
			gradient.addColorStop(1, "rgba(128 , 128, 128,0)");
			gradient.addColorStop(0, "rgba(128, 128, 128,1)");	
		}
		context.fillStyle = gradient;
		context.fillRect(0, 0, a.width, a.height);
		a.context = context;
		return a;
	}
	self.saturationWellOverlay = {};
	self.saturationWellOverlay.x = self.saturationWellOverlayDraw('x');
	self.saturationWellOverlay.y = self.saturationWellOverlayDraw('y');

	self.drawSaturationWells = function() {
		for (var i = 0, end = self.saturationWells.length; i < end; i++) {
			var well = self.saturationWells[i];
			well.context.clearRect(0, 0, well.width, well.height);  // FF cant 'copy', so we clear instead?!?!?
			//well.context.globalCompositeOperation = 'copy';
			well.context.drawImage(self.saturationWellOverlay[well.orientation], 0, 0, well.width, well.height);
			well.style.background = "hsl( " + hsv.h + ", 100%, 50%)";
			self.updateBullsEye(well);
		}
	}
	self.addSaturationWells = function(root) {
		var wells = root.querySelectorAll('canvas[data-cpc_saturationwell]');
		var well;
		for (var i = 0, end = wells.length; i < end; i++) {
			well = wells[i];
			well.uid = elements.add(well);
			well.context = well.getContext('2d');
			if (well.clientHeight > well.clientWidth) {
				well.orientation = 'y';
			} else {
				well.orientation = 'x';
			}
			well.dragUpdate = function(e) {
				var relCoords = relMouseCoords(e, this);
				var h;
				if (this.orientation === 'x') {
					hsl.s = (relCoords.x / this.clientWidth) * 100;
				} else {
					hsl.s = 100-((relCoords.y / this.clientHeight) * 100);
				}
			}
			self.addDragSelector(well);
			self.saturationWells.push(well);
		}
	}

	self.hueWellOverlayDraw = function(orientation) {
		a = document.createElement('canvas');
		a.width = orientation === 'x' ? 360 : 1;
		a.height = orientation === 'y' ? 360 : 1;
		var context = a.getContext('2d');
		var huegradient = context.createLinearGradient(0, 0, a.width, a.height);
		huegradient.a=huegradient.addColorStop;  // this is just so it packs better....wonder if theres anything bad about doing this?...feel free to flame ;)
		if (orientation==='x'){

			huegradient.a(1, "hsl(0, 100%, 50%)");
			huegradient.a(0.9, "hsl(36, 100%, 50%)");
			huegradient.a(0.8, "hsl(72, 100%, 50%)");
			huegradient.a(0.7, "hsl(108, 100%, 50%)");
			huegradient.a(0.6, "hsl(144, 100%, 50%)");
			huegradient.a(0.5, "hsl(180, 100%, 50%)");
			huegradient.a(0.4, "hsl(216, 100%, 50%)");
			huegradient.a(0.3, "hsl(252, 100%, 50%)");
			huegradient.a(0.2, "hsl(288, 100%, 50%)");
			huegradient.a(0.1, "hsl(324, 100%, 50%)");
			huegradient.a(0, "hsl(360, 100%, 50%)");
		} else {
			huegradient.a(0, "hsl(0, 100%, 50%)");
			huegradient.a(0.1, "hsl(36, 100%, 50%)");
			huegradient.a(0.2, "hsl(72, 100%, 50%)");
			huegradient.a(0.3, "hsl(108, 100%, 50%)");
			huegradient.a(0.4, "hsl(144, 100%, 50%)");
			huegradient.a(0.5, "hsl(180, 100%, 50%)");
			huegradient.a(0.6, "hsl(216, 100%, 50%)");
			huegradient.a(0.7, "hsl(252, 100%, 50%)");
			huegradient.a(0.8, "hsl(288, 100%, 50%)");
			huegradient.a(0.9, "hsl(324, 100%, 50%)");
			huegradient.a(1, "hsl(360, 100%, 50%)");
		}
		context.fillStyle = huegradient;
		context.fillRect(0, 0, a.width, a.height);
		a.context = context;
		return a;
	}

	self.hueWellOverlay = {};
	self.hueWellOverlay.x = self.hueWellOverlayDraw('x');
	self.hueWellOverlay.y = self.hueWellOverlayDraw('y');

	self.addHueWells = function(root) {
		var wells = root.querySelectorAll('canvas[data-cpc_hueWell]');
		var well;
		for (var i = 0, end = wells.length; i < end; i++) {
			well = wells[i];
			well.uid = elements.add(well);
			well.context = well.getContext('2d');
			if (well.clientHeight > well.clientWidth) {
				well.orientation = 'y';
			} else {
				well.orientation = 'x';
			}
			well.dragUpdate = function(e) {
				var relCoords = relMouseCoords(e, this);
				var h;
				// if the hue gets up to 360 it will go to 0 which can makes some things bug, so i reduce it by .001 which = red 255 anywayz
				// prob is I want to be able to set the luminance by hsl later and if I do and hue is 360 from using hsv it will jump back the hue to 0
				// and its all cool because internaly color stores 0 to 1 and rounds out when you ask for a value, so hue comes as 360, red 255...all good
				// and Ive noticed a few other pickers suffer from this
				// ....actually, move this to Colour.js...or not
				if (this.orientation === 'x') {
					h = 360-(relCoords.x / this.clientWidth) * 360;
				} else {
					h = (relCoords.y / this.clientHeight) * 360;
				}
				hsl.h = h === 360 ? 359.999 : h;
			}
			self.addDragSelector(well);
			self.hueWells.push(well);
		}
	}

	self.drawHueWells = function() {
		for (var i = 0, end = self.hueWells.length; i < end; i++) {
			var well = self.hueWells[i];
			well.context.clearRect(0, 0, well.width, well.height);  // FF cant 'copy', so we clear instead?!?!?
			//well.context.globalCompositeOperation = 'copy';
			well.context.drawImage(self.hueWellOverlay[well.orientation], 0, 0, well.clientWidth, well.clientHeight);
			self.updateBullsEye(well);
		}
	}

	self.drawBullsEye = function(element, radius, x, y, outlineColor, fillColor) {

		var ctx = element.context;
		ctx.lineWidth = 2;
		ctx.strokeStyle = outlineColor;
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
		if (fillColor){
			ctx.fillStyle=fillColor;
			ctx.fill();	
			console.debug(fillColor)
		}
		ctx.stroke();
		ctx.closePath();
	}

	self.drawAlphaBullsEye = function(element, radius, x, y, outlineColor) {
		var ctx = element.context;
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.strokeStyle = '#000';
		ctx.arc(x, y, radius+1, 0, 2 * Math.PI, false);
		ctx.stroke();
		ctx.strokeStyle = outlineColor;
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
		var pattern = ctx.createPattern(self.alphaBullsEyeBackground, "repeat");
		ctx.fillStyle = pattern;
		ctx.fill();	
		ctx.stroke();
		ctx.closePath();
	}

	self.updateBullsEye = function(element) {
		var x, y, color, fillColor;
		var width = element.clientWidth;
		var height = element.clientHeight;
		var size = element.orientation === 'y' ? width/4 : height/4;

		if (element.dataset['cpc_hsvwell'] !== undefined) {
			x = (hsv.s / 100) * width;
			y = height - ((hsv.v / 100) * height);
			if (self.color.luma >0.542) {
				color = "hsl( 0, 100%, 0%)";
			} else {
				color = "hsl( 0, 100%, 100%)";
			}
			size = 5;
		} else if (element.dataset['cpc_huewell'] !== undefined) {
			if (element.orientation === 'x') {
				y = height / 2;
				x = width-hsv.h / 360 * width;
			} else {
				y = hsv.h / 360 * height;
				x = width / 2;
			}
			if (self.color.huesLuma > 0.542) {

				color = "hsl( 0, 100%, 0%)";
			} else {
				color = "hsl( 0, 100%, 100%)";
			}
		} else if (element.dataset['cpc_lightnesswell'] !== undefined) {
			if (element.orientation === 'x') {
				y = height / 2;
				x = hsl.l / 100 * width;
			} else {
				y = height-(hsl.l / 100 * height);
				x = width / 2;
			}
			if ((hsl.l>75||self.color.huesLuma > 0.542)&&!(hsl.l<25)) {
				color = "hsl( 0, 100%, 0%)";
			} else {
				color = "hsl( 0, 100%, 100%)";
			}
		} else if (element.dataset['cpc_saturationwell'] !== undefined) {
			if (element.orientation === 'x') {
				y = height / 2;
				x = hsl.s / 100 * width;
			} else {
				y = height-(hsl.s / 100 * height);
				x = width / 2;
			}
			//console.debug((self.color.huesLuma*100))
			if (hsl.s>30&&self.color.huesLuma > 0.542) {
				color = "hsl( 0, 100%, 0%)";
			} else {
				color = "hsl( 0, 100%, 100%)";
			}
		} else if (element.dataset['cpc_alphawell'] !== undefined) {
			if (element.orientation === 'x') {
				y = height / 2;
				x = self.color.alpha * width;
			} else {
				y = height-(self.color.alpha * height);
				x = width / 2;
			}
			fillColor ='#888888';
			color ='#ffffff';
			if ( self.bullsEye == '' ) {
				self.drawAlphaBullsEye(element, size, x, y, color);
			} else {
				self.bullsEye(element, size, x, y, color,fillColor);
			} 
			return
		}
		if ( self.bullsEye == '' ) {
			self.drawBullsEye(element, size, x, y, color)
		} else {
			self.bullsEye(element, size, x, y, color,fillColor);
		}
	}

	self.addColorWells = function(root) {
		var wells = root.querySelectorAll('canvas[data-cpc_colorWell]');
		var well;
		
		for (var i = 0, end = wells.length; i < end; i++) {
			well = wells[i];
			well.uid = elements.add(well);
			well.context = well.getContext('2d');
			if (well.clientHeight > well.clientWidth) {

				well.orientation = 'y';
			} else {
				well.orientation = 'x';
			}
			self.colorWells.push(well);
		}
	}

	self.drawColorWells = function() {
		for (var i = 0, end = self.colorWells.length; i < end; i++) {
			var well = self.colorWells[i];
			well.style.background = rgb.css;
			
			var well = self.colorWells[i];
			var ctx = well.context;
			well.context.clearRect(0, 0, well.width, well.height);
			var pattern = well.context.createPattern(self.alphaWellBackground, "repeat");
			well.context.fillStyle = pattern;
			ctx.fillRect(0,0,well.width,well.height);

			if (well.dataset['cpc_colorwell_split'] !== undefined) {
				if (well.orientation=='y') {
					well.context.fillStyle = self.color.hex.rgb;
					ctx.fillRect(0,Math.round(well.height/2),well.width,well.height);
					well.context.fillStyle = self.color.rgba.css;
					ctx.fillRect(0,0,well.width,Math.round(well.height/2));
				} else {
					well.context.fillStyle = self.color.hex.rgb;
					ctx.fillRect(Math.round(well.width/2),0,well.width,well.height);
					well.context.fillStyle = self.color.rgba.css;
					ctx.fillRect(0,0,Math.round(well.width/2),well.height);
				}
			} else if (well.dataset['cpc_colorwell_alpha'] !== undefined) {
				well.context.fillStyle = self.color.css;
				ctx.fillRect(0,0,well.width,well.height);
			} else{
				well.context.fillStyle = self.color.hex.rgb;
				ctx.fillRect(0,0,well.width,well.height);
			}
		}
	}


	self.update = Cowboy.throttle(self.updateDelay, false, function() {
		if (self.onUpdate!='') self.onUpdate();
		self.drawHSVWells();
		self.drawHueWells();
		self.drawColorWells();
		self.drawLightnessWells();
		self.drawSaturationWells();
		self.drawAlphaWells();
	})

	self.color.onChange = self.update;

	self.addHSVWells(root);
	self.addHueWells(root);
	self.addColorWells(root);
	self.addLightnessWells(root);
	self.addSaturationWells(root);
	self.addAlphaWells(root);

	self.color.rgb([255, 0, 0]);
}

Elements = function() {
	var self = this;

	self.element = {};

	self.add = function(what) {
		var uid;
		while (!self.element[uid]) {
			uid = Math.random().toString(36).substr(2, 9);
			if (!self.element[uid]) self.element[uid] = what ? what : true;
		}
		return uid;
	}
}
// http://stackoverflow.com/a/5932203/189093

function relMouseCoords(event, element) {
	var totalOffsetX = 0;
	var totalOffsetY = 0;
	var currentElement = element;

	do {
		totalOffsetX += currentElement.offsetLeft;
		totalOffsetY += currentElement.offsetTop;
	}
	while (currentElement = currentElement.offsetParent)

	return {
		x: Math.max(0, Math.min(event.pageX - totalOffsetX, element.clientWidth)),
		y: Math.max(0, Math.min(event.pageY - totalOffsetY, element.clientHeight))
	}
}

$mergeObj = function(source, destination) {
	var i = 0,
	key, value;
	// console.debug(source)
	var keys = Object.keys(source);
	var length = keys.length;
	for(; i < length; i++) {
		key = keys[i];
		value = source[key];
		if(Array.isArray(value)) {
			
			if(!Array.isArray(destination[key])) destination[key] = [];
			$mergeArray(value, destination[key]);
		} else if(value !== null && typeof value == 'object') {
			//	console.debug('obj',value)
			if(Array.isArray(destination[key]) || typeof destination[key] != 'object') destination[key] = {};
			$mergeObj(value, destination[key]);
		} else {
			destination[key] = value;
		}
	}
	return destination;
};

$mergeArray = function(source, destination) {
	console.debug(source,destination)
	var key = 0,
	length = source.length,
	value;
	for(; key < length; key++) {
		value = source[key];
		if(Array.isArray(value)) {
			// if(destination[key] === undefined || !Array.isArray(destination[key])) destination[key] = [];
			if(!Array.isArray(destination[key])) destination[key] = [];
			$mergeArray(value, destination[key]);
		} else if(value !== null && typeof value == 'object') {
			if(Array.isArray(destination[key]) || typeof destination[key] != 'object') destination[key] = {};
			$mergeObj(value, destination[key]);
		} else {
			destination[key] = value;
		}
	}
	return destination;
};

/*
 * jQuery throttle / debounce - v1.1 - 3/7/2010
 * http://benalman.com/projects/jquery-throttle-debounce-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function(b,c){var $=b.jQuery||b.Cowboy||(b.Cowboy={}),a;$.throttle=a=function(e,f,j,i){var h,d=0;if(typeof f!=="boolean"){i=j;j=f;f=c}function g(){var o=this,m=+new Date()-d,n=arguments;function l(){d=+new Date();j.apply(o,n)}function k(){h=c}if(i&&!h){l()}h&&clearTimeout(h);if(i===c&&m>e){l()}else{if(f!==true){h=setTimeout(i?k:l,i===c?e-m:e)}}}if($.guid){g.guid=j.guid=j.guid||$.guid++}return g};$.debounce=function(d,e,f){return f===c?a(d,e,false):a(d,f,e!==false)}})(this)