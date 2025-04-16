import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../lib/utils";
import * as service from "./../service/student";

export const getAllStudents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { search, tokenStatus } = req.query;
    const students = await service.getAllStudents({
      search: search as string,
      tokenStatus: tokenStatus as string,
    });

    res.status(200).json({
      students,
      message: "Success get all students",
    });
  } catch (error) {
    console.log(error);
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode));
    } else {
      next(new ApiError("Internal server error", 500));
    }
  }
};

export const createStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, nim, email, programId, facultyId, departementId } = req.body;
  try {
    await service.createStudent(
      name,
      nim,
      email,
      programId,
      facultyId,
      departementId
    );
    res.status(201).json({
      message: "Success create student",
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode));
    } else {
      next(new ApiError("Internal server error", 500));
    }
  }
};

export const updateStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { name, nim, email, programId, facultyId, departementId } = req.body;
  try {
    await service.updateStudent(
      id,
      name,
      nim,
      email,
      programId,
      facultyId,
      departementId
    );
    res.status(200).json({
      message: "Success update student",
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode));
    } else {
      next(new ApiError("Internal server error", 500));
    }
  }
};

export const deleteStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    await service.deleteStudent(id);
    res.status(200).json({
      message: "Success delete student",
    });
  } catch (error) {
    console.log(error);
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode));
    } else {
      next(new ApiError("Internal server error", 500));
    }
  }
};

export const getAllFaculty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const faculties = await service.getAllFaculty();
    res.status(200).json({
      faculties,
      message: "Success get all faculty",
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode));
    } else {
      next(new ApiError("Internal server error", 500));
    }
  }
};

export const getAllProgram = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const programs = await service.getAllProgram();
    res.status(200).json({
      programs,
      message: "Success get all program",
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode));
    } else {
      next(new ApiError("Internal server error", 500));
    }
  }
};

export const getAllDepartement = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const departements = await service.getAllDepartement();
    res.status(200).json({
      departements,
      message: "Success get all departement",
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode));
    } else {
      next(new ApiError("Internal server error", 500));
    }
  }
};

export const getStudentsCount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const count = await service.getStudentsCount();
    res.status(200).json({
      count,
      message: "Success get students count",
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode));
    } else {
      next(new ApiError("Internal server error", 500));
    }
  }
};
