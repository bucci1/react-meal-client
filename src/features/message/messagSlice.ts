import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message } from "./messagTypes";

const initialState: Message = {
  type: "success",
  message: "",
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMessage: (state, action: PayloadAction<Message>) => {
      state.type = action.payload.type;
      state.message = action.payload.message;
    },
    initMessage: (state) => {
      state.message = "";
    },
  },
});

export const { setMessage, initMessage } = messageSlice.actions;
export default messageSlice.reducer;
