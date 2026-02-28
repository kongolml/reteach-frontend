import { describe, it, expect } from 'vitest';
import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime';

const todosData = [
  { userId: 1, id: 1, title: 'Buy groceries', completed: false },
  { userId: 1, id: 2, title: 'Walk the dog', completed: true },
  { userId: 1, id: 3, title: 'Read a book', completed: false },
];

describe('users todo page', () => {
  registerEndpoint('https://jsonplaceholder.typicode.com/users/1/todos', () => todosData);

  it('renders page title with user\'s ID', async () => {
    const page = await mountSuspended(
      await import('~/pages/user/[id].vue').then((m) => m.default),
      { route: { name: 'user-id', params: { id: '1' } } },
    );

    expect(page.text()).toContain("User's 1 Todo's");
  });

  it('renders todo items with correct titles', async () => {
    const page = await mountSuspended(
      await import('~/pages/user/[id].vue').then((m) => m.default),
      { route: { name: 'user-id', params: { id: '1' } } },
    );

    const items = page.findAll('li');
    expect(items.length).toBe(3);

    const texts = items.map((li) => li.text());
    expect(texts).toContain('Buy groceries');
    expect(texts).toContain('Walk the dog');
    expect(texts).toContain('Read a book');
  });

  it('sets [data-completed] attribute with respect to todo\'s status', async () => {
    const page = await mountSuspended(
      await import('~/pages/user/[id].vue').then((m) => m.default),
      { route: { name: 'user-id', params: { id: '1' } } },
    );

    const items = page.findAll('li');
    const completedAttrs = items.map((li) => li.attributes('data-completed'));
    expect(completedAttrs).toEqual(['false', 'true', 'false']);
  });

  it('sets "checked" completed todo checkboxes', async () => {
    const page = await mountSuspended(
      await import('~/pages/user/[id].vue').then((m) => m.default),
      { route: { name: 'user-id', params: { id: '1' } } },
    );

    const checkboxes = page.findAll('.todo-item input[type="checkbox"]');
    expect(checkboxes.length).toBe(3);

    expect((checkboxes[0].element as HTMLInputElement).checked).toBe(false);
    expect((checkboxes[1].element as HTMLInputElement).checked).toBe(true);
    expect((checkboxes[2].element as HTMLInputElement).checked).toBe(false);
  });
});

describe('user todo page - invalid user ID', () => {
  it('shows error for invalid user ID', async () => {
    const page = await mountSuspended(
      await import('~/pages/user/[id].vue').then((m) => m.default),
      { route: { name: 'user-id', params: { id: 'abc' } } },
    );

    expect(page.text()).toContain('Ugh, this is not a valid user id');
  });
});

