import {
  prepareContractCall,
  readContract,
  sendAndConfirmTransaction,
} from "thirdweb";
import { adminAccount, getContractData } from "../src/lib/utils";
import { elections } from "./data/election";

async function createElections() {
  for (const election of elections) {
    while (true) {
      try {
        const prepare = prepareContractCall({
          contract: getContractData("VOTE"),
          method: "createElection",
          params: [
            election.name,
            election.type,
            election.faculty.toLowerCase(),
            election.program.toLowerCase(),
          ],
        });

        const confirmationTx = await sendAndConfirmTransaction({
          account: adminAccount,
          transaction: prepare,
        });

        console.log(
          `Election ${election.name} created successfully:`,
          confirmationTx.transactionHash
        );
        break;
      } catch (error) {
        console.error(
          `Failed to create election ${election.name}, retrying...`,
          error
        );
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }
}

async function createCandidates() {
  const getElectionsFromBlockchain = await readContract({
    contract: getContractData("VOTE"),
    method: "getAllElections",
  });

  console.log(getElectionsFromBlockchain);
}

async function main() {
  // await createElections();
  await createCandidates();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
