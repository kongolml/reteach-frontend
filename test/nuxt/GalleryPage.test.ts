import { describe, it, expect } from 'vitest';
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import { ref } from 'vue';

const galleryData = {
  '1': {
    name: 'Alice',
    photos: [
      { id: 1, picture: 'https://picsum.photos/id/1/300', title: 'Sunset', userId: 1, userName: 'Alice' },
      { id: 2, picture: 'https://picsum.photos/id/2/300', title: 'Mountain', userId: 1, userName: 'Alice' },
    ],
    albums: [{ id: 1, userId: 1, title: 'Vacation' }],
    posts: [{ id: 1, userId: 1, title: 'Hello', body: 'World' }],
    comments: [{ id: 1, postId: 1, name: 'Nice', email: 'a@b.com', body: 'Great' }],
  },
  '2': {
    name: 'Bob',
    photos: [
      { id: 3, picture: 'https://picsum.photos/id/3/300', title: 'Ocean', userId: 2, userName: 'Bob' },
    ],
    albums: [
      { id: 2, userId: 2, title: 'Nature' },
      { id: 3, userId: 2, title: 'City' },
    ],
    posts: [],
    comments: [],
  },
};

let mockGalleryData: any = galleryData;

mockNuxtImport('useFetch', () => {
  return (_url: string, _opts?: any) => ({
    data: ref(mockGalleryData),
    pending: ref(false),
    error: ref(null),
  });
});

describe('gallery page', () => {
  it('renders images with correct src and alt', async () => {
    mockGalleryData = galleryData;
    const page = await mountSuspended(
      await import('~/pages/gallery.vue').then((m) => m.default),
      { route: '/gallery' },
    );

    const images = page.findAll('img');
    expect(images.length).toBe(3);

    const srcs = images.map((img) => img.attributes('src'));
    expect(srcs).toContain('https://picsum.photos/id/1/300');
    expect(srcs).toContain('https://picsum.photos/id/3/300');

    const alts = images.map((img) => img.attributes('alt'));
    expect(alts).toContain('Sunset');
    expect(alts).toContain('Ocean');
  });

  it('renders user names above images list', async () => {
    mockGalleryData = galleryData;
    const page = await mountSuspended(
      await import('~/pages/gallery.vue').then((m) => m.default),
      { route: '/gallery' },
    );

    const headings = page.findAll('h2');
    const headingTexts = headings.map((h) => h.text());
    expect(headingTexts).toContain('Alice');
    expect(headingTexts).toContain('Bob');
  });

  it('displays user\'s statistics', async () => {
    mockGalleryData = galleryData;
    const page = await mountSuspended(
      await import('~/pages/gallery.vue').then((m) => m.default),
      { route: '/gallery' },
    );

    const text = page.text();
    // Alice: 1 album, 1 post, 1 comment
    expect(text).toContain('Albums: 1');
    expect(text).toContain('Posts: 1');
    expect(text).toContain('Comments: 1');
    // Bob: 2 albums, 0 posts, 0 comments
    expect(text).toContain('Albums: 2');
    expect(text).toContain('Posts: 0');
    expect(text).toContain('Comments: 0');
  });

  it('doesnt render user sections when gallery is empty', async () => {
    mockGalleryData = {};
    const page = await mountSuspended(
      await import('~/pages/gallery.vue').then((m) => m.default),
      { route: '/gallery' },
    );

    const images = page.findAll('img');
    expect(images.length).toBe(0);
  });
});
