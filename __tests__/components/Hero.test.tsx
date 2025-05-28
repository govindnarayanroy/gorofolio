import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Hero from '@/components/Hero'

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

describe('Hero Component', () => {
  it('renders without crashing', () => {
    render(<Hero />)
    expect(screen.getByText(/Build Your/)).toBeInTheDocument()
  })

  it('contains call-to-action buttons', () => {
    render(<Hero />)

    const getStartedButton = screen.getByRole('link', { name: /get started free/i })
    const watchDemoButton = screen.getByRole('link', { name: /watch demo/i })

    expect(getStartedButton).toBeInTheDocument()
    expect(watchDemoButton).toBeInTheDocument()
  })

  it('has correct link destinations', () => {
    render(<Hero />)

    const getStartedButton = screen.getByRole('link', { name: /get started free/i })
    expect(getStartedButton).toHaveAttribute('href', '/login')
  })
})
