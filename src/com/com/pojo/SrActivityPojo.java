package com.com.pojo;

import java.util.Map;

/**
 * Created by vvishnoi on 4/16/17.
 */
public class SrActivityPojo {

    private String srTitleDetails;
    private String component;
    private String subComponent;
    private String srNumber;
    private String owner;

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String getDateClosed() {
        return dateClosed;
    }

    public void setDateClosed(String dateClosed) {
        this.dateClosed = dateClosed;
    }

    private String dateClosed;

    public String getSrTitleDetails() {
        return srTitleDetails;
    }

    public void setSrTitleDetails(String srTitleDetails) {
        this.srTitleDetails = srTitleDetails;
    }

    public String getComponent() {
        return component;
    }

    public void setComponent(String component) {
        this.component = component;
    }

    public String getSubComponent() {
        return subComponent;
    }

    public void setSubComponent(String subComponent) {
        this.subComponent = subComponent;
    }

    public String getSrNumber() {
        return srNumber;
    }

    public void setSrNumber(String srNumber) {
        this.srNumber = srNumber;
    }

    public Map<String, String> getTableData() {
        return tableData;
    }

    public void setTableData(Map<String, String> tableData) {
        this.tableData = tableData;
    }

    private Map<String,String> tableData;

}
