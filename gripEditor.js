/*
 * gripEditor jQuery plugin
 * The jQuery plugin enables user to resize an 
 *
 * @author     Ravi Shanker
 * @copyright  Copyright (c) Ravi Shanker
 * @license    http://www.opensource.org/licenses/mit-license.html  MIT License
 */
 
(function($){
    
    $.fn.extend({
        
        gripEditor : function(options){
        
            var userProps = $.extend({
                width : "500px",
                height : "250px",
                fonts : ["Arial","Comic Sans MS","Courier New","Tahoma","Times"]
            }, options);
        
            return this.each(function(){
               var Resize = false;
                var currentPosY;
                var txtArea = $(this);
                txtArea.hide(); 
                
                /* ELEMENTS  */
                //properties for the div to contain iframe and set it after the txtArea
                var divContainer = $('<div/>', {
                    css : {width : userProps.width ,height : userProps.height,border : "1px solid #ccc",color:"#000000"}
                }); 
                txtArea.after(divContainer);
                
                //buttons div
                var divBtns = $('<div/>',{
                    "class" : "gripEditor-divBtns",
                    css : {width : userProps.width}
                }).appendTo(divContainer);
                
                //creating buttons
                var boldBtn = $('<a/>',{
                    text : 'B',
                    "class" : "gripEditor-btns",
                    css : {"cursor":"pointer" , "margin-left":"15px", "font-weight":"bold"},
                    data : {commandName : "bold"},
                    click : execCommand 
                }).appendTo(divBtns);
                var italicsBtn = $('<a/>',{
                    text : 'I',
                    "class" : "gripEditor-btns",
                    css : {"cursor":"pointer", "font-style":"italic"},
                    data : {commandName : "italic"},
                    click : execCommand 
                }).appendTo(divBtns);
                var underlineBtn = $('<a/>',{
                    text : 'U',
                    "class" : "gripEditor-btns",
                    css : {"cursor":"pointer", "text-decoration":"underline"},
                    data : {commandName : "underline"},
                    click : execCommand 
                }).appendTo(divBtns);
                var fontDropdown = $('<select/>',{
                     data:{commandName : "FontName"},
                     change : execCommand
                }).appendTo(divBtns);
                $.each(userProps.fonts, function(key,value) {
                fontDropdown.append($("<option></option>")                 
                 .text(value)); 
                });
                
                //create the IFrame
                var editorFrame = $("<iframe/>",{
                   "id":"myFrame",
                   css : {width : userProps.width,"height":"100%"},
                   frameborder : "0"
                }).appendTo(divContainer).get(0);               
                $("#myFrame").height( (divContainer.height()-50)+"px");
                
                $('<div/>',{
                    "class" : "gripEditor-gripperHidden",
                    css : {width : userProps.width}
                }).appendTo(divContainer);
                var gripper = $('<div/>',{
                    "class" : "gripEditor-divgripper",
                    css : {width : userProps.width}
                }).appendTo(divContainer);
                
                /* ELEMENTS  ENDS*/
                
                editorFrame.contentWindow.document.open();               
                editorFrame.contentWindow.document.close();
                editorFrame.contentWindow.document.designMode="on";
                
                 //to update the text to the ORIGINAL text area
                 if(document.addEventListener){
                     editorFrame.contentWindow.document.addEventListener('keyup', updateTxtArea, false);
                 }
                 else{
                      //for IE8
                      editorFrame.contentWindow.document.attachEvent('onkeyup', updateTxtArea);
                 }
                 

                 //gripper
                 gripper.mousedown(function(e) {   
                    Resize = true;                 
                    currentPosY = e.pageY;
                    return false;
                });                
                $(document).mousemove(function(e) {
                    if (!Resize) return;
                    
                    var newHeight = divContainer.height() + (e.pageY - currentPosY);
                    currentPosY = e.pageY;
                    if (newHeight > 50) {
                        divContainer.height(newHeight);//setFrameHeight();
                        $("#myFrame").height((newHeight-50)+"px");
                    }
                });                                
                $(document).mouseup(function() {                    
                    Resize = false;
                });
                //gripper ends
                 
                function updateTxtArea(){
                
                    var txt = $('#myFrame').contents().find('body').html();
                    txtArea.val("<div>"+$('#myFrame').contents().find('body').html()+"</div>");
                }
                
                function execCommand (e) {
                    var contentWindow = editorFrame.contentWindow;
                    contentWindow.focus();
                    contentWindow.document.execCommand($(this).data("commandName"), false, this.value || "");
                    contentWindow.focus();
                    updateTxtArea()
                    return false;
                }
                
            });
        }
        
    });
    
})(jQuery);