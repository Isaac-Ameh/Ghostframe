import { render, screen } from '@testing-library/react'
import { SpookyLoader } from '@/components/Animations/SpookyLoader'

describe('SpookyLoader', () => {
  it('renders loading state when isLoading is true', () => {
    render(<SpookyLoader isLoading={true} />)

    // Should show loading animation
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('does not render when isLoading is false', () => {
    render(<SpookyLoader isLoading={false} />)

    // Should not show loading animation
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('displays custom message when provided', () => {
    const customMessage = 'Loading spooky content...'
    render(<SpookyLoader isLoading={true} message={customMessage} />)

    expect(screen.getByText(customMessage)).toBeInTheDocument()
  })

  it('displays default message when no message provided', () => {
    render(<SpookyLoader isLoading={true} />)

    // Should have some default loading text
    const loadingElement = screen.getByRole('status')
    expect(loadingElement).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<SpookyLoader isLoading={true} message="Loading..." />)

    const loadingElement = screen.getByRole('status')
    expect(loadingElement).toHaveAttribute('aria-live', 'polite')
  })

  it('applies correct CSS classes for styling', () => {
    const { container } = render(<SpookyLoader isLoading={true} />)

    // Check that the loader has appropriate styling classes
    const loaderElement = container.querySelector('[role="status"]')
    expect(loaderElement).toHaveClass('flex', 'items-center', 'justify-center')
  })
})