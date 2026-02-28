/**
 * This handler was here before, lets utilize nuxt and its SSR.
 * Goal/end result: move all fetching and transformation logic to server side, this way frontend makes a single request (GET /api/gallery)
 * HOW:
 * - paralellize all fetches with Promise.all
 * - group photos by user id as a key
 * - return user "convinient" object
 * 
 * Pros/cons of using nuxt as full backend:
 * Pros:
 * - no hard logic on client side
 * - possibility of caching here, pagination etc.
 * - frontend is now just a "rendering machine"
 * - no need for CORS or auth setup on client side
 * - one app - one deploy
 * 
 * Cons:
 * - requires additional error handlers to tell client what happened, maybe a need for a aligned error codes enum
 * - wihtout caching might slow down server response time
 * - no easy dynamic routing, flexible DB logic becomes complicated to implelent and maintain
 * - if app requires authorization - you have to implement it on your own, which complicates architecture and adds additional layer of complexity
 * - each request is a new instance of the app, which means no shared state between requests by default
 * 
 * 
 * Conclusion:
 * for gallery page this approach makes sense, as initial requirement for this page is to be a public page, this is a simple gallery page with any heavy logic
 */
export default defineEventHandler(async () => {
  const storage = useStorage('storage');

  // Fetch local photos and remote data in parallel
  const [photos, albums, posts, comments] = await Promise.all([
    storage.getItem('/gallery/gallery-db.json'),
    fetch('https://jsonplaceholder.typicode.com/albums').then((r) => r.json()),
    fetch('https://jsonplaceholder.typicode.com/posts').then((r) => r.json()),
    fetch('https://jsonplaceholder.typicode.com/comments').then((r) => r.json()),
  ]);

  // Group photos by user and attach statistics
  const gallery = {};

  for (const photo of photos) {
    const userId = photo.userId;

    if (!gallery[userId]) {
      gallery[userId] = {
        name: photo.userName,
        photos: [],
        albums: albums.filter((a) => a.userId === userId),
        posts: posts.filter((p) => p.userId === userId),
        comments: comments.filter((c) => {
          const post = posts.find((p) => p.id === c.postId);
          return post && post.userId === userId;
        }),
      };
    }

    gallery[userId].photos.push(photo);
  }

  return gallery;
});
