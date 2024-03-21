import * as actionTypes from '../action-types/action-types';

export const setFullScreen = (state) => ({
    type: actionTypes.FULL_SCREEN_STATE,
    payload: state,
});
