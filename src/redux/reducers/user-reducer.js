import * as actionTypes from '../action-types/action-types';

const initialState = {
    selectedUser: null,
    error: null,
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SELECT_USER:
            return {
                ...state,
                selectedUser: action.payload,
            };
        default:
            return state;
    }
};

export default userReducer;