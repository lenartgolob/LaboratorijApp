import { SET_ORIGIN_PLACE_ID, SET_ORIGIN_ADDRESS, SET_DESTINATION_PLACE_ID, SET_DESTINATION_ADDRESS } from './actions';

const initialState = {
    origin: null,
    originAddress: null,
    destination: null,
    destinationAddress: null,
}

function ljubljanaTransportReducer(state = initialState, action) {
    switch(action.type) {
        case SET_ORIGIN_PLACE_ID:
            return { ...state, origin: action.payload };
        case SET_ORIGIN_ADDRESS:
            return { ...state, originAddress: action.payload };  
        case SET_DESTINATION_PLACE_ID:
            return { ...state, destination: action.payload };
        case SET_DESTINATION_ADDRESS:
            return { ...state, destinationAddress: action.payload };    
        default:
            return state;    
    }
}

export default ljubljanaTransportReducer;
