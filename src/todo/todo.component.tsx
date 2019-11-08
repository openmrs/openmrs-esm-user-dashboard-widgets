import { openmrsFetch } from "@openmrs/esm-api";
import React, { useEffect, useState } from "react";

import WidgetFooter from "../commons/widget-footer/widget-footer.component";
import WidgetHeader from "../commons/widget-header/widget-header.component";
import RefAppGrid from "../refapp-grid/refapp-grid.component";

import { Trans } from "react-i18next";
import { todo as constants } from "../constants.json";
import { CommonWidgetProps, LoadingStatus } from "../models";
import { initI18n } from "../utils/translations";
import { compose } from "../utils";

import getTodoColumns from "./columns";
import resources from "./translations/index";

export default function Todo(props: TodoProps) {
  initI18n(resources, props.locale, useEffect);

  const [todos, setTodos] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(LoadingStatus.Loading);

  const source = "/frontend/mockTodo.json";
  const max_limit = constants.max_todos_list;

  const { limit = max_limit, sourceApi = source } = props;

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    openmrsFetch(sourceApi)
      .then(response => {
        compose(
          setTodos,
          sortTodos
        )(response.data);
        setLoadingStatus(LoadingStatus.Loaded);
      })
      .catch(error => {
        setLoadingStatus(LoadingStatus.Failed);
        console.log(error); // eslint-disable-line
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

  const showLoading = () => (
    <div>
      <Trans>Loading</Trans>...
    </div>
  );

  const showError = () => (
    <div className="error">
      <Trans>Unable to load todo's</Trans>
    </div>
  );

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

  switch (loadingStatus) {
    case LoadingStatus.Loaded:
      return showGrid();
    case LoadingStatus.Failed:
      return showError();
    default:
      return showLoading();
  }
}

type TodoProps = CommonWidgetProps & {
  sourceApi: string;
  viewAll?: string;
  limit?: number;
};
