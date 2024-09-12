import {combineReducers, configureStore} from '@reduxjs/toolkit'
import userReducer from './user/userSlice'
import adminReducer from './admin/adminSlice'
import counterReducer from './user/counterSlice'
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({
    user: userReducer,
    admin: adminReducer,
    counter: counterReducer
});

const persistConfig = {
    key: 'root',
    version: 1,
    storage
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    })
})

export const persistor = persistStore(store);