import React, { useEffect, useState } from "react";
import { useInterval } from "react-use";

import WidgetFooter from "../commons/widget-footer/widget-footer.component";
import WidgetHeader from "../commons/widget-header/widget-header.component";
import RefAppGrid from "../refapp-grid/refapp-grid.component";

import { Trans } from "react-i18next";
import resources from "./translations/index";
import { initI18n } from "../utils/translations";

import { todo as constants } from "../constants.json";
import { LoadingStatus } from "../models";
import { TodoProps } from "./todo.model";
import { getTodos } from "./todo.resource";
import getTodoColumns from "./columns";
import { compose } from "../utils";

import globalStyles from "../global.css";

export default function Todo(props: TodoProps) {
  initI18n(resources, props.locale, useEffect);
  const [todos, setTodos] = useState(null);
  const [currentRefreshInterval, setCurrentRefreshInterval] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(LoadingStatus.Loading);

  const secondInMilliSeconds = 1000;
  const {
    source,
    refreshInterval = 0,
    title = "My To do's",
    showMessage
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
    getTodos(source)
      .then(response => {
        compose(enableRefreshTodoTimer, setTodos, sortTodos)(response.data);
        setLoadingStatus(LoadingStatus.Loaded);
      })
      .catch(error => {
        setLoadingStatus(LoadingStatus.Failed);
        console.log(error); // eslint-disable-line
      });
  };

  const sortTodos = todos => {
    const compareTodo = (current, next) =>
      current[constants.SORT_BY] - next[constants.SORT_BY];

    return todos.sort(compareTodo);
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

  const showGrid = () => (
    <div className={`${globalStyles["widget-content"]} widget-content`}>
      <RefAppGrid
        data={limitListByCount(
          todos,
          source.limit ? source.limit : constants.MAX_TODOS_LIST
        )}
        columns={getTodoColumns(fetchTodos, showMessage, source.url)}
        noDataText="No Todo Actions"
      ></RefAppGrid>
    </div>
  );
  const showWidget = () => {
    return (
      <div className={`${globalStyles["widget-container"]} todos`}>
        <WidgetHeader
          title={title}
          totalCount={todos ? todos.length : 0}
          icon="svg-icon icon-todo"
        ></WidgetHeader>
        {loadingStatus === LoadingStatus.Loaded ? showGrid() : showError()}
        <WidgetFooter
          viewAllUrl={
            todos && todos.length > source.limit ? props.viewAll : null
          }
        ></WidgetFooter>
      </div>
    );
  };

  return loadingStatus === LoadingStatus.Loading ? showLoading() : showWidget();
}
