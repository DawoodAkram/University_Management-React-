const instructorSchema = require("../models/instructorModel");
const studentSchema = require("../models/studentModel");
const courseSchema = require("../models/courseModel");
const academicSchema = require("../models/academicModel");
const attendanceSchema = require("../models/attendanceModel");

const registerInstructor = async (req, res) => {
  try {
    const { fname, lname, email, password } = req.body;

    // validation
    switch (true) {
      case !fname:
        return res.status(400).send({
          success: false,
          message: "First name is mandatory!",
        });
      case !lname:
        return res.status(400).send({
          success: false,
          message: "Last name is mandatory!",
        });
      case !email:
        return res.status(400).send({
          success: false,
          message: "Email is mandatory!",
        });
      case !password:
        return res.status(400).send({
          success: false,
          message: "Password is mandatory!",
        });
      default:
        break;
    }

    // ensuring uniqueness
    const instructorExists = await instructorSchema.find({ email });
    if (instructorExists.length) {
      return res.status(400).send({
        success: false,
        message: `We already have an instructor named ${
          instructorExists[0].fname + " " + instructorExists[0].lname
        } against this email.`,
      });
    }

    // registration
    const newInstructor = new instructorSchema({
      fname,
      lname,
      email,
      password,
    });
    const result = await newInstructor.save();

    if (result) {
      res.status(200).send({
        success: true,
        message: "Instructor registered successfully!",
        data: newInstructor,
      });
    } else {
      res.status(500).send({
        success: false,
        message: "Something went wrong while registering the instructor.",
        error,
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong while registering the instructor.",
      error,
    });
  }
};

const getInstructors = async (req, res) => {
  try {
    const instructors = await instructorSchema.find();
    if (instructors.length) {
      res.status(200).send({
        success: true,
        message: "Instructors fetched successfully!",
        count: instructors.length,
        data: instructors,
      });
    } else {
      res.status(204).send({
        success: true,
        message: "No instructors so far.",
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong while fetching the instructors.",
      error,
    });
  }
};

const getSingleInstructor = async (req, res) => {
  try {
    const id = req.params.id;
    const instructor = await instructorSchema.findById(id);
    if (instructor) {
      res.status(200).send({
        success: true,
        message: "Instructor fetched successfully!",
        data: instructor,
      });
    } else {
      res.status(404).send({
        success: false,
        message: "Instructor not found.",
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong while fetching the instructor.",
      error,
    });
  }
};

const loginInstructor = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validation
    switch (true) {
      case !email:
        return res.status(400).send({
          success: false,
          message: "Email is mandatory!",
        });
      case !password:
        return res.status(400).send({
          success: false,
          message: "Password is mandatory!",
        });
      default:
        break;
    }

    const instructor = await instructorSchema.findOne({ email, password });
    if (instructor) {
      res.status(200).send({
        success: true,
        message: "Login successfully!",
        data: instructor,
      });
    } else {
      res.status(404).send({
        success: false,
        message: "Wrong credentials.",
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong while loging in the instructor.",
      error,
    });
  }
};

const editInstructor = async (req, res) => {
  try {
    const id = req.params.id;
    const { fname, lname, email, password } = req.body;

    const instructor = await instructorSchema.findById(id);
    if (!instructor) {
      res.status(404).send({
        success: false,
        message: "Instructor not found.",
      });
    }

    // validation
    switch (true) {
      case !fname:
        return res.status(400).send({
          success: false,
          message: "First name cannot be empty!",
        });
      case !lname:
        return res.status(400).send({
          success: false,
          message: "Last name cannot be empty!",
        });
      case !email:
        return res.status(400).send({
          success: false,
          message: "Email cannot be empty!",
        });
      case !password:
        return res.status(400).send({
          success: false,
          message: "Password cannot be empty!",
        });
      default:
        break;
    }

    // editing
    const editedInstructor = await instructorSchema.findByIdAndUpdate(id, {
      fname,
      lname,
      email,
      password,
    }, { new: true });
    if (editedInstructor) {
      res.status(200).send({
        success: true,
        message: "Instructor's information edited successfully!",
        data: editedInstructor,
      });
    } else {
      res.status(500).send({
        success: false,
        message: "Something went wrong while editing the instructor.",
        error,
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong while editing the instructor.",
      error,
    });
  }
};

const deleteInstructor = async (req, res) => {
  try {
    const id = req.params.id;

    const instructor = await instructorSchema.findById(id);
    if (!instructor) {
      res.status(404).send({
        success: false,
        message: "Instructor not found.",
      });
    }

    // deleting data in referenced documents (if needed...)
    // deleting
    const deletedInstructor = await instructorSchema.findByIdAndDelete(id);
    if (deletedInstructor) {
      res.status(200).send({
        success: true,
        message: "Instructor deleted successfully!",
        data: deletedInstructor,
      });
    } else {
      res.status(500).send({
        success: false,
        message: "Something went wrong while deleting the instructor.",
        error,
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong while deleting the instructor.",
      error,
    });
  }
};

const postAcademics = async (req, res) => {
  try {
    const {
      examType,
      activityNumber,
      weightage,
      totalMarks,
      marks,
      instructorId,
      courseId,
    } = req.body;

    // validation
    switch (true) {
      case !examType:
        return res.status(400).send({
          success: false,
          message: "Exam type is mandatory!",
        });
      case !weightage:
        return res.status(400).send({
          success: false,
          message: "Weightage is mandatory!",
        });
      case !totalMarks:
        return res.status(400).send({
          success: false,
          message: "Total marks is mandatory!",
        });
      case !marks.length:
        return res.status(400).send({
          success: false,
          message: "Marks array is mandatory!",
        });
      case !instructorId:
        return res.status(400).send({
          success: false,
          message: "Instructor ID is mandatory!",
        });
      case !courseId:
        return res.status(400).send({
          success: false,
          message: "Course ID is mandatory!",
        });
      default:
        break;
    }

    // posting academic
    const newAcademic = new academicSchema({
      examType,
      activityNumber,
      weightage,
      totalMarks,
      marks,
      instructorId,
      courseId,
    });
    const result = await newAcademic.save();

    if (result) {
      res.status(200).send({
        success: true,
        message: "Academics posted successfully!",
        data: result,
      });
    } else {
      res.status(500).send({
        success: false,
        message: "Something went wrong while posting academics.",
        error,
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong while posting academics.",
      error,
    });
  }
};

const getAcademics = async (req, res) => {
  try {
    const id = req.params.id;
    const academics = await academicSchema.find({ instructorId: id });
    if (academics.length) {
      let academicDetails = [];
      for (let i = 0; i < academics.length; i++) {
        const element = academics[i];
        let marksWithStudentDetails = [];
        for (let j = 0; j < element.marks.length; j++) {
          const marks = element.marks[j];

          // fetching student details
          const student = await studentSchema.findById(marks.studentId);

          // preparing new object
          let marksObject = {
            ...marks._doc,
            student,
          };

          // maintaining array
          marksWithStudentDetails.push(marksObject);
        }
        const course = await courseSchema.findById(element.courseId);
        let academicDetail = {
          ...element._doc,
          marks: marksWithStudentDetails,
          course,
        };
        academicDetails.push(academicDetail);
      }
      res.status(200).send({
        success: true,
        message: "Academics fetched successfully!",
        count: academics.length,
        data: academicDetails,
      });
    } else {
      res.status(404).send({
        success: false,
        message: "Academics against this instructor not found.",
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong while fetching academics.",
      error,
    });
  }
};

const postAttendance = async (req, res) => {
  try {
    const { date, attendance, instructorId, courseId } = req.body;

    // validation
    switch (true) {
      case !date:
        return res.status(400).send({
          success: false,
          message: "Date is mandatory!",
        });
      case !attendance.length:
        return res.status(400).send({
          success: false,
          message: "Attendance array is mandatory!",
        });
      case !instructorId:
        return res.status(400).send({
          success: false,
          message: "Instructor ID is mandatory!",
        });
      case !courseId:
        return res.status(400).send({
          success: false,
          message: "Course ID is mandatory!",
        });
      default:
        break;
    }

    // posting attendance
    const newAttendance = new attendanceSchema({
      date,
      attendance,
      instructorId,
      courseId,
    });
    const result = await newAttendance.save();

    if (result) {
      res.status(200).send({
        success: true,
        message: "Attendance posted successfully!",
        data: result,
      });
    } else {
      res.status(500).send({
        success: false,
        message: "Something went wrong while posting attendance.",
        error,
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong while posting attendance.",
      error,
    });
  }
};

const getAttendances = async (req, res) => {
  try {
    const id = req.params.id;
    const attendances = await attendanceSchema.find({ instructorId: id });

    if (attendances.length) {
      let attendanceDetails = [];
      for (let i = 0; i < attendances.length; i++) {
        const element = attendances[i];
        let attendanceWithStudentDetails = [];
        for (let j = 0; j < element.attendance.length; j++) {
          const attendance = element.attendance[j];

          // fetching student details
          const student = await studentSchema.findById(attendance.studentId);

          // preparing new object
          let attendanceObject = {
            ...attendance._doc,
            student,
          };

          // maintaining array
          attendanceWithStudentDetails.push(attendanceObject);
        }
        const course = await courseSchema.findById(element.courseId);
        let attendanceDetail = {
          ...element._doc,
          attendance: attendanceWithStudentDetails,
          course,
        };
        attendanceDetails.push(attendanceDetail);
      }
      res.status(200).send({
        success: true,
        message: "Attendances fetched successfully!",
        count: attendances.length,
        data: attendanceDetails,
      });
    } else {
      res.status(404).send({
        success: false,
        message: "Attendances against this instructor not found.",
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong while fetching attendances.",
      error,
    });
  }
};

module.exports = {
  registerInstructor,
  getInstructors,
  getSingleInstructor,
  loginInstructor,
  editInstructor,
  deleteInstructor,
  postAcademics,
  getAcademics,
  postAttendance,
  getAttendances,
};
