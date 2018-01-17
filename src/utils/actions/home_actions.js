// handle dispatching functions
//--------------------------------------------------------
export default {
    cSection: offset => {
        return (
            dispatch =>
                dispatch({
                    type: "UPDATE_CURRENT_SECTION",
                    payload: { 
                        offset: offset
                    }
                })
        )
    }
};
