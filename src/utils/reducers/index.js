// import reducers
//--------------------------------------------------------
import { combineReducers } from "redux";
import weeks from "./weeks_reducers";
import instructor from "./instructor_reducers";
import student from "./student_reducers";
import home from "./home_reducers";
import directory from "./directory_reducers";

// combine all reducers
//--------------------------------------------------------
const reducers = combineReducers({
    directories: directory,
    weeks: weeks,
    instructor: instructor,
    student: student,
    home: home
});

export default reducers;
