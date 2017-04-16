function EncodingFormat(
a0,
a1
)
{
this._length=a0;
this._messages=a1;
this._class="EncodingFormat";
}
EncodingFormat.prototype=new Validator();
EncodingFormat.prototype.LF="LF";
function _cjkParse(
a0
)
{
var a1=0;
var a2=this._length;
while(a1<a0.length)
{
var a3=a0.charCodeAt(a1);
if((a3<0x80)||((0xFF60<a3)&&(a3<0xFFA0)))a2--;
else a2-=2;
if(a2<0)
{
return new ValidatorException(this._messages[this.LF]);
}
a1++;
}
return a0;
}
function CjkFormat(
a0,
a1
)
{
this._base=EncodingFormat;
this._base(a0,a1);
this._class="CjkFormat";
}
CjkFormat.prototype=new EncodingFormat();
CjkFormat.prototype.validate=_cjkParse;
function _utf8Parse(
a0
)
{
var a1=0;
var a2=this._length;
while(a1<a0.length)
{
var a3=a0.charCodeAt(a1);
if(a3<0x80)a2--;
else if(a3<0x800)a2-=2;
else
{
if((a3&0xF800)==0xD800)
a2-=2;
else
a2-=3;
}
if(a2<0)
{
return new ValidatorException(this._messages[this.LF]);
}
a1++;
}
return a0;
}
function Utf8Format(
a0,
a1
)
{
this._base=EncodingFormat;
this._base(a0,a1);
this._class="Utf8Format";
}
Utf8Format.prototype=new EncodingFormat();
Utf8Format.prototype.validate=_utf8Parse;
function _sbParse(
a0
)
{
if(this._length<a0.length)
{
return new ValidatorException(this._messages[this.LF]);
}
return a0;
}
function SBFormat(
a0,
a1
)
{
this._base=EncodingFormat;
this._base(a0,a1);
this._class="SBFormat";
}
SBFormat.prototype=new EncodingFormat();
SBFormat.prototype.validate=_sbParse;

function _decimalGetAsString(
a0
)
{
return""+a0;
}
function _decimalParse(
a0,
a1,
a2,
a3,
a4,
a5
)
{
if(!a0)
return(void 0);
var a6=getLocaleSymbols();
if(a6)
{
var a7=a6.getGroupingSeparator();
if((a0.indexOf(a7)==0)||
(a0.lastIndexOf(a7)==(a0.length-1)))
return(void 0);
var a8=new RegExp("\\"+a7,"g");
a0=a0.replace(a8,"");
var a9=new RegExp("\\"+a6.getDecimalSeparator(),"g");
a0=a0.replace(a9,".");
}
var a10=a0.length-1;
while(a10>=0)
{
if(a0.charAt(a10)!=' ')
break;
a10--;
}
if(a10>=0)
{
if((a0.indexOf('e')<0)&&
(a0.indexOf('E')<0)&&
(((a0*a0)==0)||
((a0/a0)==1)))
{
var a11=parseFloat(a0);
if(!isNaN(a11))
{
var a12=a0.length;
var a13=0;
var a14=a0.lastIndexOf('.');
if(a14!=-1)
{
a12=a14;
a13=a0.length-a14-1;
}
var a15;
if((a4!=(void 0))&&
(a11>a4))
{
a15=DecimalFormat.LV;
}
else if((a5!=(void 0))&&
(a11<a5))
{
a15=DecimalFormat.MV;
}
else if((a2!=(void 0))&&
(a12>a2))
{
a15=DecimalFormat.LID;
}
else if((a3!=(void 0))&&
(a13>a3))
{
a15=DecimalFormat.LFD;
}
if(a15!=(void 0))
{
var a1=a1;
if((a1==(void 0))||
(a1[a15]==(void 0)))
return(void 0);
else
return new ConverterException(a1[a15]);
}
return a11;
}
}
}
return(void 0);
}
function _decimalGetAsObject(
a0
)
{
return _decimalParse(a0,
this._messages,
this._maxPrecision,
this._maxScale,
this._maxValue,
this._minValue);
}
function DecimalFormat(
a0,
a1,
a2,
a3,
a4)
{
this._messages=a0;
this._maxPrecision=a1;
this._maxScale=a2;
this._maxValue=a3;
this._minValue=a4;
this._class="DecimalFormat";
}
DecimalFormat.prototype=new Converter();
DecimalFormat.prototype.getAsString=_decimalGetAsString;
DecimalFormat.prototype.getAsObject=_decimalGetAsObject;
DecimalFormat.LFD='LFD';
DecimalFormat.LID='LID';
DecimalFormat.LV='LV';
DecimalFormat.MV='MV';
function _decimalValidate(
a0
)
{
numberString=""+a0;
var a1=_decimalParse(numberString,
this._messages,
this._maxPrecision,
this._maxScale,
this._maxValue,
this._minValue);
if(_instanceof(a1,ConverterException))
return new ValidatorException((void 0),a1.getFacesMessage());
return a1;
}
function DecimalValidator(
a0,
a1,
a2,
a3,
a4)
{
this._messages=a0;
this._maxPrecision=a1;
this._maxScale=a2;
this._maxValue=a3;
this._minValue=a4;
this._class="DecimalValidator";
}
DecimalValidator.prototype=new Validator();
DecimalValidator.prototype.validate=_decimalValidate;
function _regExpParse(
a0
)
{
a0=a0+'';
var a1=a0.match(this._pattern);
if((a1!=(void 0))&&(a1[0]==a0))
{
return a0;
}
else
{
return new ValidatorException(this._messages[RegExpFormat.NM]);
}
}
function RegExpFormat(
a0,
a1
)
{
this._pattern=a0;
this._messages=a1
this._class="RegExpFormat";
}
RegExpFormat.NM='NM';
RegExpFormat.prototype=new Validator();
RegExpFormat.prototype.validate=_regExpParse;

function _dfsv(
a0,
a1
)
{
if((a0==(void 0))||(a1==(void 0)))
return;
var a2=new Date(a1);
var a3=_dfGetLocaleTimeZoneDifference();
a1=_dfGetMidnight(a1+a3);
a1+=_getTimePortion(a0);
var a4=new Date(a1);
var a5=_getTimezoneDiff(a2,a4);
if(a5!=0)
a4=new Date(a1-a5);
var a6=_getDateFieldFormat(a0);
var a7=a0.value;
var a1=a6.getAsString(a4);
if(a0.value!=a1)
{
if(a0.onchange!=(void 0))
{
if(_agent.isIE)
{
a0.onpropertychange=function()
{
var a8=window.event;
if(a8.propertyName=='value')
{
a0.onpropertychange=function(){};
a0.onchange(a8);
}
}
a0.value=a1;
}
else
{
a0.value=a1;
var a8=new Object();
a8.type='change';
a8.target=a0;
a0.onchange(a8);
}
}
else
{
a0.value=a1;
}
}
a0.select();
a0.focus();
}
function _returnCalendarValue(
a0,
a1
)
{
var a2=a0.returnValue;
if(a2!=(void 0))
{
var a3=a0._dateField;
if(a3==(void 0))
{
a3=_savedField1879034;
}
_dfsv(a3,a2);
}
}
function _ldp(
a0,
a1,
a2,
a3,
a4
)
{
var a5=document.forms[a0][a1];
var a6=_dfgv(a5);
if(!a6)
{
a6=new Date();
}
if(!a4)
{
a4=_jspDir+_getQuerySeparator(_jspDir);
a4+="_t=fred&_red=cd";
}
else
{
var a7=a4.lastIndexOf('?');
var a8="";
if(a7==-1)
{
a7=a4.length;
}
else
{
a8=a4.substr(a7+1);
}
var a9=a4.lastIndexOf('/',a7);
var a10=a4.substring(0,a9+1);
a10+=_jspDir+_getQuerySeparator(_jspDir);
a10+=a8;
a10+=_getQuerySeparator(a10);
a10+="_t=fred";
var a11=a4.substring(a9+1,a7);
a4=a10;
a4+="&redirect="+escape(a11);
}
var a12=a6.getTime()-_dfGetLocaleTimeZoneDifference();
a4+="&value="+a12;
a4+="&loc="+_locale;
if(window["_enc"])
{
a4+="&enc="+_enc;
}
if(a2!=(void 0))
{
a4+="&minValue="+a2;
}
if(a3!=(void 0))
{
a4+="&maxValue="+a3;
}
var a13=openWindow(self,
a4,
'uix_2807778',
{width:350,height:370},
true,
void 0,
_returnCalendarValue);
a13._dateField=a5;
_savedField1879034=a5;
}
function _dfgv(a0)
{
if(a0.value!="")
return _getDateFieldFormat(a0).getAsObject(a0.value);
return null;
}
function _getTimePortion(a0)
{
var a1=_dfgv(a0);
if(!a1)
a1=new Date();
var a2=new Date(a1.getFullYear(),
a1.getMonth(),
a1.getDate());
var a3=a1-a2;
a3-=_getTimezoneDiff(a1,a2);
return a3;
}
function _dfGetLocaleTimeZoneDifference()
{
var a0=new Date();
var a1=a0.getTimezoneOffset()*-1;
var a2=0;
if(_uixLocaleTZ)
a2=(_uixLocaleTZ-a1)*60*1000;
return a2;
}
function _getTimezoneDiff(a0,a1)
{
return(a0.getTimezoneOffset()-a1.getTimezoneOffset())*60000;
}
function _dfGetMidnight(a0)
{
var a1=new Date(a0);
a1.setHours(0);
a1.setMinutes(0);
a1.setSeconds(0);
a1.setMilliseconds(0);
return a1.getTime();
}
function _dfb(a0,a1)
{
_fixDFF(a0);
}
function _dff(a0,a1)
{
_dfa(a0,a1);
}
function _dfa(a0,a1)
{
if(a1!=(void 0))
{
if(window._calActiveDateFields===(void 0))
window._calActiveDateFields=new Object();
if(typeof(a0)=="string")
{
a0=_getElementById(document,a0);
}
window._calActiveDateFields[a1]=a0;
}
}
function _calsd(a0,a1)
{
if(window._calActiveDateFields!=(void 0))
{
var a2=window._calActiveDateFields[a0];
if(a2)
_dfsv(a2,a1);
}
return false;
}
function _updateCal(a0,a1,a2)
{
a1+=('&scrolledValue='+a0.options[a0.selectedIndex].value);
if(a2)
_firePartialChange(a1);
else
document.location.href=a1;
}
function _doCancel()
{
top.returnValue=(void 0);
top.close();
return false;
}
function _selectDate(a0)
{
top.returnValue=a0;
top._unloadADFDialog(window.event);
top.close();return false;
}
var _savedField1879034;

function _getDateFieldFormat(a0)
{
var a1=a0.name;
var a2=(typeof(window['_dfs'])!="undefined");
if(a1&&a2&&_dfs)
{
var a3=_dfs[a1];
if(a3)
return new SimpleDateFormat(a3);
}
return new SimpleDateFormat();
}
function _fixDFF(a0)
{
var a1=_getDateFieldFormat(a0);
if(a0.value!="")
{
var a2=a1.getAsObject(a0.value);
if(a2!=(void 0))
a0.value=a1.getAsString(a2);
}
}

var _AD_ERA=void 0;
function _getADEra()
{
if(_AD_ERA==(void 0))
{
_AD_ERA=new Date(0);
_AD_ERA.setFullYear(1);
}
return _AD_ERA;
}
function _simpleDateFormat(
a0
)
{
var a1=new Object();
a1.value="";
var a2=this._pattern;
if(typeof a2!="string")
a2=a2[0];
_doClumping(a2,
this._localeSymbols,
_subformat,
a0,
a1);
return a1.value;
}
function _simpleDateParse(
a0
)
{
var a1=this._pattern;
if(typeof a1=="string")
{
return _simpleDateParseImpl(a0,
a1,
this._localeSymbols);
}
else
{
var a2;
for(a2=0;a2<a1.length;a2++)
{
var a3=_simpleDateParseImpl(a0,
a1[a2],
this._localeSymbols);
if(a3!=(void 0))
return a3;
}
}
}
function _simpleDateParseImpl(
a0,
a1,
a2)
{
var a3=new Object();
a3.currIndex=0;
a3.parseString=a0;
a3.parsedHour=(void 0);
a3.parsedMinutes=(void 0);
a3.parsedSeconds=(void 0);
a3.parsedMilliseconds=(void 0);
a3.isPM=false;
a3.parsedBC=false;
a3.parsedFullYear=(void 0);
a3.parsedMonth=(void 0);
a3.parsedDate=(void 0);
a3.parseException=new ConverterException();
var a4=new Date(0);
a4.setDate(1);
if(_doClumping(a1,
a2,
_subparse,
a3,
a4))
{
if(a0.length!=a3.currIndex)
{
return(void 0);
}
var a5=a3.parsedFullYear;
if(a5!=(void 0))
{
if(a3.parsedBC)
{
a5=_getADEra().getFullYear()-a5;
}
a4.setFullYear(a5);
a3.parsedFullYear=a5;
}
var a6=a3.parsedMonth;
if(a6!=(void 0))
a4.setMonth(a6);
var a7=a3.parsedDate;
if(a7!=(void 0))
a4.setDate(a7);
var a8=a3.parsedHour;
if(a8!=(void 0))
{
if(a3.isPM&&(a8<12))
{
a8+=12;
}
a4.setHours(a8);
a3.parsedHour=a8;
}
var a9=a3.parsedMinutes;
if(a9!=(void 0))
a4.setMinutes(a9);
var a10=a3.parsedSeconds;
if(a10!=(void 0))
a4.setSeconds(a10);
var a11=a3.parsedMilliseconds;
if(a11!=(void 0))
a4.setMilliseconds(a11);
if(!_isStrict(a3,a4))
{
return(void 0);
}
return a4;
}
else
{
return(void 0);
}
}
function _isStrict(
a0,
a1)
{
var a2=["FullYear","Month","Date","Hours","Minutes",
"Seconds","Milliseconds"];
for(var a3=0;a3<a2.length;a3++)
{
var a4="parsed"+a2[a3];
if(a0[a4]!=(void 0)&&
a0[a4]!=a1["get"+a2[a3]]())
{
return false;
}
}
return true;
}
function _doClumping(
a0,
a1,
a2,
a3,
a4
)
{
var a5=a0.length;
var a6=false;
var a7=0;
var a8=void 0;
var a9=0;
for(var a10=0;a10<a5;a10++)
{
var a11=a0.charAt(a10);
if(a6)
{
if(a11=="\'")
{
a6=false;
if(a7!=1)
{
a9++;
a7--;
}
if(!a2(a0,
a1,
"\'",
a9,
a7,
a3,
a4))
{
return false;
}
a7=0;
a8=void 0;
}
else
{
a7++;
}
}
else
{
if(a11!=a8)
{
if(a7!=0)
{
if(!a2(a0,
a1,
a8,
a9,
a7,
a3,
a4))
{
return false;
}
a7=0;
a8=void 0;
}
if(a11=='\'')
{
a6=true;
}
a9=a10;
a8=a11;
}
a7++;
}
}
if(a7!=0)
{
if(!a2(a0,
a1,
a8,
a9,
a7,
a3,
a4))
{
return false;
}
}
return true;
}
function _subformat(
a0,
a1,
a2,
a3,
a4,
a5,
a6
)
{
var a7=null;
var a8=false;
if((a2>='A')&&(a2<='Z')||
(a2>='a')&&(a2<='z'))
{
switch(a2)
{
case'D':
a7="(Day in Year)";
break;
case'E':
{
var a9=a5.getDay();
a7=(a4<=3)
?a1.getShortWeekdays()[a9]
:a1.getWeekdays()[a9];
}
break;
case'F':
a7="(Day of week in month)";
break;
case'G':
{
var a10=a1.getEras();
a7=(a5.getTime()<_getADEra().getTime())
?a10[0]
:a10[1];
}
break;
case'M':
{
var a11=a5.getMonth();
if(a4<=2)
{
a7=_getPaddedNumber(a11+1,a4);
}
else if(a4==3)
{
a7=a1.getShortMonths()[a11];
}
else
{
a7=a1.getMonths()[a11];
}
}
break;
case'S':
a7=_getPaddedNumber(a5.getMilliseconds(),a4);
break;
case'W':
a7="(Week in Month)";
break;
case'a':
{
var a12=a1.getAmPmStrings();
a7=(_isPM(a5.getHours()))
?a12[1]
:a12[0];
}
break;
case'd':
a7=_getPaddedNumber(a5.getDate(),a4);
break;
case'h':
hours=a5.getHours();
if(_isPM(hours))
hours-=12;
if(hours==0)
hours=12;
a7=_getPaddedNumber(hours,a4);
break;
case'K':
hours=a5.getHours();
if(_isPM(hours))
hours-=12;
a7=_getPaddedNumber(hours,a4);
break;
case'k':
hours=a5.getHours();
if(hours==0)
hours=24;
a7=_getPaddedNumber(hours,a4);
break;
case'H':
a7=_getPaddedNumber(a5.getHours(),a4);
break;
case'm':
a7=_getPaddedNumber(a5.getMinutes(),a4);
break;
case's':
a7=_getPaddedNumber(a5.getSeconds(),a4);
break;
case'w':
a7="(Week in year)";
break;
case'y':
{
var a13=a5.getFullYear();
var a14=(a4<=2)
?a4
:(void 0);
a7=_getPaddedNumber(a13,a4,a14);
}
break;
case'z':
{
a7="GMT";
var a15=_getTimeZoneOffsetString(a5,false);
if(a15)
{
a7+=a15[0];
a7+=":"
a7+=a15[1];
}
}
break;
case'Z':
{
var a15=_getTimeZoneOffsetString(a5,true);
if(a15)
{
a7=a15[0];
a7+=a15[1];
}
else
{
a7="";
}
}
break;
default:
a7="";
}
}
else
{
a7=a0.substring(a3,a3+a4);
}
a6.value+=a7;
return true;
}
function _getTimeZoneOffsetString(a0,a1)
{
var a2=-1*a0.getTimezoneOffset();
a2+=_getLocaleTimeZoneDifference();
if(a1||a2!=0)
{
var a3=new Array(2);
if(a2<0)
{
a3[0]="-";
a2=-a2
}
else
{
a3[0]="+";
}
a3[0]+=_getPaddedNumber(Math.floor(a2/60),2);
a3[1]=_getPaddedNumber(a2%60,2);
return a3;
}
}
function _getLocaleTimeZoneDifference()
{
var a0=new Date();
var a1=a0.getTimezoneOffset()*-1;
var a2=0;
if(_uixLocaleTZ)
a2=(_uixLocaleTZ-a1);
return a2;
}
function _subparse(
a0,
a1,
a2,
a3,
a4,
a5,
a6
)
{
var a7=a5.currIndex;
if((a2>='A')&&(a2<='Z')||
(a2>='a')&&(a2<='z'))
{
switch(a2)
{
case'D':
if(_accumulateNumber(a5,3)==(void 0))
{
return false;
}
break;
case'E':
{
var a8=_matchArray(a5,
(a4<=3)
?a1.getShortWeekdays()
:a1.getWeekdays());
if(a8==(void 0))
{
return false;
}
}
break;
case'F':
if(_accumulateNumber(a5,2)==(void 0))
{
return false;
}
break;
case'G':
{
var a9=_matchArray(a5,a1.getEras());
if(a9!=(void 0))
{
if(a9==0)
{
a5.isBC=true;
}
}
else
{
return false;
}
}
break;
case'M':
{
var a10;
var a11=0;
if(a4<=2)
{
a10=_accumulateNumber(a5,2);
a11=-1;
}
else
{
var a12=(a4==3)
?a1.getShortMonths()
:a1.getMonths();
a10=_matchArray(a5,a12);
}
if(a10!=(void 0))
{
a5.parsedMonth=(a10+a11);
}
else
{
return false;
}
}
break;
case'S':
{
var a13=_accumulateNumber(a5,3);
if(a13!=(void 0))
{
a5.parsedMilliseconds=a13;
}
else
{
return false;
}
}
break;
case'W':
if(_accumulateNumber(a5,2)==(void 0))
{
return false;
}
break;
case'a':
{
var a14=_matchArray(a5,
a1.getAmPmStrings());
if(a14==(void 0))
{
return false;
}
else
{
if(a14==1)
{
a5.isPM=true;
}
}
}
break;
case'd':
{
var a15=_accumulateNumber(a5,2);
if(a15!=(void 0))
{
a5.parsedDate=a15;
}
else
{
return false;
}
}
break;
case'h':
case'k':
case'H':
case'K':
{
var a16=_accumulateNumber(a5,2);
if(a16!=(void 0))
{
if((a2=='h')&&(a16==12))
a16=0;
if((a2=='k')&&(a16==24))
a16=0;
a5.parsedHour=a16;
}
else
{
return false;
}
}
break;
case'm':
{
var a17=_accumulateNumber(a5,2);
if(a17!=(void 0))
{
a5.parsedMinutes=a17;
}
else
{
return false;
}
}
break;
case's':
{
var a18=_accumulateNumber(a5,2);
if(a18!=(void 0))
{
a5.parsedSeconds=a18;
}
else
{
return false;
}
}
break;
case'w':
if(_accumulateNumber(a5,2)==(void 0))
{
return false;
}
break;
case'y':
{
var a19=_accumulateNumber(a5,4);
var a20=a5.currIndex-a7;
if(a19!=(void 0))
{
if((a20>2)&&
(a4<=2)&&
(a19<=999))
{
return false;
}
else if((a4<=2)&&(a19>=0)&&(a19<=100))
{
a19=_fix2DYear(a19);
}
else if(a4==4)
{
if(a20==3)
return false;
if(a20<=2)
a19=_fix2DYear(a19);
}
if(a19==0)
return false;
a5.parsedFullYear=a19;
}
else
{
return false;
}
}
break;
case'z':
{
if(!_matchText(a5,"GMT"))
{
return false;
}
if((a5.parseString.length-a5.currIndex)>0)
{
if(_matchArray(a5,["-","+"])==(void 0))
{
return false;
}
if(_accumulateNumber(a5,2)==(void 0))
{
return false;
}
if(!_matchText(a5,":"))
{
return false;
}
if(((a5.parseString.length-a5.currIndex)<2)||
_accumulateNumber(a5,2)==(void 0))
{
return false;
}
}
}
break;
case'Z':
{
if((a5.parseString.length-a5.currIndex)<5)
{
return false;
}
if(_matchArray(a5,["-","+"])==(void 0))
{
return false;
}
if(_accumulateNumber(a5,2)==(void 0))
{
return false;
}
if(_accumulateNumber(a5,2)==(void 0))
{
return false;
}
}
break;
default:
}
}
else
{
return _matchText(a5,
a0.substring(a3,a3+a4));
}
return true;
}
function _fix2DYear(a0)
{
var a1;
if(_df2DYS!=(void 0))
{
var a2=_df2DYS;
a1=a2-(a2%100);
a0+=a1;
if(a0<a2)
a0+=100;
}
else
{
var a3=new Date().getFullYear();
a1=a3-(a3%100)-100;
a0+=a1;
if(a0+80<a3)
{
a0+=100;
}
}
return a0;
}
function _matchArray(
a0,
a1
)
{
for(var a2=0;a2<a1.length;a2++)
{
if(_matchText(a0,a1[a2]))
{
return a2;
}
}
return(void 0);
}
function _matchText(
a0,
a1
)
{
if(!a1)
return false;
var a2=a1.length;
var a3=a0.currIndex;
var a4=a0.parseString;
if(a2>a4.length-a3)
{
return false;
}
var a5=a4.substring(a3,a3+a2);
var a6=a5.toLowerCase();
var a7=a1.toLowerCase();
if(a6!=a7)
return false;
a0.currIndex+=a2;
return true;
}
function _accumulateNumber(
a0,
a1
)
{
var a2=a0.currIndex;
var a3=a2;
var a4=a0.parseString;
var a5=a4.length;
if(a5>a3+a1)
a5=a3+a1;
var a6=0;
while(a3<a5)
{
var a7=parseDigit(a4.charAt(a3));
if(!isNaN(a7))
{
a6*=10;
a6+=a7;
a3++;
}
else
{
break;
}
}
if(a2!=a3)
{
a0.currIndex=a3;
return a6;
}
else
{
return(void 0);
}
}
function _isPM(
a0
)
{
return(a0>=12);
}
function _getPaddedNumber(
a0,
a1,
a2
)
{
var a3=a0.toString();
if(a1!=(void 0))
{
var a4=a1-a3.length;
while(a4>0)
{
a3="0"+a3;
a4--;
}
}
if(a2!=(void 0))
{
var a5=a3.length-a2;
if(a5>0)
{
a3=a3.substring(a5,
a5+a2);
}
}
return a3;
}
function SimpleDateFormat(
a0,
a1
)
{
this._class="SimpleDateFormat";
this._localeSymbols=getLocaleSymbols(a1);
if(a0==(void 0))
a0=this._localeSymbols.getShortDatePatternString();
var a2=new Array();
if(a0)
a2=a2.concat(a0);
var a3=a2.length;
for(var a4=0;a4<a3;a4++)
{
if(a2[a4].indexOf('MMM')!=-1)
{
a2[a2.length]=a2[a4].replace(/MMM/g,'MM');
a2[a2.length]=a2[a4].replace(/MMM/g,'M');
}
}
var a3=a2.length;
for(var a4=0;a4<a3;a4++)
{
if(a2[a4].indexOf('/')!=-1)
{
a2[a2.length]=a2[a4].replace(/\//g,'-');
a2[a2.length]=a2[a4].replace(/\//g,'.');
}
if(a2[a4].indexOf('-')!=-1)
{
a2[a2.length]=a2[a4].replace(/-/g,'/');
a2[a2.length]=a2[a4].replace(/-/g,'.');
}
if(a2[a4].indexOf('.')!=-1)
{
a2[a2.length]=a2[a4].replace(/\./g,'-');
a2[a2.length]=a2[a4].replace(/\./g,'/');
}
}
this._pattern=a2;
}
SimpleDateFormat.prototype=new Converter();
SimpleDateFormat.prototype.getAsString=_simpleDateFormat;
SimpleDateFormat.prototype.getAsObject=_simpleDateParse;

var _digits;
var _decimalSep;
var _groupingSep;
function isDigit(
a0
)
{
return(_getDigits()[a0]!=(void 0));
}
function _getDigits()
{
if(_digits==(void 0))
{
var a0=[
0x0030,
0x0660,
0x06F0,
0x0966,
0x09E6,
0x0A66,
0x0AE6,
0x0B66,
0x0BE7,
0x0C66,
0x0CE6,
0x0D66,
0x0E50,
0x0ED0,
0x0F20,
0xFF10
];
_digits=new Object();
for(var a1=0;a1<a0.length;a1++)
{
for(var a2=0;a2<10;a2++)
{
var a3=String.fromCharCode(a0[a1]+a2);
_digits[a3]=a2;
}
}
}
return _digits;
}
function parseDigit(
a0
)
{
var a1=_getDigits()[a0];
if(a1==(void 0))
{
return NaN;
}
else
{
return a1;
}
}
function isNotLowerCase()
{
var a0=alphaChar.charCodeAt(0);
if(a0>0xFF)
{
return true;
}
else
{
return!_isLowerCaseStrict(alphaChar);
}
}
function isLowerCase(
a0
)
{
var a1=a0.charCodeAt(0);
if(a1>0xFF)
{
return!isDigit(a0);
}
else
{
return _isLowerCaseStrict(a0);
}
}
function _isLowerCaseStrict(
a0
)
{
var a1=a0.charCodeAt(0);
return(((a1>=0x61)&&(a1<=0x7A))||
((a1>=0xDF)&&(a1<=0xFF)));
}
function isUpperCase(
a0
)
{
var a1=a0.charCodeAt(0);
if(a1>0xFF)
{
return!isDigit(a0);
}
else
{
return _isUpperCaseStrict(a0);
}
}
function isNotUpperCase(
a0
)
{
var a1=a0.charCodeAt(0);
if(a1>0xFF)
{
return true;
}
else
{
return!_isUpperCaseStrict(a0);
}
}
function _isUpperCaseStrict(
a0
)
{
var a1=a0.charCodeAt(0);
return(((a1>=0x41)&&(a1<=0x5A))||
((a1>=0xC0)&&(a1<=0xDe)));
}
function isLetter(
a0
)
{
return isLowerCase(a0)|isUpperCase(a0);
}
function getUserLanguage()
{
var a0=_locale;
if(a0==(void 0))
{
a0=window.navigator.userLanguage;
if(a0==(void 0))
{
a0=window.navigator.language;
}
}
return a0;
}
function getJavaLanguage(
a0
)
{
if(a0==(void 0))
{
a0=getUserLanguage();
}
var a1=a0.indexOf("-",0);
if(a1==-1)
return a0;
var a2=a0.length;
var a3=a0.substring(0,a1);
a3+="_";
a1++;
var a4=a0.indexOf("-",a1);
if(a4==-1)
{
a4=a2;
}
var a5=a0.substring(a1,
a4);
a3+=a5.toUpperCase();
if(a4!=a2)
{
a3+="_";
a3+=a0.substring(a4+1,
a2);
}
return a3;
}
function getLocaleSymbols(
a0
)
{
var a1=getJavaLanguage(a0);
while(true)
{
var a2=window["LocaleSymbols_"+a1];
if(a2!=(void 0))
{
return a2;
}
else
{
var a3=a1.lastIndexOf("_");
if(a3!=-1)
{
a1=a1.substring(0,a3);
}
else
{
break;
}
}
}
}
function _getEras()
{
return this.getLocaleElements()["Eras"];
}
function _getMonths()
{
return this.getLocaleElements()["MonthNames"];
}
function _getShortMonths()
{
return this.getLocaleElements()["MonthAbbreviations"];
}
function _getWeekdays()
{
return this.getLocaleElements()["DayNames"];
}
function _getShortWeekdays()
{
return this.getLocaleElements()["DayAbbreviations"];
}
function _getAmPmStrings()
{
return this.getLocaleElements()["AmPmMarkers"];
}
function _getZoneStrings()
{
return this.getLocaleElements()["zoneStrings"];
}
function _getLocalPatternChars()
{
return this.getLocaleElements()["localPatternChars"];
}
function _getDecimalSeparator()
{
if(_decimalSep!=(void 0))
return _decimalSep;
return this.getLocaleElements()["NumberElements"][0];
}
function _getGroupingSeparator()
{
if(_groupingSep!=(void 0))
return _groupingSep;
return this.getLocaleElements()["NumberElements"][1];
}
function _getPatternSeparator()
{
return this.getLocaleElements()["NumberElements"][2];
}
function _getPercent()
{
return this.getLocaleElements()["NumberElements"][3];
}
function _getZeroDigit()
{
return this.getLocaleElements()["NumberElements"][4];
}
function _getDigit()
{
return this.getLocaleElements()["NumberElements"][5];
}
function _getMinusSign()
{
return this.getLocaleElements()["NumberElements"][6];
}
function _getExponential()
{
return this.getLocaleElements()["NumberElements"][7];
}
function _getPerMill()
{
return this.getLocaleElements()["NumberElements"][8];
}
function _getInfinity()
{
return this.getLocaleElements()["NumberElements"][9];
}
function _getNaN()
{
return this.getLocaleElements()["NumberElements"][10];
}
function _getCurrencySymbol()
{
return this.getLocaleElements()["CurrencyElements"][0];
}
function _getInternationalCurrencySymbol()
{
return this.getLocaleElements()["CurrencyElements"][1];
}
function _getMonetaryDecimalSeparator()
{
var a0=this.getLocaleElements()["CurrencyElements"][2];
if(a0.length!=0)
{
return a0;
}
else
{
return this.getDecimalSeparator();
}
}
function _getLocaleElements()
{
return this["LocaleElements"];
}
function _getFullTimePatternString()
{
return this.getLocaleElements()["DateTimePatterns"][0];
}
function _getLongTimePatternString()
{
return this.getLocaleElements()["DateTimePatterns"][1];
}
function _getMediumTimePatternString()
{
return this.getLocaleElements()["DateTimePatterns"][2];
}
function _getShortTimePatternString()
{
return this.getLocaleElements()["DateTimePatterns"][3];
}
function _getFullDatePatternString()
{
return this.getLocaleElements()["DateTimePatterns"][4];
}
function _getLongDatePatternString()
{
return this.getLocaleElements()["DateTimePatterns"][5];
}
function _getMediumDatePatternString()
{
return this.getLocaleElements()["DateTimePatterns"][6];
}
function _getShortDatePatternString()
{
return this.getLocaleElements()["DateTimePatterns"][7];
}
function _getDateTimeFormatString()
{
return this.getLocaleElements()["DateTimePatterns"][8];
}
function LocaleSymbols(
a0
)
{
this["LocaleElements"]=a0;
}
LocaleSymbols.prototype.getFullTimePatternString=_getFullTimePatternString;
LocaleSymbols.prototype.getLongTimePatternString=_getLongTimePatternString;
LocaleSymbols.prototype.getMediumTimePatternString=_getMediumTimePatternString;
LocaleSymbols.prototype.getShortTimePatternString=_getShortTimePatternString;
LocaleSymbols.prototype.getFullDatePatternString=_getFullDatePatternString;
LocaleSymbols.prototype.getLongDatePatternString=_getLongDatePatternString;
LocaleSymbols.prototype.getMediumDatePatternString=_getMediumDatePatternString;
LocaleSymbols.prototype.getShortDatePatternString=_getShortDatePatternString;
LocaleSymbols.prototype.getDateTimeFormatString=_getDateTimeFormatString;
LocaleSymbols.prototype.getEras=_getEras;
LocaleSymbols.prototype.getMonths=_getMonths;
LocaleSymbols.prototype.getShortMonths=_getShortMonths;
LocaleSymbols.prototype.getWeekdays=_getWeekdays;
LocaleSymbols.prototype.getShortWeekdays=_getShortWeekdays;
LocaleSymbols.prototype.getAmPmStrings=_getAmPmStrings;
LocaleSymbols.prototype.getZoneStrings=_getZoneStrings;
LocaleSymbols.prototype.getLocalPatternChars=_getLocalPatternChars;
LocaleSymbols.prototype.getDecimalSeparator=_getDecimalSeparator;
LocaleSymbols.prototype.getGroupingSeparator=_getGroupingSeparator;
LocaleSymbols.prototype.getPatternSeparator=_getPatternSeparator;
LocaleSymbols.prototype.getPercent=_getPercent;
LocaleSymbols.prototype.getZeroDigit=_getZeroDigit;
LocaleSymbols.prototype.getDigit=_getDigit;
LocaleSymbols.prototype.getMinusSign=_getMinusSign;
LocaleSymbols.prototype.getExponential=_getExponential;
LocaleSymbols.prototype.getPerMill=_getPerMill;
LocaleSymbols.prototype.getInfinity=_getInfinity;
LocaleSymbols.prototype.getNaN=_getNaN;
LocaleSymbols.prototype.getCurrencySymbol=_getCurrencySymbol;
LocaleSymbols.prototype.getInternationalCurrencySymbol=_getInternationalCurrencySymbol;
LocaleSymbols.prototype.getMonetaryDecimalSeparator=_getMonetaryDecimalSeparator;
LocaleSymbols.prototype.getLocaleElements=_getLocaleElements;
function Converter()
{
this._class="Converter";
}
Converter.prototype.getAsString=function(a0){}
Converter.prototype.getAsObject=function(a1){}
function Validator()
{
this._class="Validator";
}
Validator.prototype.validate=function(a0){}
function ConverterException(
a0,
a1
)
{
this._facesMessage=a1;
if(a1==void(0))
{
if(a0!=void(0))
this._facesMessage=new FacesMessage((void 0),a0);
else
this._facesMessage=new FacesMessage("Convesion Failure","Convesion Failure");
}
}
ConverterException.prototype.getFacesMessage=
function()
{
return this._facesMessage;
}
function ValidatorException(
a0,
a1
)
{
this._facesMessage=a1;
if(a1==void(0))
{
if(a0!=void(0))
this._facesMessage=new FacesMessage((void 0),a0);
else
this._facesMessage=new FacesMessage("Validation Failure","Validation Failure");
}
}
ValidatorException.prototype.getFacesMessage=
function()
{
return this._facesMessage;
}
function FacesMessage(
a0,
a1
)
{
this._summary=a0;
this._detail=a1;
}
FacesMessage.prototype.getDetail=
function()
{
return this._detail;
}
FacesMessage.prototype.getSummary=
function()
{
return this._summary;
}
FacesMessage.prototype.setDetail=
function(
a2
)
{
this._detail=a2;
}
FacesMessage.prototype.setSummary=
function(
a3
)
{
this._summary=a3;
}

var _pprSubmitCount=0;
var _pprSomeAction=false;
var _pprRequestCount=0;
var _pprUnloaded=false;
var _pprBackRestoreInlineScripts=false;
var _pprBlocking=false;
var _blockOnEverySubmit=false;
var _pprIframeName="_pprIFrame";
var _pprFirstClickPass=false;
var _pprdivElementName='_pprBlockingDiv';
var _pprLibStore;
var _fullPageBlocking=false;
var _pprBlockStartTime=0;
var _pprBlockingTimeout=null;
var _pprEventElement=null;
var _pprSavedCursorFlag=false;
var _pprChoiceChanged=false;
var _agent=new Object();
var _lastDateSubmitted;
var _lastDateReset=0;
var _lastDateValidated=0;
var _lastValidationFailure=0;
_delayedEventParams=new Object();
var _initialFormState;
var _initialFormExclude=new Object();
var _initialFormStateName;
var _navDirty;
var _initialFocusID=null;
var _AdfFocusRequestDoc=null;
var _AdfFocusRequestID=null;
var _AdfFocusRequestNext=false;
var _blockCheckUnloadFromDialog=false;
var _saveForm=null;
var _saveDoValidate=null;
var _saveParameters=null;
var _submitRejected=false;
var _inPartialSubmit=false;
var _pendingRadioButton=false;
var _IE_MOUSE_CAPTURE_EVENTS=[
"onclick",
"ondblclick",
"onmousedown",
"onmousemove",
"onmouseout",
"onmouseover",
"onmouseup"
];
var _GECKO_MOUSE_CAPTURE_EVENTS=[
"click",
"mousedown",
"mouseup",
"mouseover",
"mousemove",
"mouseout",
"contextmenu"
];
function _atLeast(
a0,
a1
)
{
return(!a0||(a0==_agent.kind))&&
(!a1||(a1<=_agent.version));
}
function _atMost(
a0,
a1
)
{
return(a0==_agent.kind)&&(a1>=_agent.version);
}
function _supportsDOM()
{
var a0=false;
if(_agent.isIE)
{
a0=_agent.version>=5.5;
}
else if(_agent.isNav)
{
a0=false;
}
else if(_agent.isGecko||_agent.isSafari)
{
a0=true;
}
return a0;
}
function _agentInit()
{
var a0=navigator.userAgent.toLowerCase();
var a1=parseFloat(navigator.appVersion);
var a2=false;
var a3=false;
var a4=false;
var a5=false;
var a6=false;
var a7=false;
var a8="unknown";
var a9=false;
var a10=false;
var a11=false;
if(a0.indexOf("msie")!=-1)
{
var a12=a0.match(/msie (.*);/);
a1=parseFloat(a12[1]);
if(a0.indexOf("ppc")!=-1&&
a0.indexOf("windows ce")!=-1&&
a1>=4.0)
{
a7=true;
a8="pie";
}
else{
a3=true;
a8="ie";
}
}
else if(a0.indexOf("opera")!=-1)
{
a2=true
a8="opera";
}
else if((a0.indexOf("applewebkit")!=-1)||
(a0.indexOf("safari")!=-1))
{
a6=true
a8="safari";
}
else if(a0.indexOf("gecko/")!=-1)
{
a5=true;
a8="gecko";
a1=1.0;
}
else if((a0.indexOf('mozilla')!=-1)&&
(a0.indexOf('spoofer')==-1)&&
(a0.indexOf('compatible')==-1))
{
if(a1>=5.0)
{
a5=true;
a8="gecko";
a1=1.0;
}
else
{
a4=true;
a8="nn";
}
}
if(a0.indexOf('win')!=-1)
{
a9=true;
}
else if(a0.indexOf('mac')!=-1)
{
a11=true;
}
else if(a0.indexOf('sunos')!=-1)
{
a10=true;
}
_agent.isIE=a3;
_agent.isNav=a4;
_agent.isOpera=a2;
_agent.isPIE=a7;
_agent.isGecko=a5;
_agent.isSafari=a6;
_agent.version=a1
_agent.kind=a8;
_agent.isWindows=a9;
_agent.isSolaris=a10;
_agent.isMac=a11;
_agent.atLeast=_atLeast;
_agent.atMost=_atMost;
}
_agentInit();
var _ieFeatures=
{
channelmode:1,
copyhistory:1,
directories:1,
fullscreen:1,
height:1,
location:1,
menubar:1,
resizable:1,
scrollbars:1,
status:1,
titlebar:1,
toolbar:1,
width:1
};
var _nnFeatures=
{
alwayslowered:1,
alwaysraised:1,
copyhistory:1,
dependent:1,
directories:1,
height:1,
hotkeys:1,
innerheight:1,
innerwidth:1,
location:1,
menubar:1,
outerwidth:1,
outerheight:1,
resizable:1,
scrollbars:1,
status:1,
titlebar:1,
toolbar:1,
width:1,
"z-lock":1
}
var _modelessFeatureOverrides=
{
};
var _modalFeatureOverrides=
{
};
var _featureDefaults=
{
document:
{
channelmode:false,
copyhistory:true,
dependent:false,
directories:true,
fullscreen:false,
hotkeys:false,
location:true,
menubar:true,
resizable:true,
scrollbars:true,
status:true,
toolbar:true
},
dialog:
{
channelmode:false,
copyhistory:false,
dependent:true,
directories:false,
fullscreen:false,
hotkeys:true,
location:false,
menubar:false,
resizable:true,
scrollbars:true,
status:true
}
}
var _signedFeatures=
{
alwayslowered:1,
alwaysraised:1,
titlebar:1,
"z-lock":1
};
var _booleanFeatures=
{
alwayslowered:1,
alwaysraised:1,
channelmode:1,
copyhistory:1,
dependent:1,
directories:1,
fullscreen:1,
hotkeys:1,
location:1,
menubar:1,
resizable:1,
scrollbars:1,
status:1,
titlebar:1,
toolbar:1,
"z-lock":1
};
function _getBodyWidth(
a0,
a1,
a2
)
{
var a3=_getContentWidth(a0,a1,0);
var a4=10;
if(_isLTR()||(a2<=5))
{
a4=2*a2;
}
return a3+a4;
}
function _getContentWidth(
a0,
a1,
a2
)
{
var a3=a0.childNodes;
var a4=_agent.isGecko;
var a5=(a4)
?"tagName"
:"canHaveHTML"
var a6=0;
for(var a7=0;a7<a3.length;a7++)
{
var a8=a3[a7];
if(a8[a5]&&(a8.offsetWidth>0))
{
var a9=0;
var a10=a8["offsetWidth"];
if(a4)
{
if((a10==a1)||
(a10<=1))
{
var a11=a8.offsetLeft;
if(a8.parentNode!=a8.offsetParent)
{
a11=a11-
(a8.parentNode.offsetLeft);
}
a9=_getContentWidth(a8,
a10,
a11);
}
else
{
a9=a10;
}
}
else
{
a9=a8["clientWidth"];
if(a9==0)
{
var a11=a8.offsetLeft;
if(a8.parentElement!=a8.offsetParent)
{
a11=a11-
(a8.parentElement.offsetLeft);
}
a9=_getContentWidth(a8,
a10,
a11);
}
}
if(a9>a6)
{
a6=a9;
}
}
}
if(a6==0)
a6=a1;
return a6+a2;
}
function _getParentWindow(a0)
{
if(!a0)
return a0;
var a1=a0.parent;
try
{
a1.name;
return a1;
}
catch(e)
{
return undefined;
}
}
function _getWindowForDocument(a0)
{
if(_agent.isIE)
{
return a0.parentWindow;
}
else
{
return a0.defaultView;
}
}
function _getTop(a0)
{
var a1=(a0)
?a0.ownerDocument
?a0.ownerDocument
:a0
:document;
var a2=_getWindowForDocument(a1);
var a3=_getParentWindow(a2);
while(a3&&(a3!=a2))
{
a2=a3;
a3=_getParentWindow(a2);
}
return a2;
}
function t(a0,a1)
{
if(_tURL!=void 0)
{
document.write('<img src="'+_tURL+'"');
if(a0!=void 0)
document.write(' width="'+a0+'"');
if(a1!=void 0)
document.write(' height="'+a1+'"');
if(_axm!=void 0)
document.write(' alt=""');
document.write('>');
}
}
function _getDependents(
a0,
a1
)
{
var a2;
if(a0)
{
a2=a0["_dependents"];
if(a2==(void 0))
{
if(a1)
{
a2=new Object();
a0["_dependents"]=a2;
}
}
}
return a2;
}
function _getDependent(
a0,
a1
)
{
var a2=_getDependents(a0);
var a3;
if(a2)
{
a3=a2[a1];
}
return a3;
}
function _setDependent(
a0,
a1,
a2
)
{
var a3=_getDependents(a0,true);
if(a3)
{
a3[a1]=a2;
}
}
function _getModalDependent(
a0
)
{
return _getDependent(a0,"modalWindow");
}
function _isModalDependent(
a0,
a1
)
{
return(a1==_getModalDependent(a0));
}
function _unloadADFDialog(
a0
)
{
_blockCheckUnloadFromDialog=false;
_checkUnload(a0);
_blockCheckUnloadFromDialog=true;
}
function _checkUnload(
a0
)
{
if(_blockCheckUnloadFromDialog)
{
_blockCheckUnloadFromDialog=false;
return;
}
if(_isModalAbandoned())
return;
var a1=_getModalDependent(window);
if(a1!=null)
{
_setModalAbandoned(a1);
a1.close();
}
_pprUnloaded=true;
var a2=_getTop();
if(!a2)
return;
var a3=a2["opener"];
if(!a3)
return;
var a4=_getDependent(a3,self.name);
if(_isModalDependent(a3,self))
{
_setDependent(a3,"modalWindow",(void 0));
a3.onfocus=null;
var a5=a3.document.body;
if(_agent.atLeast("ie",4))
{
if(_agent.atLeast("ie",5)&&_agent.isWindows)
{
a5.onlosecapture=null;
_removeModalCaptureIE(a5);
}
a5.style.filter=null;
}
if(_agent.isGecko)
{
if(a5!=(void 0))
{
_removeModalCaptureGecko(a3,a5);
}
}
}
if(a4!=(void 0))
{
_setDependent(a3,self.name,(void 0));
if(a0==(void 0))
a0=self.event;
a4(a2,a0);
}
}
function _addModalCaptureIE(a0)
{
var a1=new Object();
var a2=_IE_MOUSE_CAPTURE_EVENTS;
var a3=a2.length;
for(var a4=0;a4<a3;a4++)
{
var a5=a2[a4];
a1[a5]=a0[a5];
a0[a5]=_captureEventIE;
}
window._modalSavedListeners=a1;
a0.setCapture();
}
function _removeModalCaptureIE(a0)
{
a0.releaseCapture();
var a1=window._modalSavedListeners;
if(a1)
{
var a2=_IE_MOUSE_CAPTURE_EVENTS;
var a3=a2.length;
for(var a4=0;a4<a3;a4++)
{
var a5=a2[a4];
a0[a5]=a1[a5];
}
window._modalSavedListeners=null;
}
}
function _captureEventIE()
{
window.event.cancelBubble=true;
}
function _addModalCaptureGecko(a0)
{
var a1=_GECKO_MOUSE_CAPTURE_EVENTS;
var a2=a1.length;
for(var a3=0;a3<a2;a3++)
{
var a4=a1[a3];
a0.addEventListener(a4,_captureEventGecko,true);
}
}
function _removeModalCaptureGecko(a0,a1)
{
var a2=_GECKO_MOUSE_CAPTURE_EVENTS;
var a3=a2.length;
for(var a4=0;a4<a3;a4++)
{
var a5=a2[a4];
a1.removeEventListener(a5,
a0._captureEventGecko,
true);
}
}
function _captureEventGecko(
a0
)
{
a0.stopPropagation();
window.preventDefault=true;
}
function _isModalAbandoned()
{
var a0=_getTop();
if(!a0)
return false;
return a0._abandoned;
}
function _setModalAbandoned(
a0
)
{
a0._abandoned=true;
}
function _focusChanging()
{
if(_agent.isIE)
{
return(window.event.srcElement!=window.document.activeElement);
}
else
{
return true;
}
}
function _getKeyValueString(
a0,
a1,
a2
)
{
var a3=a0[a1];
if(typeof(a3)=="function")
{
a3="[function]";
}
var a4=(_agent.isGecko)
?((a2+1)%3==0)
?'\n'
:'    '
:'\t';
return a1+':'+a3+a4;
}
function _dumpSuppress(
a0
)
{
_dump(a0,{innerText:1,outerText:1,outerHTML:1,innerHTML:1});
}
function _dump(
a0,
a1,
a2
)
{
var a3="";
if(a0)
{
if(!a2)
{
a2=a0["name"];
}
var a4="return _getKeyValueString(target, key, index);";
if(_agent.atLeast("ie",5)||_agent.isGecko||_agent.isSafari)
a4="try{"+a4+"}catch(e){return '';}";
var a5=new Function("target","key","index",a4);
var a6=0;
var a7=new Array();
for(var a8 in a0)
{
if((!a1||!a1[a8])&&!a8.match(/DOM/))
{
a7[a6]=a8;
a6++;
}
}
a7.sort();
for(var a9=0;a9<a7.length;a9++)
{
a3+=a5(a0,a7[a9],a9);
}
}
else
{
a2="(Undefined)";
}
if(a3=="")
{
a3="No properties";
}
alert(a2+":\n"+a3);
}
function _getJavascriptId(a0)
{
return a0.split(':').join('_');
}
function _validateForm(
a0,
a1
)
{
var a2='_'+_getJavascriptId(a0.name)+'Validator';
var a3=window[a2];
if(a3)
return a3(a0,a1);
return false;
}
function _getNextNonCommentSibling(
a0,
a1
)
{
var a2=a0.children;
for(var a3=a1+1;a3<a2.length;a3++)
{
var a4=a2[a3];
if(a4&&(a4.tagName!="!"))
{
return a4;
}
}
return null;
}
function _valField(
formName,
nameInForm
)
{
if(nameInForm)
{
var target=document.forms[formName][nameInForm];
var blurFunc=target.onblur;
if(blurFunc)
{
var valFunc=blurFunc.toString();
var valContents=valFunc.substring(valFunc.indexOf("{")+1,
valFunc.lastIndexOf("}"));
var targetString="document.forms['"+
formName+
"']['"+
nameInForm+
"']";
valContents=valContents.replace(/this/,targetString);
var lastArg=valContents.lastIndexOf(",");
valContents=valContents.substring(0,lastArg)+")";
eval(valContents);
}
}
}
function _validationAlert(a0)
{
_recordValidation(true,0);
alert(a0);
_recordValidation(true,0);
}
function _recordValidation(a0,a1)
{
if(!a1)
a1=new Date();
_lastDateValidated=a1;
if(a0)
_lastValidationFailure=a1;
}
function _recentValidation(a0)
{
var a1=false;
var a2=250;
if(_agent.isMac)
{
a2=600;
}
var a3=new Date();
var a4;
a4=a3-_lastValidationFailure;
if((a4>=0)&&(a4<a2))
{
a1=true;
}
else if(!a0)
{
a4=a3-_lastDateValidated;
if((a4>=0)&&(a4<a2))
{
a1=true;
}
}
return a1;
}
function _validateField(
a0,
a1,
a2,
a3,
a4
)
{
var a5=_agent.isNav;
if(a5&&a4)
{
return;
}
if(a5||_agent.isMac||_agent.isGecko)
{
if(_recentValidation(false))
return;
}
var a6=a3||(_getValue(a0)!="");
if(a6&&!window._validating&&_focusChanging())
{
if(a4)
{
var a7=window.document.activeElement;
if(a7)
{
var a8=a0.parentElement;
if(a8==a7.parentElement)
{
var a9=a8.children;
for(var a10=0;a10<a9.length;a10++)
{
if(a0==a9[a10])
{
a6=(a7!=_getNextNonCommentSibling(a8,a10));
}
}
}
}
}
if(a6)
{
var a11=_getValidationError(a0,a1);
if(a11)
{
var a12=_isShowing(a0);
window._validating=a0;
if(a12)
a0.select();
if(!a5&&a12)
{
a0.focus();
if(window["_failedPos"]!=(void 0))
{
if(a0.createTextRange)
{
var a13=a0.createTextRange();
a13.moveStart("character",window["_failedPos"]);
a13.select();
}
else if(a0.selectionStart!=(void 0))
{
a0.selectionStart=window["_failedPos"];
}
window["_failedPos"]=(void 0);
}
}
var a14=_getErrorString(a0,a2,
a11);
if(a14)
{
_validationAlert(a14);
}
if(a5&&a12)
{
a0.focus();
}
}
}
}
}
function _unvalidateField(
a0
)
{
if(window._validating==a0)
{
window._validating=void 0;
}
}
function _commandChoice(
a0,
a1
)
{
var a2=document.forms[a0].elements[a1].value;
if(a2==void(0))
a2=(document.forms[a0].elements[a1])[0].value;
var a3=a2.indexOf("#");
if(a3==0)
window.document.location.href=a2.substring(1,a2.length);
else
{
var a4=a2.indexOf("[");
var a5=a2.substring(0,a4);
var a6=a2.substring(a4+1,a4+2)
var a7=parseInt(a6);
submitForm(a0,a7,{source:a5});
}
}
function submitForm(
form,
doValidate,
parameters
)
{
var pending=true;
if(_agent.isIE)
{
pending=false;
for(var key in _delayedEventParams)
{
pending=true;
break;
}
}
if(pending)
{
_delayedEventParams=new Object();
_delayedEventParams["reset"]=true;
}
if((typeof form)=="string")
{
form=document[form];
}
else if((typeof form)=="number")
{
form=document.forms[form];
}
if(!form)
return false;
var formComplete=window["_"+_getJavascriptId(form.name)+"Validator"];
if(formComplete==(void 0))
{
_saveFormForLaterSubmit(form,doValidate,parameters);
return false;
}
var newDate=new Date();
if(_recentSubmit(newDate))
{
if(_pprFirstClickPass&&_pprBlocking)
{
_saveFormForLaterSubmit(form,doValidate,parameters);
}
return;
}
_submitRejected=false;
_inPartialSubmit=false;
_lastDateSubmitted=newDate;
if(doValidate==(void 0))
doValidate=true;
var doSubmit=true;
var paramSource;
if(parameters!=null)
paramSource=parameters.source;
else
paramSource="";
if(doValidate&&!_validateForm(form,paramSource))
doSubmit=false;
var onSubmit=window["_"+_getJavascriptId(form.name)+"_Submit"];
if(onSubmit!=(void 0))
{
var func=new Function("doValidate",onSubmit);
form._tempFunc=func;
var handlerResult=form._tempFunc(doValidate);
form._tempFunc=(void 0);
if(doValidate&&(handlerResult==false))
{
doSubmit=false;
}
}
if(doSubmit)
{
_resetHiddenValues(form);
var isDOM=_supportsDOM();
var tempParams=new Object();
if(parameters)
{
for(var paramName in parameters)
{
var paramValue=parameters[paramName];
if(paramValue!=(void 0))
{
var hiddenField=form.elements[paramName];
if(_agent.isPIE)
{
var element=form.elements[paramName];
element.value=paramValue;
}
else
{
var hiddenFieldCreated=false;
if(hiddenField&&(typeof(hiddenField)!="string"))
{
if(hiddenField.type=='submit')
{
var tmpField=document.createElement("input");
tmpField.type="hidden";
tmpField.name=paramName;
tmpField.value=parameters[paramName];
form.appendChild(tmpField);
tempParams[paramName]=tmpField;
hiddenFieldCreated=true;
}
else
hiddenField.value=paramValue;
}
else
{
if(isDOM)
{
if(!hiddenFieldCreated)
{
var tmpField=document.createElement("input");
tmpField.type="hidden";
tmpField.name=paramName;
tmpField.value=parameters[paramName];
form.appendChild(tmpField);
tempParams[paramName]=tmpField;
}
}
}
}
}
}
}
if(_agent.isPIE)
{
var isPartialForPIE=false;
var partialTargets=parameters["partialTargets"];
var partial=parameters["partial"];
if((partialTargets!=(void 0))||(partial!=(void 0)))
{
var data="";
data=createNameValueString(form);
var useragent=navigator.userAgent;
try
{
XmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
}
catch(e)
{
XmlHttp=null;
XmlRequest=null;
var errnum=e.number&amp;0xFFFFFF;
if(errnum==655789)
{
alert("\"Run ActiveX controls and plug-ins\" and \"Script ActiveX controls marked safe for scripting\" must be enabled!");
}
}
if(XmlHttp==null)
{
form.target="_self";
form.submit();
return doSubmit;
}
else
{
var urlenc="application/x-www-form-urlencoded; charset=utf-8";
XmlHttp.open(form.method.toUpperCase(),form.action,false);
XmlHttp.setRequestHeader("Content-Type",urlenc);
XmlHttp.setRequestHeader("User-Agent",useragent);
try
{
XmlHttp.send(data);
}
catch(e)
{
XmlHttp.open(form.method.toUpperCase(),form.action,false);
XmlHttp.setRequestHeader("Content-Type",urlenc);
XmlHttp.setRequestHeader("User-Agent",useragent);
XmlHttp.send(data);
}
var responseString=new String(XmlHttp.responseText);
try
{
xmlDOC=new ActiveXObject("Microsoft.XMLDOM");
xmlDOC.loadXML(responseString.toString());
}
catch(e)
{
form.target="_self";
form.submit();
return doSubmit;
}
try
{
var root=xmlDOC.documentElement;
var pprscriptnodes=root.selectNodes("//pprscripts");
var pprscript=
pprscriptnodes.item(0).childNodes.item(0).nodeTypedValue;
var pprtargetnodes=root.selectNodes("//pprtargets/pprtarget");
for(var i=0;i<pprtargetnodes.length;i++)
{
var origpprtargetid=pprtargetnodes.item(i).attributes(0).text;
var tructargetid;
var ind=origpprtargetid.indexOf("__xc");
if(ind>-1)
{
tructargetid=origpprtargetid.substring(0,ind);
}
else
{
tructargetid=origpprtargetid;
}
var pprnode=root.selectNodes("//ppr[@target_id='"
+tructargetid
+"']");
if((pprnode!=null)&&(pprnode!=(void 0)))
{
try
{
var pprtext=
pprnode.item(0).childNodes.item(0).nodeTypedValue;
var newpprtext=pprtext.toString();
if((pprtext.indexOf("span")>-1)
||(pprtext.indexOf("div")>-1))
{
var re=new RegExp('\\s*id\\s*=\\s*"'
+origpprtargetid
+'"\\s*',"gi");
newpprtext=pprtext.replace(re,' id="'
+origpprtargetid
+'_ppr_" ');
}
eval("window['"
+origpprtargetid
+"'].innerHTML=newpprtext+'<script>'+pprscript+'</script>'");
}
catch(e)
{
}
}
}
}
catch(e)
{
var elem=form.elements["partial"];
elem.value="";
form.target="_self";
form.submit();
return doSubmit;
}
finally
{
xmlHttp=null;
xmlDoc=null;
responseString=null;
root=null;
}
}
}
else
{
form.target="_self";
form.submit();
return doSubmit;
}
}
else
{
form.submit();
if(_blockOnEverySubmit)
{
_pprStartBlocking(window);
_fullPageBlocking=true;
}
}
if(isDOM)
{
for(var paramName in tempParams)
form.removeChild(tempParams[paramName]);
}
}
return doSubmit;
}
function _submitOnEnter(a0,a1,a2,a3)
{
if(window.event!=(void 0))
a0=window.event;
var a4;
if(a0.srcElement==undefined)
a4=a0.target;
else
a4=a0.srcElement;
if(!a4)return true;
if(a4.tagName=='A')return true;
if((a4.tagName=='INPUT')&&
(a4.type!='submit')&&
(a4.type!='reset'))
{
if(_getKC(a0)==13)
{
if(a2!=(void 0))
{
var a5=new Object();
a5[a2]=a2;
a5['source']=a2;
if(a3==true)
_submitPartialChange(a1,0,a5);
else
submitForm(a1,0,a5);
}
return false;
}
}
return true;
}
function _saveFormForLaterSubmit(a0,a1,a2)
{
_saveForm=a0;
_saveDoValidate=a1;
_saveParameters=a2;
if(a0.target==_pprIframeName)
{
_inPartialSubmit=true;
}
_submitRejected=true;
}
function _submitFormCheck()
{
if(_submitRejected)
{
if(_inPartialSubmit)
{
_submitPartialChange(_saveForm,_saveDoValidate,_saveParameters);
_inPartialSubmit=false;
}
else
{
submitForm(_saveForm,_saveDoValidate,_saveParameters);
}
_saveForm=null;
_saveDoValidate=null;
_saveParameters=null;
}
}
function resetForm(
form
)
{
var doReload=false;
if((typeof form)=="string")
{
form=document[form];
}
else if((typeof form)=="number")
{
form=document.forms[form];
}
if(!form)
return false;
var resetCallbacks=window["_"+_getJavascriptId(form.name)+"_Reset"];
if(resetCallbacks&&!doReload)
{
for(var i=0;i<resetCallbacks.length;i++)
{
var trueResetCallback=unescape(resetCallbacks[i]);
doReload=(eval(trueResetCallback));
}
}
if(doReload)
{
window.document.location.reload();
}
else
{
form.reset();
}
_lastDateReset=new Date();
return doReload;
}
function createNameValueString(a0){
var a1="";
try
{
var a2=a0.elements;
for(var a3=0;a3<a2.length;a3++)
{
try
{
var a4=a2[a3];
if(a4.name)
{
if(a4.type=="text"
||a4.type=="password"
||a4.type=="textarea"
||a4.type=="hidden")
{
a1+=(a4.name+"="+escape(a4.value)+"&");
}
else if(a4.type.indexOf("select")!=-1)
{
var a5;
for(var a6=0;a6<a4.options.length;a6++)
{
if(a4.options[a6].selected==true)
a5+=a4.name+"="
+escape(a4.options[a6].value)+"&";
}
if(!a5)
{
var a7=_getValue(a4);
if(a7)
{
a5+=a4.name+"="+escape(a7)+"&";
}
}
if(a5)
{
a1+=a5;
}
}
else if(a4.type=="checkbox"&&a4.checked)
a1+=(a4.name+"="+escape(a4.value)+"& ");
else if(a4.type=="radio"&&a4.checked==true)
a1+=(a4.name+"="+escape(a4.value)+"&");
}
}
catch(e)
{
}
a4=null;
}
}
catch(e)
{
}
return(a1.substring(0,a1.length-1));
}
function _resetHiddenValues(
a0
)
{
var a1=window["_reset"+_getJavascriptId(a0.name)+"Names"];
if(a1)
{
for(var a2=0;a2<a1.length;a2++)
{
var a3;
if(_agent.isPIE)
{
a3=a0.elements[a1[a2]];
}
else
{
a3=a0[a1[a2]];
}
if(a3)
{
a3.value='';
}
}
}
}
function _getValue(a0)
{
var a1=a0;
var a2=a0.type;
if(!a2&&a0.length)
{
for(var a3=0;a3<a0.length;a3++)
{
a2=a0[a3].type;
if(a2!=(void 0))
{
a1=a0[a3];
break;
}
}
}
if(a2=="checkbox")
{
if(a0.length)
{
for(var a3=0;a3<a0.length;a3++)
{
if(a0[a3].type=="checkbox"&&
a0[a3].checked)
{
return a0[a3].value;
}
}
}
else
{
return a0.checked;
}
}
else if(a2.substring(0,6)=="select")
{
a0=a1;
var a4=a0.selectedIndex;
if(a4!=(void 0)&&
a4!=null&&
a4>=0)
{
var a5=a0.options[a4];
var a6=a5.value;
if(!a6)
{
for(var a3=0;a3<a0.options.length;a3++)
{
if(a0.options[a3].value)
return a6;
}
return a5.text;
}
return a6;
}
return"";
}
else if(a2=="radio")
{
if(a0.length)
{
for(var a3=0;a3<a0.length;a3++)
{
if(a0[a3].type=="radio"&&
a0[a3].checked)
{
return a0[a3].value;
}
}
}
else
{
if(a0.checked)
{
return a0.value;
}
}
return"";
}
else
{
return a0.value;
}
}
function _setSelectIndexById(a0,a1)
{
var a2=_getElementById(document,a0);
if(a2!=null)
a2.selectedIndex=a1;
}
function _syncChoiceIndex(a0)
{
var a1=a0.form;
var a2=a0.name;
var a3=a1.elements[a2];
for(i=0;i<a3.length;i++)
{
a3[i].selectedIndex=a0.selectedIndex;
}
}
function _clearPassword(a0,a1)
{
if(window.event!=(void 0))
a1=window.event;
if(a0.value!="******")
return true;
if((a1.keyCode==8)||
((a1.keyCode>=46)&&(a1.keyCode<112)))
a0.value="";
return true;
}
function _setFocus(a0)
{
if(_isShowing(a0))
{
a0.focus();
if((a0.type=="text")
&&(a0["value"]!=(void 0))
&&(a0["value"]!=null)
&&(a0["value"].length>0))
{
if(true!=_delayedEventParams["reset"])
a0.select();
}
}
}
function _multiValidate(
form,
source,
validators
)
{
var failures="";
var subforms=window[form.name+"_SF"];
var ignorePrefixes=new Array();
var foundUsedSubform=false;
var key;
if(source!=(void 0))
{
for(key in subforms)
{
if(source.indexOf(key+":")==0)
{
foundUsedSubform=true;
break;
}
}
for(key in subforms)
{
if(source.indexOf(key+":")!=0)
{
if((foundUsedSubform)||(subforms[key]==1))
ignorePrefixes.push(key+":");
}
}
}
if(validators&&!_recentValidation(true))
{
var validations=_getValidations(form);
var firstFailure=true;
for(var i=0;i<validators.length;i+=5)
{
var isIgnored=false;
for(var j=0;j<ignorePrefixes.length;j++)
{
if(validators[i].indexOf(ignorePrefixes[j])==0)
{
isIgnored=true;
break;
}
}
if(isIgnored)
continue;
var currInput=null;
if(_agent.isPIE)
{
currInput=form.elements[validators[i]];
}
else
{
currInput=form[validators[i]];
if(currInput==undefined)
{
currInput=form.elements[validators[i]+":trailing:items"];
}
}
if(!currInput)
continue;
var elementType=currInput.type;
if(!elementType&&currInput.length)
{
var firstType=currInput[0].type;
if(firstType!="radio"&&firstType!="checkbox")
{
currInput=currInput[0];
}
}
var value=_getValue(currInput);
var required=validators[i+1];
if(required&&((value=="")||(value==(void 0))))
{
if(firstFailure)
{
_setFocus(currInput);
firstFailure=false;
}
requiredFormatIndex=validators[i+2];
var requiredErrorString=_getErrorString(currInput,
requiredFormatIndex);
if(requiredErrorString)
failures+='\n'+requiredErrorString;
}
else if(validations)
{
var converterInfo=validators[i+3];
var converterError=(void 0);
var converterFormat=(void 0);
if(converterInfo!=(void 0))
{
if((value!=(void 0))&&
!((typeof value=="string")&&(value=="")))
{
var converterConstructor=validations[converterInfo[0]];
var converterResult=void(0);
if(converterConstructor)
{
var converter=void(0);
converter=eval(converterConstructor);
converterResult=converter.getAsObject(value);
if(_instanceof(converterResult,ConverterException))
{
converterError=converterResult;
}
else if(converterResult==(void 0))
{
converterError="Conversion failed for value:"+value;
}
}
if(converterError)
{
if(firstFailure)
{
_setFocus(currInput);
firstFailure=false;
}
var errorString1=_getErrorString(currInput,
converterInfo[1],
converterError);
if(errorString1)
failures+='\n'+errorString1;
}
else
{
value=converterResult;
if(converterFormat!=void(0))
currInput.value=converterFormat;
}
}
}
if(!converterError)
{
var validatorInfo=validators[i+4];
for(var j=0;j<validatorInfo.length;j=j+2)
{
if((value!=(void 0))&&
!((typeof value=="string")&&value==""))
{
var validatorConstructor=validations[validatorInfo[j]];
var validationError=(void 0);
if(validatorConstructor)
{
var validator=(void 0);
var validationResult=(void 0);
validator=eval(validatorConstructor);
validationResult=validator.validate(value);
if(_instanceof(validationResult,ValidatorException))
validationError=validationResult;
else if(validationResult==(void 0))
validationError="Validation Failed for value:"+currInput;
}
if(validationError)
{
if(firstFailure)
{
_setFocus(currInput);
firstFailure=false;
}
var errorString=_getErrorString(currInput,
validatorInfo[j+1],
validationError);
if(errorString)
failures+='\n'+errorString;
}
}
}
}
}
}
_recordValidation((failures.length>0),0);
}
return failures;
}
function _isShowing(
a0)
{
if(_agent.isPIE)
{
if(!a0.focus()||(a0.type=='hidden'))
return false;
}
else
{
if(!a0.focus||(a0.type=='hidden'))
return false;
}
if(_agent.isIE)
{
var a1=a0;
while(a1!=(void 0))
{
computedStyle=a1.currentStyle;
if((computedStyle!=(void 0))&&
((computedStyle["visibility"]=="hidden")||
(computedStyle["display"]=="none")))
{
return false;
}
a1=a1.parentNode;
}
return true;
}
else if(!_agent.isNav&&!_agent.isSafari)
{
var a2=a0.ownerDocument.defaultView.getComputedStyle(a0,
null);
return((a2["visibility"]!="hidden")&&
(a2["display"]!="none"));
}
}
function _getID(
a0
)
{
if(!_agent.isNav)
{
if(_agent.isPIE){
return a0.name;
}
var a1=a0.id;
var a2=a0.type;
if(!a2&&a0.length)
a2=a0[0].type;
if(a2=="radio")
{
var a3;
if(a0.length)
{
a3=a0[0].parentNode;
if(a3.tagName=='FIELDSET')
a3=a3.parentNode;
}
else
{
a3=a0.parentNode;
}
a1=a3.id;
}
return a1;
}
else
{
var a4=_getForm(a0);
var a5=window["_"+_getJavascriptId(a4.name)+"_NameToID"];
if(a5)
{
var a6=_getName(a0);
return a5[a6];
}
}
}
function _getForm(
a0
)
{
var a1=a0.form;
if(a1==(void 0))
{
if(a0.length)
{
a1=a0[0].form;
}
}
return a1;
}
function _getName(
a0
)
{
var a1=a0.name;
if(a1==(void 0))
{
var a2=a0.type;
if(!a2&&a0.length)
a2=a0[0].type;
if(a2=="radio"&&a0.length)
{
a1=a0[0].name;
}
}
return a1;
}
function _instanceof(
a0,
a1
)
{
if(a1==(void 0))
return false;
while(typeof(a0)=="object")
{
if(a0.constructor==a1)
return true;
a0=a0.prototype;
}
return false;
}
function _getErrorString(
a0,
a1,
a2
)
{
var a3;
var a4=_getForm(a0);
var a5=_getValue(a0);
if(_instanceof(a2,window["ConverterException"]))
{
a3=a2.getFacesMessage().getDetail();
}
else if(_instanceof(a2,window["ValidatorException"]))
{
a3=a2.getFacesMessage().getDetail();
}
else if(a1!=(void 0))
{
var a6=window["_"+_getJavascriptId(a4.name)+"_Formats"];
if(a6)
{
a3=a6[a1];
}
}
if(a3)
{
var a7=window["_"+_getJavascriptId(a4.name)+"_Labels"];
var a8;
if(a7)
{
a8=a7[_getID(a0)];
}
var a9=window["_"+_getJavascriptId(a4.name)+"_Patterns"];
var a10;
if(a9)
{
a10=a9[_getID(a0)];
}
var a11=_formatErrorString(a3,
{
"0":a8,
"1":a5,
"2":a10
});
return a11;
}
}
function _getValidations(
a0
)
{
return window["_"+_getJavascriptId(a0.name)+"_Validations"];
}
function _getValidationError(
input,
validationIndex,
validations
)
{
if(!validations)
{
validations=_getValidations(input.form);
}
if(validations)
{
var validator=validations[validationIndex];
if(validator)
{
var trueValidator=validator.replace(/%value%/g,"_getValue(input)");
return(eval(trueValidator));
}
}
return(void 0);
}
function _formatErrorString(
a0,
a1
)
{
var a2=a0;
for(var a3 in a1)
{
var a4=a1[a3];
if(!a4)
{
a4="";
}
var a5="{"+a3+"}";
a2=a2.replace(new RegExp('%'+a3+'%','g'),
a5);
var a6=a2.indexOf(a5);
if(a4.indexOf(a5)>=0)
{
var a7='';
for(i=0;i<a4.length;i++)
{
a7=a7+'placeHolderString';
}
while(a6>=0)
{
a2=(a2.substring(0,a6)
+a7
+a2.substring(a6+a5.length));
a6=a2.indexOf(a5);
}
a6=a2.indexOf(a7);
while(a6>=0)
{
a2=(a2.substring(0,a6)
+a4
+a2.substring(a6+a7.length));
a6=a2.indexOf(a7);
}
}
else
while(a6>=0)
{
a2=(a2.substring(0,a6)
+a4
+a2.substring(a6+a5.length));
a6=a2.indexOf(a5);
}
}
a2=a2.replace(/\\\'\\\'/g,"'");
return a2;
}
function _chain(
a0,
a1,
a2,
a3,
a4
)
{
var a5=_callChained(a0,a2,a3);
if(a4&&(a5==false))
return false;
var a6=_callChained(a1,a2,a3);
return!((a5==false)||(a6==false));
}
function _callChained(
a0,
a1,
a2
)
{
if(a0&&(a0.length>0))
{
if(a2==(void 0))
{
a2=a1.window.event;
}
var a3=new Function("event",a0);
a1._tempFunc=a3;
var a4=a1._tempFunc(a2);
a1._tempFunc=(void 0);
return!(a4==false);
}
else
{
return true;
}
}
function _checkLength(a0,a1,a2)
{
elementLength=a0.value.length;
if(elementLength>a1)
{
a0.value=a0.value.substr(0,a1);
return true;
}
if(elementLength<a1)
return true;
if(_agent.isIE)
{
if(a2["type"]=="hidden")
a2=window.event;
}
if(a2.type=='change')
return true;
if(a2)
{
if((a2.which<32)
||((a2.which==118)&&(a2["ctrlKey"])))
return true;
}
return false;
}
function _getElementById(
a0,
a1
)
{
if((_agent.kind!="ie")||(_agent.version>=5))
{
if(!_agent.isPIE){
var a2=a0.getElementById(a1);
if((a2==null)||(a2.id==a1))
return a2;
}
return _findElementById(a0,a1);
}
else
{
return a0.all[a1];
}
}
function _findElementById(
a0,
a1
)
{
if(a0.id==a1)
return a0;
if(a0.childNodes)
{
var a2=a0.childNodes;
for(var a3=0;a3<a2.length;a3++)
{
var a4=_findElementById(a2.item(a3),a1);
if(a4!=null)
return a4;
}
}
return null;
}
function _getQuerySeparator(a0)
{
var a1=a0.charAt(a0.length-1);
if((a1=='&')||(a1=='?'))
return"";
return(a0.indexOf('?')>=0)?'&':'?';
}
function _addParameter(
a0,
a1,
a2
)
{
var a3=a0.indexOf('?');
if(a3==-1)
{
return a0+'?'+a1+'='+a2;
}
else
{
var a4=a0.indexOf('?'+a1+'=',a3);
if(a4==-1)
a4=a0.indexOf('&'+a1+'=',a3+1);
if(a4==-1)
{
return a0+'&'+a1+'='+a2;
}
else
{
var a5=a4+a1.length+2;
var a6=a0.substring(0,a5);
a6+=a2;
var a7=a0.indexOf('&',a5);
if(a7!=-1)
{
a6+=a0.substring(a7);
}
return a6;
}
}
}
function _addFormParameter(
a0,
a1,
a2
)
{
var a3=new Object();
if(a0)
{
for(var a4 in a0)
a3[a4]=a0[a4];
}
a3[a1]=a2;
return a3;
}
function _pprInstallBlockingHandlers(a0,a1)
{
var a2=a0.document;
if(a2==(void 0))
return;
if(_agent.isIE)
{
var a3=a0._pprConsumeFirstClick;
if(a1)
{
var a4=a0.event;
if(a4!=(void 0))
{
var a5=document.elementFromPoint(a4.x,a4.y);
if(!a0._pprFirstClickPass
||(((a4.type=='change')||(a4.type=='blur'))
&&(a4.srcElement==a5))
||(!_isSubmittingElement(a5)))
{
a0._pprControlCaptureTimeout=a0.setTimeout("_pprControlCapture(window, true);",
1);
return;
}
}
a2.attachEvent('onclick',a3);
}
else
{
a2.detachEvent('onclick',a3);
_pprControlCapture(a0,false);
}
}
else
{
var a3=a0._pprConsumeBlockedEvent;
var a6={'click':1,'keyup':1,'keydown':1,'keypress':1};
for(var a7 in a6)
{
if(a1)
a2.addEventListener(a7,a3,true);
else
a2.removeEventListener(a7,a3,true);
}
}
}
function _pprLibraryStore(a0)
{
this.loadedStatus=new Array(a0);
for(var a1=0;a1<a0;a1++)
this.loadedStatus[a1]=false;
this.total=a0;
this.allLibraries=new Array(a0);
}
function _pprStartBlocking(a0)
{
if(!a0._pprBlocking)
{
var a1=a0.document.body;
a0._pprBlockStartTime=new Date();
if(a0._pprBlockingTimeout!=null)
{
a0.clearTimeout(a0._pprBlockingTimeout);
}
a0._pprBlockingTimeout=a0.setTimeout("_pprStopBlocking(window);",
8000);
if(_agent.isIE)
{
_pprEventElement=window.document.activeElement;
}
_pprInstallBlockingHandlers(a0,true);
a0._pprBlocking=true;
}
}
function _pprStopBlocking(a0)
{
var a1=a0.document;
if(_agent.isIE)
a1.detachEvent('onmouseover',_mouseOverRestoreBlocking);
if(a0._pprBlocking)
{
if(_agent.isGecko)
{
if(a0._pprBlockingTimeout!=null)
{
a0.clearTimeout(a0._pprBlockingTimeout);
a0._pprBlockingTimeout==null;
}
}
_pprInstallBlockingHandlers(a0,false);
a0._pprEventElement=null;
a0._pprBlocking=false;
}
a0._pprBlocking=false;
}
function _pprFocus(a0,a1)
{
if(_agent.isIE)
{
if(a0.parentNode==null)
return;
var a2=_getElementById(a1,_pprdivElementName);
if((a2)&&(a2["focus"]))
a2.focus();
}
a0.focus();
}
function _pprControlCapture(a0,a1)
{
if(_agent.isIE)
{
if(a0._pprControlCaptureTimeout)
{
a0.clearTimeout(a0._pprControlCaptureTimeout);
a0._pprControlCaptureTimeout=null;
a0._pprEventElement=window.document.activeElement;
}
var a2=a0.document;
var a3=a2.body;
var a4=_getElementById(a2,_pprdivElementName);
if(a4)
{
if(a1)
{
a4.setCapture();
if(a0._pprEventElement)
a4.focus();
a0._pprSavedCursor=a3.style.cursor;
a3.style.cursor="wait";
a0._pprSavedCursorFlag=true;
}
else if(a0._pprSavedCursorFlag)
{
a4.releaseCapture();
if(a0._pprEventElement)
a0._pprEventElement.focus();
a3.style.cursor=a0._pprSavedCursor;
a0._pprSavedCursor=null;
a0._pprSavedCursorFlag=false;
}
}
}
return;
}
function _pprChoiceAction()
{
if(!_agent.isIE)
return true;
var a0=false;
if((!window._pprBlocking)&&(_pprChoiceChanged))
{
_pprChoiceChanged=false;
a0=true;
}
return a0;
}
function _pprChoiceChangeEvent(a0)
{
if(!_agent.isIE)
return true;
if(!window._pprBlocking)
_pprChoiceChanged=true;
return true;
}
function _doPartialSubmit()
{
if(_agent.isPIE){
return true;
}
return(_getElementById(document,_pprIframeName)!=null);
}
function _submitPartialChange(
a0,
a1,
a2)
{
if(!_doPartialSubmit())
return submitForm(a0,a1,a2);
if((typeof a0)=="string")
a0=document[a0];
if(!a0)
return false;
a2=_addFormParameter(a2,_getPartialParameter(),"true");
var a3=a0.target;
if(!_agent.isPIE)
{
a0.target=_pprIframeName;
}
_pprRequestCount++;
var a4=0;
if(!_agent.isIE||window._pprSomeAction)
{
a4=1;
}
_pprSubmitCount+=a4;
window._pprSomeAction=true;
if(!_agent.isPIE)
{
_pprStartBlocking(window);
}
var a5=submitForm(a0,a1,a2);
if(!a5)
{
if(!_agent.isPIE)
{
_pprStopBlocking(window);
}
_pprRequestCount--;
_pprSubmitCount-=a4;
}
a0.target=a3;
}
function _getPartialParameter()
{
return"partial";
}
function _partialRedirect(a0)
{
if(a0&&(parent._pprRequestCount>0))
{
if(((typeof a0)=="string")&&(a0.length>0))
{
parent._pprRequestCount--;
parent._pprSubmitCount=0;
parent._pprSomeAction=false;
parent.location.href=a0;
_pprStopBlocking(parent);
}
}
}
function _createToLoadArray()
{
var a0=new Array();
var a1=0;
if(window["_pprLibraries"]!=undefined)
{
for(var a2=0;a2<_pprLibraries.length;a2++)
{
if((parent._cachedLibs==null)
||(parent._cachedLibs.indexOf(_pprLibraries[a2])==-1))
{
a0[a1++]=_pprLibraries[a2];
}
}
}
return a0;
}
function _addLibraryToCache(a0)
{
if((a0.indexOf("ScriptEval"))==-1)
{
if(parent._cachedLibs==null)
parent._cachedLibs=""+a0;
else
parent._cachedLibs+=","+a0;
}
}
function _loadScriptLibrariesIE(a0,a1)
{
if(a1==null)return;
var a2=_getElementById(a0,"_adfDownload");
if(a2==null)return;
var a3=a1.length;
_pprLibStore=new _pprLibraryStore(a3);
for(var a4=0;a4<a3;a4++)
{
var a5="_pprExecScript("+a4+", s);"
var a6=new Function("s",a5);
a2.startDownload(a1[a4],a6);
_addLibraryToCache(a1[a4]);
}
}
function _loadScriptLibrariesGecko(a0,a1)
{
var a2=_getElementById(a0,_pprIframeName);
if(a2)
{
for(var a3=0;(a3<a1.length);a3++)
{
var a4=a0.createElement("script");
a4.setAttribute('src',a1[a3]);
a2.parentNode.insertBefore(a4,a2);
_addLibraryToCache(a1[a3]);
}
}
}
function _loadScriptLibraries(a0)
{
if(window["_pprLibraries"]!=(void 0))
{
var a1=_createToLoadArray();
if(a1.length>0)
{
if(_agent.isIE)
{
_loadScriptLibrariesIE(a0,a1);
}
else
{
_loadScriptLibrariesGecko(a0,a1);
}
}
}
}
function _setRequestedFocusNode(a0,a1,a2,a3)
{
if(a3==(void 0))
a3=window;
a3._AdfFocusRequestDoc=a0;
a3._AdfFocusRequestID=a1;
a3._AdfFocusRequestNext=(a2==true);
}
function _getRequestedFocusNode(a0)
{
if(a0==(void 0))
a0=window;
if((a0._AdfFocusRequestDoc!=null)
&&(a0._AdfFocusRequestID!=null))
{
var a1=_getElementById(a0._AdfFocusRequestDoc,
a0._AdfFocusRequestID);
if(!a1)
return null;
if(a0._AdfFocusRequestNext)
{
for(var a2=a1.nextSibling;
a2!=null;
a2=a2.nextSibling)
{
if(_isFocusable(a2)
||((_agent.isIE)&&(a2.nodeName.toLowerCase()=='a')))
{
a1=a2;
break;
}
}
}
return a1;
}
return null;
}
function _fullChange()
{
if(parent._pprRequestCount>0)
{
parent._pprRequestCount--;
var a0=_getElementById(document,"_pprDisableWrite");
a0.text="var _pprDocumentWrite = document.write;"+
"var _pprDocumentWriteln = document.writeln;"+
"document.write = new Function('return;');"+
"document.writeln = new Function('return;');";
var a1=_getElementById(document,"_pprEnableWrite");
a1.text="document.write = _pprDocumentWrite;"+
"document.writeln = _pprDocumentWriteln";
var a2=document.body;
var a3=a2.getAttribute("onload");
var a4=a2.getAttribute("onunload");
a2.setAttribute("onload",
_getCommentedScript(document,("_pprFullOnload")));
a2.setAttribute("onunload",
_getCommentedScript(document,("_pprFullOnunload")));
var a5=_getDocumentContent();
var a6=
new RegExp("<script id=[\"]*_pprFullChange.*>_fullChange\\(\\)</script>","i");
a5=a5.replace(a6,"");
a2.setAttribute("onload",a3);
a2.setAttribute("onunload",a4);
var a7=parent.document;
if(_agent.isIE)
{
var a8=document.charset;
a7.open();
a7.charset=a8;
}
a7.write(a5);
a7.close();
}
}
function _getFirstFocusable(a0)
{
if((a0==null)||_isFocusable(a0))
return a0;
if(a0.hasChildNodes)
{
var a1=a0.childNodes;
for(var a2=0;a2<a1.length;a2++)
{
var a3=a1[a2];
var a4=_getFirstFocusable(a3);
if(a4!=null)
return a4;
}
}
return null;
}
function _restoreFocus(a0,a1,a2)
{
if(a0==null)
return;
var a3=_getAncestorByName(a0,"DIV");
if(!a3)
{
_pprFocus(a0,a2);
}
else
{
var a4=a3.scrollTop;
var a5=a3.scrollLeft;
if(((a4==0)&&(a5==0))||!a1)
{
_pprFocus(a0,a2);
}
}
if((_agent.isIE)
&&(a0.tagName=='INPUT')
&&(_getAncestorByName(a0,'TABLE')))
{
_pprFocus(a0,a2);
}
}
function _getAncestorByName(
a0,
a1
)
{
a1=a1.toUpperCase();
while(a0)
{
if(a1==a0.nodeName)
return a0;
a0=a0.parentNode;
}
return null;
}
function _isDescendent(
a0,
a1
)
{
if(a0==null)
return false;
while(a0.parentNode)
{
if(a0==a1)
return true;
a0=a0.parentNode;
}
return false;
}
function _isFocusable(a0)
{
if(a0==null)
return false;
var a1=a0.nodeName.toLowerCase();
if(('a'==a1)&&(a0.href))
{
if(!_agent.isIE||(a0.id))
return true;
var a2=a0.childNodes;
if((a2)&&(a2.length==1))
{
var a3=a2[0].nodeName;
if('img'==a3.toLowerCase())
return false;
}
return true;
}
if(a0.disabled)
return false;
if('input'==a1)
{
return(a0.type!='hidden');
}
return(('select'==a1)||
('button'==a1)||
('textarea'==a1));
}
function _getCommentedScript(a0,a1)
{
var a2=_getElementById(a0,a1);
if(a2!=null)
{
var a3;
if(_agent.isSafari)
a3=a2.innerHTML;
else
a3=a2.text;
var a4=0;
var a5=a3.length-1;
while(a4<a5)
{
if(a3.charAt(a4)=='*')
break;
a4++;
}
while(a5>a4)
{
if(a3.charAt(a5)=='*')
break;
a5--;
}
return a3.substring(a4+1,a5);
}
return null;
}
function _eval(targetWindow,code)
{
if(code==null)
return;
if(_agent.isIE)
targetWindow.execScript(code);
else
targetWindow.eval(code);
}
function _getDocumentContent()
{
if(_agent.isIE)
return document.documentElement.outerHTML;
var a0="<html"
var a1=document.documentElement.attributes;
for(var a2=0;a2<a1.length;a2++)
{
a0+=" ";
a0+=a1[a2].name;
a0+="=\""
a0+=a1[a2].value;
a0+="\"";
}
a0+=">";
a0+=document.documentElement.innerHTML;
a0+="</html>";
return a0;
}
function _fixAllLinks(a0,a1,a2)
{
_initialFormState=_getFormState(a0,a2);
_initialFormStateName=a0;
if(a2!=(void 0))
_initialFormExclude=a2;
if(window!=a1)
{
if(a1._initialFormState==null)
a1._initialFormState=new Object();
var a3=_initialFormState;
var a4=a1._initialFormState;
for(var a5 in a3)
a4[a5]=a3[a5];
}
var a6=document.links;
var a7=a1.location.href+'#';
var a8=location.href+'#';
for(var a9=0;a9<a6.length;a9++)
{
var a10=a6[a9].href;
if(!a10
||(a10.substr(0,a8.length)==a8)
||(a10.substr(0,a7.length)==a7)
||(a10.substr(0,11).toLowerCase()=="javascript:")
||(a10.substr(0,7).toLowerCase()=="mailto:")
||(a10.indexOf("_noSv=M")>=0))
{
continue;
}
if(a6[a9].target)
{
continue;
}
var a11=a10.split("'");
a10=a11[0];
for(var a12=1;a12<a11.length;a12++)
a10=a10+"\\'"+a11[a12];
if(!_agent.isNav)
a10=escape(a10);
a6[a9].href="javascript:_submitNav('"+a0+"','"+a10+"')";
}
}
function _isInExclude(a0,a1)
{
if(a0!=(void 0))
{
if(a0[a1]!=(void 0))
return true;
var a2=a1.lastIndexOf(':');
if(a2<0)
return false;
return _isInExclude(a0,a1.substring(0,a2));
}
return false;
}
function _getFormState(a0,a1)
{
var a2=new Object();
var a3=document[a0];
for(var a4=0;a4<a3.length;a4++)
{
var a5=a3.elements[a4].name;
if(a5)
{
var a6=a3[a5];
if(a6)
{
if((a1!=(void 0))&&_isInExclude(a1,a5))
continue;
if(!a6.type||(a6.type!='hidden'))
a2[a5]=_getValue(a6);
}
}
}
return a2;
}
function isNavDirty()
{
var a0=false;
if(_navDirty)
a0=true;
else
{
var a1=_getFormState(_initialFormStateName,_initialFormExclude);
for(var a2 in a1)
{
if(a1[a2]!=_initialFormState[a2])
{
a0=true;
break;
}
}
}
return a0;
}
function _addNavExclude(a0)
{
if(_initialFormExclude!=(void 0))
_initialFormExclude[a0]=1;
else
{
_initialFormExclude=new Object();
_initialFormExclude[a0]=1;
}
}
function _submitNav(a0,a1)
{
if(isNavDirty())
{
var a2=window["_onNavigate"];
if((a2==(void 0))||!(a2(a0,a1)==false))
{
var a3=window['_navEvent'];
if(a3==(void 0))
a3='navigate';
submitForm(a0,0,{'event':a3,'uri':a1});
}
}
else
document.location.href=a1;
}
function _getInputField(a0)
{
var a1=(void 0);
var a2=(void 0);
if(window.event)
{
kc=window.event.keyCode;
a2=window.event.srcElement;
}
else if(a0)
{
kc=a0.which;
a2=a0.target;
}
if(a2!=(void 0)
&&(a2.tagName=="INPUT"||
a2.tagName=="TEXTAREA"))
a1=a2;
return a1;
}
function _enterField(
a0
)
{
var a1;
var a2;
var a3=true;
var a1=_getInputField(a0);
if(a1!=(void 0))
{
a1.form._mayResetByInput=false;
if(a1!=window._validating)
{
a1._validValue=a1.value;
}
a3=false;
}
return a3;
}
function _resetOnEscape(a0)
{
var a1;
var a2=_getInputField(a0);
if(a2!=(void 0))
{
var a3=a2.form;
if(a1==27)
{
var a4=false;
if((a2.selectionStart!=(void 0))&&
(a2.selectionEnd!=(void 0)))
{
a4=(a2.selectionStart!=a2.selectionEnd);
}
else if(document.selection)
{
a4=(document.selection.createRange().text.length!=0);
}
if(!a4)
{
a2.value=a2._validValue;
if(a3._mayResetByInput==true)
{
a3.reset();
a3._mayResetByInput=false;
}
else
{
a3._mayResetByInput=true;
}
}
return false;
}
else
{
a3._mayResetByInput=false;
}
}
return true;
}
function _checkLoad(
a0,
a1,
a2
)
{
restorePartialPageState();
if(document.forms)
{
for(var a3=0;a3<document.forms.length;a3++)
{
var a4=document.forms[a3];
if(a4.addEventListener)
{
a4.addEventListener('focus',_enterField,true);
a4.addEventListener('keydown',_resetOnEscape,true);
}
else if(a4.attachEvent)
{
a4.attachEvent('onfocusin',_enterField);
a4.attachEvent('onkeydown',_resetOnEscape);
}
}
}
if(a1!=(void 0))
{
var a5;
if(_initialFormExclude!=(void 0))
a5=_initialFormExclude;
else
a5=new Object();
if(a2!=(void 0))
{
for(var a6=0;a6<a2.length;a6++)
a5[a2[a6]]=1;
}
_fixAllLinks(a1,window,a5);
}
var a7=_getTop();
if(a7&&(self!=a7)&&a7["_blockReload"])
{
if((_agent.isIE)
&&(document.onkeydown!=null)
&&(((document.onkeydown).toString().indexOf('_monitor'))>0))
{
document.onkeydown=_monitorNoReload;
}
else
{
document.onkeydown=_noReload;
}
}
if((!_agent.isNav)&&(_initialFocusID!=null))
{
var a8=_getElementById(document,_initialFocusID);
if(a8&&a8.focus)
{
a8.focus();
if(a8.type=='text')
a8.select();
}
}
if(!_agent.isNav)
_loadScriptLibraries(document);
}
function _noReload(a0)
{
if(!a0)a0=window.event;
var a1=a0.keyCode;
if((a1==116)||(a1==82&&a0.ctrlKey))
{
if(a0.preventDefault)a0.preventDefault();
a0.keyCode=0;
return false;
}
}
function _monitorNoReload(a0)
{
if(_agent.isIE)
_monitor(a0);
return _noReload(a0);
}
function _handleClientEvent(a0,a1,a2,a3)
{
var a4=new Object();
a4.type=a0;
a4.source=a1;
a4.params=a2;
var a5=new Function("event",a3);
return a5(a4);
}
function _getCookie(a0)
{
var a1=document.cookie;
var a2="";
var a3=a0+"=";
if(a1)
{
var a4=a1.indexOf("; "+a3);
if(a4<0)
{
a4=a1.indexOf(a3);
if(a4>0)
a4=-1;
}
else
a4+=2;
if(a4>=0)
{
var a5=a1.indexOf(";",a4);
if(a5<0)
a5=a1.length;
a2=unescape(a1.substring(a4+a0.length+1,a5));
}
}
return a2;
}
function _setCookie(a0,a1)
{
var a2=window.location.host;
var a3=a2.indexOf(":");
if(a3>=0)
a2=a2.substr(0,a3);
var a4=new Date();
a4.setFullYear(a4.getFullYear()+10);
var a5=a0+"="+a1+
"; path=/;domain="+a2+"; expires="+a4.toGMTString();
document.cookie=a5;
}
function _setAdfCookie(a0,a1)
{
var a2=_getAdfCookie();
a2[a0]=a1;
var a3=a2[0];
for(var a4=1;a4<a2.length;a4++)
{
a3=a3+"^"+a2[a4];
}
_setCookie("oracle.uix",a3);
}
function _getAdfCookie()
{
var a0=_getCookie("oracle.uix");
var a1;
if(a0)
a1=a0.split("^");
else
a1=new Array("0","","");
return a1;
}
function _defaultTZ()
{
var a0=_getAdfCookie()[2];
if(a0&&(a0.indexOf("GMT")!=0))
{
return;
}
_setAdfCookie(2,_getTimeZoneID());
}
function _getTimeZoneID()
{
var a0=-(new Date()).getTimezoneOffset();
var a1;
if(a0>0)
a1="GMT+";
else
{
a1="GMT-";
a0=-a0;
}
var a2=""+a0%60;
if(a2.length==1)
a2="0"+a2;
return(a1+(Math.floor(a0/60))+":"+a2);
}
function _monitor(a0)
{
var a1=window.event;
if((a1.altKey==true)&&(a1.ctrlKey==false)&&
(a1.keyCode!=null)&&(a1.keyCode!=18)
&&(!a1.repeat))
{
var a2=String.fromCharCode(window.event.keyCode);
var a3=_getNodeWithAccessKey(document,a2);
if(a3!=null&&(a3.getAttribute("adfbtn")!=null))
{
if(a3.htmlFor)
{
var a4=a3.htmlFor;
a3=(a4!=null)
?window.document.getElementById(a4)
:null;
}
if(a3!=null)
{
a3.focus();
a3.click();
}
}
}
return true;
}
function _getNodeWithAccessKey(a0,a1)
{
var a2=a1.toUpperCase();
var a3=a1.toLowerCase();
var a4=
{
activeFound:false,
firstAccessKeyNode:null,
accessKeyNode:null
}
a4=_findAccessKey(document,
a4,
a2,
a3);
var a5=a4.accessKeyNode;
var a6=a4.firstAccessKeyNode;
if((a5==null)&&(a6!=null))
{
a5=a6;
}
return a5;
}
function _findAccessKey(a0,a1,a2,a3)
{
if(a0.nodeType==1)
{
if((a0.accessKey==a2)||
(a0.accessKey==a3))
{
if(a1.activeFound==true)
{
a1.accessKeyNode=a0;
return a1;
}
else if(a1.firstAccessKeyNode==null)
{
a1.firstAccessKeyNode=a0;
}
}
if(a0==document.activeElement)
{
a1.activeFound=true;
}
}
var a4=a0.childNodes;
for(var a5=0;a5<a4.length;a5++)
{
var a1=
_findAccessKey(a4[a5],
a1,
a2,
a3);
if(a1.accessKeyNode!=null)
{
return a1;
}
}
return a1;
}
function _isEmpty(a0)
{
var a1=""+a0;
var a2=0;
while(a2<a1.length)
{
if(a1.charAt(a2)!=' ')
return false;
a2++;
}
return true;
}
function _isLTR()
{
return document.documentElement["dir"].toUpperCase()=="LTR";
}
function _isSubmittingElement(a0)
{
var a1=false;
var a2=a0.nodeName.toUpperCase();
if(a2=="BUTTON")
{
a1=true;
}
else if(a2=="IMG")
{
var a3=a0.parentNode;
var a4=a3.nodeName.toUpperCase();
if(('A'==a4)&&(a3.href))
{
var a5=""+a3["onclick"];
if((a5!=(void 0))&&(a5!=null))
{
a1=((a5.indexOf("submitForm")>0)
||(a5.indexOf("_uixspu")>0)
||(a5.indexOf("_adfspu")>0)
||(a5.indexOf("_addRowSubmit")>0));
}
}
}
return a1;
}
function _mouseOverRestoreBlocking(a0)
{
if(_agent.isIE)
{
if(((_pprRequestCount>0)||(_fullPageBlocking==true))&&!window._pprBlocking)
{
_pprStartBlocking(window);
}
window.document.detachEvent('onmouseover',_mouseOverRestoreBlocking);
}
return true;
}
function _getKC(a0)
{
if(window.event)
return window.event.keyCode;
else if(a0)
return a0.which;
return-1;
}
function _recentSubmit(a0)
{
if(_lastDateSubmitted)
{
var a1=a0-_lastDateSubmitted;
if((a1>=0)&&(a1<200))
return true;
}
return false;
}
function _recentReset(a0)
{
if(_lastDateReset)
{
var a1=a0-_lastDateReset;
if((a1>=0)&&(a1<200))
return true;
}
return false;
}
function _savePageStateIE()
{
if(!_agent.isIE)
return;
var a0=_getElementById(document,"_pprPageContent");
if(a0==null)
return;
var a1=_getElementById(document,"_pprSaveLib");
if(!(a1!=null&&a1.value!=""))
{
return;
}
var a2=_getElementById(document,"_pprSavePage");
if(a2==null)
return;
a2.value=a0.outerHTML;
}
function restorePartialPageState()
{
if(!_agent.isIE)
return;
var a0=_getElementById(document,"_pprSavePage");
if(a0==null||a0.value=="")
return;
var a1=_getElementById(document,"_pprPageContent");
if(a1==null)
return;
a1.outerHTML=a0.value;
var a2=_getElementById(document,"_pprSaveFormAction");
if(a2==null)
{
_pprBackRestoreInlineScripts=true;
var a3=_getElementById(document,"_pprSaveLib");
if(a3!=null&&a3.value!="")
{
var a4=a3.value.split(",");
_loadScriptLibrariesIE(document,a4);
}
}
else
{
if(a2.value)
document.forms[0].action=a2.value;
submitForm(0,0,{'event':'stateSynch','source':'__unknown__'});
}
}
function _setNavDirty(a0,a1)
{
var a2=a0;
if(a2==(void 0)||!a2)
{
a2=window;
}
var a3=a2._initialFormExclude;
if((a1==(void 0))
||!a1
||!_isInExclude(a3,a1))
{
a2._navDirty=true;
}
}
function _radioSet_uixspu(a0,a1,a2,a3,a4,a5,a6)
{
_radioSet_adfspu(a0,a1,a2,a3,a6);
}
function _radioSet_adfspu(a0,a1,a2,a3,a4)
{
if(window._pprBlocking)
return;
if(_pendingRadioButton)
{
_pendingRadioButton=false;
_adfspu(a0,a1,a2,a3,a4);
}
else
{
_pendingRadioButton=true;
var a5="_pendingRadioButton=false;_adfspu(";
if((a0!=(void 0))&&(a0!=null))
a5+="'"+a0+"'";
a5+=",";
if(a1!=(void 0))
a5+=a1;
a5+=",";
if((a2!=(void 0))&&(a2!=null))
a5+="'"+a2+"'";
a5+=",";
if((a3!=(void 0))&&(a3!=null))
a5+="'"+a3+"'";
a5+=");";
window.setTimeout(a5,200);
}
}

var ADFDialogReturn=new Array();
function _launchDialog(
a0,
a1,
a2,
a3,
a4,
a5)
{
var a6=self;
var a7;
if(a5)
{
a7=function()
{
a6._submitPartialChange(a3,0,{rtrn:a4});
};
}
else
{
a7=function()
{
a6.submitForm(a3,0,{rtrn:a4});
};
}
var a8=ADFDialogReturn.length;
ADFDialogReturn[a8]=a7;
a0=a0+"&_rtrnId="+a8;
openWindow(window,a0,a1,a2,1);
}
function openWindow(
a0,
a1,
a2,
a3,
a4,
a5,
a6
)
{
if(a0)
{
if(a4==(void 0))
a4=false;
if(!a5)
{
a5=(a4)?"dialog":"document";
}
if(!a2)
a2="_blank";
var a7=_featureDefaults[a5];
if(a7==(void 0))
{
a5="document";
a7=_featureDefaults[a5];
}
var a8=(a4)
?_modalFeatureOverrides
:_modelessFeatureOverrides;
var a9=(_agent.isIE)
?_ieFeatures
:_nnFeatures;
var a10=null;
if(a3)
{
a10=new Object();
for(var a11 in a3)
{
a10[a11]=a3[a11];
}
}
var a12="";
for(var a13 in a9)
{
var a14=a8[a13];
if(a14==(void 0))
{
if(a10)
{
a14=a10[a13];
delete a10[a13];
}
if(a14==(void 0))
a14=a7[a13];
}
if(a14!=(void 0))
{
var a15=_booleanFeatures[a13]!=(void 0);
if(a14||!a15)
{
a12+=a13;
if(!a15)
{
a12+="="+a14;
}
a12+=",";
}
}
}
for(var a11 in a10)
{
a12+=a11;
if(a10[a11])
a12+="="+a10[a11];
a12+=",";
}
if(a12.length!=0)
{
a12=a12.substring(0,a12.length-1);
}
if(a6)
{
_setDependent(a0,a2,a6);
}
var a16=a0.open(a1,a2,a12);
var a17=false;
if(a16!=null)
{
var a18=0;
try
{
for(p in a16)
{
a18++;
break;
}
if(a18>0)
a17=true;
}
catch(e)
{
}
}
if(!a17)
{
_setDependent(a0,a2,(void 0));
if(_AdfWindowOpenError!=null)
alert(_AdfWindowOpenError);
return;
}
var a19=_agent.atMost("ie",4.99);
var a20=false;
var a21=a0.document;
var a22=a21.body;
if(a4&&!a19)
{
if(_agent.atLeast("ie",7))
{
var a23=a21.getElementById("_adfDialogDimmer");
if(a23==null)
{
a23=a21.createElement("div");
a23.id="_adfDialogDimmer";
var a24=a23.style;
a24.position="absolute";
a24.zIndex="32000";
a24.backgroundColor="#FFFFFF";
a24.filter="alpha(opacity=50)";
var a25=a21.documentElement;
var a26=Math.max(a25.offsetWidth,a25.scrollWidth);
var a27=Math.max(a25.offsetHeight,a25.scrollHeight);
a24.width=a26+"px";
a24.height=a27+"px";
a24.top="0px";
a24.left="0px";
a22.appendChild(a23);
a20=true;
}
}
else if(_agent.atLeast("ie",4))
{
a22.style.filter="alpha(opacity=50)";
a20=true;
}
if(_agent.isGecko)
{
if(a22!=(void 0))
_addModalCaptureGecko(a22);
}
a0.onfocus=_onModalFocus;
}
if(a4&&(_agent.atLeast("ie",5)&&_agent.isWindows))
{
_addModalCaptureIE(a22);
a22.onlosecapture=_onModalLoseCapture;
var a28=(a1!=null&&a1.indexOf(':')!=-1);
if(!a28)
{
var a29=new Function("e","_removeModalCaptureIE(window.document.body)");
a16.attachEvent("onunload",a29);
}
}
if(a4&&!a19)
{
_setDependent(a0,"modalWindow",a16);
}
if(a4&&self._pollManager)
{
_pollManager.deactivateAll();
_pollWhenModalDependentCloses();
}
a16.focus();
if(a20)
{
a0.setTimeout("_clearBodyModalEffects('alpha')",1000);
}
return a16;
}
else
{
return null;
}
}
function _pollWhenModalDependentCloses()
{
if(!_getValidModalDependent(self))
{
_pollManager.reactivateAll();
}
else
{
self.setTimeout("_pollWhenModalDependentCloses()",1000);
}
}
function _onModalLoseCapture()
{
var a0=_getValidModalDependent(self);
if(a0)
{
window.setTimeout("_onModalFocus()",1);
}
}
function _onModalFocus()
{
var a0=self.document.body;
var a1=_getModalDependent(self);
var a2=_agent.atLeast("ie",5)&&_agent.isWindows;
if(a1&&!a1.closed)
{
a1.focus();
if(a2)
{
a0.setCapture();
}
}
else
{
if(a2)
{
a0.onlosecapture=null;
_removeModalCaptureIE(a0);
}
}
}
function _clearBodyModalEffects(a0)
{
if(_getValidModalDependent(self)!=null)
{
self.setTimeout("_clearBodyModalEffects('"+a0+"')",1000);
}
else
{
if(a0=='alpha')
{
self.document.body.style.filter=null;
var a1=self.document;
var a2=a1.getElementById("_adfDialogDimmer");
if(a2!=null)
{
a1.body.removeChild(a2);
}
}
}
}
function _getValidModalDependent(
a0
)
{
var a1=_getModalDependent(a0);
if(a1)
{
if(a1.closed)
{
_setDependent(a0,"modalWindow",(void 0));
a1=(void 0);
}
}
return a1;
}
function _sizeWin(
a0,
a1,
a2,
a3
)
{
var a4=_agent.isGecko;
var a5=_agent.isIE;
var a6=_agent.isSafari;
var a7=(a4||a6);
if(!(a7||(a5&&_agent.isWindows)))
return;
var a8=a0.document.body;
if(a8)
{
var a9=(!a5&&(a8.scrollWidth>a8.clientWidth))
?a8.scrollWidth
:_getBodyWidth(a8,a8.offsetWidth,a8.offsetLeft);
var a10=0;
if(a7)
{
a10=a8.offsetHeight+(window.outerHeight-window.innerHeight);
a10+=30;
if(window.outerWidth>a8.offsetWidth)
a9+=(window.outerWidth-a8.offsetWidth);
}
else
{
a10=a8.scrollHeight+(a8.offsetHeight-a8.clientHeight);
a10+=21;
a9+=a8.offsetWidth-a8.clientWidth+16;
a10+=parseInt(a8.topMargin)+parseInt(a8.bottomMargin);
a9+=parseInt(a8.leftMargin)+parseInt(a8.rightMargin);
}
if(a1)
a9+=a1;
if(a2)
a10+=a2;
if(a3!=(void 0))
{
if(a3['W'])
{
var a11=0+a3['W'];
if(a9<a11)
a9=a11;
}
if(a3['H'])
{
var a12=0+a3['H'];
if(a10<a12)
a10=a12;
}
}
var a13=_getTop(a0.document);
var a14=a5?0:a13.screen.availLeft;
var a15=a5?0:a13.screen.availTop;
var a16=a13.screen.availHeight*0.95;
var a17=a13.screen.availWidth*0.95;
if(a10>a16)
a10=a16;
if(a9>a17)
a9=a17;
a13.resizeTo(a9,a10);
var a18=a5?a13.screenLeft:a13.screenX;
var a19=a5?a13.screenTop:a13.screenY;
var a20=false;
if((a18+a9)>(a14+a17))
{
a18=(a13.screen.availWidth-a9)/2;
a20=true;
}
if((a19+a10)>(a15+a16))
{
a19=(a13.screen.availHeight-a10)/2;
a20=true;
}
if(a20)
{
a13.moveTo(a18,a19);
}
}
}

function _pprExecScript(a0,a1)
{
if(_pprLibStore&&_pprLibStore.allLibraries!=(void 0))
{
_pprLibStore.allLibraries[a0]=a1;
_pprLibStore.loadedStatus[a0]=true;
for(var a0=_pprLibStore.total-1;a0>=0;a0--)
{
if(!_pprLibStore.loadedStatus[a0])
return;
}
for(var a2=0;a2<_pprLibStore.total;a2++)
{
var a3=parent;
if("_pprIFrame"!=window.name)
{
a3=window;
}
a3.execScript(_pprLibStore.allLibraries[a2]);
}
_pprLibStore=null;
}
}
function _pprCopyObjectElement(a0,a1)
{
var a2=0;
while(true)
{
var a3="_pprObjectScript"+a2;
var a4=_getElementById(a0,
a3);
if(a4==null)
break;
else
{
var a5=_getCommentedScript(a0,
a3);
}
if(a5!=null)
{
var a6="_pprObjectSpan"+a2;
var a7=_getElementById(a1,
a6);
if(a7!=null)
a7.outerHTML=a5;
}
a2++;
}
}
function _pprConsumeFirstClick(a0)
{
if(_agent.isIE)
{
_pprControlCapture(window,true);
window.document.detachEvent('onclick',_pprConsumeFirstClick);
}
return false;
}
function _pprConsumeBlockedEvent(a0)
{
var a1=true;
if(_pprBlocking)
{
var a2=true;
if(window._pprFirstClickPass)
{
var a3=new Date();
var a4=a3-_pprBlockStartTime;
var a5=150;
if((a4<a5)&&(a0.type=='click'))
{
var a6=a0.explicitOriginalTarget;
a2=!_isSubmittingElement(a6);
}
}
if(a2)
{
a0.stopPropagation();
a0.preventDefault();
a1=false;
}
}
return a1;
}
function _pprConsumeClick(a0)
{
if(_agent.isIE)
{
var a1=document.documentElement;
if((a0.x<a1.offsetLeft)||(a0.y<a1.offsetTop)
||(a0.x>a1.offsetWidth)||(a0.y>a1.offsetHeight))
{
_pprStopBlocking(window);
window.document.attachEvent('onmouseover',_mouseOverRestoreBlocking);
}
}
return false;
}
function _partialUnload()
{
if((parent._pprRequestCount<=0)&&!parent._pprUnloaded)
{
_pprStopBlocking(parent);
if(!(_agent.isIE)&&(parent.document.referrer!=null))
{
parent.history.go(parent.document.referrer);
}
else
{
var a0=-1;
if(_agent.isIE)
{
if(parent._pprSomeAction)
{
a0=-(parent._pprSubmitCount);
}
}
else if(parent._pprSubmitCount&&(parent._pprSubmitCount>0))
{
a0-=parent._pprSubmitCount;
}
parent._pprSubmitCount=0;
parent._pprSomeAction=false;
if(a0<0)
{
parent.history.go(a0);
}
}
}
}
function _getNewActiveElement(a0,a1,a2)
{
if(a2.id)
{
var a3=_getElementById(a0,
a2.id);
if(_isFocusable(a3))
return a3;
}
return null;
}
function _partialChange(a0)
{
if(parent._pprRequestCount<=0)
{
_pprStopBlocking(parent);
return;
}
parent._pprRequestCount--;
parent._pprSomeAction=true;
if(a0)
_fixAllLinks(a0,parent);
var a1=document;
var a2=parent.document;
var a3=_getParentActiveElement();
var a4=null;
var a5=false;
for(var a6=0;a6<_pprTargets.length;a6++)
{
var a7=_pprTargets[a6];
var a8=_getElementById(a1,a7);
var a9=_getElementById(a2,a7);
if(a8&&a9)
{
var a10=_isDescendent(a3,a9);
_setOuterHTML(a2,a9,a8);
if((a10)&&(a4==null))
{
a9=_getElementById(a2,a9.id);
a4=_getNewActiveElement(a2,
a9,
a3);
if(a4==null)
{
a4=_getFirstFocusable(a9);
if(a4!=null)
a5=true;
}
parent._pprEventElement=null;
}
}
}
_pprCopyObjectElement(a1,a2);
_loadScriptLibraries(a2);
_saveScripts(a2);
var a11=_getElementById(a2,"_pprSaveFormAction");
if(a11)
a11.value=document.forms[0].action;
_pprStopBlocking(parent);
var a12=_getRequestedFocusNode(parent);
if(a12!=null)
a4=a12;
_restoreFocus(a4,a5,a2);
_setRequestedFocusNode(null,null,false,parent);
_updateFormActions(a1,a2);
if(_pprFirstClickPass||parent._pprFirstClickPass)
{
_eval(parent,"_submitFormCheck();");
}
}
function _setOuterHTML(
a0,
a1,
a2
)
{
var a3=a2.tagName;
if(_agent.isIE||_agent.isSafari)
{
var a4=true;
var a5=((a3=="TD")||
(a3=="TH")||
(a3=="CAPTION"));
var a6=!a5&&
((a3=="COL")||
(a3=="COLGROUP")||
(a3=="TR")||
(a3=="TFOOT")||
(a3=="THEAD")||
(a3=="TBODY"));
if(a5||a6)
{
var a7=a0.createElement(a3);
if((_agent.isSafari)
&&((a3=="TR")||(a3=="TD")))
{
if(a3=="TD")
a7.innerHTML=a2.innerHTML;
else
a1.outerHTML=a2.outerHTML;
}
else
a7.mergeAttributes(a2,false);
if(a5)
{
a7.innerHTML=a2.innerHTML;
}
else
{
if(a6)
{
var a8=a2.firstChild;
while(a8!=null)
{
while(a8!=null&&a8.tagName=="!")
{
a8=a8.nextSibling;
}
if(a8!=null)
{
a7.appendChild(_setOuterHTML(a0,
null,
a8));
}
a8=a8.nextSibling;
}
}
}
if(a1)
{
if(a1["parentNode"])
a1.parentNode.replaceChild(a7,a1);
}
else
{
a1=a7;
}
a4=false;
}
if(a4)
{
a1.outerHTML=a2.outerHTML;
}
}
else
{
var a7;
if(a3!='TR')
{
a7=a0.createElement(a3);
if(a3=='SELECT')
{
if(a2.multiple)
{
a7.multiple=a2.multiple;
}
for(var a9=0;a9<a2.options.length;a9++)
{
var a10=a2.options[a9];
var a11=new Option();
a11.value=a10.value;
a11.text=a10.text;
a11.selected=a10.selected;
a7.options[a9]=a11;
}
}
else
{
var a12=a2.innerHTML;
if((a12!=null)&&(a12.length>0))
{
a7.innerHTML=a2.innerHTML;
}
}
var a13=a2.attributes;
for(var a9=0;a9<a13.length;a9++)
{
a7.setAttribute(a13[a9].name,a13[a9].value);
}
}
else
{
a7=a0.importNode(a2,true);
}
a1.parentNode.insertBefore(a7,a1);
a1.parentNode.removeChild(a1);
}
return a1;
}
function _updateFormActions(a0,a1)
{
var a2=a0.forms;
for(var a3=0;a3<a2.length;a3++)
{
var a4=a2[a3];
if(a4.hasChildNodes())
{
var a5=a4.name;
var a6=a4.action;
var a7=a1.forms[a5];
if(a7)
{
var a8=a7.action;
if(a8!=a6)
a7.action=a6;
}
}
}
}
function _saveActiveElement()
{
if(window._pprEventElement)
window._pprActiveElement=window._pprEventElement;
else if(document.activeElement)
window._pprActiveElement=document.activeElement;
else
window._pprActiveElement=null;
}
function _getParentActiveElement()
{
if(parent.document.activeElement)
{
_eval(parent,"_saveActiveElement()");
return parent._pprActiveElement;
}
return null;
}
function _saveScripts(a0)
{
if(!_agent.isIE)
return;
var a1=_getElementById(a0,"_pprSaveScript");
if(a1!=null)
{
var a2=_getCommentedScript(document,"_pprScripts");
a1.value=
a1.value+" "+a2;
}
var a3=_getElementById(a0,"_pprSaveLib");
if(a3!=null&&(window["_pprLibraries"]!=(void 0)))
{
for(var a4=0;(a4<_pprLibraries.length);a4++)
{
if(a3.value.indexOf(_pprLibraries[a4])==-1)
{
if(a3.value!="")
a3.value+=","+_pprLibraries[a4];
else
a3.value+=_pprLibraries[a4];
}
}
}
}
function _firePartialChange(a0)
{
var a1=_addParameter(a0,
_getPartialParameter(),
"true");
var a2=_getElementById(document,_pprIframeName);
_pprRequestCount++;
_pprStartBlocking(window);
if(_agent.isIE)
{
a2.contentWindow.location.replace(a1);
}
else
{
a2.contentDocument.location.replace(a1);
}
}

function _tableSort(
a0,
a1,
a2,
a3,
a4)
{
_submitPartialChange(a0,a1,
{event:'sort',
source:a2,
value:a3,
state:a4});
return false;
}
function CollectionComponent(
a0,
a1
)
{
this._formName=a0;
this._name=a1;
}
CollectionComponent.prototype.getFormName=function()
{
return this._formName;
};
CollectionComponent.prototype.getName=function()
{
return this._name;
};
CollectionComponent.prototype.getFormElement=function(a2)
{
var a3=document.forms[this.getFormName()];
var a4=this.getName()+":"+a2;
var a5=a3[a4];
return a5;
};
CollectionComponent.defineSubmit=function(a6,a7)
{
if(this._eventParam!=(void 0))
return;
CollectionComponent.prototype._eventParam=a6;
CollectionComponent.prototype._sourceParam=a7;
CollectionComponent.prototype._pTargetsParam="partialTargets";
CollectionComponent.prototype.addParam=function(paramName,paramValue){
if(this._params==(void 0))
{
this._params=new Object();
}
this._params[paramName]=paramValue;
}
CollectionComponent.prototype.submit=function(event,link){
this.addParam(this._eventParam,event);
this.addParam(this._sourceParam,this.getName());
var a8=this._params;
var a9=a8[this._pTargetsParam];
if(link!=(void 0))
{
var a10=link.id;
if(a10!=(void 0))
{
_setRequestedFocusNode(document,a10,false,window);
}
if(a9==(void 0))
{
a9=this.getName();
a8[this._pTargetsParam]=a9;
}
}
var a11=this._validate;
if(a11==(void 0))
a11=1;
var a12=submitForm;
if(a9!=(void 0))
{
a12=_submitPartialChange;
}
a12(this.getFormName(),a11,a8);
return false;
};
};
CollectionComponent.defineMultiSelect=function(a13,a14,a15)
{
if(this._selectedKey!=(void 0))
return;
CollectionComponent.prototype._selectedKey=a13;
CollectionComponent.prototype._selectedModeKey=a14;
CollectionComponent.prototype.getLength=function(){
var a16=this._getBoxes();
return a16.length;
};
CollectionComponent.prototype.multiSelect=function(selectAll){
var a16=this._getBoxes();
for(var a17=0;a17<a16.length;a17++)
{
var a18=a16[a17];
a18.checked=selectAll;
}
var a19=this.getFormElement(this._selectedModeKey);
if(selectAll)
{
a19.value="all";
}
else
{
a19.value="none";
}
if(a15)
{
_submitPartialChange(this.getFormName(),1,null);
}
};
CollectionComponent.prototype._getBoxes=function(){
var a16=this.getFormElement(this._selectedKey);
if(a16.length==(void 0))
{
var a20=new Array(1);
a20[0]=a16;
a16=a20;
}
return a16;
};
};
CollectionComponent.defineTree=
function(a21,
a22,
a23,
a24,
a25,
a26,
a27)
{
if(this._pathParam!=(void 0))
return;
CollectionComponent.defineSubmit(a21,a22);
CollectionComponent.prototype._pathParam=a23;
CollectionComponent.prototype._startParam=a24;
CollectionComponent.prototype._gotoEvent=a25;
CollectionComponent.prototype._focusEvent=a26;
CollectionComponent.prototype._validate=a27;
CollectionComponent.prototype.action=function(event,path,link)
{
this.addParam(this._pathParam,path);
return this.submit(event,link);
};
CollectionComponent.prototype.range=function(path,start)
{
this.addParam(this._startParam,start);
return this.action(this._gotoEvent,path);
};
CollectionComponent.prototype.focus=function(path,link)
{
return this.action(this._focusEvent,path,link);
};
};

function _PollManager()
{
this.pollIdList;
this.active=true;
}
_PollManager.prototype.addAndActivate=_addAndActivatePoll;
_PollManager.prototype.deactivateAll=_deactivateAllPoll;
_PollManager.prototype.reactivateAll=_reactivateAllPoll;
function _addAndActivatePoll(a0,a1,a2)
{
if(!this.pollIdList)
this.pollIdList=new Array();
this[a0]=new _PollCommand(a1,a2,this.active);
idIndex=-1;
for(var a3=0;a3<this.pollIdList.length;a3++)
{
if(a0==this.pollIdList[a3])
{
idIndex=a3;
break;
}
}
if(idIndex!=-1)
{
this.pollIdList[idIndex]==a0;
}
else
{
this.pollIdList.push(a0);
}
}
function _deactivateAllPoll()
{
for(var a0=0;a0<this.pollIdList.length;a0++)
{
clearTimeout(this[this.pollIdList[a0]].commandId);
}
this.active=false;
}
function _reactivateAllPoll()
{
for(var a0=0;a0<this.pollIdList.length;a0++)
{
this[this.pollIdList[a0]].activate();
}
this.active=true;
}
function _PollCommand(a0,a1,a2)
{
this.commandString=a0;
this.timeout=a1;
if(a2)
this.activate();
}
_PollCommand.prototype.activate=_activatePoll;
function _activatePoll()
{
this.commandId=setTimeout(this.commandString,this.timeout);
}

var _cfBus=new Object();
var _cfTransIconURL;
var _cfOpaqueIconURL;
var _cfBgColor;
function _cfsw(
a0)
{
var a1=_getColorFieldFormat(a0);
var a2=a0.name+"$sw";
var a3=(void 0);
var a4=_getElementById(document,a2);
if(a4!=(void 0))
{
if(a0.value!="")
{
a3=a1.getAsObject(a0.value);
}
if(a3!=(void 0))
{
if(a3.alpha==0)
{
a4.style.backgroundColor=(void 0);
a4.src=_cfTransIconURL;
a4.alt=_cfTrans;
}
else
{
a4.style.backgroundColor=
new RGBColorFormat("#RRGGBB").getAsString(a3);
a4.src=_cfOpaqueIconURL;
a4.alt=a1.getAsString(a3);
}
}
else
{
a4.style.backgroundColor=_cfBgColor;
a4.src=_cfOpaqueIconURL;
a4.alt=(void 0);
}
if(_agent.isGecko)
a4.title=a4.alt;
}
}
function _returnColorPickerValue(
a0,
a1
)
{
var a2=a0.returnValue;
var a3=a0._colorField;
if(a3==(void 0))
{
a3=_savedColorField1879034;
}
if(a0.isApplicable)
_cfUpdate(a3,a2);
}
function _cfbs(
a0)
{
_cfUpdate(_cfBus[a0.source],a0.params.value);
}
function _cfUpdate(
a0,
a1)
{
if(a0!=(void 0))
{
var a2=_getColorFieldFormat(a0);
var a3=(a0.type!='hidden');
var a4=a0.value;
var a5=a2.getAsString(a1);
if(a5==_cfTrans&&!a2._allowsTransparent)
return;
if(a5==(void 0))
a5="";
if(a5!=a0.value)
{
if(a0.onchange!=(void 0))
{
if(_agent.isIE)
{
a0.onpropertychange=function()
{
var a6=window.event;
if(a6.propertyName=='value')
{
a0.onpropertychange=function(){};
_cfsw(a0);
a0.onchange(a6);
}
}
a0.value=a5;
}
else
{
a0.value=a5;
if(!_agent.isNav)
_cfsw(a0);
var a6=new Object();
a6.type='change';
a6.target=a0;
a0.onchange(a6);
}
}
else
{
a0.value=a5;
if(!_agent.isNav)
_cfsw(a0);
}
}
if(a3)
{
a0.select();
a0.focus();
}
}
}
function _lcp(
a0,
a1,
a2
)
{
var a3=document.forms[a0][a1];
if(!a2)
{
a2=_jspDir+_getQuerySeparator(_jspDir)+"_t=fred&_red=cp";
}
else
{
var a4=a2.lastIndexOf('?');
var a5="";
if(a4==-1)
{
a4=a2.length;
}
else
{
a5=a2.substr(a4+1);
}
var a6=_jspDir+_getQuerySeparator(_jspDir);
a6+=a5;
a6+=_getQuerySeparator(a6);
a6+="_t=fred";
var a7=a2.substring(0,a4);
a2=a6;
a2+="&redirect="+escape(a7);
}
var a8=_cfs[a1];
var a9="#RRGGBB"
if(a8!=(void 0))
{
a2+="&pattern=";
if(typeof a8=="string")
{
a9=a8;
a2+=escape(a9);
}
else
{
a9=a8[0];
a2+=escape(a8.join(" "));
}
}
if(a3.value!="")
{
var a10=_getColorFieldFormat(a3);
var a11=a10.getAsObject(a3.value);
if(a11!=(void 0))
{
a2+="&value=";
if(a11.alpha==0)
a2+=escape(_cfTrans);
else
a2+=escape(new RGBColorFormat(a9).getAsString(a11));
}
}
var a12=_cfts[a1];
if(a12!=(void 0))
{
a2+="&allowsTransparent="+a12;
}
a2+="&loc="+_locale;
if(window["_enc"])
{
a2+="&enc="+_enc;
}
var a13=openWindow(self,
a2,
'colorDialog',
{width:430,height:230},
true,
void 0,
_returnColorPickerValue);
a13._colorField=a3;
_savedColorField1879034=a3;
}
var _savedColorField1879034;

function _getColorFieldFormat(
a0)
{
var a1=a0.name;
if(a1&&_cfs)
{
var a2=_cfs[a1];
var a3=_cfts[a1];
if(a2||a3)
return new RGBColorFormat(a2,a3);
}
return new RGBColorFormat();
}
function _fixCFF(
a0)
{
var a1=_getColorFieldFormat(a0);
if(a0.value!="")
{
var a2=a1.getAsObject(a0.value);
if(a2!=(void 0))
a0.value=a1.getAsString(a2);
}
}

var _cfTrans;
function _rgbColorFormat(
a0)
{
if(a0==(void 0))
return(void 0);
if(a0.alpha==0)
return _cfTrans;
var a1=new Object();
a1.value="";
var a2=this._pattern;
if(typeof a2!="string")
a2=a2[0];
_cfoDoClumping(a2,
_cfoSubformat,
a0,
a1);
return a1.value;
}
function _rgbColorParse(
a0)
{
if(this._allowsTransparent&&_cfTrans==a0)
return new Color(0,0,0,0);
var a1=this._pattern;
if(typeof a1=="string")
{
return _rgbColorParseImpl(a0,
a1);
}
else
{
var a2;
for(a2=0;a2<a1.length;a2++)
{
var a3=_rgbColorParseImpl(a0,
a1[a2]);
if(a3!=(void 0))
return a3;
}
}
}
function _rgbColorParseImpl(
a0,
a1)
{
var a2=new Object();
a2.currIndex=0;
a2.parseString=a0;
a2.parseException=new ConverterException();
var a3=new Color(0x00,0x00,0x00);
if(_cfoDoClumping(a1,
_cfoSubParse,
a2,
a3))
{
if(a0.length!=a2.currIndex)
{
return(void 0);
}
return a3;
}
else
{
return(void 0);
}
}
function _cfoDoClumping(
a0,
a1,
a2,
a3
)
{
var a4=a0.length;
var a5=false;
var a6=0;
var a7=void 0;
var a8=0;
for(var a9=0;a9<a4;a9++)
{
var a10=a0.charAt(a9);
if(a5)
{
if(a10=="\'")
{
a5=false;
if(a6!=1)
{
a8++;
a6--;
}
if(!a1(a0,
"\'",
a8,
a6,
a2,
a3))
{
return false;
}
a6=0;
a7=void 0;
}
else
{
a6++;
}
}
else
{
if(a10!=a7)
{
if(a6!=0)
{
if(!a1(a0,
a7,
a8,
a6,
a2,
a3))
{
return false;
}
a6=0;
a7=void 0;
}
if(a10=='\'')
{
a5=true;
}
a8=a9;
a7=a10;
}
a6++;
}
}
if(a6!=0)
{
if(!a1(a0,
a7,
a8,
a6,
a2,
a3))
{
return false;
}
}
return true;
}
function _cfoSubformat(
a0,
a1,
a2,
a3,
a4,
a5
)
{
var a6=null;
if((a1>='A')&&(a1<='Z')||
(a1>='a')&&(a1<='z'))
{
switch(a1)
{
case'r':
a6=_cfoGetPaddedNumber(a4.red,a3,3,10);
break;
case'g':
a6=_cfoGetPaddedNumber(a4.green,a3,3,10);
break;
case'b':
a6=_cfoGetPaddedNumber(a4.blue,a3,3,10);
break;
case'a':
a6=_cfoGetPaddedNumber(a4.alpha,a3,3,10);
break;
case'R':
a6=
_cfoGetPaddedNumber(a4.red,a3,2,16).toUpperCase();
break;
case'G':
a6=
_cfoGetPaddedNumber(a4.green,a3,2,16).toUpperCase();
break;
case'B':
a6=
_cfoGetPaddedNumber(a4.blue,a3,2,16).toUpperCase();
break;
case'A':
a6=
_cfoGetPaddedNumber(a4.alpha,a3,2,16).toUpperCase();
break;
default:
a6="";
}
}
else
{
a6=a0.substring(a2,a2+a3);
}
a5.value+=a6;
return true;
}
function _cfoSubParse(
a0,
a1,
a2,
a3,
a4,
a5
)
{
var a6=a4.currIndex;
if((a1>='A')&&(a1<='Z')||
(a1>='a')&&(a1<='z'))
{
switch(a1)
{
case'r':
a5.red=_cfoAccumulateNumber(a4,a3,3,10);
if(a5.red==(void 0))
{
return false;
}
break;
case'g':
a5.green=_cfoAccumulateNumber(a4,a3,3,10);
if(a5.green==(void 0))
{
return false;
}
break;
case'b':
a5.blue=_cfoAccumulateNumber(a4,a3,3,10);
if(a5.blue==(void 0))
{
return false;
}
break;
case'a':
a5.alpha=_cfoAccumulateNumber(a4,a3,3,10);
if(a5.alpha==(void 0))
{
return false;
}
break;
case'R':
a5.red=_cfoAccumulateNumber(a4,a3,2,16);
if(a5.red==(void 0))
{
return false;
}
break;
case'G':
a5.green=_cfoAccumulateNumber(a4,a3,2,16);
if(a5.green==(void 0))
{
return false;
}
break;
case'B':
a5.blue=_cfoAccumulateNumber(a4,a3,2,16);
if(a5.blue==(void 0))
{
return false;
}
break;
case'A':
a5.alpha=_cfoAccumulateNumber(a4,a3,2,16);
if(a5.alpha==(void 0))
{
return false;
}
break;
default:
}
}
else
{
return _cfoMatchText(a4,
a0.substring(a2,a2+a3));
}
return true;
}
function _cfoMatchText(
a0,
a1
)
{
if(!a1)
return false;
var a2=a1.length;
var a3=a0.currIndex;
var a4=a0.parseString;
if(a2>a4.length-a3)
{
return false;
}
var a5=a4.substring(a3,a3+a2);
if(a5!=a1)
return false;
a0.currIndex+=a2;
return true;
}
function _cfoAccumulateNumber(
a0,
a1,
a2,
a3)
{
var a4=a0.currIndex;
var a5=a4;
var a6=a0.parseString;
var a7=a6.length;
if(a7>a5+a2)
a7=a5+a2;
var a8=0;
while(a5<a7)
{
var a9=parseInt(a6.charAt(a5),a3);
if(!isNaN(a9))
{
a8*=a3;
a8+=a9;
a5++;
}
else
{
break;
}
}
if(a4!=a5&&
(a5-a4)>=a1)
{
a0.currIndex=a5;
return a8;
}
else
{
return(void 0);
}
}
function _cfoGetPaddedNumber(
a0,
a1,
a2,
a3)
{
var a4=a0.toString(a3);
if(a1!=(void 0))
{
var a5=a1-a4.length;
while(a5>0)
{
a4="0"+a4;
a5--;
}
}
if(a2!=(void 0))
{
var a6=a4.length-a2;
if(a6>0)
{
a4=a4.substring(a6,
a6+a2);
}
}
return a4;
}
function RGBColorFormat(
a0,
a1)
{
this._class="RGBColorFormat";
this._allowsTransparent=a1;
if(a0!=(void 0))
{
if(typeof(a0)=="string")
a0=[a0];
}
this._pattern=a0;
}
RGBColorFormat.prototype=new Converter();
RGBColorFormat.prototype.getAsString=_rgbColorFormat;
RGBColorFormat.prototype.getAsObject=_rgbColorParse;
function Color(
a0,
a1,
a2,
a3)
{
this._class="Color";
if(a3==(void 0))
a3=0xff;
this.red=(a0&0xff);
this.green=(a1&0xff);
this.blue=(a2&0xff);
this.alpha=(a3&0xff);
}
function _Color_toString()
{
return"rgba("+this.red+
","+this.green+
","+this.blue+
","+this.alpha+")";
}
Color.prototype.toString=_Color_toString;

function GraphView(a0,a1,a2,
a3,
a4,a5,
a6)
{
this.source=a0;
this.imageID=a1;
this.graphBounds=a3;
this.viewClip=a6;
this.formName=a2;
this.thumbWidth=a4;
this.thumbHeight=a5;
}
GraphView.prototype.submit=_submit;
GraphView.prototype.move=_move;
GraphView.prototype.moveRel=_moveRel;
GraphView.prototype.thumbClick=_thumbClick;
GraphView.prototype.nodeClick=_nodeClick;
GraphView.prototype.canvasClick=_canvasClick;
function _canvasClick(a0)
{
var a1=document.getElementById(this.imageID);
var a2=_getClickXY(a1,a0);
var a3=this.viewClip;
var a4=new Object();
a4.event="canvas";
a4.x=a2.x+a3.x;
a4.y=a2.y+a3.y;
this.submit(a4);
}
function _nodeClick(a0,a1)
{
var a2=new Object();
a2.event="click";
a2.part=a1;
a2.partID=a0;
this.submit(a2);
}
function _moveRel(a0,a1)
{
var a2=this.viewClip;
var a3=(a2.x+a2.width/2)+(a2.width*a0/2);
var a4=(a2.y+a2.height/2)+(a2.height*a1/2);
this.move(a3,a4);
}
function _move(a0,a1)
{
var a2=new Object();
a2.event="pan";
a2.x=a0;
a2.y=a1;
this.submit(a2);
}
function _submit(a0)
{
a0.source=this.source;
submitForm(this.formName,0,a0);
}
function _thumbClick(a0,a1)
{
var a2=_getClickXY(a0,a1);
var a3=a2.x;
var a4=a2.y;
var a5=this.graphBounds;
var a6=(a3*a5.width/this.thumbWidth)+a5.x;
var a7=(a4*a5.height/this.thumbHeight)+a5.y;
this.move(Math.round(a6),Math.round(a7));
}
function _getClickXY(a0,a1)
{
var a2=_getLocation(a0);
a2.x=a1.clientX-a2.x;
a2.y=a1.clientY-a2.y;
return a2;
}
function _getLocation(a0)
{
var a1=a0;
var a2=0;
var a3=0;
while(a1.tagName!="BODY"){
a2+=a1.offsetLeft;
a3+=a1.offsetTop;
a1=a1.offsetParent;
}
return{x:a2,y:a3};
}

var _shuttle_no_name="You must supply the shuttle's name to create a proxy";
var _shuttle_no_form_name_provided="A form name must be provided";
var _shuttle_no_form_available="This shuttle is not in a form";
function ShuttleProxy(
a0,
a1
)
{
if(a0==(void 0))
{
alert(_shuttle_no_name);
this.shuttleName="";
this.formName="";
return;
}
this.shuttleName=a0;
this.formName="";
if(a1==(void 0))
{
var a2=document.forms.length;
var a3=a0+":leading";
for(var a4=0;a4<a2;a4++)
{
if(document.forms[a4][a3]!=(void 0))
{
this.formName=document.forms[a4].name;
break;
}
}
if(this.formName=="")
{
alert(shuttle_no_form_available);
return;
}
}
else
{
this.formName=a1;
}
}
ShuttleProxy.prototype.getItems=_getItems;
ShuttleProxy.prototype.getSelectedItems=_getSelectedItems;
ShuttleProxy.prototype.getItemCount=_getItemCount;
ShuttleProxy.prototype.getSelectedItemCount=_getSelectedItemCount;
ShuttleProxy.prototype.addItem=_addItem;
ShuttleProxy.prototype.deleteItemByValue=_deleteItemByValue;
ShuttleProxy.prototype.deleteSelectedItems=_deleteSelectedItems;
ShuttleProxy.prototype.move=_move;
ShuttleProxy.prototype.reorderList=_reorderList;
ShuttleProxy.prototype.reset=_reset;
function _remove(a0,a1,a2)
{
var a3=a0.length;
if(a2>a3)
return;
for(var a4=a1;a4<a3;a4++)
{
if(a4<a3-a2)
a0[a4]=a0[a4+a2];
else
a0[a4]=void 0;
}
a0.length=a3-a2;
}
function _displayDesc(
a0,
a1
)
{
if(a1==(void 0))
{
alert(_shuttle_no_form_name_provided);
return;
}
if(a1.length==0)
{
alert(shuttle_no_form_available);
return;
}
var a2=document.forms[a1].elements[a0+':desc'];
if(a2==void(0))
{
return;
}
var a3=_getDescArray(a0);
if(a3==(void 0)||a3.length==0)
{
return;
}
var a4=_getSelectedIndexes(a1,a0);
if(a4.length==0)
{
a2.value="";
_setSelected(a0,a4);
return;
}
var a5=_getSelectedDesc(a0,a3,a4);
a2.value=a5;
_setSelected(a0,a4);
}
function _getDescArray
(
a0
)
{
var a1=window[a0.replace(':','_')+'_desc'];
return a1;
}
function _getSelectedDesc
(
a0,
a1,
a2
)
{
var a3=_getSelectedArray(a0);
if(a2.length==1)
return a1[a2[0]];
if(a2.length-a3.length!=1)
return"";
for(var a4=0;a4<a2.length;a4++)
{
if(a4>=a3.length||a3[a4]!=a2[a4])
return a1[a2[a4]];
}
return"";
}
function _getSelectedArray
(
a0
)
{
var a1=window[a0.replace(':','_')+'_sel'];
return a1;
}
function _setSelected
(
a0,
a1
)
{
var a2=_getSelectedArray(a0);
if(a2!=(void 0))
{
var a3=a2.length;
_remove(a2,0,a3);
for(var a4=0;a4<a1.length;a4++)
{
a2[a4]=a1[a4];
}
}
}
function _addDescAtIndex
(
a0,
a1,
a2
)
{
if(a0!=(void 0))
{
var a3=a0.length;
for(var a4=a3-1;a4>=a2;a4--)
{
a0[a4+1]=a0[a4];
}
a0[a2]=a1;
a0.length=a3+1;
}
}
function _deleteDescAtIndex
(
a0,
a1
)
{
if(a0!=(void 0))
_remove(a0,a1,1);
}
function _deleteDescAtIndexes
(
a0,
a1
)
{
if(a0!=(void 0))
{
for(var a2=a1.length-1;a2>=0;a2--)
{
_remove(a0,a1[a2],1);
}
}
}
function _clearDescAreas(
a0,
a1,
a2
)
{
var a3=document.forms[a0].elements[a1+':desc'];
var a4=document.forms[a0].elements[a2+':desc'];
if(a3!=void(0))
{
a3.value="";
}
if(a4!=void(0))
{
a4.value="";
}
}
function _moveItems(
a0,
a1,
a2
)
{
if(a2==(void 0))
{
a2=_findFormNameContaining(a0);
}
if(a2.length==0)
{
alert(shuttle_no_form_available);
return;
}
var a3=document.forms[a2].elements[a0];
var a4=document.forms[a2].elements[a1];
if(a3==(void 0)||a4==(void 0))
return;
var a5=_getSelectedIndexes(a2,a0);
if(a5.length==0)
{
if(_shuttle_no_items_selected.length>0)
alert(_shuttle_no_items_selected);
return;
}
var a6=_getDescArray(a0);
var a7=_getDescArray(a1);
a4.selectedIndex=-1;
var a8=a4.length-1;
var a9=a4.options[a8].text;
for(var a10=0;a10<a5.length;a10++)
{
var a11=a3.options[a5[a10]].text;
var a12=a3.options[a5[a10]].value;
if(a10==0)
{
a4.options[a8].text=a11;
a4.options[a8].value=a12;
}
else
{
a4.options[a8]=new Option(a11,a12,false,false);
}
if(a7!=(void 0)&&a6!=(void 0))
a7[a8]=a6[a5[a10]];
a4.options[a8].selected=true;
a8++;
}
a4.options[a8]=new Option(a9,"",false,false);
a4.options[a8].selected=false;
for(var a10=a5.length-1;a10>=0;a10--)
{
if(a6!=(void 0))
_remove(a6,a5[a10],1);
a3.options[a5[a10]]=null;
}
a3.selectedIndex=-1;
_clearDescAreas(a2,a0);
_displayDesc(a1,a2);
_makeList(a2,a0);
_makeList(a2,a1);
_navDirty=true;
}
function _moveAllItems(
a0,
a1,
a2
)
{
if(a2==(void 0))
{
a2=_findFormNameContaining(a0);
}
var a3=document.forms[a2].elements[a0];
var a4=document.forms[a2].elements[a1];
var a5=
a4.options[document.forms[a2].elements[a1].length-1].text
var a6=a4.length-1;
var a7=_getDescArray(a0);
var a8=_getDescArray(a1);
if(a3.length>1)
{
var a9=a3.length
for(var a10=0;a10<a9-1;a10++)
{
var a11=a3.options[0].text;
var a12=a3.options[0].value;
a3.options[0]=null;
if(a10==0)
{
a4.options[a6].text=a11;
a4.options[a6].value=a12;
}
else
{
a4.options[a6]=new Option(a11,a12,false,false);
}
if(a8!=(void 0)&&a7!=(void 0))
a8[a6]=a7[a10];
a6++;
}
a4.options[a6]=new Option(a5,"",false,false);
a4.options[a6].selected=false;
if(a7!=(void 0))
{
var a13=a7.length;
_remove(a7,0,a13);
}
a3.selectedIndex=-1;
a4.selectedIndex=-1;
_clearDescAreas(a2,a0,a1);
_makeList(a2,a0);
_makeList(a2,a1);
_navDirty=true;
}
else if(_shuttle_no_items.length>0)
{
alert(_shuttle_no_items);
}
}
function _orderList(
a0,
a1,
a2
)
{
if(a2==(void 0))
{
a2=_findFormNameContaining(a1);
}
var a3=document.forms[a2].elements[a1];
var a4=_getSelectedIndexes(a2,a1);
if(a4.length==0)
{
if(_shuttle_no_items_selected.length>0)
alert(_shuttle_no_items_selected);
return;
}
var a5=_getDescArray(a1);
var a6=a4.length-1;
while(a6>=0)
{
var a7=a4[a6];
var a8=a7;
var a9=a6;
while((a9>0)&&((a4[a9]-
a4[a9-1])==1))
{
a9--;
a8--;
}
if(a0==0)
{
if(a8!=0)
{
var a10=a3.options[a8-1].text;
var a11=a3.options[a8-1].value;
if(a5!=(void 0))
var a12=a5[a8-1];
for(var a13=a8;a13<=a7;a13++)
{
a3.options[a13-1].text=a3.options[a13].text;
a3.options[a13-1].value=a3.options[a13].value;
a3.options[a13-1].selected=true;
if(a5!=(void 0))
a5[a13-1]=a5[a13];
}
a3.options[a7].text=a10;
a3.options[a7].value=a11;
a3.options[a7].selected=false;
if(a5!=(void 0))
a5[a7]=a12;
_navDirty=true;
}
}
else
{
if(a7!=a3.length-2)
{
var a10=a3.options[a7+1].text;
var a11=a3.options[a7+1].value;
if(a5!=(void 0))
var a12=a5[a7+1];
for(var a13=a7;a13>=a8;a13--)
{
a3.options[a13+1].text=a3.options[a13].text;
a3.options[a13+1].value=a3.options[a13].value;
a3.options[a13+1].selected=true;
if(a5!=(void 0))
a5[a13+1]=a5[a13];
}
a3.options[a8].text=a10;
a3.options[a8].value=a11;
a3.options[a8].selected=false;
if(a5!=(void 0))
a5[a8]=a12;
_navDirty=true;
}
}
a6=a9-1;
}
_displayDesc(a1,a2);
_makeList(a2,a1);
}
function _orderTopBottomList(
a0,
a1,
a2
)
{
if(a2==(void 0))
{
a2=_findFormNameContaining(a1);
}
var a3=document.forms[a2].elements[a1];
var a4=_getSelectedIndexes(a2,a1);
if(a4.length==0)
{
if(_shuttle_no_items_selected.length>0)
alert(_shuttle_no_items_selected);
return;
}
var a5=_getDescArray(a1);
var a6=new Array();
var a7=new Array();
var a8=new Array();
var a9=new Array();
var a10=0;
if(a0==0)
{
var a11=0;
var a10=0;
for(var a12=0;
a12<a4[a4.length-1];
a12++)
{
if(a12!=a4[a11])
{
a8[a10]=a3.options[a12].text;
a9[a10]=a3.options[a12].value;
if(a5!=(void 0))
a6[a10]=a5[a12];
a10++
}
else
{
if(a5!=(void 0))
a7[a11]=a5[a12];
a11++;
}
}
if(a5!=(void 0))
a7[a11]=a5[a12];
for(var a13=0;a13<a4.length;a13++)
{
a3.options[a13].text=a3.options[a4[a13]].text;
a3.options[a13].value=a3.options[a4[a13]].value;
a3.options[a13].selected=true;
if(a5!=(void 0))
a5[a13]=a7[a13];
}
for(var a14=0;a14<a8.length;a14++)
{
a3.options[a13].text=a8[a14];
a3.options[a13].value=a9[a14];
a3.options[a13].selected=false;
if(a5!=(void 0))
a5[a13]=a6[a14];
a13++
}
}
else
{
var a11=1;
var a10=0;
if(a5!=(void 0))
a7[0]=a5[a4[0]];
for(var a15=a4[0]+1;
a15<=a3.length-2;
a15++)
{
if((a11==a4.length)||
(a15!=a4[a11]))
{
a8[a10]=a3.options[a15].text;
a9[a10]=a3.options[a15].value;
if(a5!=(void 0))
a6[a10]=a5[a15];
a10++;
}
else
{
if(a5!=(void 0))
a7[a11]=a5[a15];
a11++;
}
}
var a14=a3.length-2;
for(var a13=a4.length-1;a13>=0;a13--)
{
a3.options[a14].text=a3.options[a4[a13]].text;
a3.options[a14].value=a3.options[a4[a13]].value;
a3.options[a14].selected=true;
if(a5!=(void 0))
a5[a14]=a7[a13];
a14--;
}
for(var a13=a8.length-1;a13>=0;a13--)
{
a3.options[a14].text=a8[a13];
a3.options[a14].value=a9[a13];
a3.options[a14].selected=false;
if(a5!=(void 0))
a5[a14]=a6[a13];
a14--
}
}
_displayDesc(a1,a2);
_makeList(a2,a1);
_navDirty=true;
}
function _getSelectedIndexes(
a0,
a1
)
{
var a2=document.forms[a0].elements[a1];
var a3=new Array();
var a4=0;
for(var a5=0;a5<a2.length-1;a5++)
{
if(a2.options[a5].selected)
{
a3[a4]=a5;
a4++;
}
}
return a3;
}
function _findFormNameContaining(
a0
)
{
var a1=document.forms.length;
for(var a2=0;a2<a1;a2++)
{
if(document.forms[a2][a0]!=(void 0))
{
return document.forms[a2].name;
}
}
return"";
}
function _makeList(
a0,
a1
)
{
var a2=document.forms[a0].elements[a1];
if(a2==null)
return;
var a3="";
for(var a4=0;a4<a2.length-1;a4++)
{
if(a2.options[a4].value.length>0)
{
a3=a3+
_trimString(a2.options[a4].value)
+';';
}
else
{
a3=a3+
_trimString(a2.options[a4].text)
+';';
}
}
document.forms[a0].elements[a1+':items'].value=a3;
}
function _trimString(
a0
)
{
var a1=a0.length-1;
if(a0.charAt(a1)!=' ')
{
return a0;
}
while((a0.charAt(a1)==' ')&&(a1>0))
{
a1=a1-1;
}
a0=a0.substring(0,a1+1);
return a0;
}
function _getListName(
a0,
a1
)
{
var a2=(a1)?a0+":leading":
a0+":trailing";
return a2;
}
function _resetItems(
a0,
a1)
{
if(a1==(void 0))
{
a1=_findFormNameContaining(from);
}
if(a1.length==0)
{
alert(shuttle_no_form_available);
return;
}
leadingListName=_getListName(a0,true);
trailingListName=_getListName(a0,false);
var a2=document.forms[a1].elements[leadingListName];
var a3=document.forms[a1].elements[trailingListName];
var a4=_getOriginalLists(a0,a1);
var a5=a4.leading;
var a6=a4.trailing;
var a7=_getDescArray(leadingListName);
var a8=_getDescArray(trailingListName);
_resetToOriginalList(a5,a7,a2);
_resetToOriginalList(a6,a8,a3);
_makeList(a1,leadingListName);
_makeList(a1,trailingListName);
return false;
}
function _getOriginalLists
(
a0,
a1
)
{
var a2=window['_'+a1+'_'+a0+'_orig'];
return a2;
}
function _resetToOriginalList
(
a0,
a1,
a2
)
{
if(a0==(void 0)||a2==(void 0))
return;
a2.selectedIndex=a0.selectedIndex;
var a3=0;
for(;a3<a0.options.length;a3++)
{
var a4=a0.options[a3].text;
var a5=a0.options[a3].value;
var a6=a0.options[a3].defaultSelected;
var a7=a0.options[a3].selected;
{
a2.options[a3]=new Option(a4,a5,
a6,a7);
a2.options[a3].defaultSelected=a6;
a2.options[a3].selected=a7;
}
if(a1!=(void 0))
a1[a3]=a0.descriptions[a3];
}
var a8=a2.options.length-1;
while(a8>=a3)
{
if(a1!=(void 0))
a1[a8]=null;
a2.options[a8]=null;
a8--;
}
}
function _copyLists(a0,a1)
{
if(a1==(void 0))
{
a1=_findFormNameContaining(from);
}
if(a1.length==0)
{
alert(shuttle_no_form_available);
return;
}
var a2=new Object();
a2.leading=_copyList(_getListName(a0,true),a1);
a2.trailing=_copyList(_getListName(a0,false),a1);
return a2;
}
function _copyList(a0,a1)
{
if(a1==(void 0)||a0==(void 0))
return;
var a2=document.forms[a1].elements[a0];
if(a2==null)
return;
var a3=_getDescArray(a0);
var a4=new Object();
a4.selectedIndex=a2.selectedIndex;
a4.options=new Array();
a4.descriptions=new Array();
for(var a5=0;a5<a2.options.length;a5++)
{
a4.options[a5]=new Option(a2.options[a5].text,
a2.options[a5].value,
a2.options[a5].defaultSelected,
a2.options[a5].selected);
a4.options[a5].defaultSelected=a2.options[a5].defaultSelected;
a4.options[a5].selected=a2.options[a5].selected;
if(a3!=null)
a4.descriptions[a5]=a3[a5];
}
return a4;
}
function _reset()
{
_resetItems(this.shuttleName,this.formName);
}
function _move(
a0,
a1
)
{
if(a1==(void 0))
{
a1=false;
}
if(a0==(void 0))
{
a0=true;
}
var a2=_getListName(this.shuttleName,a0);
var a3=_getListName(this.shuttleName,!a0);
if(a1)
{
_moveAllItems(a2,a3,this.formName);
}
else
{
_moveItems(a2,a3,this.formName);
}
}
function _reorderList(
a0,
a1,
a2
)
{
if(a2==(void 0))
{
a2=true;
}
if(a1==(void 0))
{
a1=false;
}
if(a0==(void 0))
{
a0=false;
}
var a3=_getListName(this.shuttleName,a2);
if(!a1)
{
_orderList(a0,a3,this.formName);
}
else
{
_orderTopBottomList(a0,a3,this.formName);
}
}
function _getItems(
a0
)
{
if(a0==(void 0))
{
a0=true;
}
var a1=_getListName(this.shuttleName,a0);
var a2=document.forms[this.formName].elements[a1];
var a3=new Array();
for(var a4=0;a4<a2.length-1;a4++)
{
a3[a4]=a2.options[a4];
}
return a3;
}
function _getSelectedItems(
a0
)
{
if(a0==(void 0))
{
a0=true;
}
var a1=_getListName(this.shuttleName,a0);
var a2=document.forms[this.formName].elements[a1];
var a3=new Array();
var a4=0;
for(var a5=0;a5<a2.length-1;a5++)
{
if(a2.options[a5].selected)
{
a3[a4]=a2.options[a5];
a4++;
}
}
return a3;
}
function _getItemCount(
a0
)
{
if(a0==(void 0))
{
a0=true;
}
var a1=_getListName(this.shuttleName,a0);
return document.forms[this.formName].elements[a1].length-1;
}
function _getSelectedItemCount(
a0
)
{
if(a0==(void 0))
{
a0=true;
}
var a1=_getListName(this.shuttleName,a0);
var a2=document.forms[this.formName].elements[a1];
var a3=0;
for(var a4=0;a4<a2.length-1;a4++)
{
if(a2.options[a4].selected)
{
a3++;
}
}
return a3;
}
function _addItem(
a0,
a1,
a2,
a3,
a4
)
{
if(a3==(void 0))
{
a3="";
}
if(a2==(void 0))
{
a2="";
}
if(a4==(void 0))
{
a4="";
}
if(a0==(void 0))
{
a0=true;
}
var a5=_getListName(this.shuttleName,a0);
if(a1==(void 0))
{
a1=document.forms[this.formName].elements[a5].length-1;
}
if(a1<0)
{
a1=0;
}
if(a1>document.forms[this.formName].elements[a5].length-1)
{
a1=document.forms[this.formName].elements[a5].length-1;
}
var a6=document.forms[this.formName].elements[a5];
a6.options[a6.length]=
new Option(a6.options[a6.length-1].text,
a6.options[a6.length-1].value,
false,
false);
for(var a7=a6.length-1;a7>a1;a7--)
{
a6.options[a7].text=a6.options[a7-1].text;
a6.options[a7].value=a6.options[a7-1].value;
a6.options[a7].selected=a6.options[a7-1].selected;
}
a6.options[a1].text=a2;
a6.options[a1].value=a3;
a6.options[a1].selected=false;
var a8=_getDescArray(a5);
_addDescAtIndex(a8,a4,a1);
_makeList(this.formName,a5);
_navDirty=true;
}
function _deleteItemByValue(
a0,
a1
)
{
if(a1==(void 0))
{
return;
}
var a2=_getListName(this.shuttleName,a0);
var a3=document.forms[this.formName].elements[a2];
for(var a4=0;a4<a3.length-1;a4++)
{
var a5=a3.options[a4].value;
if(a5==a1)
{
var a6=_getDescArray(a2);
_deleteDescAtIndex(a6,a4);
_clearDescAreas(this.formName,a2);
a3.options[a4]=null;
_makeList(this.formName,a2);
_navDirty=true;
return;
}
}
}
function _deleteSelectedItems(
a0
)
{
if(a0==(void 0))
{
a0=true;
}
var a1=_getListName(this.shuttleName,a0);
var a2=document.forms[this.formName].elements[a1];
var a3=_getSelectedIndexes(this.formName,a1);
for(var a4=a3.length;a4>=0;a4--)
{
a2.options[a3[a4]]=null;
}
var a5=_getDescArray(a1);
_deleteDescAtIndexes(a5,a3);
_clearDescAreas(this.formName,a1);
_makeList(this.formName,a1);
_navDirty=true;
}

function RichTextEditorProxy(a0,a1,a2,a3,a4)
{
this.formName=a0;
this.beanId=a1+"_IFRAME";
this.dataBeanId=a1;
this.mode=a2;
this.maxLength=a3;
this.browserFlag=a4;
this.maxLengthAlertMsgStr="";
}
RichTextEditorProxy.prototype.onMouseOver=_onMouseOver;
RichTextEditorProxy.prototype.onMouseOut=_onMouseOut;
RichTextEditorProxy.prototype.onMouseDown=_onMouseDown;
RichTextEditorProxy.prototype.onMouseUp=_onMouseUp;
RichTextEditorProxy.prototype.createHyperlink=_createHyperlink;
RichTextEditorProxy.prototype.execHTMLCommand=_execHTMLCommand;
RichTextEditorProxy.prototype.getField=_getField;
RichTextEditorProxy.prototype.setFontBarDropdown=_setFontBarDropdown;
RichTextEditorProxy.prototype.insertHTMLTag=_insertHTMLTag;
RichTextEditorProxy.prototype.setContentOnBlur=_setContentOnBlur;
RichTextEditorProxy.prototype.insertText=_insertText;
RichTextEditorProxy.prototype.insertImageTag=_insertImageTag;
RichTextEditorProxy.prototype.setValue=_setValue;
RichTextEditorProxy.prototype.setHref=_setHref;
RichTextEditorProxy.prototype.viewHtmlSource=_viewHtmlSource;
RichTextEditorProxy.prototype.disableFontDropDowns=_disableFontDropDowns;
RichTextEditorProxy.prototype.checkRTEDataLength=_checkRTEDataLength;
RichTextEditorProxy.prototype.validateContent=_validateContent;
RichTextEditorProxy.prototype.setMaxLengthAlert=_setMaxLengthAlert;
RichTextEditorProxy.prototype.getMaxLengthAlert=_getMaxLengthAlert;
function _onMouseOver()
{
if(window.getSelection){
this.style.border="outset 2px";
}
else if(document.selection)
{
var a0=getReal(window.event.toElement,"className",this.className);
var a1=getReal(window.event.fromElement,"className",this.className);
if(a0==a1)return;
var a2=a0;
var a3=a2.getAttribute("cDisabled");
a3=(a3!=null);
if(a2.className==this.className)
a2.onselectstart=new Function("return false");
if((a2.className==this.className)&&!a3)
{
makeRaised(a2);
}
}
}
function _onMouseOut()
{
if(window.getSelection)
{
this.style.border="solid 2px #C0C0C0";
}
else if(document.selection)
{
var a0=getReal(window.event.toElement,"className",this.className);
var a1=getReal(window.event.fromElement,"className",this.className);
if(a0==a1)
return;
var a2=a1;
var a3=a2.getAttribute("PressedEx");
var a4=a2.getAttribute("cDisabled");
a4=(a4!=null);
var a5=a2.getAttribute("cToggle");
toggle_disabled=(a5!=null);
if(a5&&a2.value||a3==true)
{
makePressed(a2);
}
else if((a2.className==this.className)&&!a4)
{
makeFlat(a2);
}
}
}
function _onMouseDown(a0)
{
if(window.getSelection)
{
this.firstChild.style.left=2;
this.firstChild.style.top=2;
this.style.border="inset 2px";
a0.preventDefault();
}
else if(document.selection)
{
el=getReal(window.event.srcElement,"className",this.className);
var a1=el.getAttribute("cDisabled");
a1=(a1!=null);
if((el.className==this.className)&&!a1)
{
makePressed(el);
}
}
}
function _onMouseUp()
{
if(window.getSelection)
{
this.firstChild.style.left=1;
this.firstChild.style.top=1;
this.style.border="outset 2px";
}
else if(document.selection)
{
el=getReal(window.event.srcElement,"className",this.className);
var a0=el.getAttribute("cDisabled");
a0=(a0!=null);
if((el.className==this.className)&&!a0)
{
makeRaised(el);
}
}
}
function getReal(el,type,value)
{
temp=el;
while((temp!=null)&&(temp.tagName!="BODY"))
{
if(eval("temp."+type)==value)
{
el=temp;
return el;
}
temp=temp.parentElement;
}
return el;
}
function makeFlat(a0)
{
with(a0.style)
{
background="";
border="0px solid";
padding="2px";
}
}
function makeRaised(a0)
{
with(a0.style)
{
borderLeft="1px solid #ffffff";
borderRight="1px solid #555533";
borderTop="1px solid #ffffff";
borderBottom="1px solid #555533";
padding="1px";
}
}
function makePressed(a0)
{
with(a0.style)
{
borderLeft="1px solid #555533";
borderRight="1px solid #ffffff";
borderTop="1px solid #555533";
borderBottom="1px solid #ffffff";
paddingTop="2px";
paddingLeft="2px";
paddingBottom="0px";
paddingRight="0px";
}
}
function _createHyperlink(a0)
{
if(this.mode=="TEXT_MODE")
return;
var a1=document.getElementById(this.beanId).contentWindow;
if(this.browserFlag=="Mozilla")
{
var a2=prompt(a0,anchor?anchor.href:"http://");
if((a2!=null)&&(a2!="")&&a2!="http://")
{
a1.document.execCommand("CreateLink",false,a2);
}
}
else
{
a1.focus();
var a3=a1.document.selection;
var a4=a3.type;
var a5;
if(a4=="Control")
{
a5=a3.createRange().item(0);
}
else
{
a5=a3.createRange().parentElement();
}
var a6=getNode("A",a5);
var a2=prompt(a0,a6?a6.href:"http://");
if(a2&&a2!="http://")
{
if(a4=="None")
{
var a7=a3.createRange();
a7.pasteHTML('<A HREF="'+a2+'"></A>');
a7.select();
}
else
{
this.execHTMLCommand("CreateLink",a2);
}
}
}
}
function getNode(a0,a1)
{
while(a1&&a1.tagName!=a0)
{
a1=a1.parentElement;
}
return a1;
}
function _execHTMLCommand(a0)
{
if(this.mode=="TEXT_MODE")
return;
var a1=document.getElementById(this.beanId).contentWindow;
var a2=a1.document;
if(this.browserFlag=="Mozilla")
{
a2.execCommand('useCSS',false,true);
}
a1.focus();
a2.execCommand(a0,false,arguments[1]);
a1.focus();
}
function _setFontBarDropdown(a0,a1)
{
var a2=this.getField(a0);
this.execHTMLCommand(a1,a2.options[a2.selectedIndex].value);
}
function _insertHTMLTag(a0)
{
if(this.mode=="TEXT_MODE")
return;
var a1=document.getElementById(this.beanId).contentWindow;
if(this.browserFlag=="IE_Win")
{
a1.focus();
var a2=a1.document.selection.createRange();
a2.pasteHTML(a0);
a2.select();
a1.focus();
}
else if(this.browserFlag=="Mozilla")
{
var a3=a1.getSelection();
var a2=a3.getRangeAt(0);
a3.removeAllRanges();
a2.deleteContents();
var a4=a2.startContainer;
var a5=a2.startOffset;
a2=document.createRange();
var a6=a4;
a4=a6.parentNode;
var a7=a6.nodeValue;
var a8=a7.substr(0,a5);
var a9=a7.substr(a5);
var a10=document.createTextNode(a8);
var a11=document.createTextNode(a9);
a4.insertBefore(a11,a6);
var a12=document.createElement(a0);
a4.insertBefore(a12,a11);
a4.insertBefore(a10,a12);
a4.removeChild(a6);
}
}
function _insertText(a0)
{
var a1=document.getElementById(this.beanId).contentWindow;
if(this.browserFlag=="IE_Win")
{
a1.focus();
var a2=a1.document.selection.createRange();
a2.text=a0;
a2.select();
a1.focus();
}
else if(this.browserFlag=="Mozilla")
{
var a3=a1.getSelection();
var a2=a3.getRangeAt(0);
a3.removeAllRanges();
a2.deleteContents();
var a4=a2.startContainer;
var a5=a2.startOffset;
a2=document.createRange();
a4.insertData(a5,a0);
a2.setEnd(a4,a5+a0.length);
a2.setStart(a4,a5+a0.length);
a3.addRange(a2);
}
else
{
var a6=this.getField(this.dataBeanId);
a6.value=a6.value+" "+a0;
}
}
function _getField(p_strObjName)
{
var obj=eval("document.forms[this.formName].elements['"+p_strObjName+"']");
return obj;
}
function _validateContent()
{
this.setContentOnBlur();
return this.checkRTEDataLength();
}
function _setContentOnBlur()
{
var a0=document.forms[this.formName].elements;
for(i=0;i<a0.length;i++)
{
var a1=a0[i].name;
if(a1==this.dataBeanId)
{
var a2=a0[i];
if(document.getElementById(this.beanId).contentWindow!=undefined)
{
if(this.mode=="TEXT_MODE")
a2.value=document.getElementById(this.beanId).contentWindow.document.body.innerText;
else
a2.value=document.getElementById(this.beanId).contentWindow.document.body.innerHTML;
}
}
}
return true;
}
function _insertImageTag(a0)
{
if(this.mode=="TEXT_MODE")
return;
if(this.browserFlag=="IE_Win")
{
document.getElementById(this.beanId).contentWindow.focus();
if(document.getElementById(this.beanId).contentWindow.document.selection.type!="None")
{
var a1=document.getElementById(this.beanId).contentWindow.document.selection.createRange().parentElement();
}
var a1=document.getElementById(this.beanId).contentWindow.document.selection.createRange().parentElement();
var a2=getNode("IMG",a1);
if(a0&&a0!="http://")
{
if(document.getElementById(this.beanId).contentWindow.document.selection.type=="None")
{
var a3=document.getElementById(this.beanId).contentWindow.document.selection.createRange();
a3.pasteHTML('<IMG SRC="'+a0+'">');
a3.select();
}
else
{
this.execHTMLCommand("insertImage",a0);
}
}
}
else if(this.browserFlag=="Mozilla")
{
if((a0!=null)
&&(a0!="")
&&a0!="http://")
{
document.getElementById(this.beanId).contentWindow.document.execCommand('InsertImage',false,a0);
}
}
}
function _setValue(a0)
{
if((this.browserFlag=="Mozilla")||(this.browserFlag=="IE_Win"))
{
document.getElementById(this.beanId).contentWindow.focus();
if(this.mode=="TEXT_MODE")
document.getElementById(this.beanId).contentWindow.document.body.innerText=a0;
else
document.getElementById(this.beanId).contentWindow.document.body.innerHTML=a0;
document.getElementById(this.beanId).contentWindow.focus();
}
else
{
var a1=this.getField(this.dataBeanId);
a1.value=a0;
}
}
function _setHref(a0)
{
if(this.mode=="TEXT_MODE")
return;
var a1=document.getElementById(this.beanId).contentWindow;
if(this.browserFlag=="IE_Win")
{
a1.focus();
var a2=a1.document.selection;
if(a2.type=="None")
{
var a3=a2.createRange();
a3.pasteHTML('<A HREF="'+a0+'"></A>');
a3.select();
}
else
{
this.execHTMLCommand("CreateLink",a0);
}
}
else if(this.browserFlag=="Mozilla")
{
a1.document.execCommand("CreateLink",false,a0);
}
}
function _viewHtmlSource(a0)
{
var a1=document.getElementById(this.beanId).contentWindow.document.body;
if(a0)
{
this.disableFontDropDowns(true);
this.mode="TEXT_MODE";
if(this.browserFlag=="IE_Win")
{
a1.innerText=a1.innerHTML;
}
else
{
var a2=document.createTextNode(a1.innerHTML);
a1.innerHTML="";
a1.appendChild(a2);
}
}
else
{
this.disableFontDropDowns(false);
this.mode="RICH_TEXT_MODE";
if(this.browserFlag=="IE_Win")
{
a1.innerHTML=a1.innerText;
}
else
{
var a2=a1.ownerDocument.createRange();
a2.selectNodeContents(a1);
a1.innerHTML=a2.toString();
}
}
document.getElementById(this.beanId).contentWindow.focus();
}
function _disableFontDropDowns(a0)
{
var a1=this.getField(this.dataBeanId+'fontFamily');
if(a1!=null)
a1.disabled=a0;
var a2=this.getField(this.dataBeanId+'fontColor');
if(a2!=null)
a2.disabled=a0;
var a3=this.getField(this.dataBeanId+'fontWeight');
if(a3!=null)
a3.disabled=a0;
}
function _checkRTEDataLength()
{
if(this.maxLength==-1)
return true;
if(this.mode=="TEXT_MODE")
data=document.getElementById(this.beanId).contentWindow.document.body.innerText;
else
data=document.getElementById(this.beanId).contentWindow.document.body.innerHTML;
dataLength=data.length;
if(dataLength>this.maxLength)
{
return false;
}
if(dataLength<this.maxLength)
return true;
if(dataLength==this.maxLength)
return true;
return false;
}
function _setMaxLengthAlert(a0)
{
this.maxLengthAlertMsgStr=a0;
}
function _getMaxLengthAlert()
{
return this.maxLengthAlertMsgStr;
}
