    //var objXMLHttp =  new XmlHttp();
function doCommonAjaxCall(theDiv,theURL,useIframe,height,width, loadFunction){
    //alert(height);
    if(useIframe != null && useIframe == 'true'){
        makeFrame(theDiv,theURL,height, width, loadFunction);
    } else {
    var objXMLHttp =  new XmlHttp();
    var newPathname = "";
    if (theURL.indexOf('\/')>-1){
        newPathname = location.href.substring(0, location.href.lastIndexOf('\/faces')+6);
        UpdateDiv1(theDiv,newPathname+theURL,objXMLHttp);
    } else {
        pathArray = window.location.pathname.split( '/' );
        for ( i = 0; i < pathArray.length-1; i++ ) {
            newPathname += "/";
            newPathname += pathArray[i];
        }
        newPathname = newPathname.substring(1);
        UpdateDiv1(theDiv,window.location.protocol+'//'+window.location.host+newPathname+'/'+theURL,objXMLHttp);
    }
    }
    return;
    }
    
    function makeFrame(theDiv,theURL,height, width, loadFunction) { 
       //alert("height:"+height);
       //alert("width:"+width);
       //alert("theURL:"+theURL);
       if(!height){
          height = '350px';
       }
       if(typeof(height) == 'number'){
         height = height + "px"; 
       }
       if(!width){
          width = '400px';
       }
       if(typeof(width) == 'number'){
         width = width + "px"; 
       }
       //alert("height:"+height+" typeof(height) "+typeof(height));
       //alert("width:"+width);
       var newPathname = location.href.substring(0, location.href.lastIndexOf('\/faces')+6);
       var url = newPathname+theURL;
       //alert("URL: "+url);
       var objMyDiv = document.getElementById(theDiv);
       //alert("objMyDiv:"+objMyDiv);
       var ifrm = document.createElement("IFRAME");
       ifrm.setAttribute("id",theDiv+"Iframe");
       ifrm.setAttribute("frameBorder","0");
       ifrm.setAttribute("border","0px");
       ifrm.setAttribute("height","0px");
       ifrm.setAttribute("src", url); 
       ifrm.style.width = width; 
       ifrm.style.height = height; 
       ifrm.style.zIndex = 1;
       ifrm.setAttribute("class","iframe");
       while (objMyDiv.hasChildNodes())
       {
	  objMyDiv.removeChild(objMyDiv.firstChild);
       }
       objMyDiv.appendChild(ifrm); 
       if (loadFunction){
          setIframeOnLoadListener(ifrm,loadFunction);
       }
    } 
    function XmlHttp( ){
        this.CreateXmlHttpObject = CreateXmlHttpObject;
        this.GetUrlContent = GetUrlContent;
        this.GetResponseText = GetResponseText;
        this.GetReadyState = GetReadyState;           
        this.HttpMethod = 'GET'; // default
        this.objXmlHttp = this.CreateXmlHttpObject();
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
                   
    function GetReadyState( ){
        return this.objXmlHttp.readyState;
    }

    function GetResponseText( ){			
        return this.objXmlHttp.responseText;
    }

    // Function performs Get request to absolute url(strUrl)
    // using XmlHttp object (asynchroni)
    // Response returned into objResult element using innerHTML.
    // When state of XmlHttp object is changed - objOnReadyStateChangeFunction called
    function GetUrlContent( strUrl,objOnReadyStateChangeFunction,divName,theURL,objXMLHttp){
        //alert('GetUrlContent '+strUrl+' '+objOnReadyStateChangeFunction+' '+divName+' '+theURL);
        this.objXmlHttp.open('GET', theURL, true);
        this.objXmlHttp.setRequestHeader('Content-Type', 'application/xml');
        this.objXmlHttp.setRequestHeader("Cache-Control", "no-cache");
        if(objOnReadyStateChangeFunction){
            this.objXmlHttp.onreadystatechange=function(){
                objOnReadyStateChangeFunction(divName,objXMLHttp);
            }
        }
        this.objXmlHttp.send(null);
    }
       
    //This function is called when we get the data back from the server.       
    function GetResponse1(divName,objXMLHttp){
        if (objXMLHttp.GetReadyState() == 4) {
            // save response in inner html of result object
            var objMyDiv = document.getElementById(divName);
            var elements = objXMLHttp.GetResponseText();
            
            var firstIndexVal = elements.indexOf('<table');
            var lastIndexVal = elements.lastIndexOf('</table>')+8;
            elements = elements.substring(firstIndexVal,lastIndexVal);
            //alert(elements);
            objMyDiv.innerHTML = elements;
        }
    } 

    function UpdateDiv1(theDiv,theURL,objXMLHttp){
        objXMLHttp.GetUrlContent(theURL, GetResponse1,theDiv,theURL,objXMLHttp);
        return;
     }
         
     function CallWS(ctxPath,varValue){
//            objXMLHttp.GetUrlContent( ctxPath+"/faces/secure/km/CallByAjax.jspx?method="+varValue,false);
     }
     
     function setWindowOnloadListener(funcName){
        if (document.all){
            window.attachEvent('onload',funcName,false); 
        } else {
            window.addEventListener('load',funcName,false);   
        }
    }
    function setIframeOnLoadListener(iframe,funcName){
        if (document.all){
            iframe.attachEvent('onload',funcName,false);
        } else {
            iframe.addEventListener('load',funcName,false);
        }
    }
    function resizeFrame(f) {
        f.style.height = f.contentWindow.document.body.scrollHeight+10 + 'px';
    }
    function clearIframeLoadingImage(theDiv){
        var objMyDiv = document.getElementById(theDiv);
        if (objMyDiv){
            objMyDiv.style.display = 'none';
        }
    }

                    