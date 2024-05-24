import * as actionTypes from '../action-types/action-types';

const initialState = {
    loadingInstructionScreen: '',
    currentStatus:''
};

const loadingInstructionScreenReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOADING_INSTRUCTION_DETAILS:
            return {
                ...state,
                loadingInstructionScreen: action.payload.loadingsInstruction,
                currentStatus:action.payload.currentStatus
                ,
            };
        default:
            return state;
    }
};

export default loadingInstructionScreenReducer;
