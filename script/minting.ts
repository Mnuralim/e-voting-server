import {
  prepareContractCall,
  prepareTransaction,
  readContract,
  sendAndConfirmTransaction,
  toWei,
} from "thirdweb";
import {
  adminAccount,
  getContractData,
  thirdwebClient,
} from "../src/lib/utils";
import { privateKeys } from "./result";
import { upload } from "thirdweb/storage";
import { baseSepolia } from "thirdweb/chains";

async function mintingNFT() {
  const imageUri =
    "ipfs://QmUF6KuAZR9oAxd46kSjj7PagBEeL2yrxHYjbUEaVQQvBg/30.png";
  const description = "NFT Whitelist untuk melakukan voting ORMAWA USN";

  for (const account of privateKeys) {
    while (true) {
      try {
        const uri = await upload({
          client: thirdwebClient,
          files: [
            {
              name: `WLNFT ORMAWA USN`,
              description: description,
              image: imageUri,
              attributes: [
                {
                  trait_type: "faculty",
                  value: account.faculty.toLowerCase(),
                },
                {
                  trait_type: "program",
                  value: account.program.toLowerCase(),
                },
              ],
            },
          ],
        });

        const balanceOf = await readContract({
          contract: getContractData("NFT"),
          method: "balanceOf",
          params: [account.address],
        });

        if (Number(balanceOf) <= 0) {
          const safeMintTransaction = prepareContractCall({
            contract: getContractData("NFT"),
            method: "safeMint",
            params: [
              account.address,
              uri,
              account.faculty.toLowerCase(),
              account.program.toLowerCase(),
              imageUri,
            ],
          });

          const txSafeMint = await sendAndConfirmTransaction({
            account: adminAccount,
            transaction: safeMintTransaction,
          });

          if (txSafeMint.status === "reverted") {
            console.error("Failed to mint whitelist NFT.");
          }

          const txSendNative = prepareTransaction({
            to: account.address,
            chain: baseSepolia,
            client: thirdwebClient,
            value: toWei("0.001"),
          });

          await sendAndConfirmTransaction({
            transaction: txSendNative,
            account: adminAccount,
          });
        }

        console.log(`Success minting NFT for ${account.address}`);

        break;
      } catch (error) {
        console.error(
          `Failed to minting NFT for ${account.address}, retrying...`,
          error
        );
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }
}

async function main() {
  await mintingNFT();
}

main();
