import React from "react";
import { cleanup } from "@testing-library/react";
import MockDate from "mockdate";
import mockEsmAPI from "@openmrs/esm-api";
import * as appointment from "./appointment.resource";

jest.mock("@openmrs/esm-api", () => ({
  openmrsFetch: jest.fn()
}));

jest.mock("react-use", () => ({
  useInterval: jest.fn()
}));

describe(`test appointment calls`, () => {
  const originalError = console.error;

  afterEach(() => {
    mockEsmAPI.openmrsFetch.mockReset();
    cleanup();
    MockDate.reset();
  });

  afterAll(() => {
    console.error = originalError;
  });

  it(`should call api to change appointment status `, () => {
    mockEsmAPI.openmrsFetch.mockResolvedValueOnce({});
    const statusToBeChangedTo = "statusToBeChangedTo";
    const appointmentId = "appointment-1";
    const baseURL = "foo";
    appointment
      .changeAppointmentStatus(appointmentId, statusToBeChangedTo, baseURL)
      .then(() => {
        expect(mockEsmAPI.openmrsFetch.mock.calls[0][0]).toBe(
          baseURL + "/" + appointmentId + "/status-change"
        );
        expect(
          mockEsmAPI.openmrsFetch.mock.calls[0][1]["body"]["toStatus"]
        ).toBe(statusToBeChangedTo);
        expect(mockEsmAPI.openmrsFetch.mock.calls[0][1]["method"]).toBe("POST");
      });
  });

  it(`should call api to change provider status `, () => {
    mockEsmAPI.openmrsFetch.mockResolvedValueOnce({});
    const acceptedStatus = "ACCEPTED";
    const appointmentId = "appointment-1";
    const baseURL = "foo";
    const provider = "provider-uuid";
    appointment
      .changeAppointmentProviderStatus(
        appointmentId,
        acceptedStatus,
        provider,
        baseURL
      )
      .then(() => {
        expect(mockEsmAPI.openmrsFetch.mock.calls[0][0]).toBe(
          baseURL + "/" + appointmentId + "/providerResponse"
        );
        expect(
          mockEsmAPI.openmrsFetch.mock.calls[0][1]["body"]["response"]
        ).toBe(acceptedStatus);
        expect(
          mockEsmAPI.openmrsFetch.mock.calls[0][1]["body"]["response"]
        ).toBe(acceptedStatus);
        expect(mockEsmAPI.openmrsFetch.mock.calls[0][1]["method"]).toBe("POST");
      });
  });
});
