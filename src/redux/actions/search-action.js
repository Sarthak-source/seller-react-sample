import * as actionTypes from '../action-types/action-types';

export const setSearchTerm = (term) => ({
    type: actionTypes.SET_SEARCH_TERM,
    payload: term,
});
