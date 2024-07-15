import { createSlice } from "@reduxjs/toolkit";
export const appStore = createSlice({
  name: "app",
  initialState: {
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Bắt đầu thực hiện action login (Promise pending)
    builder.addCase(login.pending, (state) => {
      // Bật trạng thái loading
      state.isLoading = true;
    });

    // Khi thực hiện action login thành công (Promise fulfilled)
    builder.addCase(login.fulfilled, (state, action) => {
      // Tắt trạng thái loading, lưu thông tin user vào store
      state.isLoading = false;
      state.currentUser = action.payload;
    });

    // Khi thực hiện action login thất bại (Promise rejected)
    builder.addCase(login.rejected, (state, action) => {
      // Tắt trạng thái loading, lưu thông báo lỗi vào store
      state.isLoading = false;
      state.errorMessage = action.payload.message;
    });
  },
});
