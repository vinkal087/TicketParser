// utility to load Orion Parameters
var OrionParameters = (function () {
  var values = {};
  return {
    values: function () {
      return values;
    },
    getParameter: function (param_name, expose, callback) {
      OrionParameters.getParameters([param_name], expose, callback)
    },
    getParameters: function (params_name, expose, callback) {
      dojo.xhrPost({
        url: "../../../SRRequest",
        content: {
          "action": "get_hd_site_params",
          "params_name": params_name
        },
        preventCache: true,
        handleAs: 'json',
        load: function (data) {
          if (true === expose) {
            for (var i = 0; i < params_name.length; i++) {
              OrionParameters.values[params_name[i]] = data[params_name[i]];
            }
          }
          if (typeof (callback) == 'function' && data) {
            callback.call(data);
          }
        },
        error: function (error) {
          console.error('Error Encountered while loading orion parameters: ', error);
        }
      });
    }
  }; //end return
})();

var PC = (function () {
  var PCUrl;
  var srTargetURL; 
  var Chat = {};
  Chat.AVAILABLE_FOR_CUSTOMERS_AND_ENGINEERS = 'AVAILABLE_FOR_CUSTOMERS_AND_ENGINEERS';
  Chat.AVAILABLE_FOR_ENGINEERS_ONLY = 'AVAILABLE_FOR_ENGINEERS_ONLY';
  Chat.NOT_AVAILABLE = 'NOT_AVAILABLE';

  var Menu = {};
  Menu.AVAILABLE_FOR_CUSTOMERS_AND_ENGINEERS = 'Available for Chat';
  Menu.AVAILABLE_FOR_ENGINEERS_ONLY = 'Available for Oracle Initiated Chat';
  Menu.NOT_AVAILABLE = 'Not Available';
  var buildNumber;
  var pollInterval;
  var initChatServicesInterval;
  
  OrionParameters.getParameter('SRM_CHAT_POPUP_SR_TARGET_URL', true, function () {
     PC.srTargetURL = OrionParameters.values['SRM_CHAT_POPUP_SR_TARGET_URL'];
     console.log('PC.srTargetURL - Retrieved Orion Param value for SRM_CHAT_POPUP_SR_TARGET_URL :' + PC.srTargetURL);
  });
       
    OrionParameters.getParameter('SRM_INITIALIZE_CHAT_SERVICES_INTERVAL', true, function () {
    PC.initChatServicesInterval = OrionParameters.values['SRM_INITIALIZE_CHAT_SERVICES_INTERVAL'];
    console.log('PC.initChatServicesInterval : ' + PC.initChatServicesInterval);
  }); 
  
  OrionParameters.getParameter('SRM_PRESENCE_ACTIVE_POLL_INTERVAL', true, function () {
    PC.pollInterval = OrionParameters.values['SRM_PRESENCE_ACTIVE_POLL_INTERVAL'];
    console.log('PC.pollInterval : ' + PC.pollInterval);
  });
  
  OrionParameters.getParameter('SRM_ENABLE_CUSTOMER_INITIATED_CHAT', true, function () {
    PC.enableInitiatedChat = OrionParameters.values['SRM_ENABLE_CUSTOMER_INITIATED_CHAT'];     
    if (PC.enableInitiatedChat === 'true') {
      PC.initChatServicesJSONP(); 
    } else {
      dojo.query(".chatPresence").forEach(function (n) {
        n.style.display = "none";
      });
    }
  });

//15.1 LGH:this is specifically for the Service request Tab only
  var index = document.location.pathname.indexOf('oip/faces/secure/ml3/sr/');
  var index2  = document.location.pathname.indexOf('oip/faces/secure/incident/')
  if (index > 0 || index2 > 0){
      OrionParameters.getParameter('SRM_SERVICE_REQUEST_TAB_BANNER_TARGET_URL', true, function () {
        PC.bannerTargetURL = OrionParameters.values['SRM_SERVICE_REQUEST_TAB_BANNER_TARGET_URL']; 
          OrionParameters.getParameter('SRM_SERVICE_REQUEST_TAB_BANNER_MESSAGE', true, function () {
            PC.bannerMessage = OrionParameters.values['SRM_SERVICE_REQUEST_TAB_BANNER_MESSAGE'];  
             if (PC.bannerTargetURL != undefined && PC.bannerMessage != undefined && PC.bannerMessage.toLowerCase() != 'off') {             
                // display the new srviewer banner 
                var msgDivButton = dojo.byId('SRMMessagingDiv');
                if (msgDivButton != undefined){
                     dojo.style( msgDivButton, {"display" :""}); // this is located in layoutContent.jspf
                     dojo.style( msgDivButton, {"width" :"600px"});
                     msgDivButton.title = PC.bannerMessage;
                     if (dojo.byId('SRMMessagingTxt')!= undefined){
                        dojo.byId('SRMMessagingTxt').innerHTML = PC.bannerMessage;
                     }  
                     if (dojo.byId('SRMMessagingImg')!= undefined){
                        dojo.byId('SRMMessagingImg').src = "../../../secure/srm/images/airhorn_24.png";
                     } 
                     dojo.connect(msgDivButton, 
                                 "onclick" ,
                                  this,
                                  dojo.hitch(this, 
                                     function(targetURL){
                                         window.open(targetURL, "_blank");  
                                          return;
                                       },
                                     PC.bannerTargetURL));
                  }// end of if
                  
                  
                  OrionParameters.getParameter('SRM_SERVICE_REQUEST_TAB_BANNER_WIDTH', true, function() {
                      PC.bannerWidth = OrionParameters.values['SRM_SERVICE_REQUEST_TAB_BANNER_WIDTH'];  
                      var messageDiv = dojo.byId('SRMMessagingDiv');
                      if (messageDiv != undefined) {
                        dojo.style( messageDiv, {"width" : PC.bannerWidth });                    
                      }
                  });
                  
              }
            });
      });
  }
  return {
    getBuildNumber: function () {
      var kw = {
        url: "../../../SRRequest",
        content: {
          action: "getBuildNumber"
        },
        preventCache: true,
        handleAs: 'json',
        timeout: 30000,
        load: function (d) {
          PC.buildNumber = d.buildNumber;
        },
        error: function (error) {
          console.error('Error Encountered trying to get Build Version but continuing without build number .. ' + error);
          return error;
        }
      };
      dojo.xhrGet(kw);
    },

    loadChatAndPresenceJSAndInitializeMenu: function () {
        buildNumber =PC.getBuildNumber();    
        OrionParameters.getParameter('MOS_INTG_HOST_PATH', true, function () {
        PCUrl = OrionParameters.values['MOS_INTG_HOST_PATH'];
        
        var cookies = PCUrl + "/epmos/common/js/cookies.js",
          jgrowlcss = PCUrl +
          "/epmos/common/css/jquery.jgrowl.min.css",
          jgrowl = PCUrl + "/epmos/common/js/jquery.jgrowl.min.js",
          notifications = PCUrl +
          "/epmos/common/js/notifications.js",
          invitation = PCUrl + "/epmos/common/js/invitation.js",
          presenceapi = PCUrl + "/epmos/common/js/presenceapi.js",
          presence = PCUrl + "/epmos/common/js/presence.js";
        PC.loadScript(cookies, function() {
          PC.loadScript(jgrowl, function() {
            PC.loadCss(jgrowlcss, function() {
              PC.loadScript(notifications, function() {
                PC.loadScript(invitation, function() {
                  PC.initInvitation();
                  PC.loadScript(presenceapi, function() {
                    PC.initPresenceMenu();
                    PC.loadScript(presence,
                      PC.initPresence);
                  });
                });
              });
            });
          });
        });
  
          dojo.query(".chatPresence").forEach(function (n) {
            n.style.display = "";
          });
        });  
    },
    
    initPresenceMenu: function () {
      PresenceApi.config.APPLICATION = 'ISP';
      PresenceApi.config.ROOT_CONTEXT = PCUrl + '/epmos';
      PresenceApi.config.CROSS_DOMAIN = true;
      console.log('[initPresenceMenu].. PresenceApi.config.ROOT_CONTEXT ' + PresenceApi.config.ROOT_CONTEXT);
      PresenceApi.init();
      PC.retrieveEngineerAvailabilityForChat();  
    },

    setDefaultMenuSelected: function () {
      OrionParameters.getParameter('SRM_CHAT_USERMENU_DEFAULT_SELECTION', true, function () {
        Chat.chatUserMenuDefaultSelection = OrionParameters.values['SRM_CHAT_USERMENU_DEFAULT_SELECTION'];
        var engrPresence = {};
        engrPresence.status = {};
        if (Chat.chatUserMenuDefaultSelection && Chat.chatUserMenuDefaultSelection.trim() != 'NONE') {
          engrPresence.status = Chat.chatUserMenuDefaultSelection;
          PC.setMenuSelected(engrPresence);
          PC.ChatSetAvailable(Chat.chatUserMenuDefaultSelection);
        } else {
          PC.ChatSetAvailable(Chat.AVAILABLE_FOR_CUSTOMERS_AND_ENGINEERS);
        }
      });
      console.log('[setDefaultMenuSelected]..');
    },

    checkPolling: function(availability) {
//      var sat = document.getElementById('selectedAvailTxt');
//      if (sat.innerHTML == Menu.NOT_AVAILABLE) {
        if ((availability == Chat.AVAILABLE_FOR_CUSTOMERS_AND_ENGINEERS)
        || (availability == Chat.AVAILABLE_FOR_ENGINEERS_ONLY))
        {
          PRESENCE.startPolling();
          console.log('[checkPolling].. PRESENCE.startPolling called..');
        }
//      }
      if (availability == Chat.NOT_AVAILABLE) {
        PRESENCE.stopPolling();
        console.log('[checkPolling].. PRESENCE.stopPolling called..');
      }
    },

    ChatSetAvailable: function (availability) {      
      PC.persistEngineerAvailabilityForChat(availability);

      if (PresenceApi.init) {
        try {
          PresenceApi.config.APPLICATION = 'ISP';
          PresenceApi.config.ROOT_CONTEXT = PCUrl + '/epmos';
          PresenceApi.config.CROSS_DOMAIN = true;
          PresenceApi.init();

          var engrPresence = {};
          engrPresence.status = {};
          if (availability == Chat.AVAILABLE_FOR_CUSTOMERS_AND_ENGINEERS) {
            engrPresence.status = PresenceApi.status.AVAILABLE_FOR_CUSTOMERS_AND_ENGINEERS;
          } else if (availability == Chat.AVAILABLE_FOR_ENGINEERS_ONLY) {
            engrPresence.status = PresenceApi.status.AVAILABLE_FOR_ENGINEERS_ONLY;
          } else if (availability == Chat.NOT_AVAILABLE) {
            engrPresence.status = PresenceApi.status.NOT_AVAILABLE;
          }
          PC.setMenuSelected(engrPresence);   
        } catch (err) {
          if (typeof (console) != 'undefined') {
            console.log('Error: ' + err);
          }
        }
      }
    },

    setMenuSelected: function (menuSelected) {
      if (menuSelected && menuSelected.status) {
        
        // set menu
        var ms = menuSelected.status;
        var sai = document.getElementById('selectedAvailImg');
        var sat = document.getElementById('selectedAvailTxt');
        if (sai && sat) {
          sai.title = 'Engineer availability for chat';
          if (ms === PresenceApi.status.AVAILABLE_FOR_CUSTOMERS_AND_ENGINEERS || ms === PresenceApi.status.AVAILABLE_FOR_ENGINEERS_ONLY) {
            sai.src = '/oip/faces/secure/srm/images/availgreen.png';
            if (ms === PresenceApi.status.AVAILABLE_FOR_CUSTOMERS_AND_ENGINEERS) {
              sat.innerHTML = Menu.AVAILABLE_FOR_CUSTOMERS_AND_ENGINEERS;
            } else if (menuSelected.status === PresenceApi.status.AVAILABLE_FOR_ENGINEERS_ONLY) {
              sat.innerHTML = Menu.AVAILABLE_FOR_ENGINEERS_ONLY;
            }
          } else if (ms === PresenceApi.status.NOT_AVAILABLE) {
            sai.src = '/oip/faces/secure/srm/images/availgray.png';
            sat.innerHTML = Menu.NOT_AVAILABLE;
          }
          console.log('[setMenuSelected].. ' + sat.innerHTML);
        }
         
        if (PresenceApi.setPresencePreference) {
          PresenceApi.setPresencePreference({
            status: ms,
            success: function(r) {
              PC.checkPolling(r.status);
              console.log('[ChatSetAvailable].. PresenceApi.setPresencePreference: ' + r.status);
            },
            error: function(r) {
              console.log('[ChatSetAvailable].. Chat and Presence services are temporarily unavailable');
              var sai = document.getElementById('selectedAvailImg');
              if (sai) {
                sai.src = '/oip/faces/secure/srm/images/warningicon.gif';
                   
                if (dojo.isIE > 0) {
                  $("#selectedAvailImg").attr("title", "Customer Initiated Chat and Notifications are not available in Internet Explorer 8 or 9. Use Firefox, Chrome or upgrade to IE 10+.");
                } else {
                  $("#selectedAvailImg").attr("title", "Chat and Presence services are temporarily unavailable");                    
                }
              }                
              // set the menu selected to 'Not Available' if there is an error getting to initialize-chat-services.jsp.
              var sat = document.getElementById('selectedAvailTxt');
              if (sat) sat.innerHTML = Menu.NOT_AVAILABLE;
            }
          });
        }              
      } else { // get presence from coherence
        PresenceApi.getPresencePreference({
          success: function (r) {
            PC.setMenuSelected(r);
            console.log('[PresenceApi.getPresencePreference].. ' + r.status);
          },
          error: function (r) {
            PC.setMenuSelectedStored(); // use local
          }
        });
      }
      localStorage.setItem("chatAvailabilityTXT", ms);
      localStorage.setItem("chatAvailabilityIMG", (ms === PresenceApi.status.AVAILABLE_FOR_CUSTOMERS_AND_ENGINEERS || ms === PresenceApi.status.AVAILABLE_FOR_ENGINEERS_ONLY) ? '/oip/faces/secure/srm/images/availgreen.png' : '/oip/faces/secure/srm/images/availgray.png');
    },

    initPresence: function () {
      console.log('[initPresence]..');
      try {
        PRESENCE.ROOT_CONTEXT = PCUrl + '/epmos/';
        PRESENCE.DEFAULT_ACTIVE_POLL_INTERVAL = 30000;
        PRESENCE.TAKE_OVER_INTERVAL = 45000;
        PRESENCE.APP_NAME = 'ISP';
        PRESENCE.CROSS_DOMAIN = true;
        OrionParameters.getParameter('SRM_PRESENCE_ACTIVE_POLL_INTERVAL', true, function () {
          PRESENCE.MAX_POLLING_TIME = OrionParameters.values['SRM_PRESENCE_ACTIVE_POLL_INTERVAL'];
        });
        PRESENCE.initPresence();
      } catch (err) {
        if (typeof (console) != 'undefined') {
          console.log('Error: ' + err);
        }
      }
    },

    initInvitation: function () {
      console.log('[initInvitation]..');
      try {
        //var srTargetURL = "../srview/SRTechnical.jspx?srNumber={1}&queryTabName=Dynamic";
        console.log('***********PC.srTargetURL :' + PC.srTargetURL);
    
        // Bug 19546735 - CIC: Include SR# in hyperlink within engineer chat invitation 
        //var notificationElement = '<div id="notification" ><p>{0} has requested to chat about <a target="_blank" href="' + PCUrl +  '/epmos/faces/SrDetail?needSrDetailRefresh=true&amp;srNumber={1}">SR {1}: {2}</a></p><span id="expireTime">Chat request will close in <span class="chatInvitationCountDown">10</span> minutes </span><div id="commandButtonBar"><button id="declineInvitation">No, I am Busy</button><button id="acceptInvitation">Accept Invitation</button></div></div>';
        var notificationElement = '<div id="notification" ><p>{0} has requested to chat about <a target="_blank" href="' + PC.srTargetURL +  '">SR {1}: {2}</a></p><span id="expireTime">Chat request will close in <span class="chatInvitationCountDown">10</span> minutes </span><div id="commandButtonBar"><button id="declineInvitation">No, I am Busy</button><button id="acceptInvitation">Accept Invitation</button></div></div>';
        var notificationHtmlElementHeader = '<div class="oracleLogo"><img src="' + PCUrl + '/epmos/faces/common/images/invitations/oracle.png" /></div><div class="chatLogo"><img src="' + PCUrl + '/epmos/faces/common/images/chat_icon.png" class="chatIcon"/><span class="chatWithOracle">Chat with <span class="chatWithOracle_MOS">My Oracle Support</span></span></div><div style="clear:both" />';
        INVITATION.config.ROOT_CONTEXT = PCUrl + '/epmos/';
        INVITATION.config.isScreenReaderMode = false;
        INVITATION.config.tabbedChatLoader = '/epmos/faces/common/images/spinning-wheel.gif';
        INVITATION.config.messageForAnInvitationActionAlreadyProcessed = 'This action is not allowed.';
        INVITATION.config.genericError = 'An unexpected error occured, please try again later.';
        INVITATION.config.messageForPopupBlockerEnabled = 'Please disable the popup blocker and then click Accept again.';
        INVITATION.config.invitationAsPlainText = '{0} has requested to chat about Service Request {1}: {2}';
        INVITATION.config.invitationAsHtmlElement = notificationElement;
        INVITATION.config.invitationHeaderForHtmlElement = notificationHtmlElementHeader;
        INVITATION.config.unreadMessage = 'message';
        INVITATION.config.unreadMessages = 'messages';
        INVITATION.config.CROSS_DOMAIN = true;
        INVITATION.config.declineMessage = 'Provide feedback to the customer on your availability'; 
        INVITATION.config.declineMessageSubmit = 'Send'; 
        INVITATION.config.notificationIcon                = PCUrl + "/epmos/common/images/new_chat_invite.png";
        INVITATION.config.notificationAutoCloseInterval   = 20000;
        INVITATION.config.notificationTitleForInvitations = 'New Chat Invitation[s] from:';
        INVITATION.config.notificationTextAboutSR         = 'about SR';
    
        if (INVITATION.init) {
          INVITATION.init();
        }
      } catch (err) {
        if (typeof (console) != 'undefined') {
          console.log('Error: ' + err);
        }
      }
    },

    noCB: function () {
      return;
    },

    setMenuSelectedStored: function () {
      var sai = document.getElementById('selectedAvailImg');
      var sat = document.getElementById('selectedAvailTxt');
      sai.title = 'Engineer availability for chat';

      if (typeof (Storage) != "undefined") {
        if (localStorage.getItem("chatAvailabilityTXT")) {
          console.log(' chatAvailabilityTXT : ' + localStorage.getItem("chatAvailabilityTXT"));
          var chatAvailabiltyString = localStorage.getItem("chatAvailabilityTXT");
          if (chatAvailabiltyString == Chat.AVAILABLE_FOR_CUSTOMERS_AND_ENGINEERS) sat.innerHTML = Menu.AVAILABLE_FOR_CUSTOMERS_AND_ENGINEERS;
          else if (chatAvailabiltyString == Chat.AVAILABLE_FOR_ENGINEERS_ONLY) sat.innerHTML = Menu.AVAILABLE_FOR_ENGINEERS_ONLY;
          else if (chatAvailabiltyString == Chat.NOT_AVAILABLE) sat.innerHTML = Menu.NOT_AVAILABLE;

          console.log(' chatAvailabilityIMG : ' + localStorage.getItem("chatAvailabilityIMG"));
          sai.src = localStorage.getItem("chatAvailabilityIMG");
          PC.ChatSetAvailable(chatAvailabiltyString);
          console.log('[setMenuSelectedStored]..');
        }
      } else {
        PC.setDefaultMenuSelected();
      }
    },

    retrieveEngineerAvailabilityForChat: function () {
      dojo.xhrPost({
        url: "../../../SRRequest",
        content: {
          "action": "getEngineerAvailabilityForChat"
        },
        preventCache: true,
        handleAs: 'json',
        sync: false,
        load: function(d) {
          PC.setMenuSelected(d);  //engineer_availability
          console.log('[retrieveEngineerAvailabilityForChat].. ' + d.status);
        },
        error: function (error) {
          console.error('[retrieveEngineerAvailabilityForChat].. ' + error);
        }
      });
    },

    persistEngineerAvailabilityForChat: function (menuSelected) {
      dojo.xhrPost({
        url: "../../../SRRequest",
        content: {
          "action": "setEngineerAvailabilityForChat",
          "engineerAvailabilityForChat": menuSelected
        },
        preventCache: true,
        handleAs: 'json',
        load: function (data) {
          console.log('[persistEngineerAvailabilityForChat].. ' + menuSelected);
        },
        error: function (error) {
          console.error('Error while storing Engineer Availability For Chat: ', error);
        }
      });
    },

    getVersion: function () {
        var bn = new Date().getTime();
        return (PC.buildNumber ? "?v=" + PC.buildNumber : "?v=" + bn);
    },
    
    loadCss: function (url, callback) {
      console.log('[loadCss]..' + url);
      var css = document.createElement("link");
      css.rel = "stylesheet";
      css.type = "text/css";
      if (css.readyState) { //IE
        css.onreadystatechange = function () {
          if (css.readyState === "loaded" || css.readyState === "complete") {
            css.onreadystatechange = null;
            callback();
          }
        };
      } else { //Others
        css.onload = function () {
          callback();
        };
      }
      css.href = url + PC.getVersion();
      document.getElementsByTagName("head")[0].appendChild(css);
    },
    
    loadScript: function (url, callback) {
      console.log('[loadScript]..' + url);
      var script = document.createElement("script");
      script.type = "text/javascript";
      if (script.readyState) { //IE
        script.onreadystatechange = function () {
          if (script.readyState === "loaded" || script.readyState === "complete") {
            script.onreadystatechange = null;
            callback();
          }
        };
      } else { //Others
        script.onload = function () {
          callback();
        };
      }
      script.src = url + PC.getVersion();
      document.getElementsByTagName("head")[0].appendChild(script);
    },
    
    initChatServicesJSONP: function () {
      OrionParameters.getParameter('SRM_INITIALIZE_CHAT_SERVICES_URL', true, function () {
        PC.initialChatServicesURL = OrionParameters.values['SRM_INITIALIZE_CHAT_SERVICES_URL'];
        if (PC.initialChatServicesURL) {
            (function ($) {
              var url = PC.initialChatServicesURL;
              $.ajax({
                type: 'GET',
                url: url,
                async: true,
                cache: false,
                timeout: 10000,
                contentType: "application/json",
                jsonpCallback: "initChatServicesCallback",
                dataType: 'jsonp',
                success: function (data, status, xhr) {
                  console.log("[initChatServicesJSONP]..status: " + status + ", xhrsts: " + xhr.status);
                  setTimeout( function(){PC.initChatServicesJSONP();}, PC.initChatServicesInterval );
                  PC.loadChatAndPresenceJSAndInitializeMenu();
                },
                error: function (xhr, status, error) {
                  console.log("[initChatServicesJSONP]..status:" + status + ", error: " + error.message);
                  //PC.loadChatAndPresenceJSAndInitializeMenu();
                  dojo.query(".chatPresence").forEach(function (n) {
                    n.style.display = "";
                  });
                  var sat = document.getElementById('selectedAvailTxt');
                  if (sat) sat.innerHTML = Menu.NOT_AVAILABLE;                  
                  $("#selectedAvailImg").attr("src", "/oip/faces/secure/srm/images/warningicon.gif?"+new Date().getTime());
                  if (error === 'timeout')
                    $("#selectedAvailImg").attr("title", "Timeout attempting to reach Chat and Presence services."); 
                  else {
                    if (dojo.isIE > 0) {
                      $("#selectedAvailImg").attr("title", "Customer Initiated Chat and Notifications are not available in Internet Explorer 8 or 9. Use Firefox, Chrome or upgrade to IE 10+.");
                    } else {
                      $("#selectedAvailImg").attr("title", "Chat and Presence services are temporarily unavailable");                    
                    }
                  }
                }                              
              });
            })(jQuery);
        }
      });
    }
  }; //end return
})();
  

    



