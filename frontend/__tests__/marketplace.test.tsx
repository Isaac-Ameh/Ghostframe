// 🎃 GhostFrame Frontend Marketplace Tests

import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MarketplacePage from '../app/marketplace/page';

// Mock fetch
global.fetch = jest.fn();

describe('Marketplace Page', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('renders marketplace page', () => {
    render(<MarketplacePage />);
    expect(screen.getByText(/Module Marketplace/i)).toBeInTheDocument();
  });

  it('displays search bar', () => {
    render(<MarketplacePage />);
    const searchInput = screen.getByPlaceholderText(/Search modules/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('displays category filters', () => {
    render(<MarketplacePage />);
    expect(screen.getByText(/All/i)).toBeInTheDocument();
    expect(screen.getByText(/education/i)).toBeInTheDocument();
  });

  it('fetches and displays modules', async () => {
    const mockModules = {
      featured: [
        {
          id: 'quiz-ghost',
          name: 'Quiz Ghost',
          description: 'AI quiz generation',
          authorProfile: { name: 'Test Author' },
          marketplace: { downloads: 100, featured: true },
          ratings: { average: 4.5, count: 10 },
          tags: ['education'],
          categories: ['education'],
          pricing: { type: 'free' },
        },
      ],
      trending: [],
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockModules,
    });

    render(<MarketplacePage />);

    await waitFor(() => {
      expect(screen.getByText('Quiz Ghost')).toBeInTheDocument();
    });
  });

  it('handles fetch errors gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    render(<MarketplacePage />);

    // Should still render without crashing
    expect(screen.getByText(/Module Marketplace/i)).toBeInTheDocument();
  });
});
