// set init state
//--------------------------------------------------------
const initState = {
    weeks: 24,
    current: 1
};

// handle dispatch request
//--------------------------------------------------------
export default (state = initState, action) => {
    switch(action.type) {
        case "INIT_WEEKS":
            return { ...state, ...action.payload };

        case "UPDATE_CURRENT_WEEK":
            return { ...state, current: action.payload.current };
            
        default:
            return { ...state }
    }
}