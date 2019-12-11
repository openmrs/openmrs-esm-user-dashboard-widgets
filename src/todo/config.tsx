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

const filterBasedOnAttributeType = (todo, attributeTypeValue) => {
  return todo.attributes.filter(
    attribute => attribute.attributeType == attributeTypeValue
  );
};

const getTodoDate = todo => {
  let displayDate;

  switch (todo.type) {
    case "PRINT_CONSENT":
      displayDate = todo.dateCreated;
      break;
    case "APPOINTMENT_CONFIRM":
      let attribute = filterBasedOnAttributeType(todo, "Appointment");

      if (!attribute || attribute.length === 0) displayDate = "";

      displayDate = attribute[0].value.date;
      break;
    default:
      displayDate = "";
  }

  return displayDate;
};

const getServiceCategory = todo => {
  if (!todo.attributes || todo.attributes.length === 0) {
    return "";
  }

  let attribute;
  switch (todo.type) {
    case "PRINT_CONSENT":
      attribute = filterBasedOnAttributeType(todo, "Service Category");
      break;
    case "APPOINTMENT_CONFIRM":
      attribute = filterBasedOnAttributeType(todo, "Appointment");
      break;
    default:
      attribute = "";
  }

  if (!attribute || attribute.length === 0) {
    return "";
  }

  return attribute[0].value;
};
