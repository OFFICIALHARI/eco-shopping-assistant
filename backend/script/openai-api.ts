// Install the OpenAI SDK by running: npm install openai
import openai from "openai";

// Initialize the OpenAI API with your API key
const openaiApiKey = process.env.OPENAI_API_KEY;
const openaiClient = new openai.OpenAI({ apiKey: openaiApiKey });

// Function to extract relevant information from the JSON data
function extractInfo(jsonData: any) {
  const {
    title,
    product_overview,
    about_this_item,
    product_info,
    product_info_2,
    product_description,
    witb_section,
  } = jsonData;

  const details = {
    title,
    product_overview,
    about_this_item,
    product_info,
    product_info_2,
    product_description,
    witb_section,
  };

  return details;
}

// Function to generate eco-friendliness rating using OpenAI API
export default async function generateEcoRating(jsonData: any) {
  // Extract relevant information from the JSON
  // const productDetails = extractInfo(jsonData);

  // Compose a prompt using the extracted information
  //   const prompt = `Eco-friendliness rating for product:
  //   Title: ${productDetails.title}
  //   Product Overview: ${productDetails.product_overview}
  //   About This Item: ${productDetails.about_this_item}
  //   Product Info: ${productDetails.product_info}
  //   Product Info 2: ${productDetails.product_info_2}
  //   Product Description: ${productDetails.product_description}
  //   WITB Section: ${productDetails.witb_section}`;
  const prompt = `${jsonData} give eco-friendliness score based on above information, rating from 1(less impact on the environment) to 10(more impact on environment) each categories such as Material, Energy Efficiency, Transportation (assuming delivery to South India), End-of-Life Management (give score depending on disposability of this material), and Overall Eco-Friendliness Rating(overall score more weight on Material). Add a short reason in few chars in brackets for each category. If couldn't find any info on a category give neutral score.
  `;
  console.log(prompt);

  try {
    // Use the OpenAI API to generate the eco-friendliness rating
    const response = await openaiClient.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: prompt }],
      max_tokens: 100, // Adjust max_tokens as needed
      //   temperature: 0.7, // Adjust temperature as needed
      //   stop: ["\n"], // Stop at new line
    });

    // Extract the generated rating from the API response
    // console.log(response);
    // console.log(response.choices[0].message);

    const ecoRating = response.choices[0].message.content?.trim();
    // const ecoMessage = choices[1].text.trim();

    return ecoRating;
  } catch (error) {
    console.error("Error generating eco-friendliness rating:", error);
    return null;
  }
}

// Example JSON data
// const jsonData = {
//   title:
//     "Crucial P3 500GB PCIe Gen3 3D NAND NVMe M.2 SSD, up to 3500MB/s - CT500P3SSD8",
//   aboutThisItem:
//     "NVMe (PCIe Gen3 x4) technology with up to 3500MB/s sequential reads, random read/write 350K/460K IOPS.date transfer rate:3500.0 megabytes_per_second.Specific uses: Personal,Gaming,Business     Spacious storage up to 4TB     Performs up to 33% better than the previous generation     Solid Gen3 performance     Rated at MTTF greater than 1.5 million hours for extended longevity and reliability",
//   productInfo: "Hard Drive    \n                ‎500 GB Solid State Drive",
//   productDescription:
//     "Basic bootup speeds won’t cut it — not at work, on the go, or in the game. But the Crucial P3 SSD is anything but basic. With NVMe performance that’s nearly 5x faster than SATA and nearly 20x faster than HDD2, the P3 leaves older storage technology in the dust. With sequential read/write speeds up to 3500/3000MB/s, storage capacities up to 4TB, Micron Advanced 3D NAND, and innovative controller technology, the Crucial P3 gives you the speed you need for the price you want. Get faster bootups, downloads and file transfers, and store all your files, photos, videos, apps, and games with room to spare with the quality and dependability you expect from Crucial.",
// };

// Call the function to generate eco-friendliness rating
// export default generateEcoRating(jsonData)
//   .then((ecoRating) => {
//     console.log("Eco-friendliness rating:", ecoRating);
//     return ecoRating;
//   })
//   .catch((error) => {
//     console.error("Error:", error);
//   });
