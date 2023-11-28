import { MatchImageSnapshotOptions } from "jest-image-snapshot";
import puppeteer, { Browser, Page } from "puppeteer";

describe("Snapshot test", () => {
  let browser: Browser;
  let page: Page;
  const puppeteerOptions = {
    devtools: false,
    headless: true,
    defaultViewport: null,
  };

  // jest-image-snapshot custom configuration
  const snapshotConfig: MatchImageSnapshotOptions = {
    diffDirection: "vertical",
    dumpDiffToConsole: true,
    comparisonMethod: "ssim",
  };

  const polyCanvasSelector = "#polyCanvas";
  const edgeCanvasSelector = "#edgeCanvas";
  const imageCanvasSelector = "#imageCanvas";
  const minmaxSelectorRail =
    "#root > div > div > main > main.ControlsPanelGrid_controlsPanelGrid__8LrXa > main:nth-child(1) > div:nth-child(1) > table > tbody > tr > td:nth-child(2) > div";
  const colorSampleSelectorRail =
    "#root > div > div > main > main.ControlsPanelGrid_controlsPanelGrid__8LrXa > main:nth-child(1) > div:nth-child(2) > table > tbody > tr > td:nth-child(2) > div";
  const pointSpaceSelectorRail =
    "#root > div > div > main > main.ControlsPanelGrid_controlsPanelGrid__8LrXa > main:nth-child(2) > div:nth-child(1) > table > tbody > tr > td:nth-child(2) > div";
  const minSelectorHandle =
    "#root > div > div > main > main.ControlsPanelGrid_controlsPanelGrid__8LrXa > main:nth-child(1) > div:nth-child(1) > table > tbody > tr > td:nth-child(2) > div > div.rc-slider-handle.rc-slider-handle-1";
  const maxSelectorHandle =
    "#root > div > div > main > main.ControlsPanelGrid_controlsPanelGrid__8LrXa > main:nth-child(1) > div:nth-child(1) > table > tbody > tr > td:nth-child(2) > div > div.rc-slider-handle.rc-slider-handle-2";
  const colorSampleSelectorHandle =
    "#root > div > div > main > main.ControlsPanelGrid_controlsPanelGrid__8LrXa > main:nth-child(1) > div:nth-child(2) > table > tbody > tr > td:nth-child(2) > div > div.rc-slider-handle.rc-slider-handle-1";
  const pointSpaceSelectorHandle =
    "#root > div > div > main > main.ControlsPanelGrid_controlsPanelGrid__8LrXa > main:nth-child(2) > div:nth-child(1) > table > tbody > tr > td:nth-child(2) > div > div.rc-slider-handle.rc-slider-handle-1";
  const test_snapshot_path = "src/tests/e2e/__image_snapshots__/";

  beforeEach(async () => {
    browser = await puppeteer.launch(puppeteerOptions);
    page = await browser.newPage();

    try {
      // Redirect the current page in the browser to a new url with puppeteer
      const response = await page.goto(
        "http://localhost:10002/edgy-polygon-react/"
      );

      expect(response?.status()).toBe(200);
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        error.message &&
        error.message.includes("net::ERR_CONNECTION_REFUSED")
      ) {
        console.error(
          "Connection refused. The server might be down or unreachable."
        );
        console.error(
          "Make sure the server is started on on the correct port (10002) by running 'npm run test:e2eServer' first."
        );
      } else {
        if (error instanceof Error) {
          console.error("An unexpected error occurred:", error.message);
        } else {
          console.error(
            "An unexpected error occurred which is not of type error:",
            error
          );
        }
      }
      await browser.close();
    }

    const buttonSelector = "#intro-modal-default-file-button";
    const button = await page.$(buttonSelector);

    // Click the intro modal button
    await button?.click();
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }, 20000);

  afterEach(async () => {
    await browser.close();
  });

  async function moveSliderWBox(
    sliderHandleSelector: string,
    sliderBoxSelector: string,
    pxDistance: number
  ) {
    // sliders can are rendered on bottom of page which requires scrolling to interact with
    await page.waitForSelector(sliderHandleSelector);
    await page.hover(sliderHandleSelector);
    const handleElement = await page.$(sliderHandleSelector);
    const handlePos = await handleElement?.asElement()?.boundingBox();

    const boxElement = await page.$(sliderBoxSelector);
    const boxPos = await boxElement?.asElement()?.boundingBox();

    if (!handlePos) {
      throw new Error("Slider handle position cannot be null or undefined");
    }
    if (!boxPos) {
      throw new Error("Slider box position cannot be null or undefined");
    }
    const startPoint = {
      x: handlePos?.x + handlePos?.width / 2,
      y: boxPos?.y + boxPos?.height / 2,
    };

    const targetPoint = {
      x: startPoint.x + pxDistance,
      y: startPoint.y,
    };

    await page.mouse.move(startPoint.x, startPoint.y);
    await new Promise((resolve) => setTimeout(resolve, 100));

    await page.mouse.down();
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Simulate dragging by moving in steps
    await page.mouse.move(targetPoint.x, targetPoint.y, { steps: 50 });
    await new Promise((resolve) => setTimeout(resolve, 100));

    await page.mouse.up();
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  it(`renders bird image on canvases and compares screenshots`, async () => {
    await page.waitForSelector(polyCanvasSelector);
    const polyCanvasElement = await page.$(polyCanvasSelector);
    const polyImage = await polyCanvasElement?.screenshot({
      fullPage: false,
      path: `${test_snapshot_path}/application-grid-e2e-test-render-bird-polygon-image.png`,
    });
    expect(polyImage).toMatchImageSnapshot(snapshotConfig);

    await page.waitForSelector(edgeCanvasSelector);
    const edgeCanvasElement = await page.$(edgeCanvasSelector);
    const edgeImage = await edgeCanvasElement?.screenshot({
      fullPage: false,
      path: `${test_snapshot_path}/application-grid-e2e-test-render-bird-edge-image.png`,
    });
    expect(edgeImage).toMatchImageSnapshot(snapshotConfig);

    await page.waitForSelector(imageCanvasSelector);
    const imageCanvasElement = await page.$(imageCanvasSelector);
    const sourceImage = await imageCanvasElement?.screenshot({
      fullPage: false,
      path: `${test_snapshot_path}/application-grid-e2e-test-render-bird-source-image.png`,
    });
    expect(sourceImage).toMatchImageSnapshot(snapshotConfig);
  });

  //test validates image as well as UI screenshot so that changes to the UI will not require updating poly image validation snapshots
  it(`modifies min/max detection thresholds and validates change with screenshot`, async () => {
    await moveSliderWBox(maxSelectorHandle, minmaxSelectorRail, 80);

    await page.waitForSelector(polyCanvasSelector);
    let polyCanvasElement = await page.$(polyCanvasSelector);
    let polyImage = await polyCanvasElement?.screenshot({
      fullPage: false,
      path: `${test_snapshot_path}/application-grid-e2e-test-modify-minmax-max-polygon-image.png`,
    });
    expect(polyImage).toMatchImageSnapshot(snapshotConfig);

    const pageImageMaxSlider = await page.screenshot({
      fullPage: true,
      path: `${test_snapshot_path}/application-grid-e2e-test-modify-minmax-max-ui-image.png`,
    });
    expect(pageImageMaxSlider).toMatchImageSnapshot(snapshotConfig);

    await moveSliderWBox(minSelectorHandle, minmaxSelectorRail, -15);

    await page.waitForSelector(polyCanvasSelector);
    polyCanvasElement = await page.$(polyCanvasSelector);
    polyImage = await polyCanvasElement?.screenshot({
      fullPage: false,
      path: `${test_snapshot_path}/application-grid-e2e-test-modify-minmax-min-polygon-image.png`,
    });
    expect(polyImage).toMatchImageSnapshot(snapshotConfig);

    const pageImageMinSlider = await page.screenshot({
      fullPage: true,
      path: `${test_snapshot_path}/application-grid-e2e-test-modify-minmax-min-ui-image.png`,
    });
    expect(pageImageMinSlider).toMatchImageSnapshot(snapshotConfig);
  }, 10000);

  //test validates image as well as UI screenshot so that changes to the UI will not require updating poly image validation snapshots
  it(`modifies color sample radius and validates change with screenshot`, async () => {
    await moveSliderWBox(
      colorSampleSelectorHandle,
      colorSampleSelectorRail,
      150
    );

    await page.waitForSelector(polyCanvasSelector);
    const polyCanvasElement = await page.$(polyCanvasSelector);
    const polyImage = await polyCanvasElement?.screenshot({
      fullPage: false,
      path: `${test_snapshot_path}/application-grid-e2e-test-modify-color-sample-polygon-image.png`,
    });
    expect(polyImage).toMatchImageSnapshot(snapshotConfig);

    const pageImage = await page.screenshot({
      fullPage: true,
      path: `${test_snapshot_path}/application-grid-e2e-test-modify-color-sample-ui-image.png`,
    });
    expect(pageImage).toMatchImageSnapshot(snapshotConfig);
  }, 10000);

  //test validates image as well as UI screenshot so that changes to the UI will not require updating poly image validation snapshots
  it(`modifies min point spacing and validates change with screenshot`, async () => {
    await moveSliderWBox(pointSpaceSelectorHandle, pointSpaceSelectorRail, 100);

    await page.waitForSelector(polyCanvasSelector);
    const polyCanvasElement = await page.$(polyCanvasSelector);
    const polyImage = await polyCanvasElement?.screenshot({
      fullPage: false,
      path: `${test_snapshot_path}/application-grid-e2e-test-modify-point-spacing-polygon-image.png`,
    });
    expect(polyImage).toMatchImageSnapshot(snapshotConfig);

    const pageImage = await page.screenshot({
      fullPage: true,
      path: `${test_snapshot_path}/application-grid-e2e-test-modify-point-spacing-ui-image.png`,
    });
    expect(pageImage).toMatchImageSnapshot(snapshotConfig);
  }, 10000);
});
