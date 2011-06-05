/**
 * Dialog window
 */
var Dialog = function(params){

    /**
     * Div element containing dialog window
     */
    var element;
	
	var handlerElement;

	var messageElement;

    /**
     * Close dialog button
     */
    var closeButton;

    /**
     * Id okna komunikatu
     */
    var windowId = params.windowId || "stp-dialog-"+Math.floor(1000*Math.random());

    /**
     * Belka do przesuwania
     */
    var handlerId = params.handlerId || "stp-dialog-handler-"+Math.floor(1000*Math.random());

    /**
     * Szerokość okna
     */
    this.width = params.width || "250px";

    /**
     * Długość okna
     */
    this.height = params.height || "auto";

    /**
     * Tytuł okna
     */
    this.headerText = params.headerText;

    /**
     * Komunikat
     */
    this.message = params.message;

    /**
     * Determine if window if closable
     */
    var closable = (function(){
        if (params.hasOwnProperty('closable')){
            if(typeof(params.closable) === 'boolean'){
                return params.closable;
            }
            else {
                if(params.closable === "true"){
                    return true;
                }
                else if(params.closable === "false"){
                    return false;
                }
                return true;
            }
        }
        else {
            return true;
        }
    })();

    /**
     * Determine if window is movable
     */
    var movable = (function(){
        if (params.hasOwnProperty('movable')){
            if(typeof(params.movable) === 'boolean'){
                return params.movable;
            }
            else {
                if(params.movable === "true"){
                    return true;
                }
                else if(params.movable === "false"){
                    return false;
                }
                return true;
            }
        }
        else {
            return true;
        }
    })();
        
    /**
     * Czy ma być wyświetlany przycisk "ok"?
     */
    var buttonOk = (function(){
        if (params.hasOwnProperty('buttonOk')){
            if(typeof(params.buttonOk) === 'boolean'){
                return params.buttonOk;
            }
            else {
                if(params.buttonOk === "true"){
                    return true;
                }
                else if(params.buttonOk === "false"){
                    return false;
                }
                return true;
            }
        }
        else {
            return true;
        }
    })();

    /**
     * Replacement for standard "Ok" message
     */
    var buttonOkMessage = params.buttonOkMessage || "Ok";

    /**
     * that = this dla prywatnych metod
     */
    var that = this;

    /**
     * Czy ma być wyświetlany przycisk "ok"?
     */
    this.closeHandler = params.closeHandler || function(){};
    
    var movableElement;

    /**
     * Tworzy okno dialogowe
     */
    var createDialog = function(){

        element = document.createElement('div');
        element.setAttribute("id", windowId);
        element.className = 'stp-dialog-window';
        element.style.zIndex = "1000";
        element.style.width = that.width;
        element.style.height = that.height;
        // center window
        element.style.left = Math.floor((document.body.clientWidth/2 - (parseInt(that.width.replace("px", ""), 10)/2))) + "px";

        handlerElement = document.createElement("div");
        handlerElement.className = 'stp-dialog-windowHandler';
        handlerElement.setAttribute("id", handlerId);
        handlerElement.innerHTML = "<span class='stp-dialog-windowHeaderText'>"+that.headerText+"</span>";

        messageElement = document.createElement("div");
        messageElement.className = 'stp-dialog-windowMessage';
        messageElement.innerHTML = that.message;
        
		/* bring window to front */        
		MJ.addEvent(element, 'mousedown', dialogOnMouseDown);

        increaseIndex();
        if(closable === true){
            var closeX = document.createElement('span');
            closeX.className = 'stp-dialog-closeButton';
            MJ.addEvent(closeX, 'click', (function(e){
                return function(){
                    e.closeDialog();
                }
            })(that));
            handlerElement.appendChild(closeX);
        }
        if(buttonOk === true){
            var d = document.createElement('div');
            d.style.textAlign = "right";
            d.style.padding = "20px 0px 0px 0px";
            closeButton = document.createElement('button');
            closeButton.innerHTML = buttonOkMessage;
            MJ.addEvent(closeButton, 'click', (function(e){
                return function(){
                    e.closeDialog();
                }
            })(that));
            d.appendChild(closeButton);
            messageElement.appendChild(d);
        }
		if(movable === true){	
			that.setMovableElement();
        }
    };
    
    /**
     * Bring window to front
     */
    var dialogOnMouseDown = function(){
        document.getElementById(windowId).style.zIndex = getHighestIndex()+1;
    };

    var increaseIndex = function(){
        element.style.zIndex = getHighestIndex()+1;

    };

	var isOpened = function(){
		console.log(!!document.getElementById(that.getWindowId()));
		return !!document.getElementById(that.getWindowId());
	};
    
    var getHighestIndex = function(){
        var highestIndex = 0;
        var currentIndex = 0;
        var el = Array();
        el = document.getElementsByTagName("div");
        for(var i=0; i < el.length; i++){
            if (el[i].currentStyle){
                currentIndex = parseFloat(el[i].currentStyle['zIndex']);
            } else if(window.getComputedStyle){
                currentIndex = parseFloat(document.defaultView.getComputedStyle(el[i],null).getPropertyValue('z-index'));
            }
            if(!isNaN(currentIndex) && currentIndex > highestIndex){
                highestIndex = currentIndex;
            }
        }
        return highestIndex;
    };
    
    /**
     * Returns div element
     */
    this.getElement = function(){
        return element;
    };
    
    /**
     * Get buttonOkMessage
     */
    this.getButtonOkMessage = function(){
        return buttonOkMessage;
    };
    
    /**
     * Get windowId
     */
    this.getWindowId = function(){
        return windowId;
    };
    
    /**
     * Get handlerId
     */
    this.getHandlerId = function(){
        return handlerId;
    };
    
	/**
     * Get handlerElement
     */
    this.getHandlerElement = function(){
        return handlerElement;
    };

	/**
     * Get messageElement
     */
    this.getMessageElement = function(){
        return messageElement;
    };

    /**
     * Get movableElement
     */
    this.getMovableElement = function(){
        return movableElement;
    };
    
    /**
     * Set movableElement
     */
    this.setMovableElement = function(){
        movableElement = MovableElement.setMovableElement(this.getHandlerElement, this.getElement);
    };
    
    /**
     * Get movable
     */
    this.getMovable = function(){
        return movable;
    };
    
    /**
     * Set movable
     */
    this.setMovable = function(params){
    	//this.movable && MovableElement.setMovableElement(document.getElementById(this.getHandlerId()), document.getElementById(this.getWindowId()));
    };
    
    /**
     * Set buttonOkMessage
     */
    this.setButtonOkMessage = function(text){
        buttonOkMessage = text;
        closeButton.innerHTML = text;
    };

	/**
	 * Open dialog (append to body)
	 */
	this.open = function(){
		if(!isOpened()){
    		this.getElement().appendChild(this.windowHandler);
    		this.getElement().appendChild(this.windowMessage);
    		document.body.appendChild(this.getElement());
		}
	};

    createDialog();
};

/**
 * Show Dialog
 */
Dialog.prototype.show = function(){
    this.getElement().style.display = "block";
};

/**
 * Hide Dialog
 */
Dialog.prototype.hide = function(){
    this.getElement().style.display = "none";
};

/**
 * Zamyka okno oraz uruchamia handler 
 * zdefiniowany przez użytkownika
 */
Dialog.prototype.closeDialog = function(){
    document.body.removeChild(document.getElementById(this.getWindowId()));
    this.closeHandler(this.getWindowId());
};
