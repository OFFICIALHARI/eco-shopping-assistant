import express from "express";
import { createClient } from "@supabase/supabase-js";
import { exec } from "child_process";
import { supabase } from "./supabaseClient";
import generateEcoRating from "./script/openai-api";
import stringToJSON from "./lib/stringToJSON";
const app = express();
const port = 3000;
interface EcoRating {
  Material: number;
  "Energy Efficiency": number;
  Transportation: number;
  "End-of-Life Management": number;
  "Overall Eco-Friendliness Rating": number;
}

app.get("/api/run-script/:productUrl", (req, res) => {
  const productUrl = decodeURIComponent(req.params.productUrl);

  exec(
    `ts-node ./script/index.ts "${productUrl}"`,
    async (execError, stdout, stderr) => {
      if (execError) {
        console.log(`error executing script: ${execError.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }

      // Parse the script output
      console.log("stdout", stdout);
      const productDetails = JSON.parse(stdout);
      console.log(productDetails);

      // Update the productDetails table in Supabase
      const { error } = await supabase
        .from("productDetails")
        .insert(productDetails);

      if (error) {
        console.error("Error updating Supabase:", error);
        res.status(500).send("Error updating Supabase");
      } else {
        const { img_src, ...rest } = productDetails;
        const productDetailsWithoutImage = rest;
        const ecoRating = await generateEcoRating(productDetailsWithoutImage)
          .then((ecoRating) => {
            // console.log("Eco-friendliness rating:", ecoRating);
            return ecoRating;
          })
          .catch((error) => {
            console.error("Error:", error);
          });
        console.log(productDetails);
        const formattedEcoRating: EcoRating = stringToJSON(ecoRating!);
        console.log(formattedEcoRating);
        res.send([productDetails, formattedEcoRating]);
      }
    }
  );
});
app.get("/api/recomm-picks/:productUrl", (req, res) => {
  const productUrl = decodeURIComponent(req.params.productUrl);
  exec(
    `ts-node ./script/getRecomPicks.ts "${productUrl}"`,
    async (execError, stdout, stderr) => {
      if (execError) {
        console.log(`error executing script: ${execError.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }

      // await fetch("")

      // Parse the script output
      const productUrls = JSON.parse(stdout);
      console.log(productUrls);

      const firstUrl = productUrls.urls[0];
      const thirdUrl = productUrls.urls[2];

      let urls = [firstUrl, thirdUrl];

      const results = [];

      for (const url of urls) {
        try {
          let result;
          if (url) {
            result = await new Promise((resolve, reject) => {
              exec(
                `ts-node ./script/index.ts "${url}"`,
                async (execError, stdout, stderr) => {
                  if (execError) {
                    console.log(`error executing script: ${execError.message}`);
                    reject(execError);
                    return;
                  }
                  if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    reject(new Error(stderr));
                    return;
                  }

                  // Parse the script output
                  const productDetails = JSON.parse(stdout);
                  console.log(productDetails);

                  // Update the productDetails table in Supabase
                  const { error } = await supabase
                    .from("productDetails")
                    .insert(productDetails);

                  if (error) {
                    console.error("Error updating Supabase:", error);
                    reject(error);
                  } else {
                    const { img_src, ...rest } = productDetails;
                    const productDetailsWithoutImage = rest;
                    const ecoRating = await generateEcoRating(
                      productDetailsWithoutImage
                    )
                      .then((ecoRating) => {
                        // console.log("Eco-friendliness rating:", ecoRating);
                        return ecoRating;
                      })
                      .catch((error) => {
                        console.error("Error:", error);
                        reject(error);
                      });
                    console.log(productDetails);
                    const formattedEcoRating: EcoRating = stringToJSON(
                      ecoRating!
                    );
                    console.log(formattedEcoRating);
                    resolve([productDetails, formattedEcoRating]);
                  }
                }
              );
            });
          }

          results.push(result);
        } catch (error) {
          res.status(500).send("Error executing scripts");
          return;
        }
      }
      console.log("results", results);
      res.send(results);
    }
  );
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
