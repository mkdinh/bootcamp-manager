// import redux actions
//--------------------------------------------------------
import weeks from "./weeks_actions";
import instructor from "./instructor_actions";
import student from "./student_actions";
import init from "./init_actions";

// combine into a single object
//--------------------------------------------------------
export default {
    init: init,
    weeks: weeks,
    instructor: instructor,
    student: student
}