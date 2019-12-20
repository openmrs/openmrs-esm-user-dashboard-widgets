import React from "react";
import Appointment from "./appointment.component";
import { cleanup, render, waitForElement } from "@testing-library/react";
import MockDate from "mockdate";

import { setErrorFilter } from "../utils/index";
import mockEsmAPI from "@openmrs/esm-api";
import { useInterval as mockUseInterval } from "react-use";

const componentTitleRegex = /^Today's Appointments/;
const componentTitle = "Today's Appointments";

jest.mock("@openmrs/esm-api", () => ({
  openmrsFetch: jest.fn()
}));

jest.mock("react-use", () => ({
  useInterval: jest.fn()
}));

describe(`<Appointment />`, () => {
  const commonWidgetProps = { locale: "en" };
  const originalError = console.error;
  const mockStartDateTime = new Date(new Date().setHours(10)).setMinutes(30);
  const mockEndDateTime = new Date(new Date().setHours(11)).setMinutes(0);

  const mockAppointments = [
    {
      startDateTime: mockStartDateTime,
      service: {
        durationMins: 20,
        color: "red",
        name: "test service"
      },
      patient: {
        name: "test patient",
        identifier: "PID-1234"
      },
      status: "Scheduled",
      endDateTime: mockEndDateTime
    }
  ];

  beforeEach(() => {
    setErrorFilter(originalError, /Warning.*not wrapped in act/);
  });

  afterEach(() => {
    mockEsmAPI.openmrsFetch.mockReset();
    cleanup();
    MockDate.reset();
  });

  afterAll(() => {
    console.error = originalError;
  });

  it(`should show loading component initially`, () => {
    mockEsmAPI.openmrsFetch.mockResolvedValueOnce({ data: mockAppointments });
    const { getByText } = render(
      <Appointment
        source={{ url: "" }}
        {...commonWidgetProps}
        showMessage={jest.fn()}
      />
    );
    expect(getByText("Loading...")).toBeTruthy();
  });

  it(`should show header component`, done => {
    mockEsmAPI.openmrsFetch.mockResolvedValueOnce({ data: mockAppointments });
    const { getByText } = render(
      <Appointment
        source={{ url: "" }}
        {...commonWidgetProps}
        title={componentTitle}
        showMessage={jest.fn()}
      />
    );

    waitForElement(() => getByText(componentTitleRegex)).then(() => {
      expect(getByText(componentTitleRegex)).not.toBeNull();
      done();
    });
  });

  it(`should show grid with fetched appointments data`, done => {
    mockEsmAPI.openmrsFetch.mockResolvedValueOnce({ data: mockAppointments });
    const { getByText } = render(
      <Appointment
        source={{ url: "", fetchType: "all" }}
        {...commonWidgetProps}
        title={componentTitle}
        showMessage={jest.fn()}
      />
    );

    waitForElement(() => getByText(componentTitleRegex)).then(() => {
      expect(getByText("10:30 AM")).toBeTruthy();
      expect(getByText("30 mins")).toBeTruthy();
      expect(getByText("test service")).toBeTruthy();
      expect(getByText("test patient")).toBeTruthy();
      expect(getByText("PID-1234")).toBeTruthy();

      expect(mockEsmAPI.openmrsFetch.mock.calls[0][0]).toBe("/search");
      expect(mockEsmAPI.openmrsFetch.mock.calls[0][1].body.providerUuid).toBe(
        undefined
      );
      done();
    });
  });

  it(`should show checkedin label based on config`, done => {
    mockEsmAPI.openmrsFetch.mockResolvedValueOnce({
      data: [{ ...mockAppointments[0], ...{ status: "CheckedIn" } }]
    });
    const checkInConfig = [
      {
        name: "CheckIn",
        when: [
          {
            field: "status",
            values: ["Scheduled"]
          }
        ]
      }
    ];
    const { getByText } = render(
      <Appointment
        source={{ url: "" }}
        {...commonWidgetProps}
        actions={checkInConfig}
        title={componentTitle}
        showMessage={jest.fn()}
      />
    );

    waitForElement(() => getByText(componentTitleRegex)).then(() => {
      expect(getByText("Checked In")).toBeTruthy();
      done();
    });
  });

  it(`should refresh appointments when refresh interval laps`, done => {
    let refreshAppointments = null;
    mockEsmAPI.openmrsFetch.mockResolvedValueOnce({ data: mockAppointments });
    // @ts-ignore
    mockUseInterval.mockImplementationOnce(cb => (refreshAppointments = cb));

    const { getByText } = render(
      <Appointment
        source={{ url: "" }}
        {...commonWidgetProps}
        title={componentTitle}
        showMessage={jest.fn()}
      />
    );

    const appointmentsForRefresh = [
      {
        ...mockAppointments[0],
        patient: {
          name: "test patient - refreshed",
          identifier: "PID-1234"
        }
      }
    ];
    mockEsmAPI.openmrsFetch.mockResolvedValueOnce({
      data: appointmentsForRefresh
    });
    refreshAppointments();

    waitForElement(() => getByText(componentTitleRegex)).then(() => {
      expect(getByText("test patient - refreshed")).toBeTruthy();
      done();
    });
  });

  it(`should show grid with fetched appointments for provider`, done => {
    const mockedDate = new Date("2019-11-27T18:30:00.000");
    const mockedDateBeforeDelay = new Date("2019-11-27T18:10:00.000");
    MockDate.set(mockedDate);

    mockEsmAPI.openmrsFetch.mockResolvedValueOnce({ data: mockAppointments });
    const { getByText } = render(
      <Appointment
        source={{ url: "", fetchType: "self", fromTimeDelayInMinutes: 20 }}
        {...commonWidgetProps}
        title={componentTitle}
        showMessage={jest.fn()}
        provider="a1206f9f-7b59-46fb-ad6a-b00ca7e781c1"
      />
    );

    waitForElement(() => getByText(componentTitleRegex)).then(() => {
      expect(getByText("10:30 AM")).toBeTruthy();
      expect(getByText("30 mins")).toBeTruthy();
      expect(getByText("test service")).toBeTruthy();
      expect(getByText("test patient")).toBeTruthy();
      expect(getByText("PID-1234")).toBeTruthy();

      expect(mockEsmAPI.openmrsFetch.mock.calls[0][0]).toBe("/search");
      expect(mockEsmAPI.openmrsFetch.mock.calls[0][1].body.providerUuid).toBe(
        "a1206f9f-7b59-46fb-ad6a-b00ca7e781c1"
      );
      expect(mockEsmAPI.openmrsFetch.mock.calls[0][1].body.startDate).toBe(
        mockedDateBeforeDelay.toISOString()
      );

      expect(mockEsmAPI.openmrsFetch.mock.calls[0][1].body.endDate).toBe(
        new Date(mockedDate.setUTCHours(23, 59, 59, 9)).toISOString()
      );

      done();
    });
  });

  it(`should fetched appointments without enddate`, done => {
    const mockedDate = new Date("2019-11-27T18:30:00.000");
    MockDate.set(mockedDate);

    mockEsmAPI.openmrsFetch.mockResolvedValueOnce({ data: mockAppointments });
    const { getByText } = render(
      <Appointment
        source={{ url: "", showFutureAppointments: true }}
        {...commonWidgetProps}
        title={componentTitle}
        showMessage={jest.fn()}
      />
    );

    waitForElement(() => getByText(componentTitleRegex)).then(() => {
      expect(mockEsmAPI.openmrsFetch.mock.calls[0][0]).toBe("/search");
      expect(
        mockEsmAPI.openmrsFetch.mock.calls[0][1].body.startDate
      ).not.toBeUndefined();
      expect(
        mockEsmAPI.openmrsFetch.mock.calls[0][1].body.endDate
      ).toBeUndefined();
      done();
    });
  });
});
