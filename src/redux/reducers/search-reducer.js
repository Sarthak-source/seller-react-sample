import * as actionTypes from '../action-types/action-types';

const initialState = {
    items: [],
    searchTerm: '',
};

const searchReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_SEARCH_TERM:
            return {
                ...state,
                searchTerm: action.payload,
            };
        default:
            return state;
    }
};

export default searchReducer;
