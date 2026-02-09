import actionNames from "./actionNames";

export const resetState = (state) => {
    return {
        type: actionNames.RESET_STATE,
        payload: state
    }
};