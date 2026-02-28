<!-- 
Recommentaions:
1) Move data pull and manipulation to a server — eliminates client fetches, single request. (example: server/api/gallery.get.js)
2) Parallelize independent fetches — initial loadUserStatistics awaits requests one by one in a parent loop - too much requests for a client side. (code draft: Promise.all)
3) Use loading="lazy" attribute for imaeges - load images only  when htey are in a viewport 
-->

<template>
  <div>
    <h2>Gallery</h2>
    <div v-if="pending">Loading…</div>
    <div v-else-if="error">Error loading images: {{ error.message }}</div>
    <div v-else>
      <div
        v-if="gallery && Object.keys(gallery).length !== 0"
        v-for="(userGallery, index) in Object.values(gallery)"
        :key="index"
      >
        <hr v-if="index !== 0" />
        <h2>{{ userGallery.name }}</h2>
        <p>Albums: {{ userGallery.albums.length }}</p>
        <p>Posts: {{ userGallery.posts.length }}</p>
        <p>Comments: {{ userGallery.comments.length }}</p>
        <div class="gallery">
          <template v-for="img in userGallery.photos" :key="img.id">
            <img
              :src="img.picture"
              :alt="img.title"
              class="photo"
              loading="lazy"
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const {
  data: gallery,
  pending,
  error,
} = await useFetch('/api/gallery', { lazy: true });

if (error.value) {
  console.error('Failed to load gallery:', error.value);
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
