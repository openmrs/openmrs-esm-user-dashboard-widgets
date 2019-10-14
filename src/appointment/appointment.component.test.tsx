import React from "react";
import Appointment from "./appointment.component";
import { render, cleanup, waitForElement } from "@testing-library/react";

import { setErrorFilter } from "../utils/index";
import mockEsmAPI from "@openmrs/esm-api";

jest.mock("@openmrs/esm-api", () => ({
  openmrsFetch: jest.fn().mockResolvedValueOnce({})
}));

describe(`<Appointment />`, () => {
  const commonWidgetProps = { language: "en" };
  const originalError = console.error;
  const mockAppointments = [
    {
      startDateTime: 1571013348404,
      service: {
        durationMins: 20,
        color: "red",
        name: "test service"
      },
      patient: {
        name: "test patient",
        identifier: "PID-1234"
      }
    }
  ];

  beforeEach(() => {
    setErrorFilter(originalError, /Warning.*not wrapped in act/);
  });

  afterEach(() => {
    mockEsmAPI.openmrsFetch.mockReset();
    cleanup();
  });

  afterAll(() => {
    console.error = originalError;
  });

  it(`should show loading component initially`, () => {
    mockEsmAPI.openmrsFetch.mockResolvedValueOnce({});
    const { getByText } = render(
      <Appointment sourceApi="" {...commonWidgetProps} />
    );
    expect(getByText("Loading...")).toBeTruthy();
  });

  it(`should show header component`, done => {
    mockEsmAPI.openmrsFetch.mockResolvedValueOnce({ data: mockAppointments });
    const { getByText } = render(
      <Appointment
        sourceApi=""
        {...commonWidgetProps}
        title="Today's Appointments"
      />
    );

    waitForElement(() => getByText("Today's Appointments")).then(() => {
      expect(getByText("Today's Appointments")).not.toBeNull();
      done();
    });
  });

  it(`should show grid with given appointments data`, done => {
    mockEsmAPI.openmrsFetch.mockResolvedValueOnce({ data: mockAppointments });
    const { getByText } = render(
      <Appointment
        sourceApi=""
        {...commonWidgetProps}
        title="Today's Appointments"
      />
    );

    waitForElement(() => getByText("Today's Appointments")).then(() => {
      expect(getByText("06:05 AM")).toBeTruthy();
      expect(getByText("20 mins")).toBeTruthy();
      expect(getByText("test service")).toBeTruthy();
      expect(getByText("test patient")).toBeTruthy();
      expect(getByText("PID-1234")).toBeTruthy();
      done();
    });
  });
});
