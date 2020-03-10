# Report Configuration

Date: 10-march-2020

## Status

Proposed

## Context

Each report link widget needs to be configured in dashboard configurations. It will show report data in chart or table in a popup window when a report link is clicked.

## Decision

Below is the configuration template for report.

### Chart configuration for a report link

```
{
    ...

    "contents": [
        {
            ...

            "properties": {
                "title": "My Reports", // title of the report widget
                //supports multiple reports
                "reports": [
                {
                    "name": "report link name", // name of the report
                    "properties": {
                    "url": "/ws/reporting/random-report-id/",  // url of the source for report
                    "name": "report link name ", // name to display
                    "sourcePath": "dataSets.0.rows",
                    "xAxis": "test-data",  // field name which should be taken as source for x-axis of chart
                    "yAxis": [
                        {
                        "field": "count",
                        "color": "#008000"
                        } // field name which should be taken as source for y-axis of chart
                    ],
                    "type": "LineChart" // type of the chart ex. Line chart
                    },
                    "type": "Chart" // type of the report modal ex. Chart
                }
            ]
        }
    }]
}
```

### Table configuration for a report link

```
{
    ...

    "contents": [
        {
            ...

            "properties": {
                "title": "My Reports", // title of the report widget
                //supports multiple reports
                "reports": [
            {
            "name": "report link name", // name of the report
            "properties":
                {
                "url": "/ws/reporting/random-report-id/",  // url of the source for report
                "name": "report link name", // name of the report
                "sourcePath": "dataSets.0.rows",
                "columns": [
                    {
                    "header": "header name", // column name of the table
                    "cells": [
                        {
                        "type": "label",
                        "styles": "regular",
                        "valueAccessor": "column name" // value should be shown in table
                        }]
                    }]
                }
            }]
        }
    }]
}
```

### Table configuration for a report link with report name only

```
{
    ...

    "contents": [
        {
            ...

            "properties": {
                "title": "My Reports", // title of the report widget
                //supports multiple reports
                "reports": [
            {
            "name": "report link name", // name of the report
            "properties":
                {
                "url": "/ws/reporting/random-report-id/",  // url of the source for report
                "name": "report link name", // name of the report
                "sourcePath": "dataSets.0.rows",
                "columns": [
                    "first column",
                    "second column",
                    ] // column names for the table which will show with default configuration.
                }
            }]
        }
    }]
}
```
