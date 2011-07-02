/**
 * Dialog window
 */
var Dialog = function(params){

    /**
     * Main DOM element containing dialog window
     */
    var element;

    /**
     * Element containing window handler
     */
    var handlerElement;
    
    /**
     * Element containing message
     */
    var messageElement;
    
    /**
     * MovableElement attached to dialog 
     */
    var movableElement;

    /**
     * Close dialog button
     */
    var closeButton;

    /**
     * Dialog ID
     */
    var windowId = params.windowId || "mj-dialog-"+Math.floor(1000*Math.random());

    /**
     * Handler ID
     */
    var handlerId = params.handlerId || "mj-dialog-handler-"+Math.floor(1000*Math.random());

    /**
     * Dialog width
     */
    this.width = params.width || "250px";

    /**
     * Dialog height
     */
    this.height = params.height || "auto";

    /**
     * Dialog header text
     */
    this.headerText = params.headerText;

    /**
     * Message
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
     * Is close (x) button displayed?
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
     * that = this for private methods
     */
    var that = this;

    /**
     * Is "OK" button displayed?
     */
    this.closeHandler = params.closeHandler || function(){};
    
    /**
     * Create Dialog's DOM nodes
     * @private
     */
    var createDialog = function(){

        element = document.createElement('div');
        element.setAttribute("id", windowId);
        element.className = 'mj-dialog-window';
        element.style.zIndex = "1000";
        element.style.width = that.width;
        element.style.height = that.height;
        // center window
        element.style.left = Math.floor((document.body.clientWidth/2 - (parseInt(that.width.replace("px", ""), 10)/2))) + "px";
        element.style.top = "200px";

        handlerElement = document.createElement("div");
        handlerElement.className = 'mj-dialog-windowHandler';
        handlerElement.setAttribute("id", handlerId);
        handlerElement.innerHTML = "<span class='mj-dialog-windowHeaderText'>"+that.headerText+"</span>";

        messageElement = document.createElement("div");
        messageElement.className = 'mj-dialog-windowMessage';
        messageElement.innerHTML = that.message;
        
        /* bring window to front */        
        MJ.addEvent(element, 'mousedown', dialogOnMouseDown);

        increaseIndex();
        if(closable === true){
            var closeX = document.createElement('span');
            closeX.className = 'mj-dialog-closeButton';
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
     * Bring window to front when left mouse
     * button was pressed.
     * @private
     */
    var dialogOnMouseDown = function(){
        element.style.zIndex = getHighestIndex()+1;
    };

    /**
     * Increase z-index
     * @private
     */
    var increaseIndex = function(){
        element.style.zIndex = getHighestIndex()+1;

    };

    /**
     * Get highest z-index
     * @private
     */
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
     * Is dialog already appended to body?
     * @private
     */
    var isOpened = function(){
        return !!document.getElementById(windowId);
    };
    
    /**
     * Open dialog (append to body)
     * @private
     */
    var open = function(){
        if(!isOpened()){
            element.appendChild(handlerElement);
            element.appendChild(messageElement);
            document.body.appendChild(element);
            var count = 0;
            var el = document.getElementsByTagName('div');
            for(var i=0; i<el.length; i++){
                if(el[i].className === 'mj-dialog-window'){
                    count++;
                }
            }
            element.style.top = Number(element.style.top.replace(/px/, ''))+50*(count-1) + "px";
            element.style.left = Number(element.style.left.replace(/px/, ''))+50*(count-1) + "px";
        }
    };
    
    /**
     * Get main element
     */
    this.getElement = function(){
        return element;
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
     * Get button text
     */
    this.getButtonOkMessage = function(){
        return buttonOkMessage;
    };
    
    /**
     * Set button text
     */
    this.setButtonOkMessage = function(text){
        buttonOkMessage = text;
        closeButton.innerHTML = text;
    };
    
    /**
     * Get dialog's main window ID
     */
    this.getWindowId = function(){
        return windowId;
    };
    
    /**
     * Get dialog's window handler ID
     */
    this.getHandlerId = function(){
        return handlerId;
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
        movableElement = MovableElement.setMovableElement(this.getHandlerElement(), this.getElement());
    };
    
    /**
     * Get movable property
     */
    this.getMovable = function(){
        return movable;
    };
    
    /**
     * Set movable property
     */
    this.setMovable = function(params){
    //this.getMovableElement().removeMovableElement();
    };
    
    /**
     * Show Dialog
     */
    this.show = function(){
        !isOpened() && open();
        this.getElement().style.display = "block";
    };

    /**
     * Hide Dialog
     */
    this.hide = function(){
        this.getElement().style.display = "none";
    };

    /**
     * Close dialog (remove it from body) and run
     * user defined handler (if any)
     */
    this.closeDialog = function(){
        document.body.removeChild(document.getElementById(this.getElement().getAttribute('id')));
        this.closeHandler(this.getElement().getAttribute('id'));
    };

    createDialog();
};