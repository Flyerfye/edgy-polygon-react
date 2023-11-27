import React from 'react';
import { fireEvent, render, screen, act, Matcher } from "@testing-library/react";
import ApplicationGrid from "../../components/layout/ApplicationGrid";
import sinon from "sinon";

const defaultFileButton:Matcher = "intro-modal-default-file-button"
const aboutMeButton:Matcher = "application-grid-about-me-button"
const closeAboutMeButton:Matcher = "about-me-close-button"
const startSaveButton:Matcher = "application-grid-save-button"
const finishSaveButton:Matcher = "save-image-modal-save-button"
const requests: sinon.SinonFakeXMLHttpRequest[] = [];
let numReqs = 0;

function clickButton(buttonLabel:Matcher) {
  const button = screen.getByTestId(
    buttonLabel
  );
  fireEvent.click(button);
}

function clickFileButton(buttonLabel:Matcher) {
  const button = screen.getAllByTestId(
    buttonLabel
  );
  // Create a fake XMLHttpRequest object using sinon
  const fake_request = sinon.useFakeXMLHttpRequest();
  fake_request.onCreate = function (fake_request) {
    requests.push(fake_request);
  };

  fireEvent.click(button[0]);

  // Simulate the onload event by responding to the XHR request
  act(() => {
    return requests[numReqs].respond(
      200,
      { "Content-Type": "application/octet-stream" },
      'SampleData'
    );
  });

  fake_request.restore();
  numReqs++;
}

describe("ApplicationGrid", () => {
  it("renders an intro modal which can be closed", async () => {
    //rendering the entire ApplicationGrid takes the majority of the time in this test but is necessary
    render(<ApplicationGrid />);
    const preClickGreetingElement = screen.getByTestId("intro-modal");
    expect(preClickGreetingElement).toBeInTheDocument();
    
    expect(screen.queryByTestId("intro-modal")).toBeVisible();

    clickFileButton(defaultFileButton);

    expect(screen.queryByTestId("intro-modal")).toBeNull();
  });
  
  it("can show an About Me modal which can be closed", async () => {
    render(<ApplicationGrid />);
    clickFileButton(defaultFileButton);
    
    expect(screen.queryByTestId("about-me-modal")).toBeNull();

    clickButton(aboutMeButton);

    expect(screen.queryByTestId("about-me-modal")).toBeVisible();

    clickButton(closeAboutMeButton);

    expect(screen.queryByTestId("about-me-modal")).toBeNull();
  });

  // Optional test coverage to add:
  //  change the filepath to a temp directory
  //  change the resolution to 150
  //  verify that the file was saved and with the correct dimensions 
  it("can show a Save modal which can be closed", async () => {
    render(<ApplicationGrid />);
    clickFileButton(defaultFileButton);
    
    expect(screen.queryByTestId("save-modal")).toBeNull();

    clickButton(startSaveButton);
    expect(screen.queryByTestId("save-modal")).toBeVisible();

    clickButton(finishSaveButton);
    expect(screen.queryByTestId("save-modal")).toBeNull();
  });
});
