// set init state
//--------------------------------------------------------
const initState = {
    root: ""
};

// handle dispatch request
//--------------------------------------------------------
export default (state = initState, action) => {
    switch(action.type) {
        case "INIT_APP":
            if(action.payload.key === "instructor") {
                return { ...state, ...action.payload };
            };
            
        case "UPDATE_INSTRUCTOR_DIRECTORY":
            return { ...state, [action.payload.key]: action.payload.value };
            
        default:
            return { ...state }
    }
}