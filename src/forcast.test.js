import React from "react";
import { render, screen } from "@testing-library/react";
import axios from "axios";
import Forcast from "./forcast";

jest.mock("axios", () => ({
  get: jest.fn(() => new Promise(() => {})),
}));

jest.mock("react-animated-weather", () => () => null);

describe("Forcast", () => {
  test("does not render a city search field", () => {
    render(<Forcast icon="CLEAR_DAY" weather="Clear" />);

    expect(screen.queryByPlaceholderText(/Search any city/i)).toBeNull();
    expect(axios.get).toHaveBeenCalled();
  });
});
