<template>
  <AwesomeArticle>
    <h1>User's {{ route.params.id }} Todo's</h1>
    <div class="todo-container">
      <div class="todo-controls">
        <fieldset>
          <legend>Filter by status</legend>
          <label>
            <input type="checkbox" id="filter-completed" checked />
            Show completed
          </label>
          <label>
            <input type="checkbox" id="filter-pending" checked />
            Show pending
          </label>
        </fieldset>

        <fieldset>
          <legend>Display limit</legend>
          <label>
            <input type="radio" name="limit" id="limit-5" />
            5
          </label>
          <label>
            <input type="radio" name="limit" id="limit-10" />
            10
          </label>
          <label>
            <input type="radio" name="limit" id="limit-all" checked />
            All
          </label>
        </fieldset>

        <fieldset>
          <legend>Order by status</legend>
          <label>
            <input type="radio" name="order" id="order-default" checked />
            Default
          </label>
          <label>
            <input type="radio" name="order" id="order-completed" />
            Completed first
          </label>
          <label>
            <input type="radio" name="order" id="order-pending" />
            Pending first
          </label>
        </fieldset>

        <fieldset>
          <legend>Actions</legend>
          <label>
            <input type="radio" name="bulk-action" id="action-none" checked />
            None
          </label>
          <label>
            <input type="radio" name="bulk-action" id="action-mark-all" />
            Mark all as done
          </label>
          <label>
            <input type="radio" name="bulk-action" id="action-unmark-all" />
            Unmark all
          </label>
        </fieldset>
      </div>

      <ul class="todo-list">
        <li v-for="todo in todos" :key="todo.id" :data-completed="String(todo.completed)">
          <label class="todo-item">
            <input type="checkbox" :checked="todo.completed" />
            <span>{{ todo.title }}</span>
          </label>
        </li>
      </ul>
    </div>
  </AwesomeArticle>
</template>

<script setup>
const route = useRoute();

// use $fetch - best practice https://nuxt.com/docs/3.x/api/utils/dollarfetch#usage
const { data: todos } = useAsyncData(() =>
  $fetch(
    `https://jsonplaceholder.typicode.com/users/${route.params.id}/todos`
  )
);
</script>

<style scoped>
.todo-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.todo-controls fieldset {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0.5rem 1rem;
}

.todo-controls label {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-right: 0.75rem;
  cursor: pointer;
}

.todo-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.todo-list li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #ddd;
}

.todo-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

/* no-js logic for todo list management */
/* status filters */
.todo-container:has(#filter-completed:not(:checked)) li[data-completed="true"] {
  display: none;
}

.todo-container:has(#filter-pending:not(:checked)) li[data-completed="false"] {
  display: none;
}

/* limit items display */
.todo-container:has(#limit-5:checked) .todo-list li:nth-child(n + 6) {
  display: none;
}

.todo-container:has(#limit-10:checked) .todo-list li:nth-child(n + 11) {
  display: none;
}

/* individual todo check/uncheck */
.todo-list li:has(.todo-item input:checked) span {
  text-decoration: line-through;
  opacity: 0.5;
}

/* order by status — based on live checkbox state */
.todo-container:has(#order-completed:checked) .todo-list li:has(.todo-item input:not(:checked)) {
  order: 1;
}

.todo-container:has(#order-pending:checked) .todo-list li:has(.todo-item input:checked) {
  order: 1;
}

/* mark all as done */
.todo-container:has(#action-mark-all:checked) .todo-list span {
  text-decoration: line-through;
  opacity: 0.5;
}

/* unmark all */
.todo-container:has(#action-unmark-all:checked) .todo-list li:has(.todo-item input:checked) span {
  text-decoration: none;
  opacity: 1;
}
</style>
