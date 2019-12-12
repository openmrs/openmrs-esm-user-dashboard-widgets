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
          valueAccessor: todo => getServiceCategoryColour(todo)
        },
        {
          id: "serviceCategory",
          type: "label",
          styles: "sub-text",
          valueAccessor: todo => getServiceCategoryName(todo)
        }
      ]
    }
  ]
};

const getAttributeByName = (todo, attributeTypeValue) => {
  return todo.attributes.find(
    attribute => attribute.attributeType == attributeTypeValue
  );
};

const getTodoDate = todo => {
  if (todo.type === "PRINT_CONSENT") {
    return todo.dateCreated;
  }
  const appointmentAttribute = getAttributeByName(todo, "Appointment");
  return appointmentAttribute ? appointmentAttribute.value.date : "";
};

const getServiceCategory = todo => {
  if (!todo.attributes || todo.attributes.length === 0) {
    return "";
  }

  const serviceCategoryAttributeName =
    todo.type === "PRINT_CONSENT" ? "Service Category" : "Appointment";

  const serviceCategory = getAttributeByName(
    todo,
    serviceCategoryAttributeName
  );

  return serviceCategory ? serviceCategory.value : "";
};

const getServiceCategoryColour = todo => {
  const serviceCategoryValue = getServiceCategory(todo);
  return serviceCategoryValue.service
    ? serviceCategoryValue.service.colour
    : "";
};

const getServiceCategoryName = todo => {
  const serviceCategoryValue = getServiceCategory(todo);
  return serviceCategoryValue.service
    ? serviceCategoryValue.service.name
    : serviceCategoryValue.name;
};
