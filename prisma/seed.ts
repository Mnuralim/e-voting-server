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
    await prisma.faculty.deleteMany({});
    console.log("Faculties cleared");
  } catch (error) {
    console.log("No faculties to clear or table doesn't exist");
  }

  console.log("Database cleared successfully");
}

async function createFaculties() {
  const faculties = [
    {
      name: "Fakultas Sains dan Teknologi",
      programs: [
        {
          name: "Teknik Sipil",
        },
        {
          name: "Teknik Pertambangan",
        },
      ],
    },
    {
      name: "Fakultas Teknologi Informasi",
      programs: [
        {
          name: "Ilmu Komputer",
        },
        {
          name: "Sistem Informasi",
        },
      ],
    },
    {
      name: "Fakultas Hukum",
      programs: [{ name: "Hukum" }],
    },
    {
      name: "Fakultas Ilmu Sosial dan Politik",
      programs: [
        {
          name: "Manajemen",
        },
        {
          name: "Akuntansi",
        },
      ],
    },
    {
      name: "Fakultas Keguruan dan Ilmu Pendidikan",
      programs: [
        {
          name: "Pendidikan Matematika",
        },
        {
          name: "Pendidikan Kimia",
        },
      ],
    },
    {
      name: "Fakultas Pertanian, Perikanan dan Peternakan",
      programs: [
        {
          name: "Ilmu Perikanan",
        },
        {
          name: "Ilmu Kelautan",
        },
      ],
    },
  ];

  const facultiesWithPrograms = [];

  for (const faculty of faculties) {
    const createdFaculty = await prisma.faculty.create({
      data: {
        name: faculty.name,
      },
    });

    const createdPrograms = [];
    for (const program of faculty.programs) {
      const createdProgram = await prisma.program.create({
        data: {
          name: program.name,
        },
      });
      createdPrograms.push(createdProgram);
    }

    facultiesWithPrograms.push({
      faculty: createdFaculty,
      programs: createdPrograms,
    });
  }

  console.log("Faculties and Programs created");
  return facultiesWithPrograms;
}

async function createStudents(
  facultiesWithPrograms: {
    faculty: {
      id: string;
      name: string;
      createdAt: Date;
    };
    programs: {
      id: string;
      name: string;
      createdAt: Date;
    }[];
  }[]
) {
  const programs = facultiesWithPrograms.flatMap((fp) => fp.programs);
  const totalPrograms = programs.length;

  const studentsPerProgram = Math.floor(students.length / totalPrograms);

  console.log(`Total programs: ${totalPrograms}`);
  console.log(`Students per program: ${studentsPerProgram}`);

  let studentIndex = 0;

  for (const { faculty, programs } of facultiesWithPrograms) {
    for (const program of programs) {
      for (
        let i = 0;
        i < studentsPerProgram && studentIndex < students.length;
        i++
      ) {
        const student = students[studentIndex];

        await prisma.student.create({
          data: {
            nim: student.nim,
            name: student.name,
            email: student.email,
            faculty_id: faculty.id,
            program_id: program.id,
          },
        });

        studentIndex++;
      }
    }
  }

  while (studentIndex < students.length) {
    const student = students[studentIndex];
    const randomProgramIndex = Math.floor(Math.random() * totalPrograms);
    const program = programs[randomProgramIndex];
    const faculty = facultiesWithPrograms.find((fp) =>
      fp.programs.some((p) => p.id === program.id)
    )?.faculty;

    await prisma.student.create({
      data: {
        nim: student.nim,
        name: student.name,
        email: student.email,
        faculty_id: faculty?.id!,
        program_id: program.id,
      },
    });

    studentIndex++;
  }

  console.log(
    `${studentIndex} students created and distributed among faculties and programs`
  );
}

async function main() {
  try {
    await clearDatabase();
    const facultiesWithPrograms = await createFaculties();
    await createStudents(facultiesWithPrograms);

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
