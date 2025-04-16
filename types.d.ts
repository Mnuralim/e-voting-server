import Express from "express";
declare global {
  namespace Express {
    interface Request {
      user?: {
        address: string;
        role?: string;
      };
    }
  }
}

interface ElectionVoterCount {
  [electionId: string]: number;
}
