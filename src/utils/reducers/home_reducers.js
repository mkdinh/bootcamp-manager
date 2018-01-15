const initState = {
    summary: "",
    overview: "",
    activities: {},
    timeTracker: ""
};

export default (state = initState, action) => {
    switch(action.type) {
        case "INIT_TODAY_LESSON":
            console.log(action.payload)
            return { ...state, ...action.payload };
        default: 
            return { ...state };
    }
};