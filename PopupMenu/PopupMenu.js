/**
 * Popup menu
 */
var PopupMenu = function(params) {

	/**
	 * Menu width (must be specified with units, i.e. "100px")
	 */
	this.width = (function(params) {
		if (params.hasOwnProperty('width')) {
			if (isNaN(params.width)) {
				return params.width;
			} else {
				return params.width.toString() + "px";
			}
		} else {
			return params.element.offsetWidth + "px";
		}
	})(params);

	/**
	 * Menu entries
	 */
	this.entries = params.entries;

	/**
	 * An element which triggers menu popup
	 */
	this.element = params.element;

	/**
	 * Event activating menu. Available: mouseover, click. Default: click
	 */
	this.activationMethod = params.activationMethod || 'click';

	/**
	 * Menu hide timeout
	 */
	this.hideTimeout = params.hideTimeout || 1;

	/**
	 * x offset
	 */
	this.xOffset = 0;

	/**
	 * y offset
	 */
	this.yOffset = 0;

	/**
	 * Hide menu when click is triggered
	 */
	this.hideOnClick = params.hideOnClick || true;

	/**
	 * Make object available to private methods
	 */
	var that = this;

	/**
	 * Div element id
	 */
	var divElementId = 'mj-popupmenu-' + Math.random();

	/**
	 * Div element
	 */
	var divElement = document.createElement('div');

	/**
	 * Indicates if mouse cursor is over the menu
	 */
	var isOver = false;

	/**
	 * Initialize menu. Create event listeners and populate divElement with html
	 * content.
	 */
	var initialize = function() {

		MJ.addEvent(that.element, that.activationMethod, function() {
			refreshPosition();
			that.onActivation();
		});
		MJ.addEvent(that.element, 'mouseout', function() {
			isOver = false;
			window.setTimeout(function() {
				!isOver && that.hide();
			}, that.hideTimeout);
		});
		MJ.addEvent(that.element, 'mouseover', function() {
			isOver = true;
		});
		MJ.addEvent(divElement, 'mouseout', function() {
			isOver = false;
			window.setTimeout(function() {
				!isOver && that.hide();
			}, that.hideTimeout);
		});
		MJ.addEvent(divElement, 'mouseover', function() {
			isOver = true;
		});

		populateElement();
	};

	/**
	 * Recalculates actual position, and updates this.xOffset and this.yOffset
	 */
	var calculatePosition = function() {
		var position = MJ.getPosition(that.element);
		that.xOffset = (function() {
			var diff = position.x + Number(that.width.replace(/(px)|(pt)/, ''))
					- document.documentElement.clientWidth;
			if (diff > 0) {
				return position.x - diff - 5;
			} else {
				return position.x;
			}
		})();
		that.yOffset = position.y + that.element.offsetHeight;
	};

	/**
	 * Refreshes menu position. Updates divElement's top and left position.
	 */
	var refreshPosition = function() {
		calculatePosition();
		/* override default css-class styles */
		divElement.style.width = that.width;
		divElement.style.top = that.yOffset + 'px';
		divElement.style.left = that.xOffset + 'px';
		divElement.style.display = 'none';
	};

	/**
	 * Create div with menu content.
	 */
	var populateElement = function() {
		MJ.addClass(divElement, 'mj-popupmenu-menu');
		divElement.setAttribute('id', divElementId);
		refreshPosition();

		/* populate menu */
		for ( var i = 0; i < that.entries.length; i++) {
			var liEntryElement = document.createElement('li');
			liEntryElement.innerHTML = that.entries[i].text;

			/* add click event listeners */
			if (typeof that.entries[i].link === 'function') {
				MJ.addEvent(liEntryElement, 'click', (function(e) {
					return function() {
						e.link();
						that.hide();
					};
				})(that.entries[i]));
			} else {
				MJ.addEvent(liEntryElement, 'click', (function(e) {
					return function() {
						location.href = e.link;
					};
				})(that.entries[i]));
			}
			divElement.appendChild(liEntryElement);
		}
		document.body.appendChild(divElement);
	};

	/**
	 * Action performed when menu is triggered
	 */
	this.onActivation = function() {
		if (this.activationMethod === 'mouseover') {
			this.show();
		} else {
			this.toggle();
		}
	};

	/**
	 * Get divElement
	 */
	this.getDivElement = function() {
		return divElement;
	};

	initialize();
};

/**
 * Hide or show menu
 */
PopupMenu.prototype.toggle = function() {
	if (this.getDivElement().style.display !== 'none') {
		this.hide();
	} else {
		this.show();
	}
};

/**
 * Show menu
 */
PopupMenu.prototype.show = function() {
	this.getDivElement().style.display = 'block';
};

/**
 * Hide menu
 */
PopupMenu.prototype.hide = function() {
	this.getDivElement().style.display = 'none';
};
