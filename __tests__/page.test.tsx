import { render, screen } from '@testing-library/react'
import Home from '../app/page' // Adjust path if using src/app/page
import '@testing-library/jest-dom'

describe('Home Page', () => {
  it('renders the hello world heading', () => {
    // ARRANGE: Render the component
    render(<Home />)

    // ACT: Look for the specific element
    const heading = screen.getByRole('heading', { level: 1 })

    // ASSERT: Verify it exists and contains the right text
    expect(heading).toBeInTheDocument()
  })
})
