const initState = {
    summary: "",
    overview: "",
    activities: {},
    timeTracker: "",
    cSection:  {
        index: 0,
        offset: 0
    }
};

export default (state = initState, action) => {
    switch(action.type) {
        case "INIT_APP":
            if(action.payload.key === "home") {
                return { ...state, ...action.payload };
            };
        case "UPDATE_CURRENT_SECTION":
            return { ...state, cSection: action.payload.offset };
        case "INIT_TODAY_LESSON":
            return { ...state, ...action.payload };
        default: 
            return { ...state };
    }
};