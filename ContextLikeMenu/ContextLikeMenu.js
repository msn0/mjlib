/**
 * mjlib is released under MIT
 * Copyright (c) 2011 Michał Jezierski
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

/**
 * Context-like menu
 */
var ContextLikeMenu = function(params) {

	/**
	 * Menu width (must be specified with units, i.e. "100px")
	 */
	this.width = params.width || params.element.offsetWidth + "px";

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
	 * Make object available to private methods
	 */
	var that = this;

	/**
	 * Div element id
	 */
	var divElementId = 'mj-contextlikemenu-' + Math.random();

	/**
	 * Div element
	 */
	var divElement = document.createElement('div');

	var isOver = false;

	/**
	 * Initialize
	 */
	var initialize = function() {

		MJ.addEvent(that.element, that.activationMethod, function() {
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
	 * Create div with menu content
	 * 
	 * @returns
	 */
	var populateElement = function() {

		MJ.addClass(divElement, 'mj-contextlikemenu-menu');
		divElement.setAttribute('id', divElementId);

		/* override default css-class styles */
		divElement.style.width = that.width;
		divElement.style.top = (that.element.offsetTop + that.element.offsetHeight)
				+ 'px';
		divElement.style.left = that.element.offsetLeft + 'px';
		divElement.style.display = 'none';

		/* populate menu */
		for ( var i = 0; i < that.entries.length; i++) {
			var liEntryElement = document.createElement('li');
			liEntryElement.innerHTML = that.entries[i].text;

			/* add click event listeners */
			if (typeof that.entries[i].link === 'function') {
				MJ.addEvent(liEntryElement, 'click', (function(e) {
					return function() {
						e.link();
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

	this.getDivElement = function() {
		return divElement;
	};

	initialize();
};

/**
 * Hide or show menu
 */
ContextLikeMenu.prototype.toggle = function() {
	if (this.getDivElement().style.display !== 'none') {
		this.hide();
	} else {
		this.show();
	}
};

/**
 * Show menu
 */
ContextLikeMenu.prototype.show = function() {
	this.getDivElement().style.display = 'block';
};

/**
 * Hide menu
 */
ContextLikeMenu.prototype.hide = function() {
	this.getDivElement().style.display = 'none';
};
