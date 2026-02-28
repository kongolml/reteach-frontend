<template>
  <div>
    <h2>Gallery</h2>
    <div v-if="pending">Loading…</div>
    <div v-else-if="error">Error loading images: {{ error.message }}</div>
    <div v-else>
      <div
        v-if="Object.keys(sortByUser).length !== 0"
        v-for="(userGallery, index) in Object.values(sortByUser)"
        :key="index"
      >
        <hr v-if="index !== 0" />
        <h2>{{ userGallery.name }}</h2>
        <p>Albums: {{ userGallery.albums.length }}</p>
        <p>Posts: {{ userGallery.posts.length }}</p>
        <p>Comments: {{ userGallery.comments.length }}</p>
        <div class="gallery">
          <template v-for="img in userGallery.photos" :key="img.id">
            <!-- TODO: utilize lazy loading with loading="lazy" so image will be downloaded only when it's in viewport -->
            <!-- TODO: for very long lists - think about virtualization to not buildup very large DOM -->
            <img :src="img.picture" :alt="img.title" class="photo" />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const {
  data: images,
  pending,
  error,
} = await useFetch('/api/gallery', { lazy: true });

const users = ref([]);
onMounted(async () => {
  users.value = await fetch('https://jsonplaceholder.typicode.com/users').then(
    (res) => res.json()
  );

  await loadUserStatistics();
});

const sortByUser = computed(() => {
  if (!images.value || !users.value.length) {
    return {};
  }

  return images.value.reduce((acc, img) => {
    const user = users.value.find((u) => u.id === img.userId);
    if (!user) {
      return acc;
    }
    if (!acc[img.userId]) {
      acc[img.userId] = {
        name: img.userName,
        photos: [],
        albums: user.albums || [],
        posts: user.posts || [],
        comments: user.comments || [],
      };
    }
    acc[img.userId].photos.push(img);
    return acc;
  }, {});
});

/**
 * Load specific user statistics
 */

/**
 * TODO: this function awaits requests one by one even though they are not dependent on each other - can be wrapped in Promise.all
 */
async function loadUserStatistics() {
  // Example of Promise.all - clean, elegant
  // await Promise.all(users.value.map(async (user) => {
  //   const [albums, posts, comments] = await Promise.all([
  //     fetch(`https://jsonplaceholder.typicode.com/users/${user.id}/albums`).then(r => r.json()),
  //     fetch(`https://jsonplaceholder.typicode.com/users/${user.id}/posts`).then(r => r.json()),
  //     fetch(`https://jsonplaceholder.typicode.com/users/${user.id}/comments`).then(r => r.json()),
  //   ]);

  //   user.albums = albums;
  //   user.posts = posts;
  //   user.comments = comments;
  // }));


  for (const user of users.value) {
    (user.albums = []), (user.posts = []), (user.comments = []);

    // Fetch user Albums
    await fetch(`https://jsonplaceholder.typicode.com/users/${user.id}/albums`)
      .then((res) => res.json())
      .then((albums) => user.albums.push(...albums));

    // Fetch user Posts
    await fetch(`https://jsonplaceholder.typicode.com/users/${user.id}/posts`)
      .then((res) => res.json())
      .then((posts) => user.posts.push(...posts));

    // Fetch user Comments
    await fetch(
      `https://jsonplaceholder.typicode.com/users/${user.id}/comments`
    )
      .then((res) => res.json())
      .then((comments) => user.comments.push(...comments));
  }
}

if (error.value) {
  console.error('Failed to load images:', error.value);
}
</script>

<style scoped>
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1svw;
}
.img-gallery {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.photo {
  max-width: 100%;
  height: auto;
  object-fit: cover;
}
</style>
