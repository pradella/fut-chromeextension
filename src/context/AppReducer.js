import _ from "lodash";
import * as actionTypes from "./actionTypes";

const AppReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.payload,
      };

    case actionTypes.INITIALIZE_CONNECTION:
      return {
        ...state,
        chromeExtension: {
          ...state.chromeExtension,
          initialized: true,
        },
      };

    case actionTypes.ADD_ACTION_QUEUE:
      return {
        ...state,
        chromeExtension: {
          ...state.chromeExtension,
          actionQueue: [
            ...state.chromeExtension.actionQueue,
            action.payload,
          ],
        },
      };

    case actionTypes.REMOVE_ACTION_QUEUE:
      return {
        ...state,
        chromeExtension: {
          ...state.chromeExtension,
          actionQueue: _.filter(
            state.chromeExtension.actionQueue,
            (item) => item.action !== action.payload.action
          ),
        },
      };

    default:
      return state;
  }
};

export default AppReducer;
