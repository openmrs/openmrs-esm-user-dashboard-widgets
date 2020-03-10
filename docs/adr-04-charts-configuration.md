# Chart Configuration

Date: 21-October-2019

## Status

Proposed

## Context

Each chart widget needs to be configured in dashbaord configurations. It can not be very generic as it will be too hard for the implementers to configure the widgets.

## Decision

Below is the configuration template for charts.

```
{
    ...

    "contents": [
        {
            ...

            "properties": {

                "title": "My Reports", // title of the chart widget
                //supports multiple charts
                "charts": [
                    {
                        "url": "/ws/reporting/random-chart-id/",  // url of the source for chart
                        "name": "No. of HSU per month", // name of the chart
                        "sourcePath": "data.rows", // source path of from resultset
                        "xAxis": "duration", // field name which should be taken as source for x-axis of chart
                        "yAxis": "no-of-registrations", // field name which should be taken as source for y-axis of chart
                        "type": "LineChart" // type of the chart ex. Line chart
                    }
                ]
            }
        }
    ]
}
```

### Multiple Line Chart Configuration

```
{
    ...
    "contents": [
        {
            ...
            "properties": {
                ...
                "charts": [
                    {
                        ...
                        yAxis: [
                            {
                                "field":"no-of-registrations",// field name which should be taken as source for y-axis of chart
                                "color":"#00ff00"// color for the yAxis line of chart
                            },
                            ...
                        ]
                    }
                ]
            }
        }
    ]
}
```

## Consequences

- It supports simple chart layout for now.
