export default {
  columns: [
    {
      cells: [
        {
          type: "label",
          styles: "highlight",
          valueAccessor: "startDateTime",
          formatter: "convertToTime",
          showDateFormatter: "convertToDayMonth"
        },
        {
          type: "label",
          styles: "sub-text",
          valueAccessor: "startDateTime",
          formatter: {
            name: "differenceInMins",
            args: ["endDateTime"]
          },
          showDateFormatter: "convertToTime"
        }
      ]
    },
    {
      cells: [
        {
          type: "label",
          styles: "regular",
          valueAccessor: "patient.name"
        },
        {
          type: "label",
          styles: "sub-text",
          valueAccessor: "patient.identifier"
        }
      ]
    },
    {
      styles: "center",
      cells: [
        {
          type: "colorCircle",
          valueAccessor: "service.color"
        },
        {
          type: "label",
          styles: "sub-text",
          valueAccessor: "service.name"
        }
      ]
    }
  ]
};
