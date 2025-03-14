import { upload } from "thirdweb/storage";
import {
  adminAccount,
  ApiError,
  generateEmailMessage,
  getContractData,
  sendEmail,
  thirdwebClient,
} from "../lib/utils";
import * as repository from "../repository/whitelist";
import { ethers } from "ethers";
import {
  prepareContractCall,
  prepareTransaction,
  readContract,
  sendAndConfirmTransaction,
  toWei,
} from "thirdweb";
import { sepolia } from "thirdweb/chains";
import {
  findAllStudents,
  findOneStudent,
  findStudentById,
} from "../repository/student";

export const whitelistAddress = async (
  email: string,
  token: string,
  userAddress: string
) => {
  if (!email || !token) {
    throw new ApiError("Email and token are required.", 400);
  }

  const student = await findOneStudent(email);
  if (!student?.accessToken) {
    throw new ApiError("Access token not found.", 404);
  }

  const isValid = await Bun.password.verify(token, student.accessToken.token);
  if (!isValid) {
    throw new ApiError("Invalid access token.", 400);
  }

  if (student.accessToken.status === "used") {
    throw new ApiError("Access token already used.", 400);
  }

  if (!ethers.isAddress(userAddress)) {
    throw new ApiError("Invalid user address.", 400);
  }

  const totalMinted = await readContract({
    contract: getContractData("NFT"),
    method: "totalMinted",
  });

  const imageUri =
    "ipfs://QmUF6KuAZR9oAxd46kSjj7PagBEeL2yrxHYjbUEaVQQvBg/30.png";
  const uri = await upload({
    client: thirdwebClient,
    files: [
      {
        name: `WLNFT #${Number(totalMinted)}`,
        description: "This is whitelist NFT",
        image: imageUri,
        attributes: [
          {
            trait_type: "faculty",
            value: student.faculty.name.toLowerCase(),
          },
          {
            trait_type: "program",
            value: student.program.name.toLowerCase(),
          },
        ],
      },
    ],
  });

  const safeMintTransaction = prepareContractCall({
    contract: getContractData("NFT"),
    method: "safeMint",
    params: [
      userAddress,
      uri,
      student.faculty.name,
      student.program.name,
      imageUri,
    ],
  });

  const txSafeMint = await sendAndConfirmTransaction({
    account: adminAccount,
    transaction: safeMintTransaction,
  });

  if (txSafeMint.status === "reverted") {
    throw new ApiError("Failed to mint whitelist NFT.", 500);
  }

  const txSendNative = prepareTransaction({
    to: userAddress,
    chain: sepolia,
    client: thirdwebClient,
    value: toWei("0.001"),
  });

  await sendAndConfirmTransaction({
    transaction: txSendNative,
    account: adminAccount,
  });

  await repository.updateAccessTokenToUsed(email);
};

export const bulkAccessToken = async () => {
  const students = await findAllStudents({});

  let counter = 0;
  for (const student of students) {
    const token = Math.random().toString(36).substring(2, 15);
    const tokenHash = await Bun.password.hash(token, {
      cost: 10,
      algorithm: "bcrypt",
    });

    if (!student.accessToken || student.accessToken === null) {
      const { emailHtml, emailText } = generateEmailMessage(
        student.name,
        token
      );

      await sendEmail({
        html: emailHtml,
        subject: "Access Token untuk Sistem E-Voting",
        text: emailText,
        to: student.email,
      });

      await repository.updateAccessTokenToActive(student.email, tokenHash);
      console.log(`Access token sent to ${student.email}`);
      counter++;
    }
  }

  console.log(`${counter} access tokens sent.`);
};

export const createAccessToken = async (studentId: string) => {
  const student = await findStudentById(studentId);
  if (!student) {
    throw new ApiError("Student not found.", 404);
  }

  if (student.accessToken !== null) {
    throw new ApiError("Access token already created.", 400);
  }

  const token = Math.random().toString(36).substring(2, 15);
  const tokenHash = await Bun.password.hash(token, {
    cost: 10,
    algorithm: "bcrypt",
  });

  const { emailHtml, emailText } = generateEmailMessage(student.name, token);

  await sendEmail({
    html: emailHtml,
    subject: "Access Token untuk Sistem E-Voting",
    text: emailText,
    to: student.email,
  });

  await repository.updateAccessTokenToActive(student.email, tokenHash);
};
