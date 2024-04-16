import { produce } from 'immer';
import * as actionTypes from '../action-types/action-types';

const initialState = {
    selectedStoreSummary: null,
    error: null,
};

const storeSummaryReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.STORE_SUMMARY_STATE:
            return produce(state, draftState => {
                draftState.selectedStoreSummary = action.payload;
            });

        default:
            return state;
    }
};

export default storeSummaryReducer;
