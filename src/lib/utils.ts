import type { Request, Response, NextFunction } from "express";
import nodemailer from "nodemailer";
import {
  createThirdwebClient,
  getContract,
  type ContractOptions,
} from "thirdweb";
import { createAuth } from "thirdweb/auth";
import { privateKeyToAccount } from "thirdweb/wallets";
import {
  nftContractABI,
  nftContractAddress,
  privateKey,
  voteContractAbi,
  voteContractAddress,
} from "./smartcontract";
import { sepolia } from "thirdweb/chains";

export class ApiError extends Error {
  statusCode: number;
  status: string;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "Failed" : "Error";

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status;
  err.message = err.message;

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

interface NodemailerData {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export const sendEmail = async (data: NodemailerData) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    logger: true,
    debug: true,
    auth: {
      user: Bun.env.EMAIL_ID,
      pass: Bun.env.EMAIL_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: "'tim voting usn' <usn.com>",
    to: `${data.to}`,
    subject: data.subject,
    text: data.text,
    html: data.html,
  });

  console.log(info.response);
  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};

export const thirdwebClient = createThirdwebClient({
  secretKey: Bun.env.THIRDWEB_SECRET!,
});

export const adminAccount = privateKeyToAccount({
  client: thirdwebClient,
  privateKey: privateKey,
});

export const thirdwebAuth = createAuth({
  domain: Bun.env.CLIENT_DOMAIN!,
  adminAccount,
});

type NFTContractReturn = Readonly<
  ContractOptions<typeof nftContractABI, `0x${string}`>
>;
type VoteContractReturn = Readonly<
  ContractOptions<typeof voteContractAbi, `0x${string}`>
>;
type ContractTypeMap = {
  NFT: NFTContractReturn;
  VOTE: VoteContractReturn;
};

export const getContractData = <T extends "NFT" | "VOTE">(
  smartcontract: T
): ContractTypeMap[T] => {
  if (smartcontract === "NFT") {
    const contract = getContract({
      client: thirdwebClient,
      address: nftContractAddress,
      chain: sepolia,
      abi: nftContractABI,
    });
    return contract as ContractTypeMap[T];
  } else {
    const contract = getContract({
      client: thirdwebClient,
      address: voteContractAddress,
      chain: sepolia,
      abi: voteContractAbi,
    });
    return contract as ContractTypeMap[T];
  }
};

export const generateEmailMessage = (studentName: string, token: string) => {
  const emailHtml = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #4CAF50;">Halo, ${studentName}!</h2>
          <p>Terima kasih telah bergabung dalam sistem e-voting kami.</p>
          <p>Berikut adalah <strong>access token</strong> Anda untuk mint NFT yang akan digunakan pada saat pemilihan:</p>
          <p style="font-size: 18px; color: #4CAF50; font-weight: bold;">${token}</p>
          <p>Jaga token ini baik-baik dan jangan bagikan kepada siapa pun.</p>
          <p>Salam hangat,<br>Sistem E-Voting</p>
        </div>
      `;

  const emailText = `
        Halo, ${studentName}!
        
        Terima kasih telah bergabung dalam sistem e-voting kami.
        
        Berikut adalah access token Anda untuk mint NFT yang akan digunakan pada saat pemilihan:
        ${token}
        
        Jaga token ini baik-baik dan jangan bagikan kepada siapa pun.
        
        Salam hangat,
        Sistem E-Voting
      `;

  return {
    emailHtml,
    emailText,
  };
};
