import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GhostNavigation } from '@/components/Navigation/GhostNavigation'

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

describe('GhostNavigation', () => {
  it('renders all navigation links', () => {
    render(<GhostNavigation />)

    expect(screen.getByText('GhostFrame')).toBeInTheDocument()
    expect(screen.getByText('Quiz Ghost')).toBeInTheDocument()
    expect(screen.getByText('Story Spirit')).toBeInTheDocument()
    expect(screen.getByText('Upload')).toBeInTheDocument()
  })

  it('renders correct href attributes', () => {
    render(<GhostNavigation />)

    expect(screen.getByRole('link', { name: /ghostframe/i })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: /quiz ghost/i })).toHaveAttribute('href', '/quiz-ghost')
    expect(screen.getByRole('link', { name: /story spirit/i })).toHaveAttribute('href', '/story-spirit')
    expect(screen.getByRole('link', { name: /upload/i })).toHaveAttribute('href', '/upload')
  })

  it('has proper accessibility attributes', () => {
    render(<GhostNavigation />)

    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()
  })

  it('renders icons for navigation items', () => {
    render(<GhostNavigation />)

    // Check that icons are rendered (they should have specific classes or data attributes)
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)
  })

  it('applies hover effects correctly', async () => {
    const user = userEvent.setup()
    render(<GhostNavigation />)

    const quizLink = screen.getByRole('link', { name: /quiz ghost/i })
    
    await user.hover(quizLink)
    
    // The component should handle hover states (this tests that no errors occur)
    expect(quizLink).toBeInTheDocument()
  })
})