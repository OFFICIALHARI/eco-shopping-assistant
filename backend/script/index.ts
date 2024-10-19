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

  // Scrape product title
  const title = await page.$eval("#productTitle", (el) =>
    el?.textContent?.trim()
  );

  // Overview
  let overviewSection;
  try {
    overviewSection = await page.waitForSelector(
      "#productOverview_feature_div",
      { timeout: 5000 }
    );
  } catch (e) {
    // console.log("OverviewSection not found, skipping...");
  }

  if (overviewSection) {
    // Expand the product overview section if collapsed
    const expandButton = await overviewSection.$(
      'div#poToggleButton a[data-action="a-expander-toggle"]'
    );
    if (expandButton) {
      await expandButton.click();
      // Wait for the expanded content to load
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  // Scrape the content of the section
  const product_overview = await overviewSection?.evaluate(() => {
    const attributes: { [key: string]: string } = {}; // Add type annotation for attributes object
    const rows = document.querySelectorAll("table.a-normal tr");
    rows.forEach((row) => {
      const key = row.querySelector("td.a-span3")?.textContent?.trim();
      const value = row.querySelector("td.a-span9")?.textContent?.trim();
      if (key && value) {
        attributes[key] = value;
      }
    });
    return attributes;
  });

  // Image
  await page.waitForSelector("#imgTagWrapperId img");
  // Extract the image source
  const img_src = await page.evaluate(() => {
    const img = document.querySelector(
      "#imgTagWrapperId img"
    ) as HTMLImageElement;
    return img ? img.src : null;
  });

  // Scrape "About this item" section
  let isAboutThisItemPresent = false;
  let element;
  try {
    element = await page.$("#feature-bullets ul");
  } catch (e) {
    element = await page.$("#productFactsDesktop_feature_div ul");
  }

  if (element !== null) {
    isAboutThisItemPresent = true;
    // console.log("The element is present");
  } else {
    // console.log("AboutThisItemSection not found, skipping...");
  }
  if (isAboutThisItemPresent) {
    // Expand the product overview section if collapsed
    const expandButton = await page.$(
      'div#productFactsToggleButton a[data-action="a-expander-toggle"]'
    );
    if (expandButton) {
      await expandButton.click();
      // Wait for the expanded content to load
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  let about_this_item;
  try {
    about_this_item = await page.$eval(
      "#feature-bullets ul",
      (el) => el?.textContent?.trim() || ""
    );
  } catch (e) {
    about_this_item = await page.$eval(
      "#productFactsDesktop_feature_div ul",
      (el) => el?.textContent?.trim() || ""
    );
  }

  // Scrape product information
  let product_info;
  let product_info_2 = null;

  try {
    try {
      product_info = await page.$eval(
        "#productDetails_techSpec_section_1",
        (el) => el?.textContent?.trim() || ""
      );
    } catch (e) {
      product_info = await page.$$eval(
        "#productDetails_detailBullets_sections1 tr",
        (rows) => {
          return Array.from(rows, (row) => {
            const columns = row.querySelectorAll("th, td");
            return Array.from(columns, (column) => column.textContent);
          });
        }
      );

      await page.waitForSelector("#productDetails_techSpec_section_2", {
        timeout: 1000,
      });
      // Scrape product information
      product_info_2 = await page.evaluate(() => {
        const infoTableRows = Array.from(
          document.querySelectorAll("#productDetails_techSpec_section_2 tr")
        );
        const productInformation: { [key: string]: string } = {};

        infoTableRows.forEach((row) => {
          const key = row.querySelector("th")?.textContent?.trim();
          const value = row.querySelector("td")?.textContent?.trim();
          if (key && value) {
            productInformation[key] = value;
          }
        });
        return productInformation;
      });
    }
  } catch (e) {
    try {
      product_info = await page.$$eval(
        "#technicalSpecifications_section_1 tr",
        (rows) => {
          return Array.from(rows, (row) => {
            const columns = row.querySelectorAll("th, td");
            return Array.from(columns, (column) => column.textContent);
          });
        }
      );
    } catch (e) {
      // console.log("ProductDetails/Specs not found, skipping...");
    }
  }

  // Scrape product description
  let product_description = "";
  try {
    // Try to scrape product description from the A+ content section
    const descriptionSection = await page.waitForSelector(
      "#aplus_feature_div",
      { timeout: 5000 }
    );
    product_description = (await descriptionSection?.evaluate(() => {
      const descriptionElement = document.querySelector("#aplus h2");
      if (
        descriptionElement &&
        descriptionElement.nextSibling &&
        descriptionElement.nextSibling.textContent
      ) {
        return descriptionElement.nextSibling.textContent.trim();
      }
      // return "";
    })) as string;
    // if (productDescription) {
    //   return productDescription;
    // }
  } catch (error) {
    // console.log(
    //   "A+ content description not found, falling back to regular product description."
    // );
  }

  // let productDescription = "";

  try {
    await page.waitForSelector("#productDescription p", { timeout: 1000 });
    product_description = await page.$eval(
      "#productDescription p",
      (el) => el?.textContent?.trim() || ""
    );
  } catch (error) {
    // console.log(
    //   "The selector was not found within the timeout period, but we are proceeding anyway."
    // );
  }

  let witbSection;
  try {
    witbSection = await page.waitForSelector("#whatsInTheBoxDeck");
  } catch (e) {
    // console.log("WitbSection not found, skipping...");
  }

  // Scrape the content of the section
  let witb_section: string[] = [];
  if (witbSection) {
    witb_section = (await witbSection.evaluate(() => {
      const contentList = document.querySelectorAll("#witb-content-list li");
      const items = Array.from(contentList).map(
        (item) => item.textContent?.trim() || ""
      );
      return items;
    })) as string[]; // Update the type to string[]
  }

  console.log(
    JSON.stringify(
      {
        title,
        product_overview,
        about_this_item,
        product_info,
        product_info_2,
        product_description,
        witb_section,
        img_src,
      },
      null,
      2
    )
  );

  // Close the browser
  await browser.close();

  // Log the entire object
})();
