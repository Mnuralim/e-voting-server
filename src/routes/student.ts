import { Router } from "express";
import {
  createStudent,
  deleteStudent,
  getAllDepartement,
  getAllFaculty,
  getAllProgram,
  getAllStudents,
  getStudentsCount,
  updateStudent,
} from "../controller/student";
import { authentication } from "../middleware/authentication";
import { disableVoting } from "../middleware/disable-voting";
import { authorization } from "../middleware/auhorization";

const studentRouter: Router = Router();

studentRouter.get("/", getAllStudents);
studentRouter.get("/count", getStudentsCount);
studentRouter.get("/faculties", getAllFaculty);
studentRouter.get("/programs", getAllProgram);
studentRouter.get("/departements", getAllDepartement);
studentRouter.post(
  "/",
  authentication,
  disableVoting,
  authorization("KPURM_UNIVERSITY"),
  createStudent
);
studentRouter.patch(
  "/:id",
  authentication,
  disableVoting,
  authorization("KPURM_UNIVERSITY"),
  updateStudent
);
studentRouter.delete(
  "/:id",
  authentication,
  disableVoting,
  authorization("KPURM_UNIVERSITY"),
  deleteStudent
);

export { studentRouter };
