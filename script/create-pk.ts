import { Wallet } from "ethers";
import fs from "fs";
import { findAllStudents } from "../src/repository/student";

async function createPk() {
  const students = await findAllStudents({});

  const studentsDummy = students;
  const privateKeys: {
    privateKey: string;
    address: string;
    faculty: string;
    program: string;
    departement?: string | null;
  }[] = [];

  for (let i = 0; i < studentsDummy.length; i++) {
    const wallet = Wallet.createRandom();
    const cleanedPrivateKey = wallet.privateKey.replace(/^0x/, "");
    const address = wallet.address;
    privateKeys.push({
      privateKey: cleanedPrivateKey,
      address,
      faculty: studentsDummy[i].faculty.name.toLowerCase(),
      program: studentsDummy[i].program.name.toLowerCase(),
      departement:
        students[i].departement && students[i].departement?.name
          ? students[i].departement?.name.toLowerCase()
          : null,
    });

    const fileContent = `export const privateKeys = ${JSON.stringify(
      privateKeys,
      null,
      2
    )};`;

    fs.writeFileSync("script/result.ts", fileContent, "utf8");

    console.log("Private keys berhasil disimpan di result.ts");
  }
}

async function main() {
  await createPk();
}

main();
