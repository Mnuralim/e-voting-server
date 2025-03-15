import { PrismaClient } from "@prisma/client";
import { generateEmailMessage, sendEmail } from "../src/lib/utils";

const prisma = new PrismaClient();

async function createFaculties() {
  const faculties = [
    { name: "Fakultas Saintek" },
    { name: "Fakultas Teknologi Informasi" },
    { name: "Fakultas Hukum" },
    { name: "Fakultas Ilmu Sosial dan Politik" },
    { name: "Fakultas Keguruan dan Ilmu Pendidikan" },
    { name: "Fakultas Pertanian, Perikanan dan Peternakan" },
  ];

  const createdFaculties = await Promise.all(
    faculties.map((faculty) =>
      prisma.faculty.create({
        data: faculty,
      })
    )
  );

  console.log("Faculties created");
  return createdFaculties;
}

async function createPrograms() {
  const programs = [
    { name: "Teknik Sipil" },
    { name: "Ilmu Komputer" },
    { name: "Hukum" },
    { name: "Manajemen" },
    { name: "Pendidikan Matematika" },
    { name: "Ilmu Perikanan" },
  ];

  const createdPrograms = await Promise.all(
    programs.map((program) =>
      prisma.program.create({
        data: program,
      })
    )
  );

  console.log("Programs created");
  return createdPrograms;
}

async function createStudents(
  faculties: {
    id: string;
    name: string;
  }[],
  programs: {
    id: string;
    name: string;
  }[]
) {
  const students = [
    {
      nim: "212221046",
      name: "ALJASTIN ILHAM MIRU",
      email: "alfianilhammiru281@gmail.com",
    },
    {
      nim: "212211036",
      name: "Fazrinda Razky Nurpratiwi",
      email: "mfazrinda@gmail.com",
    },
    {
      nim: "212211043",
      name: "Safrin",
      email: "furisafrin@gmail.com",
    },
    {
      nim: "212231125",
      name: "Muh.Alhafiz",
      email: "muhamadalhafishusna@gmail.com",
    },
    {
      nim: "212221098",
      name: "Mawar",
      email: "fujifaster175@gmail.com",
    },
    {
      nim: "212211031",
      name: "Alfina rezkiana septiana",
      email: "elvinareskisa@gmail.com",
    },
    {
      nim: "212231128",
      name: "Muhammad Amsiddin",
      email: "muhammadamsiddin@gmail.com",
    },
    {
      nim: "212221101",
      name: "Wiana",
      email: "wianagx@gmail.com",
    },
    {
      nim: "212221062",
      name: "Hasrianti",
      email: "hasrianti.ga@gmail.com",
    },
    {
      nim: "212211041",
      name: "Nuris",
      email: "nurisnuris238@gmail.com",
    },
    {
      nim: "212211038",
      name: "Naya Rahmatika",
      email: "nayarahma354@gmail.com",
    },
    {
      nim: "212221086",
      name: "Yantri",
      email: "nurmayantri4140@gmail.com",
    },
    {
      nim: "212231044",
      name: "Sahril",
      email: "syahrielthespecialone51@gmail.com",
    },
    {
      nim: "212231151",
      name: "Zulman",
      email: "zulman033@gmail.com",
    },
    {
      nim: "212221103",
      name: "Yeni",
      email: "ilvayeni54@gmail.com",
    },
    {
      nim: "212211030",
      name: "Aldi",
      email: "aldisiompu@gmail.com",
    },
    {
      nim: "212221079",
      name: "Musda",
      email: "musdamardita@gmail.com",
    },
    {
      nim: "212211035",
      name: "Errin Sriwati Bahman",
      email: "errinsriwati18@gmail.com",
    },
    {
      nim: "212221052",
      name: "Dasmawati",
      email: "dasmawati277@gmail.com",
    },
    {
      nim: "212221058",
      name: "Fikma",
      email: "fikmaima@gmail.com",
    },
    {
      nim: "212211039",
      name: "Nina Lestari",
      email: "lestarinna2@gmail.com",
    },
    {
      nim: "212221057",
      name: "Vicri haikal",
      email: "fikrihaikaall08@gmail.com",
    },
    {
      nim: "212231112",
      name: "BELLA AMELIA YUSTIN LA LUMBU",
      email: "bellaamelialumbu@gmail.com",
    },
    {
      nim: "212211033",
      name: "Asni Kamal",
      email: "asnikamal21@gmail.com",
    },
    {
      nim: "212231133",
      name: "NURJATI PUTRI",
      email: "nurjatyputry0015@gmail.com",
    },
    {
      nim: "212221099",
      name: "Wa Ode Sri Rintan",
      email: "waodesririntan883@gmail.com",
    },
    {
      nim: "212221067",
      name: "Jeslina",
      email: "jeslinaain12@gmail.com",
    },
    {
      nim: "212221073",
      name: "Meisy Ningsy",
      email: "mnningsi18@gmail.com",
    },
    {
      nim: "212211045",
      name: "Yanti",
      email: "yanticcs26@gmail.com",
    },
    {
      nim: "212221060",
      name: "FITO AZLAN",
      email: "alanlamaraja12@gmail.com",
    },
    {
      nim: "212221084",
      name: "Nur Intan",
      email: "nurintan21022003@gmail.com",
    },
    {
      nim: "212231146",
      name: "Syukur Hidayat",
      email: "syukurhidayat909@gmail.com",
    },
  ];

  const pairings = [
    { faculty: faculties[0], program: programs[0] },
    { faculty: faculties[1], program: programs[1] },
    { faculty: faculties[2], program: programs[2] },
    { faculty: faculties[3], program: programs[3] },
    { faculty: faculties[4], program: programs[4] },
    { faculty: faculties[5], program: programs[5] },
  ];

  const studentsPerPairing = Math.ceil(students.length / pairings.length);
  const studentsWithFacultyAndProgram = students.map((student, index) => {
    const pairingIndex = Math.floor(index / studentsPerPairing);
    const { faculty, program } = pairings[pairingIndex % pairings.length];

    return {
      ...student,
      faculty_id: faculty.id,
      program_id: program.id,
    };
  });

  const createdStudents = await Promise.all(
    studentsWithFacultyAndProgram.map((student) =>
      prisma.student.create({
        data: student,
      })
    )
  );

  console.log("Students created");

  /*
  await Promise.all(
    createdStudents.map(async (student) => {
      const token = Math.random().toString(36).substring(2, 15);

      const tokenHash = await Bun.password.hash(token, {
        cost: 10,
        algorithm: "bcrypt",
      });

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

      await prisma.accessToken.create({
        data: {
          token: tokenHash,
          status: "active",
          student_id: student.id,
        },
      });
    })
  );
  */

  return createdStudents;
}

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

async function main() {
  await clearDatabase();
  const createdFaculties = await createFaculties();
  const createdPrograms = await createPrograms();
  await createStudents(createdFaculties, createdPrograms);

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
