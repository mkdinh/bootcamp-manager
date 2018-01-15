// set init state
//--------------------------------------------------------
const initState = {
    weeks: "24",
    current: "01"
};

// handle dispatch request
//--------------------------------------------------------
export default (state = initState, action) => {
    switch(action.type) {
        case "INIT_APP":
            if(action.payload.key === "weeks") {
                return { ...state, ...action.payload };
            };

        case "UPDATE_CURRENT_WEEK":
            return { ...state, current: action.payload.current };
            
        default:
            return { ...state }
    }
}