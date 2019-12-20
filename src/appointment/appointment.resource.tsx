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

  const appointmentProvider = () =>
    source.fetchType === "self" ? { providerUuid: provider } : {};

  const appointmentsEndDate = () =>
    source.showFutureAppointments
      ? {}
      : {
          endDate: new Date(new Date().setUTCHours(23, 59, 59, 9)).toISOString()
        };

  const fetchConditions = () => {
    const startDateCondition = {
      startDate: appointmentsStartDate()
    };

    return {
      ...startDateCondition,
      ...appointmentsEndDate(),
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

const appointmentUrl = (baseUrl: string, appointmentId: string, path: string) =>
  `${baseUrl}/${appointmentId}/${path}`;

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
    appointmentUrl(baseUrl, id, constants.STATUS_CHANGE_URL),
    requestOptions()
  );
}

export function changeAppointmentProviderResponse(
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
    appointmentUrl(
      baseURL,
      appointmentId,
      constants.PROVIDER_RESPONSE_CHANGE_URL
    ),
    requestOptions()
  );
}
