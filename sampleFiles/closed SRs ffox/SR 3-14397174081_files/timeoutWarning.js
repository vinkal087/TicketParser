
var timeoutWarningText = "Your session will end in {0} minute(s).";
var timeoutAlertText = "Your session has ended. Unsaved data is likely lost. <p>Reinitialize Session to start again. If you want to copy information that you might lose you can close this dialog and stay on the page.</p>";
var ssoTimeoutWarningText = "Your SSO session will end in {0} minutes. Save your work or loss of data may occur. <p>Sign-in again to extend your existing session for an additional 8 hours.</p>";
var ssoTimeoutAlertText = "Your SSO session has ended. <p>Sign-in again to extend your existing session for an additional 8 hours.</p>"
var loaded = false;

$(document).ready(function() {
    //create jquery dialogs
    console.debug("starting on document ready from timeoutWarning.js");
    timeoutWarningDialog = $(document.createElement('div'));
    timeoutAlertDialog = $(document.createElement('div'));
    ssoTimeoutWarningDialog = $(document.createElement('div'));

    //configure the dialog options
    timeoutWarningDialog.dialog({
        title: "Session Timeout Warning",
        autoOpen: false,
        resizable: false,      
        modal: true,      
        buttons: {        
            "Extend Session": function() {  $( this ).dialog( "close" );continueSession();}
        }
    }); 

    timeoutAlertDialog.dialog({
        title: "Session Ended",
        autoOpen: false,
        resizable: false,      
        modal: true,   
        width: 400,
        buttons: {        
            "Reinitialize Session": function() {  $( this ).dialog( "close" );openNewSessionURL();},
            "Stay on Page": function() {  $( this ).dialog( "close" );}
        }
    });

    ssoTimeoutWarningDialog.dialog({
        title: "Your Oracle SSO Session is Ending Soon",
        autoOpen: false,
        resizable: false,      
        modal: true,   
        width: 500,
        buttons: {        
            "Remind Me Later": function() {  $( this ).dialog( "close" ); remindMeLater();},
            "Sign-In to Extend Session...": function() {  $( this ).dialog( "close" );extendSsoSession();}
        }
    });
    if(!loaded){
        if(disableSsoTimeout != null && disableSsoTimeout != 'true'){
            initializeSsoTimeout();
        }
    }
    
    loaded = true;
    //alert("disableSsoTimeout:" + disableSsoTimeout);
});

//custom string format method
String.prototype.format = function(){  
    var content = this;  
    for (var i=0; i < arguments.length; i++)  {  
        var replacement = '{' + i + '}';  
        content = content.replace(replacement, arguments[i]);    
    }  
    return content;  
};

function resetSessionTimeout(){
    console.debug('resetSessionTimeout called');
    if(this._timeout && this._warningBeforeTimeout && this._newSessionURL){
        recordSessionTimeout(this._timeout, this._warningBeforeTimeout, this._newSessionURL);
    }
}

function recordSessionTimeout(timeout, warningBeforeTimeout, newSessionURL) 
{
  this._timeout = timeout;
  this._warningBeforeTimeout = warningBeforeTimeout;
  this._newSessionURL = newSessionURL;
  
  if (this._timeoutWarningTimer)
  {
    cancelTimer(this._timeoutWarningTimer);
    this._timeoutWarningTimer = null;
  }
  if (this._timeoutTimer) 
  {
    cancelTimer(this._timeoutTimer);
    this._timeoutTimer = null;
  }
  if (this._warningBeforeTimeout > 0)
  {
    this._timeoutWarningTimer = this.scheduleTimer("showTimeoutWarning();", timeout - warningBeforeTimeout);
  }
}

function scheduleTimer(callback, delay)
{
  // schedule the callback
  var timerRecord = window.setTimeout(callback, delay);

  return timerRecord;
}

function showTimeoutWarning(){
    this._timeoutWarningTimer = null;
  
    if (this._timeoutTimer)
    {
        cancelTimer(this._timeoutTimer);
        this._timeoutTimer = null;
    }
    this._timeoutTimer = this.scheduleTimer("showTimeoutAlert();", this._warningBeforeTimeout);
    //alert("Your session is going to timeout in 1 min");
    this._countDownCounter = Math.floor(this._warningBeforeTimeout/60000);
    updateCountDownCounter();
    this._countDownTimer = setInterval(countDownTimer, 60000);//run every minute
    timeoutWarningDialog.dialog( "open" );
    //cancelTimer(this._timeoutWarningTimer);
}

function countDownTimer(){
  
  this._countDownCounter = this._countDownCounter - 1;
  if (_countDownCounter <= 0)
  {
     clearInterval( this._countDownTimer );
     this._countDownTimer = null;
     return;
  }
  updateCountDownCounter();
}

function updateCountDownCounter(){
    var text = timeoutWarningText.format(this._countDownCounter);
    //alert(text);
    timeoutWarningDialog.html(text);
}

function showTimeoutAlert(){
    if (this._timeoutWarningTimer)
  {
    cancelTimer(this._timeoutWarningTimer);
    this._timeoutWarningTimer = null;
  }
  if (this._timeoutTimer) 
  {
    cancelTimer(this._timeoutTimer);
    this._timeoutTimer = null;
  }
  //cancel sso timer
  if(this._ssoTimer){
    cancelTimer(this._ssoTimer);
    this._ssoTimer = null;
  }
  
  timeoutAlertDialog.html(timeoutAlertText);//set text
  //hide warning
  timeoutWarningDialog.dialog( "close" );
  if(ssoTimeoutWarningDialog.dialog("isOpen")){
    ssoTimeoutWarningDialog.dialog("close");
  }
  timeoutAlertDialog.dialog( "open" );
  
  //alert("Your session has timed out.");
}

function cancelTimer(timerId){
  
  if (timerId != null){
    // cancel the window timer
    window.clearTimeout(timerId);
  }
 
}

function continueSession(){
    //alert("Contuning, please wait...");
    touchSession();
    //reset the timer
    resetSessionTimeout();
}

function touchSession(){
    var actionURL = window.location.href;
    makeAjaxCall(actionURL, null);
}


function makeAjaxCall(url, callback){
    var objXmlHttp =  CreateXmlHttpObject();
    objXmlHttp.open('GET', url, true);
    objXmlHttp.setRequestHeader('Content-Type', 'application/xml');
    objXmlHttp.setRequestHeader("Cache-Control", "no-cache");
    
    if(callback){
        objXmlHttp.onreadystatechange=function(){
            callback(objXmlHttp);
        }
    }
    //console.log("sending..." + url);
    objXmlHttp.send(null);
}

 function CreateXmlHttpObject(){
        var xmlhttp=false;
        try {
            xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
        try {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (E) {
            xmlhttp = false;
        }
    }
    if (!xmlhttp)if(typeof XMLHttpRequest!='undefined') {
        xmlhttp = new XMLHttpRequest();
    }
    return xmlhttp;
}

function openNewSessionURL(){
    if(this._newSessionURL){
        window.location.replace(this._newSessionURL);
    }
}

//============SSO Timeout Warning Functions===========================================================
function initializeSsoTimeout() {
    //console.debug("initializeSsoTimeout");
    window.onfocus = function(){recordSsoTimeout();};
    scheduleSsoTimeout();
}


function recordSsoTimeout() {
    var expTimestamp =  readExpCookie();
    //alert("expTimestamp: " + expTimestamp);    
    //showPopup(30);
    //console.debug("recordSsoTimeout");
    if (expTimestamp != -1) {
        var d = new Date();
        var nowUTC = d.getTime() + d.getTimezoneOffset()*60*1000;
        
        var timeDiff = expTimestamp - nowUTC;
        //alert("timeDiff: " + timeDiff);    
        
        if (timeDiff <= 1800000) { // 30 mins
            if (timeDiff <= 1200000) { // 20 mins
                if (timeDiff <= 600000) { // 10 mins
                    if (timeDiff <= 0) {// already expired
                        showPopup(0);
                    } else {
                        showPopup(10);
                    }
                } else {
                    showPopup(20);
                }
            } else {
                showPopup(30);
            }
        } else {
            hideSsoPopup();
        }
    }
    
        }

function hideSsoPopup(){
    if(ssoTimeoutWarningDialog.dialog("isOpen")){
        ssoTimeoutWarningDialog.dialog("close");
        //update server side parameter
        checkUpdateTimeoutStatus("update", null);
    }
}

function remindMeLater(){
    //update server side parameter
    checkUpdateTimeoutStatus("remind", null);
}


function scheduleSsoTimeout(){
    recordSsoTimeout();
    this._ssoTimer = setTimeout(function(){scheduleSsoTimeout();}, 5*60*1000);
}


function showPopup(timeout){
    //don't show SSO popup if Http Session popup is open
    if(timeoutWarningDialog.dialog("isOpen") || timeoutAlertDialog.dialog("isOpen")){
        return;
    }
    getSsoTimeoutStatus(timeout);
    //setTimeout(function(){getSsoTimeoutStatus(timeout);}, 10*1000);//add some delay to let the page load first
}

function getSsoTimeoutStatus(toLevel){
    //alert("showPopup: " + toLevel);
    if(ssoTimeoutWarningDialog){
        if(toLevel <= 0){
            $(":button:contains('Remind Me Later')").button().hide();
            ssoTimeoutWarningDialog.dialog('option', 'title', 'Your Oracle SSO Session has Ended');
            ssoTimeoutWarningDialog.html(ssoTimeoutAlertText);
        } else {
            $(":button:contains('Remind Me Later')").button().show();
            ssoTimeoutWarningDialog.dialog('option', 'title', 'Your Oracle SSO Session is Ending Soon');
            ssoTimeoutWarningDialog.html(ssoTimeoutWarningText.format(toLevel));//set text
        }
        checkUpdateTimeoutStatus(null, toLevel);
    }
}

function checkUpdateTimeoutStatus(action, toLevel){
        var randomnumber=Math.floor(Math.random()*10000001);
        var pathname = location.href.substring(0, location.href.lastIndexOf('\/faces')+6);
    var params;
    if(action != null){
        params = "action=" + action;
    } else {
        params = "toLevel=" + toLevel;
    }
    var url = pathname + "/ssotimeoutwarningstatus?" + params + "&_r=" + randomnumber;//adding random parameter to disable cache
        
        //alert("url: "+url);
    if(action){
        makeAjaxCall(url, null);//no response expected
    } else {
        makeAjaxCall(url, getStatusResponse);
    }
}

function getStatusResponse(objXMLHttp){
    //alert("response received " + objXMLHttp.readyState);
    if (objXMLHttp.readyState == 4) {
        // save response in inner html of result object
        var elements = objXMLHttp.responseText;
        //alert("response: " + elements);
        if(elements != null && elements.indexOf("true") != -1 ){
           //alert(elements);
           if(!ssoTimeoutWarningDialog.dialog("isOpen")){
           ssoTimeoutWarningDialog.dialog( "open" ); 
            }
        } else {
            if(ssoTimeoutWarningDialog.dialog("isOpen")){
            ssoTimeoutWarningDialog.dialog( "close" ); 
            }
        }
        
    }
} 


function extendSsoSession(){
    var pathname = location.href.substring(0, location.href.lastIndexOf('\/faces')+6);
    pathname = pathname + "/secure/reauthenticate.jspx?reauthenticate=true";
    var newwin = window.open(pathname, '_blank');
}

function readCookie(name)
{
  var nameEQ = name + "=";
  var cookies = document.cookie.split(';');
  for(var i=0;i < cookies.length;i++)
  {
    var c = cookies[i];
    while (c.charAt(0)==' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0)
    {
      return unescape(c.substring(nameEQ.length, c.length));
    }
  }
  return null;
}

function readExpCookie() {
    var expTimestamp = 0;
    var timeoutCookie = readCookie('ORASSO_AUTH_HINT');
    if (timeoutCookie && timeoutCookie.length > 5) {
        var utcTimeout = timeoutCookie.substring(5);
        
        if (utcTimeout.length == 14) {
            var year	= utcTimeout.substring(0, 4);
            var month	= utcTimeout.substring(4, 6);
            var day	= utcTimeout.substring(6, 8);
            var hour	= utcTimeout.substring(8, 10);
            var min	= utcTimeout.substring(10, 12);
            var sec	= utcTimeout.substring(12, 14);
            
            var timeoutDate = new Date(year, month - 1, day, hour, min, sec, 0);
            expTimestamp = timeoutDate.getTime();
        }
    }
        
    if (expTimestamp < 1)
        expTimestamp = -1;
    return expTimestamp;
}