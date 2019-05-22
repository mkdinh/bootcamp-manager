// import json fs functions
//--------------------------------------------------------
import jsonUpdater from '../functions/json_updater';
import json_updater from '../functions/json_updater';

// handle dispatching functions
//--------------------------------------------------------
export default {
  updateCurrent: week => {
    return dispatch =>
      jsonUpdater.updateCurrentWeek(week).then(() =>
        dispatch({
          type: 'UPDATE_CURRENT_WEEK',
          payload: { current: week },
        }),
      );
  },

  updateCurrentDay: day => {
    return dispatch =>
      jsonUpdater.updateCurrentDay(day).then(() =>
        dispatch({
          type: 'UPDATE_CURRENT_DAY',
          payload: { day },
        }),
      );
  },
};
