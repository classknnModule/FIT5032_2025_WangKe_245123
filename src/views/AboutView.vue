<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center mb-4">❤ MentalHealth Dashboard</h1>
        <div class="row mb-4">
          <div class="col">
            <h4>Height:</h4>
          </div>
          <div class="col">
            <h4>Weight:</h4>
          </div>
        </div>
        <div class="row mb-4">
          <div class="col">
            <h4>Sleep time:</h4>
          </div>
          <div class="col">
            <h4>Fit time:</h4>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div>
    <button @click="logout" class="logout-btn">Logout</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('currentUser')
  
  router.push('/login')
}
</script>

<style scoped>
.logout-btn {
  margin-top: 20px;
  padding: 8px 16px;
  background-color: #c00;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.logout-btn:hover {
  background-color: #900;
}
</style>