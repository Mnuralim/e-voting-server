import { PrismaClient } from "@prisma/client";
import { students } from "./data";

const prisma = new PrismaClient();

async function clearDatabase() {
  console.log("Clearing database...");

  try {
    await prisma.accessToken.deleteMany({});
    console.log("Access tokens cleared");
  } catch (error) {
    console.log("No access tokens to clear or table doesn't exist");
  }

  try {
    await prisma.student.deleteMany({});
    console.log("Students cleared");
  } catch (error) {
    console.log("No students to clear or table doesn't exist");
  }

  try {
    await prisma.program.deleteMany({});
    console.log("Programs cleared");
  } catch (error) {
    console.log("No programs to clear or table doesn't exist");
  }

  try {
    await prisma.departement.deleteMany({});
    console.log("Departments cleared");
  } catch (error) {
    console.log("No departments to clear or table doesn't exist");
  }

  try {
    await prisma.faculty.deleteMany({});
    console.log("Faculties cleared");
  } catch (error) {
    console.log("No faculties to clear or table doesn't exist");
  }

  console.log("Database cleared successfully");
}

type Departement = {
  id: string;
  name: string;
  createdAt: Date;
};

async function createFacultiesAndDepartments() {
  const faculties = [
    {
      name: "Fakultas Sains dan Teknologi",
      programs: [
        {
          name: "Teknik Sipil",
          department: null,
        },
        {
          name: "Teknik Pertambangan",
          department: null,
        },
      ],
    },
    {
      name: "Fakultas Teknologi Informasi",
      programs: [
        {
          name: "Ilmu Komputer",
          department: null,
        },
        {
          name: "Sistem Informasi",
          department: null,
        },
      ],
    },
    {
      name: "Fakultas Hukum",
      programs: [
        {
          name: "Hukum",
          department: null,
        },
      ],
    },
    {
      name: "Fakultas Ilmu Sosial dan Politik",
      programs: [
        {
          name: "Manajemen",
          department: null,
        },
        {
          name: "Akuntansi",
          department: null,
        },
      ],
    },
    {
      name: "Fakultas Keguruan dan Ilmu Pendidikan",
      programs: [
        {
          name: "Pendidikan Matematika",
          department: "Jurusan MIPA",
        },
        {
          name: "Pendidikan Kimia",
          department: "Jurusan MIPA",
        },
      ],
    },
    {
      name: "Fakultas Pertanian, Perikanan dan Peternakan",
      programs: [
        {
          name: "Agroteknologi",
          department: "Jurusan Pertanian",
        },
        {
          name: "Agribisnis",
          department: "Jurusan Pertanian",
        },
      ],
    },
  ];

  // Create departments first
  const departmentsToCreate = ["Jurusan MIPA", "Jurusan Pertanian"];
  const createdDepartments: Record<string, Departement> = {};

  for (const deptName of departmentsToCreate) {
    const createdDept = await prisma.departement.create({
      data: {
        name: deptName,
      },
    });
    createdDepartments[deptName] = createdDept;
  }

  console.log("Departments created");

  const facultiesWithProgramsAndDepts = [];

  for (const faculty of faculties) {
    const createdFaculty = await prisma.faculty.create({
      data: {
        name: faculty.name,
      },
    });

    const createdProgramsWithDepts = [];
    for (const program of faculty.programs) {
      const createdProgram = await prisma.program.create({
        data: {
          name: program.name,
        },
      });

      createdProgramsWithDepts.push({
        program: createdProgram,
        department: program.department
          ? createdDepartments[program.department]
          : null,
      });
    }

    facultiesWithProgramsAndDepts.push({
      faculty: createdFaculty,
      programsWithDepts: createdProgramsWithDepts,
    });
  }

  console.log("Faculties and Programs created");
  return { facultiesWithProgramsAndDepts, departments: createdDepartments };
}

async function createStudents(data: {
  facultiesWithProgramsAndDepts: {
    faculty: {
      id: string;
      name: string;
      createdAt: Date;
    };
    programsWithDepts: {
      program: {
        id: string;
        name: string;
        createdAt: Date;
      };
      department: {
        id: string;
        name: string;
        createdAt: Date;
      } | null;
    }[];
  }[];
  departments: Record<string, any>;
}) {
  const { facultiesWithProgramsAndDepts } = data;

  const programInfos = facultiesWithProgramsAndDepts.flatMap((fp) =>
    fp.programsWithDepts.map((pd) => ({
      program: pd.program,
      department: pd.department,
      faculty: fp.faculty,
    }))
  );

  const totalPrograms = programInfos.length;
  const studentsPerProgram = Math.floor(students.length / totalPrograms);

  console.log(`Total programs: ${totalPrograms}`);
  console.log(`Students per program: ${studentsPerProgram}`);

  let studentIndex = 0;

  for (const { program, department, faculty } of programInfos) {
    for (
      let i = 0;
      i < studentsPerProgram && studentIndex < students.length;
      i++
    ) {
      const student = students[studentIndex];

      const studentData = {
        nim: student.nim,
        name: student.name,
        email: student.email,
        faculty_id: faculty.id,
        program_id: program.id,
      };

      if (department) {
        await prisma.student.create({
          data: {
            ...studentData,
            departement_id: department.id,
          },
        });
      } else {
        await prisma.student.create({
          data: {
            ...studentData,
            departement_id: null,
          },
        });
      }
      studentIndex++;
    }
  }

  // Handle any remaining students
  while (studentIndex < students.length) {
    const student = students[studentIndex];
    const randomProgramIndex = Math.floor(Math.random() * totalPrograms);
    const programInfo = programInfos[randomProgramIndex];

    const studentData = {
      nim: student.nim,
      name: student.name,
      email: student.email,
      faculty_id: programInfo.faculty.id,
      program_id: programInfo.program.id,
    };

    if (programInfo.department) {
      await prisma.student.create({
        data: {
          ...studentData,
          departement_id: programInfo.department.id,
        },
      });
    } else {
      await prisma.student.create({
        data: {
          ...studentData,
          departement_id: null,
        },
      });
    }

    studentIndex++;
  }

  console.log(
    `${studentIndex} students created and distributed among faculties, programs, and departments`
  );
}

async function main() {
  try {
    await clearDatabase();
    const data = await createFacultiesAndDepartments();
    await createStudents(data);

    console.log("Seeding completed successfully.");
  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
