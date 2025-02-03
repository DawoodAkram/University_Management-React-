import { BASE_URL } from "../config";

const title = "instructor/";

export const instructorEndpoints = {
  loginInstructor: () => `${BASE_URL}${title}login`,

  registerInstructor: () => `${BASE_URL}${title}register`,

  getInstructors: () => `${BASE_URL}${title}getAll`,

  getSingleInstructor: (id) => `${BASE_URL}${title}get/${id}`,

  deleteSingleInstructor: (id) => `${BASE_URL}${title}delete/${id}`,
};
