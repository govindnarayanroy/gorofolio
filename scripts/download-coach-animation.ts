import fs from "fs";
import path from "path";
import https from "https";

const ANIMATION_URL = "https://assets2.lottiefiles.com/packages/lf20_xyadoh9h.json";
const OUTPUT_PATH = path.join(process.cwd(), "public", "animations", "coach.json");

async function downloadAnimation() {
  return new Promise((resolve, reject) => {
    https.get(ANIMATION_URL, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download animation: ${response.statusCode}`));
        return;
      }

      const file = fs.createWriteStream(OUTPUT_PATH);
      response.pipe(file);

      file.on("finish", () => {
        file.close();
        console.log("Animation downloaded successfully!");
        resolve(true);
      });

      file.on("error", (err) => {
        fs.unlink(OUTPUT_PATH, () => {});
        reject(err);
      });
    }).on("error", (err) => {
      reject(err);
    });
  });
}

downloadAnimation().catch(console.error); 