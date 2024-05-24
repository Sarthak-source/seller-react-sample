import * as actionTypes from '../action-types/action-types';



const initialState = {
    toggleState: true,
};

const toggleReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.TOGGLE_NAV_BAR:
            return {
                ...state,
                toggleState: action.payload,
            };
        default:
            return state;
    }
};

export default toggleReducer;
