import { prisma } from "../db";

export const findAllStudents = async (filters: {
  search?: string;
  tokenStatus?: string;
}) => {
  return await prisma.student.findMany({
    where: {
      OR: filters.search
        ? [
            { nim: { contains: filters.search, mode: "insensitive" } },
            { name: { contains: filters.search, mode: "insensitive" } },
            { email: { contains: filters.search, mode: "insensitive" } },
            {
              faculty: {
                name: { contains: filters.search, mode: "insensitive" },
              },
            },
            {
              program: {
                name: { contains: filters.search, mode: "insensitive" },
              },
            },
          ]
        : undefined,
      accessToken: filters.tokenStatus
        ? { status: filters.tokenStatus }
        : undefined,
    },
    include: {
      accessToken: {
        select: {
          status: true,
        },
      },
      faculty: {
        select: {
          name: true,
        },
      },
      program: {
        select: {
          name: true,
        },
      },
    },
  });
};

export const findProgramById = async (id: string) => {
  return await prisma.program.findUnique({
    where: {
      id,
    },
    select: {
      name: true,
    },
  });
};

export const findStudentById = async (id: string) => {
  return await prisma.student.findUnique({
    where: {
      id,
    },
    include: {
      accessToken: true,
    },
  });
};

export const findOneStudent = async (email?: string, nim?: string) => {
  return await prisma.student.findFirst({
    where: {
      OR: [
        {
          email,
        },
        {
          nim,
        },
      ],
    },
    include: {
      accessToken: true,
      faculty: true,
      program: true,
    },
  });
};

export const findFacultyById = async (id: string) => {
  return await prisma.faculty.findUnique({
    where: {
      id,
    },
    select: {
      name: true,
    },
  });
};

export const createStudent = async (
  name: string,
  nim: string,
  email: string,
  programId: string,
  facultyId: string
) => {
  await prisma.student.create({
    data: {
      name,
      nim,
      email,
      program_id: programId,
      faculty_id: facultyId,
    },
  });
};

export const updateStudent = async (
  id: string,
  name: string,
  nim: string,
  email: string,
  programId: string,
  facultyId: string
) => {
  return await prisma.student.update({
    where: {
      id,
    },
    data: {
      name,
      nim,
      email,
      program_id: programId,
      faculty_id: facultyId,
    },
  });
};

export const deleteStudent = async (id: string) => {
  await prisma.student.delete({
    where: {
      id,
    },
  });
};

export const deleteAccessToken = async (id: string) => {
  await prisma.accessToken.delete({
    where: {
      student_id: id,
    },
  });
};

export const getAllFaculty = async () => {
  return await prisma.faculty.findMany();
};

export const getAllProgram = async () => {
  return await prisma.program.findMany();
};
