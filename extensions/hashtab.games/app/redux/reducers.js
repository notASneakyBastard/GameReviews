import { combineReducers } from 'redux';
import {
    ADD_REVIEWS,
    ADD_REVIEW,
    REVIEWS_LOADING,
    REVIEWS_LOADED,
    REIVEWS_FETCH_ERROR,
    MAP_REVIEWS,
    MAP_REVIEW,
} from './types';

import { preventStateRehydration } from '@shoutem/core/preventStateRehydration';

const reviews = (state = {}, action) => {
    const id = action.id;
    const payload = action.payload;
    console.log(state, action);
    switch (action.type) {
        case ADD_REVIEWS:
            //var s = state[id] !== undefined ? state[id] + payload : payload
            const f = Object.assign(state[id] === undefined ? {} : state[id], payload)
            console.log(f);
            return {
                ...state,
                [id]: { ...f },
            };
        case ADD_REVIEW:
            return {
                ...state,
                [id]: {
                    ...state[id],
                    [action.name]: payload,
                }
            };
        default:
            return state;
    }
};

const loader = (state = {}, action) => {
    switch (action.type) {
        case REVIEWS_LOADING:
            return {
                isLoading: true,
            };
        case REVIEWS_LOADED:
            return {
                error: false,
                isLoading: false,

            };
        case REIVEWS_FETCH_ERROR:
            return {
                error: true,
                isLoading: false,

            };
        default:
            return state;
    }
};

const map = (state = {}, action) => {
    const id = action.id;
    const payload = action.payload;
    switch (action.type) {
        case MAP_REVIEWS:
            const f = Object.assign(state[id] === undefined ? {} : state[id], payload);
            return {
                ...state,
                [action.id]: { ...f },
            };
        case ADD_REVIEW:
            // const f = Object.assign(state[id] === undefined ? {} : state[id], payload);
            return {
                ...state,
                [action.id]: { 
                    ...state[id],
                    [action.name]: action.payload,
                 },
            };
        default:
            return state
    }
};


export default preventStateRehydration(combineReducers({ reviews, loader, map }));
