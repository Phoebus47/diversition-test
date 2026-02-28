import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useGalleryFilter } from '@/lib/hooks/use-gallery-filter';

describe('useGalleryFilter', () => {
  it('starts with no active hashtag', () => {
    const { result } = renderHook(() => useGalleryFilter());
    expect(result.current.activeHashtag).toBeNull();
    expect(result.current.filter({ hashtags: ['#nature'] } as any)).toBe(true);
  });

  it('sets active hashtag on click', () => {
    const { result } = renderHook(() => useGalleryFilter());

    act(() => {
      result.current.onHashtagClick('#nature');
    });

    expect(result.current.activeHashtag).toBe('#nature');
    expect(result.current.filter({ hashtags: ['#nature'] } as any)).toBe(true);
    expect(result.current.filter({ hashtags: ['#travel'] } as any)).toBe(false);
  });

  it('toggles off when clicking same hashtag again', () => {
    const { result } = renderHook(() => useGalleryFilter());

    act(() => result.current.onHashtagClick('#nature'));
    expect(result.current.activeHashtag).toBe('#nature');

    act(() => result.current.onHashtagClick('#nature'));
    expect(result.current.activeHashtag).toBeNull();
  });

  it('switches to new hashtag when clicking different one', () => {
    const { result } = renderHook(() => useGalleryFilter());

    act(() => result.current.onHashtagClick('#nature'));
    act(() => result.current.onHashtagClick('#travel'));

    expect(result.current.activeHashtag).toBe('#travel');
  });

  it('onClearFilter resets active hashtag', () => {
    const { result } = renderHook(() => useGalleryFilter());

    act(() => result.current.onHashtagClick('#nature'));
    expect(result.current.activeHashtag).toBe('#nature');

    act(() => result.current.onClearFilter());
    expect(result.current.activeHashtag).toBeNull();
  });
});
