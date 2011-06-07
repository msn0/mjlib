/**
 * MovableElement reprezentuje elementy (np. divy), którymi
 * można poruszać za pomocą myszki. Na przykład mając dowolnego
 * diva o id="myDiv" możemy sprawić by można było nim poruszać
 * za pomocą statycznej metody MovableElement.setMovableElement:
 * <pre>
 *      var myDiv = document.getElementById('myDiv');
 *      MovableElement.setMovableElement(myDiv);
 * </pre>
 *
 * @param handlerElement uchwyt
 * @param elementToMove element poruszający się
 * @author michalj
 */
function MovableElement(handlerElement, elementToMove){

    this.handlerElement = handlerElement;
    this.elementToMove = elementToMove || handlerElement;
    this.x = 0;
    this.y = 0;
    this.movedX = 0;
    this.movedY = 0;
    var that = this;

    var mouseDown = function(event){
        event = event || window.event;
        that.handlerElement.style.cursor = "move";
        document.onmouseup = mouseUp;
        document.onmousemove = mouseMove;
        that.handlerElement.onselectstart = function(){return false;}
        if (event.pageY){
            that.x = event.pageX;
            that.y = event.pageY;
        }
        else {
            that.x = event.clientX;
            that.y = event.clientY;
        }
        return false;
    }

    var mouseUp = function(event){
        event = event || window.event;
        document.onmouseup = null;
        document.onmousemove = null;
        that.handlerElement.style.cursor = "default";
        return;
    };

    var mouseMove = function(event){
        event = event || window.event;
        that.movedX = event.pageX || event.clientX;
        that.movedY = event.pageY || event.clientY;
        var diffX = that.x - that.movedX;
        var diffY = that.y - that.movedY;
        if (event.pageY){
            that.x = event.pageX;
            that.y = event.pageY;
        }
        else {
            that.x = event.clientX;
            that.y = event.clientY;
        }
        that.elementToMove.style.top = that.elementToMove.offsetTop - diffY + "px";
        that.elementToMove.style.left = that.elementToMove.offsetLeft - diffX + "px";
        return;
    };
    
    // TODO: removing events doesn't work yet
    this.removeMovableElement = function(){
        this.handlerElement.removeEventListener('mousedown', mouseDown, false)
    };
    
    MJ.addEvent(this.handlerElement, 'mousedown', mouseDown, true);
}

/**
 * Tworzenie elementu zdolnego do poruszania się.
 *
 * @param handlerElement uchwyt
 * @param elementToMove element poruszający się
 */
MovableElement.setMovableElement = function(handlerElement, elementToMove){
    return new MovableElement(handlerElement, elementToMove);
};

