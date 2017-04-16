var waitTableWidth = 210;
var waitMsgText;
var currentWindow;
if (navigator.appName == 'Netscape') {
   window.captureEvents(Event.MOUSEDOWN)
   window.onmousedown = getEvent;
   window.onkeypress = getEventKey;
 } else if (navigator.appName == 'Microsoft Internet Explorer') {
    document.onmousedown=getEvent;
    document.onkeypress = getEventKey;
 }

function getEvent(e){
   if(isDirtyFlagDefined()){
      if (!e) { var e = window.event; }
      var targ
      if (e.target) targ = e.target
      else if (e.srcElement) targ = e.srcElement
      if (targ.nodeType == 3) // defeat Safari bug
         targ = targ.parentNode
      
      //check the target element and decide
      if(checkFormElement(targ) || checkImageClick(targ)){
         //alert("Flag is true");
         setDirtyFlag(true);
      }
   }
   checkInDisplayPopup();
}

function checkFormElement(target){
   var tname = target.tagName;
   //alert("tname" + tname);
   if((tname != null) && (tname == "INPUT" || tname == "SELECT" || tname == "OPTION" || tname == "TEXTAREA" )){
      return true;
   } else {
      return false;
   }
}

function checkImageClick(target){
   var tname = target.tagName;
   if(tname != null && tname == "IMG"){
      //check specific images like delete, add, search, etc
      var source = target.src;
      var filename = getImageFileName(source);
      filename = filename.toUpperCase();
      //alert("filename: " + filename);
      if(filename.match("ADD") || filename.match("LVIB")){
         return true;
      }
      //check alt text
      var altText = target.alt;
      if(altText != null){
         altText = altText.toUpperCase();
         //alert("altText: " + altText);
         if(altText.match("DEL") || altText.match("ADD") || altText.match("REMOVE")){
            //alert("alt text is del or add");
            return true;
         }
      }
   }
   
   return false;
}

function getImageFileName(source){
   if(source != null){
      var imagePath = source.split("/");
      if(imagePath != null && imagePath.length > 0){
         var filename = imagePath[imagePath.length - 1];
         return filename;
      }
   }
   return "";
}

function getEventKey(e){
   if(isDirtyFlagDefined()){
      document.captureEvents(Event.KEYPRESS)
      setDirtyFlag(true);
   }
   if (typeof getPopupEventKey == 'function' ){
     getPopupEventKey(e);
   }
   checkInDisplayPopup();
}

/*
 * Method to handle dirty page popups from menu actions 
 */
function popupDirtyPage(root, destination, showWait){
   var targetUrl = root + destination;
   var dirtyParam = document.getElementById("dirtyFlag");
   if (window.modifiedFlds != undefined && window.modifiedFlds.size() > 0)
   {
      if (!confirm("You have made changes. They will be lost if you continue."))
       return;
      else
        window.modifiedFlds.clear();

   }
   if(!dirtyParam){
      openPage(targetUrl, showWait);
   } else { 
      if(dirtyParam.value == true || dirtyParam.value == 'true'){
         var alertUrl = root + "/secure/ml3/common/PageModifiedAlert.jspx?target="+ targetUrl;
         alertUrl = alertUrl + getMessageIds();
         displayDialog(alertUrl);
      } else {
         openPage(targetUrl, showWait);
      }
   }
}

function processMenuClick(root, destination, showWait){
   var targetUrl = root + destination;
   var dirtyParam = document.getElementById("dirtyFlag");
   //alert("dirtyParam: " + dirtyParam);
   if(!dirtyParam){
      openPage(targetUrl, showWait);
   } else { 
      //alert("dirtyParam.value:" + dirtyParam.value);
      if(dirtyParam.value == true || dirtyParam.value == 'true'){
         var alertUrl = "/secure/ml3/common/DirtyPageAlert.jspx?target="+ targetUrl;
         alertUrl = alertUrl + getMessageIds();
         if(showWait){
            alertUrl = alertUrl + "&showWait=" + showWait;
         }
         //alert("alertUrl:"+alertUrl);
         
         showGoPopup(alertUrl, 200, 350);
      } else {
         openPage(targetUrl, showWait);
      }
   }
}

function showCancelAlert(root, buttonId, showWait){
   var dirtyParam = document.getElementById("dirtyFlag");
   //alert("dirtyParam:"+dirtyParam);
   if(!dirtyParam){
      //alert("dirtyParam: false");
      buttonAction(window, buttonId, showWait)
   } else { 
      //alert("dirtyParam: true");
      if(dirtyParam.value == true || dirtyParam.value == 'true'){
         var alertUrl = root + "/secure/ml3/common/PageModifiedAlert.jspx?btnId="+ buttonId + "&showWait=" + showWait;
         alertUrl = alertUrl + getMessageIds();
         displayDialog(alertUrl);
      } else {
         buttonAction(window, buttonId, showWait)
      }
   }
}

function submitAndDisplayWait(formId, buttonId){
   submitAndDisplayWait(formId, buttonId, null);
}
/**
 * Method to display popup on submit action
 */
function submitAndDisplayWait(formId, buttonId, msgText){
   //alert("buttonId: "+buttonId);
   var done = submitForm(formId,1,{source:buttonId});
   if(done == true || done == 'true'){
     showWaitMessage(window, msgText);
   }
   return false;
}

function buttonAction(window, buttonId, showWait){
   //alert("buttonAction:buttonId: "+buttonId);
   var objButton = window.document.getElementById(buttonId);
   if(!objButton){
      alert("Button is not defined for id " + buttonId);
      return;
   }
   var myForm = window.document.getElementsByTagName("form")[0];
   waitMessage(window, showWait);
   //alert("Form: " + myForm.id);
   window.submitForm(myForm.id,1,{source:buttonId});
   //objButton.click();
}





function getMessageIds(){
   var urlParams = "";
   var msgIds = document.getElementById("alertMsgIds");
   if(msgIds){
      //alert("msgIds3: " + msgIds.value); 
      urlParams = "&msgIds=" + msgIds.value;
   }
   return urlParams;
}

function isDirtyFlagDefined(){
   var dirtyParam = document.getElementById("dirtyFlag");
   if (dirtyParam != null) {
      return true;
   } else {
      return false;
   }
}

function openPage(targetUrl, showWait){
   waitMessage(window, showWait);
   window.location.href = targetUrl;
}

function setDirtyFlag(flag){
   var dirtyParam = document.getElementById("dirtyFlag");
   dirtyParam.value = flag;
}


function continueAction(target, menuAction, showWait){
   var win = getParentWindow(); 
   if(menuAction && menuAction == 'true'){
      showWaitMessage(win);
      win.location.href = target; 
   } else {
      buttonAction(win, target, showWait); 
   }
   self.close();
      
}

function dirtyPopupContinueAction(target, showWait){
   //alert("target:"+target);
   //alert("showWait:"+showWait);
   var win = parent;
   //alert("win:"+win);
   if(showWait && (showWait == 'true' || showWait == true)){ 
      showWaitMessage(win);
   }
   win.location.href = target; 
   closeGoPopupDiv();
}

function dirtyPopupCancelAction(){
   closeGoPopupDiv();
}


function getParentWindow(){
   var win; 
   if (window.showModalDialog) {
      win = window.dialogArguments;
   } else {
      win = opener;
   }
   return win;
}

function cancelAction(){
   self.close();
}

function displayDialog(alertUrl) {
   if (window.showModalDialog) {
      //for IE
      window.showModalDialog(alertUrl, window, 'dialogHeight:250px;dialogWidth:500px;center:yes;status:no;');
   } else {
      window.open(alertUrl, null, 'left=250,top=200,width=500,height=250,toolbar=no,statusbar=no,scrollbars=yes, resizable=yes, modal=yes');
   }
} 

function waitMessage(window, showWait){
   if(showWait && (showWait == 'true' || showWait == true ) ){
      //alert(window);
      showWaitMessage(window);
   }
}
function showWaitMessage(window){
   showWaitMessage(window, null);
}
function showWaitMessage(window, msgText){
   var waitDiv = lookupWaitDiv(window);
   waitMsgText = window.getWaitText(msgText);
   currentWindow = window;
   //alert("waitDiv 5: "+waitDiv);
   if(waitDiv != null){
      waitDiv.style.zIndex = 500;
      waitDiv.style.visibility = "visible";
      var left = getWaitDivLeft(window);
      var top = getWaitDivTop(window);
      //alert("left:"+left);
      //alert("top:"+top);
      waitDiv.style.left = left+"px";
      waitDiv.style.top = top+"px";
      //alert("getWaitDivTop" + getWaitDivTop());
      window.document.body.style.cursor='wait';
      refreshWaitMsg(window);
   }
}



function lookupWaitDiv(window){
   var divs = window.document.getElementsByName("WaitMessage");
   var element = null;
   //alert(divs);
   //alert(divs.length);
   if(divs){
      if(divs.length > 0){
         element = divs[0];
      }
   } 
   
   if(!element){
      //IE
      divs = window.document.getElementsByTagName("DIV");
      for(var i=0; i<divs.length; i++){
         //alert(divs[i].name);
         if(divs[i].name == "WaitMessage"){
            element = divs[i];
            break;
         }
      }
   }
   return element;
   
}

var waitMsgIndex = 0;
var totalMsgCount = 6;
var urlContext    = location.href.substring(0, location.href.lastIndexOf('\/faces'));
var pic1= new Image(2,13); 
pic1.src='/oip/faces/common/images/loadingmessage/bottom.gif'; 
var pic2= new Image(10,15); 
pic2.src='/oip/faces/common/images/loadingmessage/bottomleft.gif'; 
var pic3= new Image(13,13); 
pic3.src='/oip/faces/common/images/loadingmessage/bottomright.gif';
var pic4= new Image(10,3); 
pic4.src='/oip/faces/common/images/loadingmessage/leftside.gif';
var pic5= new Image(13,5); 
pic5.src='/oip/faces/common/images/loadingmessage/rightside.gif';
var pic6= new Image(2,14); 
pic6.src='/oip/faces/common/images/loadingmessage/top.gif';
var pic7= new Image(10,14); 
pic7.src='/oip/faces/common/images/loadingmessage/topleft.gif';
var pic8= new Image(15,14); 
pic8.src='/oip/faces/common/images/loadingmessage/topright.gif';
var pic9= new Image(16,16);
pic9.src='/oip/faces/common/images/LoadingImage.gif';

function refreshWaitMsg(window){
   var waitDiv = lookupWaitDiv(window);
   //alert("waitDiv: "+waitDiv);
   if(waitDiv != null && waitDiv.style.visibility == "visible"){
      waitDiv.innerHTML = getWaitContent();
      //var refresh = new function(){waitDiv.innerHTML = getWaitContent(window);};
      //setTimeout(refresh, 100);
   }
}
function getWaitContent(){
    //alert("getWaitContent 3");
    var iframeWidth = waitTableWidth+18;
    var tableHtmlStart='<iframe SRC="/oip/faces/common/images/blank.gif" frameborder="0" width="' + iframeWidth + 'px" height="95px"></iframe>'+
                        '<div style="position:relative;top:-100px;left:0px">'+
                       '   <table summary="" border="0" cellspacing="0" cellpadding="0">'+
                       '     <tr>'+
                       '       <td colspan="3" width="100%" height="100%"><table width="100%" summary="" border="0" cellspacing="0" cellpadding="0">'+
                       '           <tr>'+
                       '             <td width="9px"><img src="/oip/faces/common/images/loadingmessage/topleft.gif" border="0" alt=""></td>'+
                       '             <td width="100%" style="background-image:url(\'/oip/faces/common/images/loadingmessage/top.gif\');background-repeat:repeat-x"><img src="/oip/faces/common/images/loadingmessage/top.gif" alt=""/></td>'+
                       '             <td width="11px"><img src="/oip/faces/common/images/loadingmessage/topright.gif" border="0" alt""></td>'+
                       '           </tr>'+
                       '         </table></td>'+
                       '     </tr>'+
                       '     <tr>'+
                       '       <td style="background-color:#F7F7F7;" width="100%"><table width="100%" summary="" border="0" cellspacing="0" cellpadding="0">'+
                       '           <tr>'+
                       '             <td style="background-image:url(\'/oip/faces/common/images/loadingmessage/leftside.gif\');background-repeat:repeat-y"><img src="/oip/faces/common/images/loadingmessage/leftside.gif" border="0" alt=""/></td>'+
                       '             <td width="100%">'+
                       '<table align="center" width="' + waitTableWidth + 'px" style="color:rgb(0,0,0); " cellpadding="10" >';
   //var tableHtmlStart = '<table align="center" width="' + waitTableWidth + 'px" style="color:rgb(0,0,0); background-color:#FDFCC8; border:solid 1px #689ED0;" cellpadding="10" >';
   //var tableHtmlEnd = '</B><BR/></td></tr></table>';
   var tableHtmlEnd =  '</B><BR/></td></tr></table>'+
                       '</td>'+
                       '             <td style="background-image:url(\'/oip/faces/common/images/loadingmessage/rightside.gif\');background-repeat:repeat-y"><img src="/oip/faces/common/images/loadingmessage/rightside.gif" border="0" alt=""/></td>'+
                       '           </tr>'+
                       '         </table></td>'+
                       '     </tr>'+
                       '     <tr>'+
                       '       <td><table width="100%" summary="" border="0" cellspacing="0" cellpadding="0">'+
                       '           <tr>'+
                       '             <td width="10px"><img src="/oip/faces/common/images/loadingmessage/bottomleft.gif" border="0" alt=""></td>'+
                       '             <td style="background-image:url(\'/oip/faces/common/images/loadingmessage/bottom.gif\');background-repeat:repeat-x"><img src="/oip/faces/common/images/loadingmessage/bottom.gif" border="0" alt=""/></td>'+
                       '             <td width="11px"><img src="/oip/faces/common/images/loadingmessage/bottomright.gif" border="0" alt=""></td>'+
                       '           </tr>'+
                       '         </table></td>'+
                       '     </tr>'+
                       '   </table>'+
                       ' </div>';
   var content = "";
   //loadingText = window.getWaitText(waitMsgText);
   //alert("msg:"+msg);
   var textRow;
   //image does not spin properly in Non IE browser, so use dots there
   if (navigator.appName == 'Microsoft Internet Explorer'){
      textRow = '<tr><td align="center" style="color:black;font-size: 10pt;"><B>' + waitMsgText + '<BR><BR><img src="/oip/faces/common/images/orapageprocessing_ani.gif" alt="Retrieving Data" align="middle"/>';  
   } else {
      //var dots = getDots(); 
      textRow = '<tr><td align="left" style="color:black;font-size: 10pt;"><BR/><B><div id="waitMsgContentDiv">' + waitMsgText + '</div><BR>'; 
      showMsgWithDots();
   }
   content = tableHtmlStart + textRow + tableHtmlEnd;
   return content;
}


function showMsgWithDots(){
   if(!currentWindow){
      currentWindow = window;
   }
   var contentDivObj = currentWindow.document.getElementById("waitMsgContentDiv");
   var waitDiv = lookupWaitDiv(currentWindow);
   var msg = waitMsgText;
   //alert("waitDiv: "+waitDiv);
   //alert("contentDivObj: "+contentDivObj);
   if(waitDiv && waitDiv.style.visibility == "visible"){
      if(contentDivObj){
         if (waitMsgIndex == totalMsgCount) {
            waitMsgIndex = 0;
         }
         var dots = "";
         for(var i=0; i < waitMsgIndex; i++){
         
            dots = "." + dots;
         }
         waitMsgIndex++;
         contentDivObj.innerHTML = msg + dots;
      }
      setTimeout("showMsgWithDots()", 500);
   }
   //return msg;
}

function getWaitDivLeft(window){
   var left = (getDocumentWidth(window) - waitTableWidth)/2;
   //alert("left: " + left);
   return left;
}

function getWaitDivTop(window){
   var top = getDocumentHeight(window) + 115;
   //alert("left: " + left);
   return top;
}

function getDocumentWidth(win) {
  var myWidth = 0;
  //alert("in getDocumentWidth");
  var doc = win.document;
  if( typeof( window.innerWidth ) == 'number' ) {
    //Non-IE
    //alert("1");
    myWidth = win.window.innerWidth;
  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
    //IE 6+ in 'standards compliant mode'
    //alert("2");
    myWidth = doc.documentElement.clientWidth;
  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
    //IE 4 compatible
    myWidth = doc.clientWidth;
    //alert("3");
  }
  //alert( 'Width = ' + myWidth );
  return myWidth;
}

function getDocumentHeight(win) {
  var scrOfX = 0, scrOfY = 0;
  var doc = win.document;
  if( typeof( window.pageYOffset ) == 'number' ) {
    //Netscape compliant
    scrOfY = win.window.pageYOffset;
  } else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
    //DOM compliant
    scrOfY = doc.body.scrollTop;
  } else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
    //IE6 standards compliant mode
    scrOfY = doc.documentElement.scrollTop;
  }
  //alert("scrOfY: " + scrOfY);
  return scrOfY;
}

/*
   This method is used to make the entire document. 
   During onload the masking does not cover the entire document if window has scrolling
*/
function checkInDisplayPopup(){
   var inDisplayPopup = document.getElementById('_inDisplayPopup'); 
   if(inDisplayPopup && inDisplayPopup.value == 'true'){
      //now expand the masking div all over the window
      //alert("isInDisplayPopup");
      maskWindow();
      inDisplayPopup.value = '';//reset flag
   }
}
       
    function callExternalUrlUsingIframe(url){
       var objMyDiv = createDiv('hiddenUrlDiv');
       //alert("objMyDiv:"+objMyDiv);
       var ifrm = document.createElement("IFRAME");
       ifrm.setAttribute("id", "hiddenUrlDivIframe");
       ifrm.setAttribute("frameBorder","0");
       ifrm.setAttribute("border","0px");
       ifrm.setAttribute("height","0px");
       ifrm.setAttribute("src", url); 
       //ifrm.style.width = width; 
       //ifrm.style.height = height; 
       ifrm.style.zIndex = -100;
       ifrm.setAttribute("class","iframe");
       while (objMyDiv.hasChildNodes()){
         objMyDiv.removeChild(objMyDiv.firstChild);
       }
       objMyDiv.appendChild(ifrm); 
       
    }
    
    function createDiv(id){
      var newdiv = document.createElement('div');
      newdiv.setAttribute('id', id);
      newdiv.style.position = "absolute";
      newdiv.style.left = -100;
      newdiv.style.top = -100;
      newdiv.style.zIndex = -100;
      document.body.appendChild(newdiv);
      return newdiv;
    }