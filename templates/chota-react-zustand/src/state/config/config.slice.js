import intialConfigState from "./config.initial";

/*
The config slice owns app-level settings (name, language, theme). It mirrors the
Redux `config` reducer as a Zustand slice: state lives under the `config`
namespace and `updateConfig` performs the same shallow merge the reducer did.
*/
export const createConfigSlice = (set) => ({
  config: { ...intialConfigState },

  updateConfig: (payload) =>
    set(
      (state) => ({ config: { ...state.config, ...payload } }),
      false,
      "config/updateConfig"
    ),
});

export default createConfigSlice;
