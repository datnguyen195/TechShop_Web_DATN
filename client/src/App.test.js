import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

test("renders learn react link", () => {
  const { getByText } = render(
    <Provider store={store}>
      <ToastContainer />

      <App />
    </Provider>
  );

  expect(getByText(/learn/i)).toBeInTheDocument();
});
