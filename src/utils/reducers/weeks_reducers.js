// set init state
//--------------------------------------------------------
const initState = {
  weeks: 24,
  current: 1,
  day: 1,
};

// handle dispatch request
//--------------------------------------------------------
export default (state = initState, action) => {
  switch (action.type) {
    case 'INIT_WEEKS':
      return { ...state, ...action.payload, ...action.payload.current };

    case 'UPDATE_CURRENT_WEEK':
      return { ...state, current: action.payload.current };

    case 'UPDATE_CURRENT_DAY':
      return { ...state, day: action.payload.day };

    default:
      return { ...state };
  }
};
