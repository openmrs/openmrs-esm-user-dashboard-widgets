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
            if (!todo.attributes || todo.attributes.length === 0) {
              return "";
            }

            const consentTypeAttributes = todo.attributes.filter(
              attribute => attribute.attributeType == "Concept"
            );
            if (!consentTypeAttributes || consentTypeAttributes.length === 0) {
              return "";
            }

            return consentTypeAttributes[0].value.name;
          }
        }
      ]
    }
  ]
};
