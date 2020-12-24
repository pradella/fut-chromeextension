/*global chrome*/
import React, { createContext, useEffect, useReducer, useRef } from "react";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";

import AppReducer from "./AppReducer";
import * as actionTypes from "./actionTypes";

// Initial state
const initialState = {
  user: null,
  chromeExtension: {
    initialized: false,
    actionQueue: [],
  },
};

// Create context
export const GlobalContext = createContext(initialState);

// Provider component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  // detect changes in queue, and then process it
  useEffect(() => {
    _.forEach(state.chromeExtension.actionQueue, processAction);
  }, [JSON.stringify(state.chromeExtension.actionQueue)]); //eslint-disable-line

  // Actions
  function setUser(user) {
    dispatch({
      type: actionTypes.SET_USER,
      payload: user,
    });
  }

  function initializeConnection() {
    // init connection with background.js
    if (!state.chromeExtension.initialized && chrome?.extension) {
      const port = chrome.extension.connect({
        name: "Sample Communication",
      });

      // listen messages from background.js
      port.onMessage.addListener((action = {}) => {
        console.log("onMessage", action);
        if (!action.action) {
          console.error("No action received");
        }

        const callback = findActionQueue(action);
        callback?.callback && callback.callback(action.payload);

        removeActionQueue(callback);
      });

      dispatch({
        type: actionTypes.INITIALIZE_CONNECTION,
      });
    }
  }

  function executeAction(action, params, callback) {
    addActionQueue({
      id: uuidv4(),
      action,
      params,
      callback,
    });
  }

  function processAction(action = {}) {
    if (!chrome?.tabs?.query) return;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, action, (response) => {
        if (response) {
          // do cool things with the response
          // ...
        }
      });
    });
  }

  function addActionQueue(callback = {}) {
    dispatch({
      type: actionTypes.ADD_ACTION_QUEUE,
      payload: callback,
    });
  }

  function findActionQueue(action = {}) {
    return (
      _.find(
        stateRef.current.chromeExtension.actionQueue,
        (item) => item.id === action.id
      ) ||
      (() =>
        console.error(`Callback ${action.action} (${action.id}) not found`))
    );
  }

  function removeActionQueue(callback = {}) {
    dispatch({
      type: actionTypes.REMOVE_ACTION_QUEUE,
      payload: callback,
    });
  }

  return (
    <GlobalContext.Provider
      value={{
        ...state,
        setUser,
        executeAction,
        initializeConnection,
        isConnectionInitialized: state.chromeExtension.initialized,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
