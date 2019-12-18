import subMinutes from "date-fns/subMinutes";
import { openmrsFetch } from "@openmrs/esm-api";

import { AppointmentSource } from "./appointment.model";
import replaceParams from "../utils/param-replacers";
import { appointments as constants } from "../constants.json";

export function getAppointments(
  source: AppointmentSource,
  provider: String
): Promise<any> {
  const fetchAppointmentsUrl = () => replaceParams(`${source.url}/search`);

  const appointmentsStartDate = () =>
    new Date(
      subMinutes(
        new Date(),
        source.fromTimeDelayInMinutes ? source.fromTimeDelayInMinutes : 0
      )
    ).toISOString();

  const appointmentsEndDate = () =>
    new Date(new Date().setUTCHours(23, 59, 59, 9)).toISOString();

  const appointmentProvider = () =>
    source.fetchType === "self" ? { providerUuid: provider } : {};

  const appointmentsEndDateCondition = () =>
    source.removeEndDate ? {} : { endDate: appointmentsEndDate() };

  const fetchConditions = () => {
    const startDateCondition = {
      startDate: appointmentsStartDate()
    };

    return {
      ...startDateCondition,
      ...appointmentsEndDateCondition(),
      ...appointmentProvider()
    };
  };

  return openmrsFetch(fetchAppointmentsUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: fetchConditions()
  });
}

const appointmentUrlFormat = (
  baseUrl: string,
  appointmentId: string,
  statuschangeurl: string
) => `${baseUrl}/${appointmentId}/${statuschangeurl}`;

export function changeAppointmentStatus(
  id: string,
  status: string,
  baseUrl: string
): Promise<any> {
  const requestBody = () => ({
    toStatus: status,
    onDate: new Date().toISOString()
  });

  const requestOptions = () => ({
    method: "POST",
    body: requestBody(),
    headers: {
      "Content-Type": "application/json"
    }
  });

  return openmrsFetch(
    appointmentUrlFormat(baseUrl, id, constants.STATUS_CHANGE_URL),
    requestOptions()
  );
}
export function changeAppointmentProviderStatus(
  appointmentId: string,
  providerStatus: string,
  provider: string,
  baseURL: string
): Promise<any> {
  const requestOptions = () => ({
    method: "POST",
    body: {
      response: providerStatus,
      uuid: provider
    },
    headers: {
      "Content-Type": "application/json"
    }
  });
  return openmrsFetch(
    appointmentUrlFormat(
      baseURL,
      appointmentId,
      constants.PROVIDER_STATUS_CHANGE_URL
    ),
    requestOptions()
  );
}
