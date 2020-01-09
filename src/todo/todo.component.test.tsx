import React from "react";
import Todo from "./todo.component";

import {
  render,
  cleanup,
  waitForElement,
  fireEvent
} from "@testing-library/react";
import { setErrorFilter } from "../utils/index";

import mockEsmApi from "@openmrs/esm-api";

const mockUrl = "mock/test/todo";
const componentTitleRegex = /^My To Do's/;
const componentTitle = "My To Do's";

jest.mock("@openmrs/esm-api", () => ({
  openmrsFetch: jest.fn()
}));

describe(`<Todo />`, () => {
  const commonWidgetProps = { locale: "en" };
  const originalError = console.error;

  afterEach(() => {
    cleanup();
  });

  const mockTodos = [
    {
      todoId: 1,
      markedDone: false,
      dateCreated: 1572879146000,
      patient: {
        name: "Patient One",
        identifier: "10000X",
        id: 14
      },
      attributes: [
        {
          id: 23,
          uuid: "0458d18d-b779-4141-b1a2-a7977f49c391",
          attributeType: "Appointment",
          dataType: "Appointment",
          value: {
            id: 97,
            uuid: "609cd7a8-84a0-42a0-a7ec-13551acbd928",
            date: 1576132200000,
            service: {
              id: 2,
              uuid: "f6d752bf-34ea-48d0-8815-47cb93080eac",
              colour: "#006400",
              name: "Cardiology (R)"
            }
          }
        }
      ],
      type: "APPOINTMENT_CONFIRM",
      encounterId: 37,
      uuid: "1ab4a2c8-1cf5-46d8-8d7a-3be35c4d8b75"
    },
    {
      todoId: 2,
      markedDone: true,
      dateCreated: 1572584857000,
      patient: {
        name: "Patient Two",
        identifier: "103450X",
        id: 14,
        uuid: "6b42e575-2e44-40c1-a14c-8637cbb3d21f"
      },
      attributes: [
        {
          id: 1,
          uuid: "dcfb79f5-e443-483a-92c5-72942e9f581e",
          attributeType: "Service Category",
          dataType: "Concept",
          value: {
            id: 166290,
            name: "Prostheses",
            uuid: "84b2d351-393a-4cff-8c3c-f5785c05f9ce"
          }
        }
      ],
      type: "PRINT_CONSENT",
      encounterId: 37,
      uuid: "da6d1694-2eda-4ada-944e-10ccac16c1d4",
      visitUUId: "3479bf97-b842-4f94-a424-253297e4dc5e"
    }
  ];

  beforeEach(() => {
    setErrorFilter(originalError, /Warning.*not wrapped in act/);
  });

  afterEach(() => {
    mockEsmApi.openmrsFetch.mockReset();
    cleanup();
  });

  afterAll(() => {
    console.error = originalError;
  });

  it(`should show error message for source api fails`, done => {
    mockEsmApi.openmrsFetch.mockRejectedValueOnce(
      new Error("Unable to load todo's")
    );

    const { getByText } = render(
      <Todo
        source={{ url: "" }}
        showMessage={jest.fn}
        title={componentTitle}
        {...commonWidgetProps}
      />
    );

    waitForElement(() => getByText("Unable to load todo's")).then(() => {
      done();
    });
  });

  it(`should show loading component initially`, () => {
    mockEsmApi.openmrsFetch.mockResolvedValueOnce({ data: [] });

    const { getByText } = render(
      <Todo
        source={{ url: "" }}
        showMessage={jest.fn}
        title={componentTitle}
        {...commonWidgetProps}
      />
    );

    expect(getByText("Loading...")).toBeTruthy();
  });

  it(`should render header component`, done => {
    mockEsmApi.openmrsFetch.mockResolvedValueOnce({ data: [mockTodos[0]] });

    const { getByText } = render(
      <Todo
        showMessage={jest.fn()}
        {...commonWidgetProps}
        title={componentTitle}
        source={{ url: mockUrl }}
      />
    );

    waitForElement(() => getByText(componentTitleRegex)).then(() => {
      done();
    });
  });

  it(`should contain view all which redirects to url given in config for todos more than limit`, done => {
    mockEsmApi.openmrsFetch.mockResolvedValueOnce({ data: mockTodos });
    const { getByText } = render(
      <Todo
        source={{ url: mockUrl, limit: 1 }}
        showMessage={jest.fn()}
        title={componentTitle}
        {...commonWidgetProps}
        viewAll="/mock/view/all"
      />
    );

    waitForElement(() => getByText("View All")).then(() => {
      expect(
        getByText("View All")
          .closest("a")
          .getAttributeNode("href").textContent
      ).toBe("/mock/view/all");
      done();
    });
  });

  it(`should not contain view all if todos are less than limit`, done => {
    mockEsmApi.openmrsFetch.mockResolvedValueOnce({ data: mockTodos });
    const { getByText, queryByText } = render(
      <Todo
        source={{ url: mockUrl, limit: 5 }}
        showMessage={jest.fn()}
        title={componentTitle}
        {...commonWidgetProps}
        viewAll="/mock/view/all"
      />
    );

    waitForElement(() => getByText(componentTitleRegex)).then(() => {
      expect(queryByText("View All")).toBeNull;
      done();
    });
  });

  it(`should limit todos list if configured`, done => {
    mockEsmApi.openmrsFetch.mockResolvedValueOnce({ data: mockTodos });
    const { getByText, container } = render(
      <Todo
        source={{ url: mockUrl, limit: 1 }}
        showMessage={jest.fn()}
        title={componentTitle}
        {...commonWidgetProps}
      />
    );

    waitForElement(() => getByText(componentTitleRegex)).then(() => {
      expect(container.getElementsByClassName("rt-tr-group").length).toBe(1);
      done();
    });
  });

  it.only(`should show print todo with given data`, done => {
    mockEsmApi.openmrsFetch.mockResolvedValueOnce({ data: [mockTodos[1]] });

    const { getByText } = render(
      <Todo
        source={{ url: mockUrl }}
        showMessage={jest.fn()}
        title={componentTitle}
        {...commonWidgetProps}
      />
    );

    waitForElement(() => getByText(componentTitleRegex)).then(() => {
      expect(getByText("Patient Two")).toBeTruthy();
      expect(getByText("103450X")).toBeTruthy();
      expect(getByText("Prostheses")).toBeTruthy();
      expect(getByText("Nov 01")).toBeTruthy();
      expect(getByText("Print")).toBeTruthy();
      expect(getByText("Print").className).toContain(
        "task button small-button"
      );
      expect(document.querySelector("a").getAttribute("href")).toContain(
        "openmrs/htmlformentryui/htmlform/enterHtmlFormWithStandardUi.page?patientId=6b42e575-2e44-40c1-a14c-8637cbb3d21f&visitId=3479bf97-b842-4f94-a424-253297e4dc5e&definitionUiResource=icrc:htmlforms/transversal/addClinicalConsent.xml"
      );
      done();
    });
  });

  it(`should show appointment confirm todo with given data`, done => {
    mockEsmApi.openmrsFetch.mockResolvedValueOnce({ data: [mockTodos[1]] });

    const { getByText, container } = render(
      <Todo
        source={{ url: mockUrl }}
        showMessage={jest.fn()}
        title={componentTitle}
        {...commonWidgetProps}
      />
    );

    waitForElement(() => getByText(componentTitleRegex)).then(() => {
      expect(getByText("Cardiology (R)")).toBeTruthy();
      expect(container.getElementsByClassName("circle")).toBeTruthy();
      expect(getByText("Dec 12")).toBeTruthy();
      expect(getByText("Confirm")).toBeTruthy();
      expect(container.getElementsByClassName("icon-phone")).toBeTruthy();
      done();
    });
  });

  it(`should sort Todos by todo created date`, done => {
    mockEsmApi.openmrsFetch.mockResolvedValueOnce({ data: mockTodos });
    const { getByText, container } = render(
      <Todo
        source={{ url: mockUrl }}
        showMessage={jest.fn()}
        title={componentTitle}
        {...commonWidgetProps}
      />
    );

    waitForElement(() => getByText(componentTitleRegex)).then(() => {
      expect(container.getElementsByClassName("todo-date")[0].textContent).toBe(
        "Nov 01"
      );
      expect(container.getElementsByClassName("todo-date")[1].textContent).toBe(
        "Dec 12"
      );
      done();
    });
  });

  it(`should remove todos when marked as done`, done => {
    mockEsmApi.openmrsFetch.mockResolvedValueOnce({
      data: mockTodos.slice(0, 1)
    });
    const { getByText, container, getByTestId } = render(
      <Todo
        source={{ url: mockUrl }}
        showMessage={jest.fn()}
        title={componentTitle}
        {...commonWidgetProps}
      />
    );

    waitForElement(() => getByText(componentTitleRegex)).then(() => {
      expect(container.getElementsByClassName("mark-done")).toBeTruthy;
      expect(container.getElementsByClassName("icon-ok")).toBeTruthy;

      mockEsmApi.openmrsFetch.mockResolvedValueOnce({ ok: true });
      mockEsmApi.openmrsFetch.mockResolvedValueOnce({
        data: []
      });

      // Click button
      fireEvent.click(getByTestId(/submit/));

      // Wait for page to update with query text
      waitForElement(() => getByText("No Todo Actions")).then(() => {
        done();
      });
    });
  });
});
