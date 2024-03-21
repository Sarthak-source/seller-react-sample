import * as actionTypes from '../action-types/action-types';

const initialState = {
    fullScreenState: true,
};

const fullScreenReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FULL_SCREEN_STATE:
            return {
                ...state,
                fullScreenState: action.payload,
            };
        default:
            return state;
    }
};

export default fullScreenReducer;
