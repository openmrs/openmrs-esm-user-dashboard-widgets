export default {
  columns: [
    {
      cells: [
        {
          type: "label",
          styles: "highlight todo-date",
          valueAccessor: "dateCreated",
          formatter: "convertToDayMonth"
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
      cells: [
        {
          id: "serviceCategory",
          type: "label",
          styles: "sub-text",
          valueAccessor: todo => {
            return todo.attributes.filter(
              attribute => attribute.attributeType == "Concept"
            )[0].value.name;
          }
        }
      ]
    }
  ]
};
