<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-12">
        <main id="main-content" role="main">
          <h1 class="text-center mb-4">📧 Email System</h1>
          <BulkEmailSender />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import BulkEmailSender from '@/components/BulkEmailSender.vue'
</script>

<style scoped>
.container {
  max-width: 1200px;
}

h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 30px;
}
</style>
