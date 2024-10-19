import puppeteer from "puppeteer";
interface Product {
  id: number;
  title: string;
  product_overview: Record<string, any>; // JSONB type can contain any JSON structure
  about_this_item: string;
  product_info: Record<string, any>; // JSONB type can contain any JSON structure
  product_info_2: Record<string, any>; // JSONB type can contain any JSON structure
  product_description: string;
}
const productUrl = process.argv[2];
(async () => {
  // console.log("Launching browser...");
  const browser = await puppeteer.launch({
    headless: false,
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    userDataDir: "C:\\Users\\dhars\\AppData\\Local\\Google\\Chrome\\User Data",
    args: ["--profile-directory=Default", "--no-sandbox"],
  });
  // console.log("Browser launched successfully!");
  // const browser = await puppeteer.launch({
  //   //   "C:\\Users\\dhars\\AppData\\Local\\Google\\Chrome\\User Data\\Profile 1",
  //   headless: false, // Launch a visible browser
  //   executablePath:
  //     "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", // Path to your installed Chrome browser

  //   userDataDir: `C:\\Users\\dhars\\AppData\\Local\\Google\\Chrome\\User Data`,
  //   args: [
  //     "--profile-directory=Profile 1",
  //     // "--no-sandbox",
  //     // "--disable-features=ImprovedCookieControls",
  //     // "--disable-setuid-sandbox",
  //   ],
  //   // args: [
  //   //   //   "--disable-extensions-except=/path/to/my/extension",
  //   //   //   "--load-extension=/path/to/my/extension",
  //   //   "--user-data-dir=C:\\Users\\dhars\\AppData\\Local\\Google\\Chrome\\User Data\\Profile 1",
  //   //   //'--profile-directory=Profile 1'
  //   // ],
  //   // userDataDir:
  // });

  const page = await browser.newPage();
  await page.goto(`${productUrl}`);

  const scrollPageToBottom = async () => {
    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight);
    });
  };

  // Scroll the page multiple times until the carousel is within the viewport or a maximum number of scrolls is reached
  const maxScrolls = 10; // Adjust the maximum number of scrolls as needed
  let scrollCount = 0;

  let carousel: HTMLElement;
  while (scrollCount < maxScrolls) {
    // Check if the carousel selector is visible
    const carouselVisible = await page.evaluate(() => {
      carousel = document.querySelector(
        "div.a-row.a-carousel-header-row.a-size-large.pa_componentTitleTest.unified_ad_labeling_title_margin + div.a-row div.a-carousel-col.a-carousel-center"
      ) as HTMLElement;
      const rect = carousel?.getBoundingClientRect(); // Add null check for carousel
      return (
        rect?.top !== undefined &&
        rect?.top >= 0 &&
        rect?.left >= 0 &&
        rect?.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        rect?.right <=
          (window.innerWidth || document.documentElement.clientWidth)
      );
    });

    // If the carousel is visible, break the loop
    if (carouselVisible) {
      break;
    }

    // If the carousel is not visible yet, scroll the page to the bottom
    await scrollPageToBottom();
    scrollCount++;
  }

  await page.waitForSelector(
    "div.a-row.a-carousel-header-row.a-size-large.pa_componentTitleTest.unified_ad_labeling_title_margin + div.a-row div.a-carousel-col.a-carousel-center",
    {
      timeout: 60000,
    }
  ); // Wait for up to 60 seconds

  // Extract URLs of the products in the carousel
  const urls = await page.evaluate(() => {
    const productElements = carousel.querySelectorAll(
      "div.a-row.a-carousel-header-row.a-size-large.pa_componentTitleTest.unified_ad_labeling_title_margin + div.a-row div.a-carousel-col.a-carousel-center li.a-carousel-card a.a-link-normal"
    );
    const uniqueUrls = new Set<string>(); // Use a Set to ensure unique URLs
    for (const element of productElements) {
      const anchorElement = element as HTMLAnchorElement; // Type assertion
      uniqueUrls.add(anchorElement.href);
    }
    return Array.from(uniqueUrls); // Convert Set to array
  });
  //   console.log(urls);

  console.log(
    JSON.stringify(
      {
        urls,
      },
      null,
      2
    )
  );

  // Close the browser
  await browser.close();

  // Log the entire object
})();
