import { UPDATE_CONFIG } from "./config.type";
import intialConfigState from "./config.initial";

const config = (state = intialConfigState, action) => {
  switch (action.type) {
    case UPDATE_CONFIG:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};

export default config;
