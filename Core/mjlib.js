/**
 * mjlib is released under the MIT License
 * Copyright (c) 2011 Michał Jezierski [ambinanitelo (at) g m a i l (dot) c 0 m]
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
 * MJ core object. Actual functionality contains: (1) fast css class
 * manipulation engine (2) cross-browser support (3) getting elements absolute
 * position (4) xhr requests
 */
var MJ = {

	/**
	 * Check if object has desired class
	 * 
	 * @param obj - examined object
	 * @param clsName - checked className
	 */
	hasClass : function(obj, clsName) {
		return ((' ' + obj.className + ' ').indexOf(' ' + clsName + ' ') > -1);
	},

	/**
	 * Remove class from object
	 * 
	 * @param obj - examined object
	 * @param clsName - class to be removed
	 */
	removeClass : function(obj, clsName) {
		if (MJ.hasClass(obj, clsName)) {
			var cls = ' ' + obj.className + ' ';
			obj.className = cls.replace(' ' + clsName + ' ', ' ').replace(
					/\s(.*)\s$/, '$1');
		}
	},

	/**
	 * Add class to object
	 * 
	 * @param obj - examined object
	 * @param clsName - class to be added
	 */
	addClass : function(obj, clsName) {
		if (MJ.hasClass(obj, clsName)) {
			return;
		} else {
			obj.className += ' ' + clsName;
		}

	},

	/**
	 * Toggle objects class
	 * 
	 * @param obj - examined object
	 * @param clsName - class to be toggle
	 */
	toggleClass : function(obj, clsName) {
		if (MJ.hasClass(obj, clsName)) {
			MJ.removeClass(obj, clsName);
		} else {
			MJ.addClass(obj, clsName);
		}
	},

	/**
	 * Cross-browser event addition
	 * 
	 * @param obj
	 * @param eventType
	 * @param eventHandler
	 * @param useCapture
	 */
	addEvent : function(obj, eventType, eventHandler, useCapture) {
		useCapture || (useCapture = false);
		if (obj.addEventListener) {
			obj.addEventListener(eventType, eventHandler, true);
		} else if (obj.attachEvent) {
			obj.attachEvent('on' + eventType, eventHandler);
		}
	},

	/**
     * Get objects absolute position
     * @param obj
     * @return x, y
     */
    getPosition : function(obj) {
        var xOffset = 0, yOffset=0;
        if(obj.offsetParent) {
            while(obj!=null){
                xOffset += obj.offsetLeft;
                yOffset += obj.offsetTop;
                obj = obj.offsetParent;
            }
        } else if(obj.x) {
            xOffset += obj.x;
            yOffset += obj.y;
        }
        return {
            x: xOffset,
            y: yOffset
        };
    }
	
};
