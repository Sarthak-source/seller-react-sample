import * as actionTypes from '../action-types/action-types';

export const setToggleAction = (state) => ({
    type: actionTypes.TOGGLE_NAV_BAR,
    payload: state,
});
