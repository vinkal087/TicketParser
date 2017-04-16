package com.htmlutils;

import com.com.pojo.SrActivityPojo;
import org.apache.log4j.Logger;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;

/**
 * Created by vvishnoi on 4/9/17.
 */
public class ParseSRActivities {
    private static ResourceBundle bundle = ResourceBundle.getBundle("activities");
    final static Logger logger = Logger.getLogger(ParseSRActivities.class);

    public static void main(String[] args) throws Exception{
        //String path = "/Users/vvishnoi/Documents/work/projects/HtmlParserForSR/sampleFiles/closed SRs ffox/SR 3-14121648591-Invalid misc rec transact..-Linux x86 (Oracle Linux 5)-Oracle Receivables-Reports Issues (Aging Reports)-TRUE OIL LLC.htm";
        String path = "/Users/vvishnoi/Documents/work/projects/HtmlParserForSR/sampleFiles/closed SRs ffox/SR 3-14401996641-Multiplied Amounts on AR ..-Linux x86-64 (Oracle Linux 6)-Oracle Receivables-Reports Issues (Aging Reports)-KaMin LLC.htm";
        String content = new String(Files.readAllBytes(Paths.get(path)));
        Document doc = Jsoup.parse(content);

       // getHeaderDetails(doc);
       // parseSrActivity1(doc);
    }


    public static void processHtmlFile(String file, Map<String,Map<String,SrActivityPojo>> mainMap) throws Exception{
        String content = new String(Files.readAllBytes(Paths.get(file)));
        Document doc = Jsoup.parse(content);
        SrActivityPojo srPojo=new SrActivityPojo();
        srPojo.setTableData(new LinkedHashMap<String, String>());
        getHeaderDetails(doc,srPojo);
        List<String> activityList=Arrays.asList(bundle.getString("SR_FIRST_ACTIVITIES_LIST").split(","));
        parseSrActivity1(doc,activityList,srPojo.getTableData());
        activityList=Arrays.asList(bundle.getString("SR_SECOND_ACTIVITIES_LIST").split(","));
        parseSrActivity1(doc,activityList,srPojo.getTableData());
        /*if(!parseSrActivity1(doc,activityList,srPojo.getTableData())){
            activityList=Arrays.asList(bundle.getString("SR_SECOND_ACTIVITIES_LIST").split(","));
            parseSrActivity1(doc,activityList,srPojo.getTableData());
        }*/

        String htmlFileName = srPojo.getComponent()+" "+srPojo.getSubComponent()+".html";
        if(!mainMap.containsKey(htmlFileName)){
            mainMap.put(htmlFileName,new LinkedHashMap<String, SrActivityPojo>());
        }
        mainMap.get(htmlFileName).put(srPojo.getSrNumber(),srPojo);
    }

    private static boolean parseSrActivity1(Document doc, List<String> activityList, Map<String,String> mp) throws Exception{
        boolean activityPresent=false;
        Elements mainTableColumn = doc.select("#srActivity1");
        Elements mainDiv= mainTableColumn.select("#actionData");
        Elements tables = mainDiv.select("table");
        for(int i=0;i<tables.size();i++){
            Element table = tables.get(i);
            Elements rows =table.select("tr");
            for(int j=0;j<rows.size();j++){
                Element row = rows.get(j);
                activityPresent = activityPresent | parseActivity(row,activityList,mp);
            }
        }
        return activityPresent;
    }

    private static boolean parseActivity(Element row, List<String> activityList,Map<String,String > mp) throws Exception{
        Elements outerDiv = row.select(".activitydivClass");
        if(outerDiv.size()==0) return false;
        Elements titleBarNodeDivList= outerDiv.select("[dojoattachpoint=titleBarNode]");
        if(titleBarNodeDivList.size()==0)return false;
        Elements hideNodeDivList = outerDiv.select("[dojoattachpoint=hideNode]");
        if(hideNodeDivList.size()==0)return false;
        String title = title(titleBarNodeDivList.get(0));

        if(activityPresentInActivityList(title,activityList)==null)return false;
        String data = getData(hideNodeDivList.get(0));
        mp.put(activityPresentInActivityList(title,activityList),data);
        logger.info(title(titleBarNodeDivList.get(0)) +"\t"+ getData(hideNodeDivList.get(0)));
        return true;

    }

    private static String title(Element titleBarNode) throws Exception{
        Elements titleNodeDivList=titleBarNode.select("[dojoattachpoint=titleNode]");
        if(titleNodeDivList.size()==0)throw new Exception("No Title Found");
        return titleNodeDivList.get(0).text();
    }

    private static String getData(Element hideNodeDiv){
        if(hideNodeDiv.select("[dojoattachpoint=wipeNode]").size()==0) return "";
        Element wipeNodeDiv=hideNodeDiv.select("[dojoattachpoint=wipeNode]").get(0);
        if(wipeNodeDiv.select("[dojoattachpoint=containerNode]").size()==0) return "";
        Element containerNodeDiv=wipeNodeDiv.select("[dojoattachpoint=containerNode]").get(0);
        if(containerNodeDiv.select("div").size()==0) return "";
        Element containerNodeDivTextDiv = containerNodeDiv.child(1);
        return  containerNodeDivTextDiv.toString();
    }

    private static String activityPresentInActivityList(String title, List<String> activityList){
        for(String str: activityList){
            if(title.contains(str.trim())){
                return str.trim();
            }
        }
        return null;
    }

    private static void getHeaderDetails(Document doc, SrActivityPojo srPojo) throws Exception{
        Elements mainDiv = doc.select("#tab1");
        if(mainDiv.select("input[name=activeSrList]").size()==0)return;
        Element activeSrList=mainDiv.select("input[name=activeSrList]").get(0);
        String srNumber = activeSrList.attr("value");
        srPojo.setSrNumber(srNumber);
        logger.info(srNumber);

        Element srHeader = doc.select("#srHeader").first();
        String title = title(srHeader);
        srPojo.setSrTitleDetails(title);
        logger.info(title);

        String component = srHeader.select("input[name=componentDescription]").first().attr("value");
        srPojo.setComponent(component);
        logger.info(component);

        String subComponent = srHeader.select("input[name=subcomponentDescription]").first().attr("value");
        srPojo.setSubComponent(subComponent);
        logger.info(subComponent);

        String owner = srHeader.select("input[name=empEmail]").first().attr("value");
        srPojo.setOwner(owner);
        logger.info(owner);

        String dateClosed = srHeader.select("input[id=nextResponse]").first().attr("value");
        srPojo.setDateClosed(dateClosed);
        logger.info(dateClosed);

    }
}
