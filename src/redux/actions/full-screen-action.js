import * as actionTypes from '../action-types/action-types';

export const setFullScreen = (state) => ({
    type: actionTypes.TOGGLE_NAV_BAR,
    payload: state,
});
