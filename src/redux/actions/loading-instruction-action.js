import * as actionTypes from '../action-types/action-types';

export const setLoadingInstructionScreen = (state) => ({
    type: actionTypes.LOADING_INSTRUCTION_DETAILS,
    payload: state,
});
