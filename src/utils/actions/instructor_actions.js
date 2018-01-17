// import json fs functions
//--------------------------------------------------------
import jsonUpdater from "../functions/json_updater";

// handle dispatching functions
//--------------------------------------------------------
export default {

    updateDir: (key, value) => {
        return (
            dispatch => jsonUpdater.updateDir("instructor", key, value)
                .then(() => 
                    dispatch({
                        type: "UPDATE_INSTRUCTOR_DIRECTORY",
                        payload: { 
                            key: key,
                            value: value
                        }
                    })
                )
        );     
    }
};
