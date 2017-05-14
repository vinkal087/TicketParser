package com.htmlutils;

import com.com.pojo.SrActivityPojo;
import j2html.tags.ContainerTag;
import j2html.tags.DomContent;
import org.apache.commons.io.FileUtils;
import org.apache.log4j.Logger;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.*;

import static j2html.TagCreator.*;

/**
 * Created by vvishnoi on 4/16/17.
 */
public class Main {

    final static Logger logger = Logger.getLogger(Main.class);
    public static void main(String[] args) throws Exception{
        //logger.info(generateTableHeaders());
        processDirectory("/Users/vvishnoi/Documents/work/projects/HtmlParserForSR/sampleFiles/closed SRs ffox","/Users/vvishnoi/Documents/work/projects/HtmlParserForSR/sampleFiles/generated");
    }
    private static ResourceBundle bundle = ResourceBundle.getBundle("activities");

    public  static void processDirectory(String source, String destination) throws Exception{
        logger.info("Processing Directory:"+source);
        File folder = new File(source);
        File[] listOfFiles = folder.listFiles();

        Map<String,Map<String,SrActivityPojo>> mainMap = new LinkedHashMap<>();

        for (int i = 0; i < listOfFiles.length; i++) {
            if (listOfFiles[i].isFile() ) {
                if(listOfFiles[i].getName().endsWith(".htm") ||  listOfFiles[i].getName().endsWith(".html")){
                    logger.info("Processing File: "+listOfFiles[i].getName());
                    ParseSRActivities.processHtmlFile(listOfFiles[i].getAbsolutePath(),mainMap);
                }

            }
        }
        Map<String, String> htmlFileMap=generateHtmlTable(mainMap);
        createHtmlFiles(htmlFileMap,destination);
        copyCssToDest(destination);

    }

    private static Map<String,String> generateHtmlTable(Map<String,Map<String,SrActivityPojo>> mainMap){
        Iterator<String> fileNameKeys=mainMap.keySet().iterator();
        Map<String,String> htmlFileMap=new LinkedHashMap<>();
        while(fileNameKeys.hasNext()){
            String fileName=fileNameKeys.next();
            String htmlTable="<table>";
            Map<String,SrActivityPojo> mp=mainMap.get(fileName);
            Iterator<String> srNumbers = mp.keySet().iterator();
            htmlTable+=generateTableHeaders();
            while(srNumbers.hasNext()){
                String srNumber = srNumbers.next();
                SrActivityPojo srPojo=mp.get(srNumber);
                htmlTable+=generateTableRow(srPojo);
            }
            htmlTable+="</table>";
            logger.info(htmlTable);
            String list=generateSRHtmlList(mp);
            htmlFileMap.put(fileName,list+htmlTable);
        }
        return htmlFileMap;
    }

    private  static String generateTableHeaders(){
        List<String> activityList= Arrays.asList(bundle.getString("SR_FIRST_ACTIVITIES_LIST").split(","));
        DomContent[] arr=new  DomContent[activityList.size()+1];
        arr[0]=th("SR Details");
        for(int i=0;i<activityList.size();i++){
           arr[i+1]=th(activityList.get(i));
        }
       return tr().with(arr).render().trim();
    }

    private static String generateTableRow(SrActivityPojo srPojo){
        List<String> activityList= Arrays.asList(bundle.getString("SR_FIRST_ACTIVITIES_LIST").split(","));
        DomContent[] arr=new  DomContent[activityList.size()+1];

        arr[0]=td().with(getDomContentFromString(generateSrDetail(srPojo))).withId(srPojo.getSrNumber()).withStyle("max-width:250px;vertical-align: top;");
        for(int i=0;i<activityList.size();i++){
            String activityListId=activityList.get(i).replaceAll("[[^a-z,^A-Z]]*","");
            if(!srPojo.getTableData().containsKey(activityList.get(i))){
                if(activityList.get(i).equalsIgnoreCase("ODM Issue Clarification") && srPojo.getTableData().containsKey("ODM Question")){

                    arr[i + 1] = td().with(getDomContentForKey("ODM Question",srPojo.getTableData())).withId(activityListId);

                }
                else if(activityList.get(i).equalsIgnoreCase("ODM Solution/Action Plan") && srPojo.getTableData().containsKey("ODM Answer")){

                        arr[i + 1] = td().with(getDomContentForKey("ODM Answer",srPojo.getTableData())).withId(activityListId);

                }
                else {
                    arr[i + 1] = td().withId(activityListId);
                }
            }
            else {
                DomContent dom= getDomContentForKey(activityList.get(i),srPojo.getTableData());
                arr[i + 1] = td().with(dom).withId(activityListId);
            }
        }
        return
                tr().with(arr).withStyle("word-wrap: break-word;").render().trim();
    }

    private static String generateSrDetail(SrActivityPojo srPojo){
        String str="";
        str+=srPojo.getSrNumber()+"<br/>"+srPojo.getOwner()+"<br/>"+srPojo.getDateClosed();
        return str;
    }

    private static void createHtmlFiles(Map<String,String> htmlFileMap, String dest) throws Exception{
        Iterator<String> itr=htmlFileMap.keySet().iterator();
        while(itr.hasNext()){
            String fileName=itr.next();
            String fullPath = dest+"/"+fileName;
            BufferedWriter bw = new BufferedWriter(new FileWriter(fullPath));
            bw.write(htmlFileMap.get(fileName));
            bw.flush();
            if(bw!=null){
                bw.close();
            }
        }
    }

    private static String generateSRHtmlList(Map<String,SrActivityPojo> mp){
        Iterator<String> srNumbers = mp.keySet().iterator();
        String htmlHead="<html><head><link rel=\"stylesheet\" href=\"styles.css\"></head>";
        String html=htmlHead+"<ul>";

        while(srNumbers.hasNext()){
            String srNumber = srNumbers.next();
            SrActivityPojo srPojo=mp.get(srNumber);
            html+="<li><a href=\"#"+srNumber+"\">"+srPojo.getSrTitleDetails()+"</a></li>";

        }
        return html+"</ul></html>";
    }

    private static DomContent getDomContentForKey(String key, Map<String,String> mp){
        DomContent dom = new DomContent() {
            @Override
            public String render() {
                return mp.get(key);
            }
        };
        return dom;
    }

    private static DomContent getDomContentFromString(String str){
        DomContent dom = new DomContent() {
            @Override
            public String render() {
                return str;
            }
        };
        return dom;
    }

    private static void copyCssToDest(String destination){
        File source = new File("resources/styles.css");
        File destinationFile = new File(destination+"/styles.css");
        try {
            FileUtils.copyFile(source, destinationFile);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
