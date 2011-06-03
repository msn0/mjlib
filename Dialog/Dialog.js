/**
 * Dialog window
 */
var Dialog = function(params){

    /**
     * Div element containing dialog window
     */
    var element;

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
    this.buttonOk = (typeof (params.buttonOk) === 'boolean') ? params.buttonOk : true;

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

        that.windowHandler = document.createElement("div");
        that.windowHandler.className = 'stp-dialog-windowHandler';
        that.windowHandler.setAttribute("id", handlerId);
        that.windowHandler.innerHTML = "<span class='stp-dialog-windowHeaderText'>"+that.headerText+"</span>";

        that.windowMessage = document.createElement("div");
        that.windowMessage.className = 'stp-dialog-windowMessage';
        that.windowMessage.innerHTML = that.message;
        
        MJ.addEvent(element, 'mousedown', dialogOnMouseDown);

        increaseIndex();

        if(that.closable === true){
            var closeX = document.createElement('span');
            //closeX.setAttribute("class", "stp-dialog-closeButton");
            closeX.className = 'stp-dialog-closeButton';
            MJ.addEvent(closeX, 'click', (function(e){
                return function(){
                    e.closeDialog();
                }
            })(that));
            that.windowHandler.appendChild(closeX);
        }
        if(that.buttonOk === true){
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
            that.windowMessage.appendChild(d);
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
     * Get movableElement
     */
    this.getMovableElement = function(){
        return movableElement;
    };
    
    /**
     * Set movableElement
     */
    this.setMovableElement = function(){
        movableElement = MovableElement.setMovableElement(document.getElementById(this.getHandlerId()), document.getElementById(this.getWindowId()));
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
//        if(typeof params !== "undefined" && params.hasOwnProperty('handlerId')){
//            this.movable && MovableElement.setMovableElement(document.getElementById(params.handlerId), document.getElementById(this.getWindowId()));
//        }
//        else {
            this.movable && MovableElement.setMovableElement(document.getElementById(this.getHandlerId()), document.getElementById(this.getWindowId()));
//        }
    };
    
    /**
     * Set buttonOkMessage
     */
    this.setButtonOkMessage = function(text){
        buttonOkMessage = text;
        closeButton.innerHTML = text;
    };

    createDialog();
};

/**
 * Metoda pokazuje okienko dialogowe
 */
Dialog.prototype.show = function(params){
    params = params || {};
    this.getElement().appendChild(this.windowHandler);
    this.getElement().appendChild(this.windowMessage);
    document.body.appendChild(this.getElement());
    
    this.setMovableElement();
    
    if(typeof params.setmovable !== "undefined" && params.setmovable !== 'false'){
        this.movable && MovableElement.setMovableElement(document.getElementById(this.getHandlerId()), document.getElementById(this.getWindowId()));
    }
};

/**
 * Zamyka okno o podanym id oraz uruchamia handler 
 * zdefiniowany przez użytkownika
 */
Dialog.prototype.closeDialog = function(){
    document.body.removeChild(document.getElementById(this.getWindowId()));
    this.closeHandler(this.getWindowId());
};