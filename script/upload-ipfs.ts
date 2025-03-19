import { upload } from "thirdweb/storage";
import { thirdwebClient } from "../src/lib/utils";
import fs from "fs";
import path from "path";

async function uploadFileToIPFS() {
  const folderPath = path.join(__dirname, "image-candidate");
  const files = fs.readdirSync(folderPath);

  const fileUploads = files.map((fileName) => {
    const filePath = path.join(folderPath, fileName);
    const fileBuffer = fs.readFileSync(filePath);

    return {
      name: fileName,
      data: fileBuffer,
    };
  });

  const result = await upload({
    client: thirdwebClient,
    files: fileUploads,
  });

  const fileContent = `export const imageResult = ${JSON.stringify(
    result,
    null,
    2
  )};`;

  fs.writeFileSync("script/image-result.ts", fileContent, "utf8");
}

async function main() {
  await uploadFileToIPFS();
}

main();
