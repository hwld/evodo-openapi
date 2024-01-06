import { render, screen } from "@testing-library/react";
import { Button } from "./button";
import { expect } from "vitest";

describe("ボタン", () => {
  it("ボタンがレンダリングされている", () => {
    render(<Button>ボタン</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
