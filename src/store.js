// Import dependencies
//--------------------------------------------------------
import { createStore, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import reducers from "./utils/reducers";
// Create global storage
//--------------------------------------------------------

let midwares = [thunk];

if(process.env.NODE_ENV === 'development') {
    let logger = createLogger({
        predicate: process.env.NODE_ENV === 'development'
    });

    midwares = [...midwares, logger];
};

const store = createStore(reducers, applyMiddleware(...midwares));

export default store;


