import React from "react";
import Appointment from "./appointment.component";
import { render, cleanup } from "@testing-library/react";

describe(`<Appointment />`, () => {
  const commonWidgetProps = { language: "en" };
  afterEach(() => {
    cleanup();
  });

  it(`renders Appointment without dying`, () => {
    render(<Appointment {...commonWidgetProps} />);
  });

  it(`should render header component`, () => {
    const { getByText } = render(<Appointment {...commonWidgetProps} />);
    expect(getByText("Today's Appointments")).toBeTruthy();
  });
});
