import { UPDATE_CONFIG } from "./config.type";

export const updateConfig = (payload) => ({
  type: UPDATE_CONFIG,
  payload,
});
