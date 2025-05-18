import { createSlice } from "@reduxjs/toolkit";

const serverSlice = createSlice({
    name: 'server',
    initialState: {
        ipAddress: '',
        port: '',
        connected: false
    },
    reducers: {
        setServerConfig: (state, action) => {
            state.ipAddress = action.payload.ip;
            state.port = action.payload.port;
        },
        setConnected: (state, action) => {
            state.connected = action.payload;
        },
    }
});

export const { setServerConfig, setConnected } = serverSlice.actions;
export const serverSelector = (state) => state.server;
export default serverSlice.reducer;
