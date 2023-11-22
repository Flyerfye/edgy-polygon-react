import { fireEvent, render, screen, act } from "@testing-library/react";
import ApplicationGrid from "../../components/layout/ApplicationGrid";
import sinon from "sinon";

function clickDefaultButton() {
  const defaultFileButton = screen.getByTestId(
    "intro-modal-default-file-button"
  );
  // Create a fake XMLHttpRequest object using sinon
  const fake_request = sinon.useFakeXMLHttpRequest();
  const requests: sinon.SinonFakeXMLHttpRequest[] = [];
  fake_request.onCreate = function (fake_request) {
    requests.push(fake_request);
  };

  fireEvent.click(defaultFileButton);

  // Simulate the onload event by responding to the XHR request
  act(() => {
    return requests[0].respond(
      200,
      { "Content-Type": "application/octet-stream" },
      'SampleData'
    );
  });

  fake_request.restore();
}

describe("ApplicationGrid", () => {
  it("renders an intro modal which can be closed", async () => {
    //rendering the entire ApplicationGrid takes the majority of the time in this test but is necessary
    render(<ApplicationGrid />);
    const preClickGreetingElement = screen.getByTestId("intro-modal");
    expect(preClickGreetingElement).toBeInTheDocument();

    clickDefaultButton();

    expect(screen.queryByTestId("intro-modal")).toBeNull();
  });
});
