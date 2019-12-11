import Todo from "./todo.component";

export default {
  columns: [
    {
      cells: [
        {
          type: "label",
          styles: "highlight todo-date",
          valueAccessor: todo => getTodoDate(todo),
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
      styles: "center",
      cells: [
        {
          id: "serviceCategoryColour",
          type: "colorCircle",
          styles: "sub-text",
          valueAccessor: todo => {
            let serviceCategoryValue = getServiceCategory(todo);
            return serviceCategoryValue.service
              ? serviceCategoryValue.service.colour
              : "";
          }
        },
        {
          id: "serviceCategory",
          type: "label",
          styles: "sub-text",
          valueAccessor: todo => {
            let serviceCategoryValue = getServiceCategory(todo);
            return serviceCategoryValue.service
              ? serviceCategoryValue.service.name
              : serviceCategoryValue.name;
          }
        }
      ]
    }
  ]
};

const getAttributeByName = (todo, attributeTypeValue) => {
  return todo.attributes.filter(
    attribute => attribute.attributeType == attributeTypeValue
  );
};

const getTodoDate = todo => {
  switch (todo.type) {
    case "PRINT_CONSENT":
      return todo.dateCreated;
    case "APPOINTMENT_CONFIRM":
      let attribute = getAttributeByName(todo, "Appointment");

      if (!attribute || attribute.length === 0) return "";

      return attribute[0].value.date;
    default:
      return "";
  }
};

const getServiceCategory = todo => {
  if (!todo.attributes || todo.attributes.length === 0) {
    return "";
  }

  let attribute;
  switch (todo.type) {
    case "PRINT_CONSENT":
      attribute = getAttributeByName(todo, "Service Category");
      break;
    case "APPOINTMENT_CONFIRM":
      attribute = getAttributeByName(todo, "Appointment");
      break;
    default:
      attribute = "";
  }

  if (!attribute || attribute.length === 0) {
    return "";
  }

  return attribute[0].value;
};
