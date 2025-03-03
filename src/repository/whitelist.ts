import { prisma } from "../db";

export const updateAccessTokenToUsed = async (email: string) => {
  await prisma.student.update({
    where: {
      email,
    },
    data: {
      accessToken: {
        update: {
          data: {
            status: "used",
          },
        },
      },
    },
  });
};

export const updateAccessTokenToActive = async (
  email: string,
  token: string
) => {
  await prisma.student.update({
    where: {
      email,
    },
    data: {
      accessToken: {
        create: {
          token,
          status: "active",
        },
      },
    },
  });
};
