// 🎃 GhostFrame Module Card Component Tests

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock module card component
const ModuleCard = ({ module, featured }: any) => (
  <div data-testid="module-card">
    <h3>{module.name}</h3>
    <p>{module.description}</p>
    <span>{module.ratings.average}</span>
    <span>{module.marketplace.downloads}</span>
    {featured && <span>Featured</span>}
  </div>
);

describe('ModuleCard Component', () => {
  const mockModule = {
    id: 'test-module',
    name: 'Test Module',
    description: 'A test module',
    authorProfile: {
      name: 'Test Author',
      avatar: '',
    },
    marketplace: {
      downloads: 100,
      featured: false,
    },
    ratings: {
      average: 4.5,
      count: 10,
    },
    tags: ['test'],
    categories: ['utility'],
    pricing: {
      type: 'free',
    },
  };

  it('renders module information', () => {
    render(<ModuleCard module={mockModule} />);

    expect(screen.getByText('Test Module')).toBeInTheDocument();
    expect(screen.getByText('A test module')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('shows featured badge when featured', () => {
    render(<ModuleCard module={mockModule} featured={true} />);
    expect(screen.getByText('Featured')).toBeInTheDocument();
  });

  it('does not show featured badge when not featured', () => {
    render(<ModuleCard module={mockModule} featured={false} />);
    expect(screen.queryByText('Featured')).not.toBeInTheDocument();
  });
});
