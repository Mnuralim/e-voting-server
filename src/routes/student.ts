import { Router } from "express";
import {
  createStudent,
  deleteStudent,
  getAllDepartement,
  getAllFaculty,
  getAllProgram,
  getAllStudents,
  updateStudent,
} from "../controller/student";
import { authentication } from "../middleware/authentication";
import { disableVoting } from "../middleware/disable-voting";

const studentRouter: Router = Router();

studentRouter.get("/", getAllStudents);
studentRouter.get("/faculties", getAllFaculty);
studentRouter.get("/programs", getAllProgram);
studentRouter.get("/departements", getAllDepartement);
studentRouter.post("/", authentication, disableVoting, createStudent);
studentRouter.patch("/:id", authentication, disableVoting, updateStudent);
studentRouter.delete("/:id", authentication, disableVoting, deleteStudent);

export { studentRouter };
