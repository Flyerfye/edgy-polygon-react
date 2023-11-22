import { MatchImageSnapshotOptions } from "jest-image-snapshot";
import puppeteer, { Browser, Page } from "puppeteer";

// jest-image-snapshot custom configuration
function getConfig() {
  return {
    diffDirection: "vertical",
    dumpDiffToConsole: true,
    comparisonMethod: "ssim",
  } as MatchImageSnapshotOptions;
}

describe("Snapshot test", () => {
  var browser: Browser;
  var page: Page;

  beforeAll(async () => {
    jest.setTimeout(35000);
    browser = await puppeteer.launch();
    page = await browser.newPage();

    try {
      // Redirect the current page in the browser to a new url with puppeteer
      const response = await page.goto(
        "http://localhost:10002/edgy-polygon-react/"
      );

      expect(response!.status()).toBe(200);
    } catch (error: any) {
      if (
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
        console.error("An unexpected error occurred:", error.message);
      }
      await browser.close();
    }

    const buttonSelector = "#intro-modal-default-file-button";
    const button = await page.$(buttonSelector);

    // Click the intro modal button
    await button!.click();
  });

  afterAll(async () => {
    await browser.close();
  });

  it(`renders bird image on polygon canvas and compares screenshots`, async () => {
    const canvasSelector = "#polyCanvas";
    await page.waitForSelector(canvasSelector);
    const canvasElement = await page.$(canvasSelector);

    // The server sometimes needs extra processing time before the polygon image is generated
    // Placing this test at the end seems to allow for this naturally but a delay is added for consistency
    // await new Promise(resolve => setTimeout(resolve, 1000));

    const image = await canvasElement!.screenshot({ fullPage: false });
    const config = getConfig();
    expect(image).toMatchImageSnapshot(config);
  });

  it(`renders bird image on edge canvas and compares screenshots`, async () => {
    const edgeCanvasSelector = "#edgeCanvas";
    await page.waitForSelector(edgeCanvasSelector);
    const canvasElement = await page.$(edgeCanvasSelector);

    const image = await canvasElement!.screenshot({ fullPage: false });
    const config = getConfig();
    expect(image).toMatchImageSnapshot(config);
  });

  it(`renders bird image on image canvas and compares screenshots`, async () => {
    const imageCanvasSelector = "#imageCanvas";
    await page.waitForSelector(imageCanvasSelector);
    const canvasElement = await page.$(imageCanvasSelector);

    const image = await canvasElement!.screenshot({ fullPage: false });
    const config = getConfig();
    expect(image).toMatchImageSnapshot(config);
  });
});
