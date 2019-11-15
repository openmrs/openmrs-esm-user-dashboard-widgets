import { openmrsFetch } from "@openmrs/esm-api";
import React, { useEffect, useState } from "react";
import { useInterval } from "react-use";

import WidgetFooter from "../commons/widget-footer/widget-footer.component";
import WidgetHeader from "../commons/widget-header/widget-header.component";
import RefAppGrid from "../refapp-grid/refapp-grid.component";

import { Trans } from "react-i18next";
import { todo as constants } from "../constants.json";
import { CommonWidgetProps, LoadingStatus } from "../models";
import { initI18n } from "../utils/translations";
import { compose } from "../utils";

import globalStyles from "../global.css";
import getTodoColumns from "./columns";
import resources from "./translations/index";

export default function Todo(props: TodoProps) {
  initI18n(resources, props.locale, useEffect);
  const [todos, setTodos] = useState(null);
  const [currentRefreshInterval, setCurrentRefreshInterval] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(LoadingStatus.Loading);

  const secondInMilliSeconds = 1000;
  const max_limit = constants.MAX_TODOS_LIST;

  const {
    limit = max_limit,
    sourceApi = "",
    refreshInterval = 0,
    title = null
  } = props;

  useEffect(() => {
    fetchTodos();
  }, []);

  useInterval(() => fetchTodos(), currentRefreshInterval);

  const getRefreshInterval = () =>
    refreshInterval > 0 ? refreshInterval : constants.DEFAULT_REFRESH_INTERVAL;
  const disableRefreshTodoTimer = () => setCurrentRefreshInterval(null);
  const enableRefreshTodoTimer = () =>
    setCurrentRefreshInterval(secondInMilliSeconds * getRefreshInterval());

  const fetchTodos = () => {
    disableRefreshTodoTimer();
    openmrsFetch(sourceApi)
      .then(response => {
        compose(enableRefreshTodoTimer, setTodos, sortTodos)(response.data);
        setLoadingStatus(LoadingStatus.Loaded);
      })
      .catch(error => {
        setLoadingStatus(LoadingStatus.Failed);
        console.log(error); // eslint-disable-line
      });
  };

  const sortTodos = fetchTodos => {
    const compareTodo = (current, next) =>
      current[constants.SORT_BY] - next[constants.SORT_BY];

    return fetchTodos.sort(compareTodo);
  };

  const limitListByCount = (items, limit) => {
    return limit > 0 ? items.slice(0, limit) : items;
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
      <div className={globalStyles["widget-container"]}>
        <WidgetHeader
          title={title}
          totalCount={todos.length}
          icon="svg-icon icon-todo"
        ></WidgetHeader>
        <div className={globalStyles["widget-content"]}>
          <RefAppGrid
            data={limitListByCount(todos, limit)}
            columns={getTodoColumns()}
            noDataText="No Todo Actions"
          ></RefAppGrid>
        </div>
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
  refreshInterval?: number;
};
