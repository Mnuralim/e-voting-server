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
  sendAndConfirmTransaction,
  toWei,
} from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
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
    throw new ApiError("Email and token wajib diisi.", 400);
  }

  const student = await findOneStudent(email);
  if (!student?.accessToken) {
    throw new ApiError("Token tidak ditemukan.", 404);
  }

  const isValid = await Bun.password.verify(token, student.accessToken.token);
  if (!isValid) {
    throw new ApiError("Token tidak valid.", 400);
  }

  if (student.accessToken.status === "used") {
    throw new ApiError("Token sudah digunakan.", 400);
  }

  if (!ethers.isAddress(userAddress)) {
    throw new ApiError("Alamat wallet tidak valid.", 400);
  }
  const imageUri = "ipfs://QmQaiRSDCNapVTkEQ3QFBkcfx78yBaZ6FroWSQP6AFUeYP/0";
  const uri = await upload({
    client: thirdwebClient,
    files: [
      {
        name: `WLNFT ORMAWA USN`,
        description: "NFT Whitelist untuk melakukan voting ORMAWA USN",
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
          {
            trait_type: "departement",
            value: student.departement
              ? student.departement.name.toLowerCase()
              : "none",
          },
          {
            trait_type: "dpm",
            value: student.faculty.name.toLowerCase(),
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
      student.faculty.name.toLowerCase(),
      student.program.name.toLowerCase(),
      imageUri,
      student.departement ? student.departement.name.toLowerCase() : "none",
      student.faculty.name.toLowerCase(),
    ],
  });

  const txSafeMint = await sendAndConfirmTransaction({
    account: adminAccount,
    transaction: safeMintTransaction,
  });

  if (txSafeMint.status === "reverted") {
    throw new ApiError("Gagal mint NFT.", 500);
  }

  const txSendNative = prepareTransaction({
    to: userAddress,
    chain: baseSepolia,
    client: thirdwebClient,
    value: toWei("0.0005"),
  });

  await sendAndConfirmTransaction({
    transaction: txSendNative,
    account: adminAccount,
  });

  await repository.updateAccessTokenToUsed(email);
};

export const bulkAccessToken = async (role: string) => {
  const students = await findAllStudents({});

  let counter = 0;
  for (const student of students) {
    if (role !== "admin" && role !== student.faculty.name.toLowerCase()) {
      throw new ApiError("Role tidak valid.", 400);
    }
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

export const createAccessToken = async (studentId: string, role: string) => {
  const student = await findStudentById(studentId);
  if (!student) {
    throw new ApiError("Mahasiswa tidak ditemukan.", 404);
  }

  if (
    role !== "admin" &&
    role !== "KPURM_UNIVERSITY" &&
    role !== student.faculty.name.toLowerCase()
  ) {
    throw new ApiError("Role tidak valid.", 400);
  }

  if (student.accessToken !== null) {
    throw new ApiError("Access token sudah dibuat.", 400);
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
