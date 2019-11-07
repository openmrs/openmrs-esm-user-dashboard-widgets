import { openmrsFetch } from "@openmrs/esm-api";
import React, { useEffect, useState } from "react";

import WidgetFooter from "../commons/widget-footer/widget-footer.component";
import WidgetHeader from "../commons/widget-header/widget-header.component";
import RefAppGrid from "../refapp-grid/refapp-grid.component";

import { todo as constants } from "../constants.json";
import { CommonWidgetProps } from "../models";
import { initI18n } from "../utils/translations";
import { compose } from "../utils";

import getTodoColumns from "./columns";
import resources from "./translations/index";

export default function Todo(props: TodoProps) {
  initI18n(resources, props.locale, useEffect);
  const [todos, setTodos] = useState(null);
  const source = "/frontend/mockTodo.json";
  const max_limit = constants.max_todos_list;
  const { limit = max_limit, sourceApi = source } = props;

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    openmrsFetch(sourceApi).then(response => {
      compose(
        setTodos,
        sortTodos
      )(response.data);
    });
  };

  const sortTodos = fetchTodos => {
    const compareTodo = (current, next) =>
      current[constants.sortBy] - next[constants.sortBy];

    return fetchTodos.sort(compareTodo);
  };

  const getTodoByLimit = () => {
    return limit > 0 ? todos.slice(0, limit) : todos;
  };

  const showLoading = () => <div>Loading...</div>;

  const showGrid = () => {
    return (
      <div>
        <WidgetHeader
          title={props.title}
          icon="svg-icon icon-todo"
        ></WidgetHeader>
        <RefAppGrid
          data={getTodoByLimit()}
          columns={getTodoColumns()}
        ></RefAppGrid>
        <WidgetFooter viewAllUrl={props.viewAll}></WidgetFooter>
      </div>
    );
  };
  return todos ? showGrid() : showLoading();
}

type TodoProps = CommonWidgetProps & {
  sourceApi: string;
  viewAll?: string;
  limit?: number;
};
