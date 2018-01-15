// Import dependencies
//--------------------------------------------------------
import { createStore, applyMiddleware } from "redux";
import { createLogger as logger} from "redux-logger";
import thunk from "redux-thunk";
import reducers from "./utils/reducers";

// Create global storage
//--------------------------------------------------------
const midwares = applyMiddleware(thunk, logger());

const store = createStore(reducers, midwares);

export default store;


