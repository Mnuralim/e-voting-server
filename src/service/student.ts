import { ApiError } from "../lib/utils";
import * as repository from "../repository/student";

export const getAllStudents = async (filters: {
  search?: string;
  tokenStatus?: string;
}) => {
  return await repository.findAllStudents(filters);
};

export const createStudent = async (
  name: string,
  nim: string,
  email: string,
  programId: string,
  facultyId: string
) => {
  if (!name || !nim || !email || !programId || !facultyId) {
    throw new ApiError(
      "Name, NIM, email, programId, and facultyId are required.",
      400
    );
  }

  const student = await repository.findOneStudent(email, nim);
  if (student) {
    throw new ApiError("Student already exists.", 400);
  }

  const program = await repository.findProgramById(programId);
  if (!program) {
    throw new ApiError("Program not found.", 404);
  }

  const faculty = await repository.findFacultyById(facultyId);
  if (!faculty) {
    throw new ApiError("Faculty not found.", 404);
  }

  await repository.createStudent(name, nim, email, programId, facultyId);
};

export const updateStudent = async (
  id: string,
  name: string,
  nim: string,
  email: string,
  programId: string,
  facultyId: string
) => {
  const student = await repository.findStudentById(id);
  if (!student) {
    throw new ApiError("Student not found.", 404);
  }

  if (name) {
    student.name = name;
  }

  if (nim) {
    student.nim = nim;
  }

  if (email) {
    student.email = email;
  }

  if (programId) {
    student.program_id = programId;
  }

  if (facultyId) {
    student.faculty_id = facultyId;
  }

  await repository.updateStudent(
    id,
    student.name,
    student.nim,
    student.email,
    student.program_id,
    student.faculty_id
  );
};

export const deleteStudent = async (id: string) => {
  const student = await repository.findStudentById(id);
  if (!student) {
    throw new ApiError("Student not found.", 404);
  }
  if (student.accessToken) {
    await repository.deleteAccessToken(student.id);
  }
  await repository.deleteStudent(id);
};

export const getAllFaculty = async () => {
  return repository.getAllFaculty();
};

export const getAllProgram = async () => {
  return repository.getAllProgram();
};
