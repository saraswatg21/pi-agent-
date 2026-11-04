import React from "react";
import { render, screen } from "@testing-library/react";
import axios from "axios";
import Forcast from "./forcast";
import apiKeys from "./apiKeys";

jest.mock("axios", () => ({
  get: jest.fn(() => new Promise(() => {})),
}));

jest.mock("react-animated-weather", () => () => null);

describe("Forcast", () => {
  test("hides city search and automatically requests the default forecast", () => {
    render(<Forcast icon="CLEAR_DAY" weather="Clear" />);

    expect(screen.queryByPlaceholderText(/Search any city/i)).toBeNull();
    expect(axios.get).toHaveBeenCalledWith(
      `${apiKeys.base}weather?q=Delhi&units=metric&APPID=${apiKeys.key}`
    );
  });
});
