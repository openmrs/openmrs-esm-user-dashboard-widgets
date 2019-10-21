import React, { useEffect } from "react";
import { Trans } from "react-i18next";

import resources from "./translations/index";
import { initI18n } from "../utils/translations";

import { CommonWidgetProps } from "../models/index";
import WidgetHeader from "../commons/widget-header/widget-header.component";

export default function Todo(props: TodoProps) {
  initI18n(resources, props.locale, useEffect);

  return (
    <div>
      <WidgetHeader title="My To Do's" icon="svg-icon icon-todo"></WidgetHeader>
      <h1>
        <Trans>Todo Widget</Trans>!!!
      </h1>
    </div>
  );
}

type TodoProps = CommonWidgetProps & {};
