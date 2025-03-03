import { PrismaClient } from "@prisma/client";
import { generateEmailMessage, sendEmail } from "../src/lib/utils";

const prisma = new PrismaClient();

async function main() {
  const faculties = [
    { name: "Fakultas Teknik" },
    { name: "Fakultas Teknologi Informasi" },
    { name: "Fakultas Hukum" },
  ];

  const programs = [
    { name: "Teknik Mesin" },
    { name: "Ilmu Komputer" },
    { name: "Hukum Perdata" },
  ];

  const students = [
    {
      nim: "123456789",
      name: "John Doe",
      email: "shadownur345@gmail.com",
      program_id: "",
      faculty_id: "",
    },
    {
      nim: "987654321",
      name: "Jane Doe",
      email: "cryptomism33@gmail.com",
      program_id: "",
      faculty_id: "",
    },
    {
      nim: "456789123",
      name: "Alice Smith",
      email: "alikazalim04@gmail.com",
      program_id: "",
      faculty_id: "",
    },
  ];

  const createdFaculties = await Promise.all(
    faculties.map((faculty) =>
      prisma.faculty.create({
        data: faculty,
      })
    )
  );

  const createdPrograms = await Promise.all(
    programs.map((program) =>
      prisma.program.create({
        data: program,
      })
    )
  );

  const createdStudents = await Promise.all(
    students.map((student, index) =>
      prisma.student.create({
        data: {
          ...student,
          program_id: createdPrograms[index % createdPrograms.length].id,
          faculty_id: createdFaculties[index % createdFaculties.length].id,
        },
      })
    )
  );

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
