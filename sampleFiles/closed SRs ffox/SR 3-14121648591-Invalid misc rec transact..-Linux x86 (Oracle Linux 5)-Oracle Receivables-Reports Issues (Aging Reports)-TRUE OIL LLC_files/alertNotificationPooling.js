//Default pooling period
var alertsPoolingPeriod = ALERTS_POOLING_PERIOD;
//2 * 60 * 1000;
//Global variables to track user idle
var USER_TIME_OUT = ALERTS_POOLING_PERIOD;
//1000 * 60;
var lastMouseMoveTime = new Date().getTime();
var authorized = true;

var lovHash;
var oldHash;

/**
 * Basic Ajax util functions
 */
var AjaxUtils = {
    /**
   * Ajax GET function
   */
    xhrGet: function(ajaxParameters) {
        var xmlhttp = AjaxUtils.getXmlHttpObject();
        if (xmlhttp == null) {
            alert("Your browser does not support XMLHTTP!");
            return;
        }

        var url = ajaxParameters.url;

        if (ajaxParameters.content != undefined) {
            var parameters = ajaxParameters.content;
            for (property in parameters) {
                //console.debug( property, parameters[property] );
                if (url.indexOf('?') < 0) {
                    url += "?" + property + "=" + parameters[property];
                } else {
                    url += "&" + property + "=" + parameters[property];
                }
            }
        }

        if (ajaxParameters.preventCache) {
            if (url.indexOf('?') < 0) {
                url = url + "?preventCache = " + Math.random();
            } else {
                url = url + "&preventCache = " + Math.random();
            }
        }

        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    try {
                        var responseObject = eval("(" + xmlhttp.responseText + ")");
                        //console.debug( 'responseObject:', responseObject );
                        ajaxParameters.load.call(this, responseObject);
                    } catch(e) {
                        //console.error( 'Error when parsing response ', e );
                        }
                } else if (xmlhttp.status == 401) {
                    authorized = false;

                }

            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send(null);
    },

    /**
   * Ajax xmlHttp object
   */
    getXmlHttpObject: function() {
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            return new XMLHttpRequest();
        }

        if (window.ActiveXObject) {
            // code for IE6, IE5
            return new ActiveXObject("Microsoft.XMLHTTP");
        }

        return null;
    }
}

//----------------------------------------------------------------------------- 
function isArray(it) {
    return it && (it instanceof Array || typeof it == "array");
}
//-----------------------------------------------------------------------------       
function showAlertsDialog() {
    getNewAlerts();
    var popupHeight = 600;
    var popupWidth = 800;

    var popupTop = (screen.height - popupHeight) / 2;
    var popupLeft = (screen.width - popupWidth) / 2;

    var winHandle = window.open("/oip/faces/secure/srm/alerts/Alerts.jspx", "mywindow", "status=0, toolbar=0, location=0, scrollbars=1, menubar=0, " + " top=" + popupTop + " , left=" + popupLeft + " , " + " height=" + popupHeight + ", width=" + popupWidth);
    winHandle.focus();
}
//----------------------------------------------------------------------------- 
function getAlertsIcon() {
    var alertsIcon;

    var imagesList = document.getElementsByTagName("img");
    for (var i = 0; i < imagesList.length; i++) {
        if (imagesList[i].id.indexOf('alertsIcon') > 0) {
            alertsIcon = imagesList[i];
        }
    }
    return alertsIcon;
}
//----------------------------------------------------------------------------- 
function getAlertsCounter() {
    var alertsCounter;

    var spanList = document.getElementsByTagName("span");
    for (var i = 0; i < spanList.length; i++) {
        if (spanList[i].id.indexOf('alertCnt') > 0) {
            alertsCounter = spanList[i];
        }
    }
    return alertsCounter;
}
//-----------------------------------------------------------------------------       
function refreshNewAlerts() {
    console.debug('refreshNewAlerts: ACTION_GET_NEW_ALERTS');
    getNewAlerts();
}
//----------------------------------------------------------------------------- 
var dfd;
function getNewAlerts() {
    console.debug("Get NEW ALERTS for user... [" + new Date() + "]");
//    var alertCnt = getAlertsCounter();
//    var alertsIcon = getAlertsIcon();
    var kw = {
        url: '/oip/faces/AlertNotification',
        content: {
            'ACTION': 'ACTION_GET_NEW_ALERTS'
        },
        preventCache: true,
        handleAs: 'json',
        load: function(data) {
            console.debug("Get NEW ALERTS load function... [" + new Date() + "]");
            var alertCnt = getAlertsCounter();
            var alertsIcon = getAlertsIcon();
            if (data != undefined && data.poolingPeriod != undefined)
                alertsPoolingPeriod = data.poolingPeriod;
            try {
            alertCnt.innerHTML = "";
            alertCnt.innerHTML = "(" + data.unacknowledgedAlertsCount + " alerts)";
            } catch(e) {
                console.debug("Error in alert count: " +e);            
            }
            if (alertsIcon != undefined) {
                if (data.unacknowledgedAlertsCount > 0) {
                    alertsIcon.style.background = "red";
                    alertsIcon.style.visibility = "";
                } else {
                    alertsIcon.style.background = "#00FF00";
                    alertsIcon.style.visibility = "";
                }
            } else {
                if (data.unacknowledgedAlertsCount > 0) {
                    var ans = window.confirm('You have ' + data.unacknowledgedAlertsCount + ' unacknowledged alert message(s). Do you want to see the list?');
                    if (ans == true) {
                        showAlertsDialog();
                    }
                }
            }
            // Process LOV caching data
            if (lovHash != data.lovHash) {
                lovHash = data.lovHash;
                if (typeof(processLOVChange) != "undefined" && processLOVChange instanceof Function) {
                    processLOVChange(true);
                }
            }
            try {
                resetSessionTimeout (); //Bug 16286517 - UPDATE JAVASCRIPTS UNDER SP TO INVOKE RESETSESSIONTIMEOUT()
                 console.debug("getNewAlerts: invoke resetSessionTimeout");
           } catch (e) {
                console.debug("Error invoking resetSessionTimeout. " +e);
            }
            return data;
        },
        error: function(data) {
            console.log("Error", dojo.toJson(data));
        },
        timeout: 120000
    };
    //If the user is not idle then request the alerts
    if (((new Date().getTime() - lastMouseMoveTime) < USER_TIME_OUT) && (authorized == true)) {
        //Ajax request to server
        dfd = AjaxUtils.xhrGet(kw);
    } else {
        //console.debug( "WARN: Alerts pooling stopped. User is idle !" );
        }

    if (authorized == true) {
        setTimeout("refreshNewAlerts()", alertsPoolingPeriod);
    }
    return dfd;
};
//----------------------------------------------------------------------------- 
//Input event handler
function onUserInputEvent(e) {
    //console.debug( 'in onUserInputEvent ' + ( e ? e : window.event ) + ' date: ' + new Date() );
    lastMouseMoveTime = new Date().getTime();
}
//----------------------------------------------------------------------------- 
function hookUserInputEvents() {
    try {
        if (document.body) {
            //console.debug( 'add Event Listener' );
            document.body.onmousedown = onUserInputEvent;
        } else {
            //console.error('No body');
            }
    } catch(e) {
        //console.error( 'Error hook events ', e );
        }
}
//----------------------------------------------------------------------------- 
//Start pooling only for Support users
if (HAS_SUPPORT_RESPONSIBILITIES) {
    console.log("start polling in alertNotificationPooling");
    try{
        //Hook input event handlers to track user idling
        hookUserInputEvents();
        //getNewAlerts();
        setTimeout("getNewAlerts()", 2000); //give a delay of 2 secs for the very first 
    }catch(exc){
        console.log("problem encountered in alertNotificationPooling.js" + exc.message);
    }
}