import { render, screen } from '@testing-library/react'
import { AppLayout } from '@/components/Layout/AppLayout'

describe('AppLayout', () => {
  it('renders children correctly', () => {
    render(
      <AppLayout>
        <div>Test Content</div>
      </AppLayout>
    )

    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('renders navigation when showNavigation is true', () => {
    render(
      <AppLayout showNavigation={true}>
        <div>Test Content</div>
      </AppLayout>
    )

    // Check for navigation elements
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('applies correct CSS classes', () => {
    const { container } = render(
      <AppLayout>
        <div>Test Content</div>
      </AppLayout>
    )

    const mainElement = container.querySelector('main')
    expect(mainElement).toHaveClass('min-h-screen')
  })

  it('renders with default props', () => {
    render(
      <AppLayout>
        <div>Test Content</div>
      </AppLayout>
    )

    // Should render without errors
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })
})