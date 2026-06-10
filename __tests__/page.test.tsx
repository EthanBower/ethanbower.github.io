import { render } from "@testing-library/react";
import Home from "../app/home/page";
import "@testing-library/jest-dom";
import { SettingsProvider } from "@/lib/components/global/settingsProvider";

jest.mock("three", () => {
  const originalThree = jest.requireActual("three");
  return {
    ...originalThree,
    WebGLRenderer: jest.fn().mockImplementation(() => ({
      setSize: jest.fn(),
      render: jest.fn(),
      dispose: jest.fn(),
      setPixelRatio: jest.fn(),
      clear: jest.fn(),
      setClearColor: jest.fn(),
      autoClear: false,
      shadowMap: { enabled: false },
      domElement:
        typeof document !== "undefined" ? document.createElement("canvas") : {},
    })),
  };
});

jest.mock("three/examples/jsm/libs/stats.module.js", () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => {
      return {
        dom: document.createElement("div"),
        showPanel: jest.fn(),
        begin: jest.fn(),
        end: jest.fn(),
      };
    }),
  };
});

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false, // Set to true if you want to mock dark mode by default
      media: query,
      onchange: null,
      addListener: jest.fn(), // Use vi.fn() if using Vitest
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }),
  });
});

describe("Home Page", () => {
  it("renders the hello world heading", () => {
    // ARRANGE: Render the component
    const { container } = render(
      <SettingsProvider>
        <Home />
      </SettingsProvider>,
    );

    // ACT: Look for the specific element
    const canvas = container.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
  });
});
