const initState = {
    root: {},
    activities: {},
    homeworks: {},
    projects: {},
    slides: {}
}

export default (state, action) => {
    switch(action.type) {
        case "INIT_DIRECTORIES":
            return { ...state, ...action.payload };
        default:
            return { ...state };
    }
}