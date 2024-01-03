import * as actionTypes from '../action-types/action-types';

const initialState = {
    currentState: false,
};

const stateRefreshReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.STATE_REFRESH:
            return {
                ...state,
                currentState: action.payload,
            };
        default:
            return state;
    }
};

export default stateRefreshReducer;