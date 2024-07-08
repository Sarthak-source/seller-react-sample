import * as actionTypes from '../action-types/action-types';

const storedUser = localStorage.getItem('user');
const storedSelectedUser = storedUser ? JSON.parse(storedUser) : null;

const storedUserConfig = localStorage.getItem('userConfig');
const storedSelectedUserConfig = storedUserConfig ? JSON.parse(storedUserConfig) : null;

const initialState = {
    selectedUser: storedSelectedUser,
    selectUserConfig: storedSelectedUserConfig,
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
        case actionTypes.SELECT_TEMP_USER:
            return {
                ...state,
                selectedTempUser: action.payload,
            };
        case actionTypes.SELECT_USER_CONFIG:
            localStorage.setItem('userConfig', JSON.stringify(action.payload));
            return {
                ...state,
                selectUserConfig: action.payload,
            };
        default:
            return state;
    }
};

export default userReducer;
