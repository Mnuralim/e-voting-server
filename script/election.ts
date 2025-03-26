import {
  prepareContractCall,
  readContract,
  sendAndConfirmTransaction,
} from "thirdweb";
import { adminAccount, getContractData } from "../src/lib/utils";
import { candidates, elections } from "../prisma/data/election";
import { toBigInt } from "ethers";

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
            election.departement ? election.departement.toLowerCase() : "",
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

type Candidate = {
  name: string;
  vision: string;
  mission: string;
  image: string;
};

async function createCandidates() {
  const electionsData = await readContract({
    contract: getContractData("VOTE"),
    method: "getAllElections",
  });

  const candidatesPerElection: Record<string, Candidate[]> = {};
  let candidateIndex = 0;

  electionsData.forEach((election) => {
    const electionId = election.id.toString();
    candidatesPerElection[electionId] = [];
    for (let i = 0; i < 2; i++) {
      if (candidates[candidateIndex]) {
        candidatesPerElection[electionId].push(candidates[candidateIndex]);
        candidateIndex++;
      }
    }
  });

  for (const election of electionsData) {
    const electionId = election.id.toString();

    const electionCandidates = candidatesPerElection[electionId];
    for (const candidate of electionCandidates) {
      while (true) {
        try {
          const prepare = prepareContractCall({
            contract: getContractData("VOTE"),
            method: "addCandidate",
            params: [
              toBigInt(electionId),
              candidate.name,
              candidate.image,
              candidate.vision,
              candidate.mission,
            ],
          });

          const confirmationTx = await sendAndConfirmTransaction({
            account: adminAccount,
            transaction: prepare,
          });

          console.log(
            `Candidate ${candidate.name} added to election ${election.name}:`,
            confirmationTx.transactionHash
          );
          break;
        } catch (error) {
          console.error(
            `Failed to add candidate ${candidate.name} to election ${election.name}, retrying...`,
            error
          );
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
      }
    }
  }
}

async function main() {
  await createElections();
  await createCandidates();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
