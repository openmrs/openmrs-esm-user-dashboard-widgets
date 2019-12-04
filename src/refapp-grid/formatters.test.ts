import format, { formatField } from "./formatters";

describe("formatters", () => {
  const mockStartDateTime = new Date(new Date().setHours(10)).setMinutes(30);
  const mockEndDateTime = new Date(new Date().setHours(11)).setMinutes(0);
  it("should format given field with given formatter", () => {
    const source = {
      startDateTime: mockStartDateTime
    };
    const configs = [
      {
        name: "convertToTime",
        valueAccessor: "startDateTime"
      }
    ];

    const formattedSource = format(source, configs);

    expect(formattedSource.startDateTimeFormatted).toEqual("10:30 AM");
  });

  it("should add formatted value to given new field", () => {
    const source = {
      startDateTime: mockStartDateTime
    };
    const configs = [
      {
        name: "convertToTime",
        valueAccessor: "startDateTime",
        formattedField: "startTime"
      }
    ];

    const formattedSource = format(source, configs);
    expect(formattedSource.startTime).toEqual("10:30 AM");
  });

  it("should format value for nested field", () => {
    const source = {
      appointment: {
        startDateTime: mockStartDateTime
      }
    };
    const configs = [
      {
        name: "convertToTime",
        valueAccessor: "appointment.startDateTime",
        formattedField: "startTime"
      }
    ];

    const formattedSource = format(source, configs);
    expect(formattedSource.appointment.startTime).toEqual("10:30 AM");
  });

  describe("convertToTime", () => {
    it("should extract Time with 12 hour type", () => {
      const source = {
        appointment: {
          startDateTime: mockStartDateTime
        }
      };
      const configs = [
        {
          name: "convertToTime",
          valueAccessor: "appointment.startDateTime",
          formattedField: "startTime"
        }
      ];

      const formattedSource = format(source, configs);
      expect(formattedSource.appointment.startTime).toEqual("10:30 AM");
    });
  });

  describe("differenceInMins", () => {
    it("should find difference of dates in minutes", () => {
      const source = {
        appointment: {
          startDateTime: mockStartDateTime,
          endDateTime: mockEndDateTime
        }
      };
      const formatter = {
        name: "differenceInMins",
        args: ["appointment.endDateTime"]
      };

      const actualDurationInMins = formatField(
        source,
        source.appointment.startDateTime,
        formatter
      );
      expect(actualDurationInMins).toEqual("30 mins");
    });
  });

  describe("suffix", () => {
    it("should add given suffix to the field", () => {
      const source = {
        appointment: {
          durationInMins: "20"
        }
      };
      const configs = [
        {
          name: "suffix",
          valueAccessor: "appointment.durationInMins",
          formattedField: "duration",
          args: [" mins"]
        }
      ];

      const formattedSource = format(source, configs);
      expect(formattedSource.appointment.duration).toEqual("20 mins");
    });
  });
});
