// Detect if the browser is IE or not.
// If it is not IE, we assume that the browser is NS. 
var IE = document.all?true:false                   
// If NS -- that is, !IE -- then set up for mouse capture   
if (!IE) document.captureEvents(Event.MOUSEMOVE)           
// Set-up to use getMouseXY function onMouseMove         
document.onmousemove = getMouseXY;                 
var linkId;                   
// Temporary variables to hold mouse x-y pos.s  
var tempX = 0 
var tempY = 0  
var tempMouseX = 0;
var tempMouseY = 0;
// Main function to retrieve mouse x-y pos.s     

var openPopups = [];
var goPopupDivName = "_orionGoPopup";
var goPopupDivId = goPopupDivName + 'Div';
var commandPopupDivName = "_orionCustomCommandPopup";
var commandPopupDivId = commandPopupDivName + 'Div';
var goPopupContentDivName = "_orionGoPopupContent";

function getMouseXY(e) {
  if (IE) { // grab the x-y pos.s if browser is IE
    tempMouseX = event.clientX + document.body.scrollLeft
    tempMouseY = event.clientY + document.body.scrollTop
  } else {  // grab the x-y pos.s if browser is NS
    tempMouseX = e.pageX
    tempMouseY = e.pageY
  }  
  // catch possible negative values in NS4
  if (tempMouseX < 0){tempMouseX = 0}
  if (tempMouseY < 0){tempMouseY = 0}  

  return true
}

function getPopupEventKey(e){
   //getEventKey(e);
   if (!IE) {
     if (e.keyCode == 27){
     //alert('e.keyCode');
      closeAllPopups();
     }
   } else {
     if (window.event.keyCode == 27){
     //alert('window.event.keyCode');
      closeAllPopups();
     }
   }
   checkInDisplayPopup();
}
 
function getPreId(link){            
    linkId = link.id;                  
    var preId;                     
    if (linkId.indexOf(':') > -1){  
        preId = linkId.substr(0,linkId.lastIndexOf(':'))+':';    
    } else {                      
        preId = linkId;                
    }                    
    return preId;         
}                      

function showPopupMenu(linkId, popupPlacement) { 
    closeAllPopups()
    var popup = document.getElementById(linkId+'Div'); 
    var link = document.getElementById(linkId);
    popup.style.position = 'absolute';  
    popup.style.display = 'block';  
    
    if (popupPlacement == 'left') {
        popup.style.left = (tempMouseX-(popup.offsetWidth-5))+ 'px'; 
    } else if (popupPlacement == 'middle'){
        popup.style.left = (tempMouseX)+ 'px'; 
    } else if (popupPlacement == 'right'){
        popup.style.left = (tempMouseX+(popup.offsetWidth/2))+ 'px';
    } 
    //popup.style.left = (tempMouseX-3)+ 'px'; 
    popup.style.top = ((tempMouseY-3) + getScrollY())+ 'px';
    addPopupToArray(popup);
    //return true; 
    
    
}   
function showDropdownSelector(linkId) {
//alert("showDropdownSelector "+linkId+" "+getScrollY());
    closeAllPopups()
    var popup = document.getElementById(linkId+'Div'); 
    var link = document.getElementById(linkId);
    popup.style.position = 'absolute';  
    popup.style.display = 'block';  
    
    popup.style.left = (tempMouseX-3)+ 'px'; 
    popup.style.top = ((tempMouseY-3) + getScrollY())+ 'px';
    addPopupToArray(popup);
    //return true;                        
}   
function showButtonSelect(linkId, popupPlacement) { 
//alert(popupPlacement);
    closeAllPopups()
    var popup = document.getElementById(linkId+'Div'); 
    var link = document.getElementById(linkId);
    popup.style.position = 'absolute';  
    popup.style.display = 'block';  
    if (popupPlacement == 'left') {
        popup.style.left = ((tempMouseX-3)-(popup.offsetWidth-5))+ 'px'; 
    } else if (popupPlacement == 'right'){
        popup.style.left = (tempMouseX-3)+ 'px'; 
    } 
    //popup.style.left = (tempMouseX-3)+ 'px'; 
    popup.style.top = ((tempMouseY-3 + getScrollY()))+ 'px';
    addPopupToArray(popup);
    //return true;                        
}  
function showlinkselect(linkId, popupPlacement) { 
//alert(popupPlacement);
    closeAllPopups()
    var popup = document.getElementById(linkId+'Div'); 
    var link = document.getElementById(linkId);
    popup.style.position = 'absolute';  
    popup.style.display = 'block';  
    if (popupPlacement == 'left') {
        popup.style.left = ((tempMouseX-3)-(popup.offsetWidth-5))+ 'px'; 
    } else if (popupPlacement == 'right'){
        popup.style.left = (tempMouseX-3)+ 'px'; 
    } 
    //popup.style.left = (tempMouseX-3)+ 'px'; 
    popup.style.top = (tempMouseY-3)+getScrollY()+ 'px';
    addPopupToArray(popup);
    //return true;                        
}  
function closeAllPopups(){
    for (var i = 0;i < openPopups.length;i++){
      //alert('closeAllPopups '+openPopups[i].id);
      closePopupDiv(openPopups[i].id, this);
    }
    openPopups.length = 0;
}
function addPopupToArray(popup){
    if (openPopups.length > 0){
        if (!contains(popup, openPopups)){
           openPopups[openPopups.length+1] = popup;
        }
    } else {
        openPopups[0] = popup;
    }
}
function contains(a, obj){
  for(var i = 0; i < a.length; i++) {
    if(a[i] === obj){
      return true;
    }
  }
  return false;
}
function leftPosition(target) {
        var left = 0;
        if(target.offsetParent) {
            while(1) {
                left += target.offsetLeft;
                if(!target.offsetParent) {
                    break;
                } 
                    target = target.offsetParent;
                }
            } else if(target.x) {
            left += target.x; 
        }
        return left;
}
function topPosition(target) {
        var top = 0;
        if(target.offsetParent) {
            while(1) {
                top += target.offsetTop;
                if(!target.offsetParent) {
                    break;
                } 
                    target = target.offsetParent;
                }
            } else if(target.y) {
            top += target.y; 
        }
        return top;
}

function showPopupDiv(divId, height, width) {    
    //alert("showPopupDiv called");
    maskWindow();
    if(!height || typeof(height) != 'number'){
      height = 350;
    }
    if(!width || typeof(width) != 'number'){
      width = 400;
    }
    var popup = document.getElementById(divId); 
    //alert("popup:"+popup);
    var left = (getWindowWidth() - width)/2;
    if(left <= 0){
      left = 100;
    }
    //alert("left:" + left);
    var top = getScrollY() + 100; 
    popup.style.position = 'absolute';   
    popup.style.display = 'block';   
    popup.style.left = left+'px';   
    popup.style.top = top+'px';
    addPopupToArray(popup);
    return true;                        
}

function maskWindow(){
   var maskedDiv = document.getElementById ('MaskedDiv');
   //alert("maskedDiv:"+maskedDiv);
   if(maskedDiv){
        maskedDiv.style.display='';
        maskedDiv.style.visibility='visible';
        maskedDiv.style.top='0px';
        maskedDiv.style.left='0px';
        //var width = document.documentElement.clientWidth;
        var width = getWindowWidth();
        var height = getDocHeight();
        /*
        if(width <= 0){
         var widthObj = parent.document.getElementById('_windowWidth');
         alert("widthObj: " +widthObj);
         if(widthObj){
            width = widthObj.value;
            alert("maskWindow width: " + width);
         }
         //width = 1200;
        }
        if(height <= 0){
         height = 1000;
        }
        alert("Mask width: " + width);
        alert("Mask height: " + height);
        */
        maskedDiv.style.width=  width + 'px';
        maskedDiv.style.height= height + 'px';
   }
}

function unmaskWindow(prnt){
   if (prnt.document.getElementById ('MaskedDiv')){
       var maskedDiv = prnt.document.getElementById('MaskedDiv');
       //alert("maskedDiv: " +maskedDiv);
       maskedDiv.style.display = 'none';
   }
   var inDisplayPopup = prnt.document.getElementById('_inDisplayPopup'); 
   if(inDisplayPopup){
      inDisplayPopup.value = '';//reset flag
   }
}

function hidePopupDirectFromId(closeLinkId){
   var closeLink = document.getElementById(closeLinkId);
   hidePopupDirect(closeLink);
} 

function hidePopupDirect(closeLink){	   	
    var divId = (closeLink.id).replace('CLOSE','Div');      
    closePopupDiv(divId, this);
    var popupLink = document.getElementById((closeLink.id).replace('CLOSE',''));
    if(popupLink){
      popupLink.focus();
    }
} 

function closePopupDiv(divId, prnt){
   var popupDiv = prnt.document.getElementById(divId); 
   //alert("popupDiv:"+popupDiv+" divId:"+divId+" prnt:"+prnt);
   if(popupDiv){
      popupDiv.style.display = 'none';   
      unmaskWindow(prnt);
      //popupDiv.innerHtml = '';
      /*
      while (popupDiv.hasChildNodes())
      {
          popupDiv.removeChild(popupDiv.firstChild);
      }*/
   }
}

function closeGoPopupDiv(){
   //alert("closeGoPopupDiv:");
   closePopupDiv(goPopupDivId, parent);
}

function closeCommandPopupDiv(){
   //alert("closeCommandPopupDiv:");
   closePopupDiv(commandPopupDivId, parent);
}

function hidePopup(linkId){                     
    var templates = document.getElementById(linkId.id);    
    templates.style.display = 'none';     
}  

function mouseLeaves (element, event) {        
    if (window.event && typeof window.event.toElement != 'undefined' && window.event.toElement && typeof   
        element.contains != 'undefined') {                             
        return !element.contains(window.event.toElement);              
    }                          
    else if (typeof event.relatedTarget != 'undefined' && event.relatedTarget) {     
        return !contains(element, event.relatedTarget);                       
    }
}                                            
function contains (container, containee) {                       
    while (containee) {                      
    if (container == containee) {  
        return true;                        
    }                       
       containee = containee.parentNode;  
    }                       
return false;           
} 


function handlePopupReturn(popupDivId, enclosingForm){
   //parent.submitForm(enclosingForm,0);
   //alert("closing window");
    
   if(typeof parent._adfspu == 'function') { 
      //alert("partial submit 1");
      parent._adfspu(enclosingForm, 0); //uses partial submit
   } else {
      //alert("form submit");
      parent.submitForm(enclosingForm,0);
   }
   closePopupDiv(popupDivId, parent);
   //show loading icons
   var loadingIds = parent.document.getElementById('loadingIcons'); //get the hidden variable
   //alert("loadingIds " + loadingIds);
   if(loadingIds){
      //alert("loadingIds value " + loadingIds.value);
      if(loadingIds.value.length > 0){
         if(typeof parent.showLoadingIcon == 'function') { 
            var args = loadingIds.value.split(",");
            //alert("arguments " + args);
            parent.showLoadingIcon.apply(this, args);//execute method with dynamic arguments
         }
         //reset value
         loadingIds.value = '';
      }
   }
   return true;
}

function handleClickThruCancel(popupDivId){
   // the issue here is if the retuen was invoked from jspx that calls the click thru as a popup(like viewAttachment.jspx) , then we close the popup
   // otherwise if the click thru was invoked, it's assumed that the call was invoked on a window.open and the parent window should be closed 
   if (parent.document.getElementById(popupDivId) != undefined){
        closePopupDiv(popupDivId, parent);
   }else{
        window.close();  
   }
}
function getDocHeight() {
    var D = document;
    if(parent.document){
      D = parent.document;
    }
    return Math.max(
        Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
        Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
        Math.max(D.body.clientHeight, D.documentElement.clientHeight)
    );
}

function getWindowWidth() {
  var myWidth = 0;
  var doc = document;
  if(parent.document){
   doc = parent.document;
  }
  if( typeof( window.innerWidth ) == 'number' ) {
    //Non-IE
    myWidth = window.innerWidth;
  } else if( doc.documentElement && ( doc.documentElement.clientWidth || doc.documentElement.clientHeight ) ) {
    //IE 6+ in 'standards compliant mode'
    myWidth = doc.documentElement.clientWidth;
  } else if( doc.body && ( doc.body.clientWidth || doc.body.clientHeight ) ) {
    //IE 4 compatible
    myWidth = doc.body.clientWidth;
  }
  //window.alert( 'Width = ' + myWidth );
  return myWidth;
}

function getScrollY() {
  var scrOfX = 0, scrOfY = 0;
  if( typeof( window.pageYOffset ) == 'number' ) {
    //Netscape compliant
    scrOfY = window.pageYOffset;
  } else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
    //DOM compliant
    scrOfY = document.body.scrollTop;
  } else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
    //IE6 standards compliant mode
    scrOfY = document.documentElement.scrollTop;
  }
  //alert("scrOfY: " + scrOfY);
  return scrOfY;
}
function showGoPopupWithHeader(popupPage, popupHeight, popupWidth, headerText, useIframe){
   //alert("showGoPopupWithHeader called..."+popupHeight);
   createPopupDiv(goPopupDivName, goPopupContentDivName, headerText);
   //call popup url
   showPopupDiv(goPopupDivId, popupHeight, popupWidth);
   doCommonAjaxCall(goPopupContentDivName, popupPage, useIframe, popupHeight, popupWidth);
   document.getElementById(goPopupDivName + 'CLOSE').focus();
}
function showGoPopup(popupPage, popupHeight, popupWidth){
    //alert("showGoPopup1 called... "+popupPage+' '+popupHeight+' '+popupWidth);
    showGoPopupWithJavascript(popupPage, popupHeight, popupWidth);
}
function showGoPopupWithJavascript(popupPage, popupHeight, popupWidth, closeJavascript){
   //alert("showGoPopupWithJavascript called..."+header);
   createPopupDivWithJavascript(goPopupDivName, goPopupContentDivName, '', closeJavascript);
   //call popup url
   showPopupDiv(goPopupDivId, popupHeight, popupWidth);
   doCommonAjaxCall(goPopupContentDivName, popupPage, 'true', popupHeight, popupWidth);
   document.getElementById(goPopupDivName + 'CLOSE').focus();
}
   
/*function showGoPopup(popupPage, popupHeight, popupWidth){
   //alert("showGoPopup2 called... "+popupPage+' '+popupHeight+' '+popupWidth);
   showGoPopupWithHeader(popupPage, popupHeight, popupWidth, '');
}*/

function createPopupDiv(outerDiv, innerDivId, headerText){
    createPopupDivWithJavascript(outerDiv, innerDivId, headerText);
}
function createPopupDivWithJavascript(outerDiv, innerDivId, headerText, closeJavascript){
  if (!headerText){
    headerText = '';
  }
   var outerDivObj = document.getElementById(goPopupDivId);
   if(!outerDivObj){
      var poupDivHtml = '<table summary="" border="0" cellspacing="0" cellpadding="0">' + 
                        //top row
                        '<tr>' + 
                           '<td colspan="3" width="100%" height="100%">' + 
                              '<table width="100%" summary="" border="0" cellspacing="0" cellpadding="0">' + 
                                 '<tr>' + 
                                    '<td width="9px"><img src="/oip/common/images/regions/topleft.gif" border="0" alt=""></td>' + 
                                    '<td style="background-image:url(\'/oip/common/images/regions/top.gif\');background-repeat:repeat-x">' + 
                                       '<table cellpadding="0" cellspacing="0" border="0" summary="" style="width:100%;background-image:url(\'/oip/common/images/tables/table-header-back.gif\');background-repeat:repeat-x">' + 
                                          '<tr>' + 
                                             '<td>' +
                                                '<table cellpadding="0" cellspacing="0" border="0" summary="">' + 
                                                   '<tr>' + 
                                                      '<td><span class="xc"></span></td>' + 
                                                   '</tr>' + 
                                                '</table>' +
                                             '</td>' + 
                                             '<td>' + 
                                                '<table cellpadding="0" cellspacing="0" border="0" summary="">' + 
                                                   '<tr>' + 
                                                      '<td width="100%"></td>' + 
                                                      '<td>' +
                                                         '<a id="' + outerDiv + 'CLOSE" name="closeTemplates" onclick="'+closeJavascript+'; hidePopupDirect(this);" class="xl" href="#"><img src="/oip/common/images/close.gif" border="0" alt="Close"></a>' +
                                                      '</td>' + 
                                                   '</tr>' + 
                                                '</table>' +
                                             '</td>' + 
                                          '</tr>' + 
                                       '</table>' +
                                    '</td>' + 
                                    '<td width="11px"><img src="/oip/common/images/regions/topright.gif" border="0" alt=""></td>' + 
                                 '</tr>' + 
                              '</table>' +
                           '</td>' + 
                        '</tr>' +
                        //content row
                        '<tr>' + 
                           '<td style="background-color:#F7F7F7;" width="100%">' +
                              '<table width="100%" summary="" border="0" cellspacing="0" cellpadding="0">' + 
                                 '<tr>' + 
                                    '<td style="background-image:url(\'/oip/common/images/regions/leftside.gif\');background-repeat:repeat-y"><img src="/oip/common/images/regions/leftside.gif" border="0" alt=""></td>' + 
                                    '<td width="100%">' +
                                       '<div id="' + innerDivId + '"></div>' + 
                                    '</td>' + 
                                    '<td style="background-image:url(\'/oip/common/images/regions/rightside.gif\');background-repeat:repeat-y"><img src="/oip/common/images/regions/rightside.gif" border="0" alt=""></td>' + 
                                 '</tr>' + 
                              '</table>' + 
                           '</td>' + 
                        '</tr>' + 
                        //bottom row
                        '<tr>' + 
                           '<td>' + 
                              '<table width="100%" summary="" border="0" cellspacing="0" cellpadding="0">' + 
                                 '<tr>' + 
                                    '<td width="10px"><img src="/oip/common/images/regions/bottomleft.gif" border="0" alt=""></td>' + 
                                    '<td style="background-image:url(\'/oip/common/images/regions/bottom.gif\');background-repeat:repeat-x"><img src="/oip/common/images/regions/bottom.gif" border="0" alt=""></td>' + 
                                    '<td width="11px"><img src="/oip/common/images/regions/bottomright.gif" border="0" alt=""></td>' + 
                                 '</tr>' + 
                              '</table>' +
                           '</td>' + 
                        '</tr>' + 
                     '</table>';
      //alert(poupDivHtml);
      //document.write(poupDivHtml);
      var popupDivObj = document.createElement("div");
      popupDivObj.setAttribute("id",goPopupDivId);
      popupDivObj.style.zIndex = 200;
      popupDivObj.style.display = 'none';
      popupDivObj.style.position = 'absolute';
      popupDivObj.style.left = 0;
      popupDivObj.style.top = 0;
      popupDivObj.innerHTML =  poupDivHtml;
      document.body.appendChild(popupDivObj);
      //create masking div
      var maskDivObj = document.createElement("div");
      maskDivObj.setAttribute("id","MaskedDiv");
      maskDivObj.className = "MaskedDiv";
      document.body.appendChild(maskDivObj);
      //alert("div created")
   } else {
      //clear the content
      
      //alert("outerDivObj html:"+outerDivObj.innerHTML);
      var contentDivObj = document.getElementById(innerDivId);
      if(contentDivObj){
         //var parentNode = contentDivObj.parentNode;
         //if(parentNode){
         //   parentNode.removeChild(contentDivObj); 
         //}
         while (contentDivObj.hasChildNodes()){
             contentDivObj.removeChild(contentDivObj.firstChild);
         }
      }
      //alert("outerDivObj html:"+outerDivObj.innerHTML);
      
   }
}
// Cancel SR Alert functions
function showSrCancelAlertPopup(frmId, btnId){
   var alertUrl = '/secure/ml3/common/CancelAlertPopup.jspx';
   alertUrl += "?frmId=" + frmId + "&btnId=" + btnId + "&msgIds=srCreate.confirmationAlertPopup.cancelMessage";
   //alert("alertUrl:"+alertUrl);
   showGoPopup(alertUrl, 200, 350);
}

function cancelAlertContinueAction(frmId, btnId){
   //alert("target:"+target);
   //alert("showWait:"+showWait);
   var win = parent;
   showWaitMessage(win);
   win.submitForm(frmId,0,{source:btnId});    
   closeGoPopupDiv();
}

// Non Tech SR Popup functions
function showNonTechSrPopup(frmId, btnId){
   var alertUrl = '/secure/ml3/sr/NonTechSrPopup.jspx';
   alertUrl += "?frmId=" + frmId + "&btnId=" + btnId + "&msgIds=srCreate.nonTechSrPopup.snExpiredMessage";
   showGoPopup(alertUrl, 200, 350);
}

function nonTechSrPopupContinueAction(frmId, btnId){
   var win = parent;
   showWaitMessage(win);
   var hiddenField = win.document.getElementById('nonTechSrPopupResult');
   hiddenField.value = 'true';
   win.submitForm(frmId,0,{source:btnId});    
   closeGoPopupDiv();
}

function nonTechSrPopupCancelAction(frmId, btnId){
   var win = parent;
   var hiddenField = win.document.getElementById('nonTechSrPopupResult');
   hiddenField.value = '';   
   closeGoPopupDiv();
}

