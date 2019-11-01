# Appointment Configuration

Date: 21-October-2019

## Status

Proposed

## Context

Each appointment widget needs to be configured in dashbaord configurations. It can not be very generic as it will be too hard for the implementers to configure the widgets.

## Decision

Below is the configuration template for appointments.

```
{
    ...

    "contents": [
        {
            ...

            "properties": {
                "title": "Today's Appointments",  // Title of the appointment widget
                "source": "/ws/rest/v1/appointments", // source base url for appointments
                "refreshInterval": 60, // interval in seconds to refresh appointments
                // any data fileter which needs to be applied on the source data after fetching
                "filters": [
                    {
                        "field": "status",
                        "values": ["Scheduled", "CheckedIn"]
                    }
                ],
                // action buttons need to be shown
                "actions": [
                    {
                        "name": "CheckIn", // Name of the action
                        "when": [ // when this action button needs to be shown, else status field will be shown
                            {
                                "field": "status",
                                "values": ["Scheduled"]
                            }
                        ]
                    }
                ]
            }
        }
    ]
}
```

## Consequences

- Appointment widget is dependening on particular url format & result set.
- We may not be able to use with other appointment modules which does not support given url format & result set.
