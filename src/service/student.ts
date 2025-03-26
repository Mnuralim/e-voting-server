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
  facultyId: string,
  departementId?: string | null
) => {
  if (!name || !nim || !email || !programId || !facultyId) {
    throw new ApiError(
      "Name, NIM, email, programId, and facultyId wajib diisi.",
      400
    );
  }

  const student = await repository.findOneStudent(email, nim);
  if (student) {
    throw new ApiError(
      "Mahasiswa dengan NIM atau Email tersebut sudah terdaftar.",
      400
    );
  }

  const program = await repository.findProgramById(programId);
  if (!program) {
    throw new ApiError("Prodi tidak ditemukan.", 404);
  }

  const faculty = await repository.findFacultyById(facultyId);
  if (!faculty) {
    throw new ApiError("Fakultas tidak ditemukan.", 404);
  }

  if (departementId) {
    const departement = await repository.findDepartementById(departementId);

    if (!departement) {
      throw new ApiError("Jurusan tidak ditemukan.", 404);
    }
  }

  await repository.createStudent(
    name,
    nim,
    email,
    programId,
    facultyId,
    departementId
  );
};

export const updateStudent = async (
  id: string,
  name: string,
  nim: string,
  email: string,
  programId: string,
  facultyId: string,
  departementId?: string | null
) => {
  const student = await repository.findStudentById(id);
  if (!student) {
    throw new ApiError("Mahasiswa tidak ditemukan.", 404);
  }

  if (email && email !== student.email) {
    const existingStudentWithEmail = await repository.findOneStudent(email);
    if (existingStudentWithEmail && existingStudentWithEmail.id !== id) {
      throw new ApiError("Email sudah digunakan oleh mahasiswa lain.", 400);
    }
  }

  if (nim && nim !== student.nim) {
    const existingStudentWithNim = await repository.findOneStudent(
      undefined,
      nim
    );
    if (existingStudentWithNim && existingStudentWithNim.id !== id) {
      throw new ApiError("NIM sudah digunakan oleh mahasiswa lain.", 400);
    }
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

  if (departementId) {
    student.departement_id = departementId;
  }

  await repository.updateStudent(
    id,
    student.name,
    student.nim,
    student.email,
    student.program_id,
    student.faculty_id,
    student.departement_id
  );
};

export const deleteStudent = async (id: string) => {
  const student = await repository.findStudentById(id);
  if (!student) {
    throw new ApiError("Mahasiswa tidak ditemukan.", 404);
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

export const getAllDepartement = async () => {
  return repository.getAllDepartement();
};
