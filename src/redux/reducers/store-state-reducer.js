import * as actionTypes from '../action-types/action-types';

const initialState = {
    storeState: null,
    fromVehicleInward: false,
};

const storeReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.STORE_STATE:
            return {
                ...state,
                storeState: action.payload.state,
                fromVehicleInward: action.payload.fromVehicleInward 
            };
        default:
            return state;
    }
};

export default storeReducer;