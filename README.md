# User Dashboard Widgets

ESM Package serves widgets for OpenMRS Dashboard Engine.

## Available Widgets

- Todo

- Appointment

- Charts

## Pre-Requesties

NodeJS

## How to Setup?

- Run `npm install` to install all the dependencies

- Run `npm start -- --https --port 8082` to start application in dev mode.

- If you are using with OpenMRS Micro Frontend, update/add the port:url in `import-map.json` file of `openmrs-esm-root-config`.

- Run `npm run build` for production build.

## Chart Widget

- It renders charts based on the configuration specified in the `dashboard-config` files .

- Sample Configuration (should be specified in a config file, Eg: dashboard-config/poprofessional.json in the chart specific object of the `contents` array ):

```

"properties": {

"title": "Reports",

"charts": [

{

"url": "<report-url>",

"name": "<report name>",

"sourcePath": "<(Eg:dataSets.metadata.rows)>",

"xAxis": "<x-axis label as in Sample report data>",

"yAxis": "<y-axis label as in Sample report data>",

"type": "<chart-type (Eg: LineChart)>"

}

]

}

```

- Sample Report Data from URL:

```

{
	dataSets:{
		metadata:{
			rows:{
				{
					<x-axis-label>:<some-data>,
					<y-axis-label>:<some-numeric-data>
				},
				...
			],
			...
		},
	...
},
...
}

```

- Supported Chart Types:

      	- LineChart
