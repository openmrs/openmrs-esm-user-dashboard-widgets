# Report Configuration

Date: 10-march-2020

## Status

Proposed

## Context

Each report link widget needs to be configured in dashboard configurations.

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
                    "name": "Number of Session Individual / Group Per Month", // name of the report
                    "properties": {
                    "url": "/ws/reporting/random-report-id/",  // url of the source for report
                    "name": "Number of Session Individual / Group Per Month", // name to display
                    "sourcePath": "dataSets.0.rows",
                    "xAxis": "Number of Session Per Month",  // field name which should be taken as source for x-axis of chart
                    "yAxis": [
                        {
                        "field": "Individual",
                        "color": "#008000"
                        },
                        {
                        "field": "Group",
                        "color": "#4286f4"
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
            "name": "Number of Conformity for Finishing Validated / Refused Per Month",
            "properties":
                {
                "url": "/ws/reporting/random-report-id/",  // url of the source for report
                "name": "Number of Conformity for Finishing Validated / Refused Per Month",
                "sourcePath": "dataSets.0.rows",
                "columns": [
                    {
                    "header": "Duration", // column name of the table
                    "cells": [
                        {
                        "type": "label",
                        "styles": "regular",
                        "valueAccessor": "Number of Conformity for Finishing" // value should be shown in table
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
            "name": "Number of Conformity for Finishing Validated / Refused Per Month",
            "properties":
                {
                "url": "/ws/reporting/random-report-id/",  // url of the source for report
                "name": "Number of Conformity for Finishing Validated / Refused Per Month",
                "sourcePath": "dataSets.0.rows",
                "columns": [
                    "UL Prosthesis Validated",
                    "LL Prosthesis Validated",
                    ] // column names for the table which will show with default configuration.
                }
            }]
        }
    }]
}
```

## Consequences

- It supports simple chart and table layout.
