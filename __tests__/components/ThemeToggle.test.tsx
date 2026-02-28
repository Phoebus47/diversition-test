import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useTheme } from '@/lib/hooks/use-theme';
import { ThemeToggle } from '@/components/ThemeToggle';

vi.mock('@/lib/hooks/use-theme');

describe('ThemeToggle', () => {
  afterEach(() => cleanup());

  it('renders trigger button with aria-label', () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'system',
      setTheme: vi.fn(),
      effectiveTheme: 'light',
    });
    render(<ThemeToggle />);
    expect(
      screen.getByRole('button', { name: /theme \(light, dark, or system\)/i }),
    ).toBeInTheDocument();
  });

  it('opens dropdown and shows Light, Dark, System menuitems on click', () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'system',
      setTheme: vi.fn(),
      effectiveTheme: 'light',
    });
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole('button', { name: /theme/i }));
    expect(screen.getByRole('group', { name: /theme/i })).toBeInTheDocument();
    expect(
      screen.getByRole('menuitem', { name: /^light$/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('menuitem', { name: /^dark$/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('menuitem', { name: /^system$/i }),
    ).toBeInTheDocument();
  });

  it('calls setTheme when option is selected', () => {
    const setTheme = vi.fn();
    vi.mocked(useTheme).mockReturnValue({
      theme: 'system',
      setTheme,
      effectiveTheme: 'light',
    });
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole('button', { name: /theme/i }));
    fireEvent.click(screen.getByText('Dark'));
    expect(setTheme).toHaveBeenCalledWith('dark');
  });

  it('calls setTheme with light when Light is selected', () => {
    const setTheme = vi.fn();
    vi.mocked(useTheme).mockReturnValue({
      theme: 'dark',
      setTheme,
      effectiveTheme: 'dark',
    });
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole('button', { name: /theme/i }));
    fireEvent.click(screen.getByText('Light'));
    expect(setTheme).toHaveBeenCalledWith('light');
  });

  it('calls setTheme with system when System is selected', () => {
    const setTheme = vi.fn();
    vi.mocked(useTheme).mockReturnValue({
      theme: 'light',
      setTheme,
      effectiveTheme: 'light',
    });
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole('button', { name: /theme/i }));
    fireEvent.click(screen.getByText('System'));
    expect(setTheme).toHaveBeenCalledWith('system');
  });

  it('shows light icon when effectiveTheme is light', () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
      effectiveTheme: 'light',
    });
    const { container } = render(<ThemeToggle />);
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelector('circle')).toBeInTheDocument();
  });

  it('shows dark icon when effectiveTheme is dark', () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'dark',
      setTheme: vi.fn(),
      effectiveTheme: 'dark',
    });
    const { container } = render(<ThemeToggle />);
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelector('path[d*="12.79"]')).toBeInTheDocument();
  });

  it('shows dark icon when theme is system but system is dark', () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'system',
      setTheme: vi.fn(),
      effectiveTheme: 'dark',
    });
    const { container } = render(<ThemeToggle />);
    expect(container.querySelector('path[d*="12.79"]')).toBeInTheDocument();
  });

  it('closes dropdown on Escape key', () => {
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole('button', { name: /theme/i }));
    expect(screen.getByRole('group', { name: /theme/i })).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(
      screen.queryByRole('group', { name: /theme/i }),
    ).not.toBeInTheDocument();
  });

  it('keeps dropdown open on other key than Escape', () => {
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole('button', { name: /theme/i }));
    expect(screen.getByRole('group', { name: /theme/i })).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(screen.getByRole('group', { name: /theme/i })).toBeInTheDocument();
  });

  it('closes dropdown on click outside', () => {
    render(
      <div>
        <ThemeToggle />
        <button type="button">Outside</button>
      </div>,
    );
    fireEvent.click(screen.getByRole('button', { name: /theme/i }));
    expect(screen.getByRole('group', { name: /theme/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Outside' }));
    expect(
      screen.queryByRole('group', { name: /theme/i }),
    ).not.toBeInTheDocument();
  });

  it('keeps dropdown open when clicking inside dropdown (not on menuitem)', () => {
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole('button', { name: /theme/i }));
    const group = screen.getByRole('group', { name: /theme/i });
    const wrapper = group.parentElement;
    expect(wrapper).toBeTruthy();
    if (wrapper) fireEvent.click(wrapper);
    expect(screen.getByRole('group', { name: /theme/i })).toBeInTheDocument();
  });
});
