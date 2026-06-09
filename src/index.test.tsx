import { waitFor } from "@testing-library/react";

describe("index entrypoint", () => {
  it("renders the App in the root element", async () => {
    document.body.innerHTML = '<div id="root"></div>';

    jest.isolateModules(() => {
      require("./index");
    });

    await waitFor(() => {
      expect(document.getElementById("root")).toHaveTextContent(/splitwise/i);
    });
  });
});
