import * as actionTypes from '../action-types/action-types';

const storedMill = localStorage.getItem('mill');
const storedSelectedMill = storedMill ? JSON.parse(storedMill) : null;

const initialState = {
    selectedMill: storedSelectedMill,
    error: null,
};

const millReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SELECT_MILL:
            localStorage.setItem('mill', JSON.stringify(action.payload));
            return {
                ...state,
                selectedMill: action.payload,
            };
        default:
            return state;
    }
};

export default millReducer;