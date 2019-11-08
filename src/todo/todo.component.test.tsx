import React from "react";
import Todo from "./todo.component";

import { render, cleanup, waitForElement } from "@testing-library/react";
import { setErrorFilter } from "../utils/index";

import mockEsmApi from "@openmrs/esm-api";

const mockUrl = "mock/test/todo";
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
        name: "Test Afgan Patient",
        identifier: "10000X",
        id: 14
      },
      serviceCategory: {
        id: 172105,
        name: "Prostheses"
      },
      type: "PRINT_CONSENT",
      encounterId: 37
    },
    {
      todoId: 2,
      markedDone: true,
      dateCreated: 1572584857000,
      patient: {
        name: "ICRC Patient",
        identifier: "103450X",
        id: 14
      },
      serviceCategory: {
        id: 172105,
        name: "Prostheses"
      },
      type: "PRINT_CONSENT",
      encounterId: 37
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

  // it(`should show error message for sourceApi errors`, () => {
  //   mockEsmApi.openmrsFetch = jest.fn(() => {
  //     return Promise.reject("Unable");
  //   });
  //   // const mockError = new Error("error");
  //   // mockEsmApi.openmrsFetch.mockRejectedValueOnce({ message: "Your error" });
  //   const { getByText } = render(
  //     <Todo
  //       sourceApi=""
  //       showMessage={jest.fn}
  //       title={componentTitle}
  //       {...commonWidgetProps}
  //     />
  //   );

  //   expect(getByText("Unable to load todo's")).toBeTruthy;
  // });

  it(`should show loading component initially`, () => {
    mockEsmApi.openmrsFetch.mockResolvedValueOnce({ data: [] });

    const { getByText } = render(
      <Todo
        sourceApi=""
        showMessage={jest.fn}
        title={componentTitle}
        {...commonWidgetProps}
      />
    );

    expect(getByText("Loading...")).toBeTruthy;
  });

  it(`should render header component`, done => {
    mockEsmApi.openmrsFetch.mockResolvedValueOnce({ data: [mockTodos[0]] });

    const { getByText } = render(
      <Todo
        showMessage={jest.fn()}
        {...commonWidgetProps}
        title={componentTitle}
        sourceApi={mockUrl}
      />
    );

    waitForElement(() => getByText(componentTitle)).then(() => {
      done();
    });
  });

  it(`should show todos with given data`, done => {
    mockEsmApi.openmrsFetch.mockResolvedValueOnce({ data: [mockTodos[0]] });

    const { getByText } = render(
      <Todo
        sourceApi={mockUrl}
        showMessage={jest.fn()}
        title={componentTitle}
        {...commonWidgetProps}
      />
    );

    waitForElement(() => getByText(componentTitle)).then(() => {
      expect(getByText("Test Afgan Patient")).toBeTruthy();
      expect(getByText("10000X")).toBeTruthy();
      expect(getByText("Prostheses")).toBeTruthy();
      expect(getByText("M11 04")).toBeTruthy();
      expect(getByText("Print")).toBeTruthy();
      expect(getByText("Print").className).toEqual("button");
      expect(document.querySelector("a").getAttribute("href")).toContain(
        "openmrs/htmlformentryui/htmlform/viewEncounterWithHtmlForm.page?patientId=14&encounter=37"
      );
      done();
    });
  });

  it(`should sort Todo's by date`, done => {
    mockEsmApi.openmrsFetch.mockResolvedValueOnce({ data: mockTodos });
    const { getByText, container } = render(
      <Todo
        sourceApi={mockUrl}
        showMessage={jest.fn()}
        title={componentTitle}
        {...commonWidgetProps}
      />
    );

    waitForElement(() => getByText(componentTitle)).then(() => {
      expect(container.getElementsByClassName("todo-date")[0].textContent).toBe(
        "M11 01"
      );
      expect(container.getElementsByClassName("todo-date")[1].textContent).toBe(
        "M11 04"
      );
      done();
    });
  });

  it(`should have url for view all`, done => {
    mockEsmApi.openmrsFetch.mockResolvedValueOnce({ data: mockTodos });
    const { getByText } = render(
      <Todo
        sourceApi={mockUrl}
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

  it(`should limit todos list if configured`, done => {
    mockEsmApi.openmrsFetch.mockResolvedValueOnce({ data: mockTodos });
    const { getByText, container } = render(
      <Todo
        sourceApi={mockUrl}
        showMessage={jest.fn()}
        title={componentTitle}
        {...commonWidgetProps}
        limit={1}
      />
    );

    waitForElement(() => getByText(componentTitle)).then(() => {
      expect(container.getElementsByClassName("rt-tr-group").length).toBe(1);
      done();
    });
  });
});
