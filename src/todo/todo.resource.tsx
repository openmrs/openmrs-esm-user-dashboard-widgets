import { openmrsFetch } from "@openmrs/esm-api";

const markAsDoneUrl = (baseUrl: string, todoUuid: string) =>
  `${baseUrl}/${todoUuid}/complete`;

export const getTodos = source =>
  openmrsFetch(`${source.url}?completed=${source.showDone ? "true" : "false"}`);

export const markTodoAsDone = (todo, baseUrl: string) => {
  const options = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    }
  };

  return openmrsFetch(markAsDoneUrl(baseUrl, todo.uuid), options);
};
