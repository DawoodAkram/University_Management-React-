const express = require("express");
const { registerInstructor, getInstructors, getSingleInstructor, getAcademics, postAcademics, postAttendance, getAttendances, editInstructor, deleteInstructor, loginInstructor } = require("../controllers/instructorController");

const router = express.Router();

router.post("/register", registerInstructor);
router.get("/getAll", getInstructors);
router.get("/get/:id", getSingleInstructor);
router.post("/login", loginInstructor);
router.put("/edit/:id", editInstructor);
router.delete("/delete/:id", deleteInstructor);

router.post("/postAcademics", postAcademics);
router.get("/getAcademics/:id", getAcademics);

router.post("/postAttendance", postAttendance);
router.get("/getAttendances/:id", getAttendances);

module.exports = router;