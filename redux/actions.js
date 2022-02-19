export const SET_ORIGIN_PLACE_ID = 'SET_ORIGIN_PLACE_ID';
export const SET_ORIGIN_ADDRESS = 'SET_ORIGIN_ADDRESS';
export const SET_DESTINATION_PLACE_ID = 'SET_DESTINATION_PLACE_ID';
export const SET_DESTINATION_ADDRESS = 'SET_DESTINATION_ADDRESS';

export const setOrigin = origin => dispatch => {
    dispatch({
        type: SET_ORIGIN_PLACE_ID,
        payload: origin,
    });
};

export const setOriginAddress = originAddress => dispatch => {
    dispatch({
        type: SET_ORIGIN_ADDRESS,
        payload: originAddress,
    });
};

export const setDestination = destination => dispatch => {
    dispatch({
        type: SET_DESTINATION_PLACE_ID,
        payload: destination,
    });
};

export const setDestinationAddress = destinationAddress => dispatch => {
    dispatch({
        type: SET_DESTINATION_ADDRESS,
        payload: destinationAddress,
        
    });
};