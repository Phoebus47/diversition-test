import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useMasonryColumns } from '@/lib/hooks/use-masonry-columns';

const mockImages = [
  { id: '1', width: 100, height: 100, src: '', alt: '', hashtags: [] },
  { id: '2', width: 100, height: 200, src: '', alt: '', hashtags: [] },
  { id: '3', width: 100, height: 50, src: '', alt: '', hashtags: [] },
];

describe('useMasonryColumns', () => {
  it('distributes images across columns based on height', () => {
    const { result } = renderHook(() => useMasonryColumns(mockImages, 2));

    // Column 1 gets image 1 (height ratio 1)
    // Column 2 gets image 2 (height ratio 2)
    // Column 1 is shorter (1 < 2), so it gets image 3 (height ratio 0.5)
    expect(result.current[0]).toHaveLength(2);
    expect(result.current[1]).toHaveLength(1);
    expect(result.current[0][0].id).toBe('1');
    expect(result.current[1][0].id).toBe('2');
    expect(result.current[0][1].id).toBe('3');
  });

  it('handles zero or negative column count gracefully', () => {
    const { result: r0 } = renderHook(() => useMasonryColumns(mockImages, 0));
    expect(r0.current).toEqual([]);

    const { result: rNeg } = renderHook(() =>
      useMasonryColumns(mockImages, -1),
    );
    expect(rNeg.current).toEqual([]);
  });

  it('handles empty image list', () => {
    const { result } = renderHook(() => useMasonryColumns([], 3));
    expect(result.current).toHaveLength(3);
    result.current.forEach((col) => expect(col).toHaveLength(0));
  });
});
