import { render, screen } from '@testing-library/react'
import Home from '../app/page' // Adjust path if using src/app/page
import '@testing-library/jest-dom'

jest.mock('three', () => {
  const originalThree = jest.requireActual('three');
  return {
    ...originalThree,
    WebGLRenderer: jest.fn().mockImplementation(() => ({
      setSize: jest.fn(),
      render: jest.fn(),
      dispose: jest.fn(),
      clear: jest.fn(),
      setClearColor: jest.fn(),
      autoClear: false,          
      shadowMap: { enabled: false },
      domElement: typeof document !== 'undefined' ? document.createElement('canvas') : {},
    })),
  };
});

describe('Home Page', () => {
  it('renders the hello world heading', () => {
    // ARRANGE: Render the component
    const { container } = render(<Home />);

    // ACT: Look for the specific element
    const canvasByTag = container.querySelector('canvas');
    expect(canvasByTag).not.toBeNull();
  })
})