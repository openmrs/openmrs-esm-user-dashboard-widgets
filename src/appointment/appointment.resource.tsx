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

  const fetchConditions = () => {
    const dateRangeconditions = {
      startDate: appointmentsStartDate(),
      endDate: appointmentsEndDate()
    };

    return {
      ...dateRangeconditions,
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

export function checkInAppointment(id: string, baseUrl: string): Promise<any> {
  const checkInAppointmentUrl = (baseUrl: string, appointmentId: string) =>
    `${baseUrl}/${appointmentId}/${constants.STATUS_CHANGE_URL}`;

  const requestBody = () => ({
    toStatus: "CheckedIn",
    onDate: new Date().toISOString()
  });

  const requestOptions = () => ({
    method: "POST",
    body: requestBody(),
    headers: {
      "Content-Type": "application/json"
    }
  });

  return openmrsFetch(checkInAppointmentUrl(baseUrl, id), requestOptions());
}
