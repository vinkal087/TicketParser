/*Log the current page to Omniture / Site Catalyst */
function logOmnitureTrackView() {
try{
     s.pageName = parseFileName();
     var s_code = s.t();
     if (s_code) {
         document.write(s_code);
     }
   }catch(err){
    //Ignore the error
   }
}

function logOmnitureTrackClickEvent(p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15) {
    if (p1) {

        var s = s_gi(s_account);

        s.pageName = parseFileName();
        //s.prop1 = p1;        
        if (p1) {
            s.prop1 = p1;
        }
        else {
            s.prop1 = "";
        }
        if (p2) {
            s.prop2 = p2;
        }
        else {
            s.prop2 = "";
        }
        if (p3) {
            s.prop3 = p3;
        }
        else {
            s.prop3 = "";
        }
        if (p4) {
            s.prop4 = p4;
        }
        else {
            s.prop4 = "";
        }
        if (p5) {
            s.prop5 = p5;
        }
        else {
            s.prop5 = "";
        }
        if (p6) {
            s.prop6 = p6;
        }
        else {
            s.prop6 = "";
        }
        if (p7) {
            s.prop7 = p7;
        }
        else {
            s.prop7 = "";
        }
        if (p8) {
            s.prop8 = p8;
        }
        else {
            s.prop8 = "";
        }
        if (p9) {
            s.prop9 = p9;
        }
        else {
            s.prop9 = "";
        }
        if (p10) {
            s.prop10 = p10;
        }
        else {
            s.prop10 = "";
        }
        if (p11) {
            s.prop11 = p11;
        }
        else {
            s.prop11 = "";
        }
        if (p12) {
            s.prop12 = p12;
        }
        else {
            s.prop12 = "";
        }
        if (p13) {
            s.prop13 = p13;
        }
        else {
            s.prop13 = "";
        }
        if (p14) {
            s.prop14 = p14;
        }
        else {
            s.prop14 = "";
        }
        if (p15) {
            s.prop15 = p15;
        }
        else {
            s.prop15 = "";
        }
        s.tl();
    }
}

/*Parse the actual file name out of the URL */
function parseFileName(){
   var sUrl = document.URL;
   endIdx = sUrl.indexOf('?');
   if(endIdx < 0) endIdx = sUrl.length;
   
   pageName = sUrl.substring(sUrl.lastIndexOf('/')+1, endIdx);
   
   return pageName
}

