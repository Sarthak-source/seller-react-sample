import * as actionTypes from '../action-types/action-types';

const storedUser = localStorage.getItem('user');
const storedSelectedUser = storedUser ? JSON.parse(storedUser) : null;

const initialState = {
    selectedUser: storedSelectedUser,
    error: null,
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SELECT_USER:
            localStorage.setItem('user', JSON.stringify(action.payload));
            return {
                ...state,
                selectedUser: action.payload,
            };
        default:
            return state;
    }
};

export default userReducer;
