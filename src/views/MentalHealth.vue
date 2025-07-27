<template>
    <div class="container mt-5">
        <div class="row">
            <div class="col-md-8 offset-md-2">
                <h1 class="text-center">❤ MentalHealth</h1>
                <div class="row mb-3">
                    <div class="col-md-6 col-sm-6 col-6">
                        <p class="responsive-text">
                            "Your Mental Health Journey: You're the Hero."
                            </p>
                        <p class="responsive-text">
                            "Break the Silence. Break the Stigma."
                            </p>
                        <p class="responsive-text">
                            "Mind Strong. Heart Strong. You Strong."
                            
                        </p>
                        <router-link to="/">
                            <button class="btn btn-info">Join us</button>
                        </router-link>

                        <router-link to="/eva">
                            <button class="btn btn-info">Evaluate us</button>
                        </router-link>
                    </div>
                    <div class="col-md-6 col-sm-6 col-6">
                        <img
                            src="@/assets/self-care.png"
                            alt="Self care woman"
                            class="img-fluid"
                            style="object-fit: cover; width: 100%; height: auto;"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped>
.responsive-text {
  font-size: 1rem; 

  @media (max-width: 2000px) {
    font-size: 0.8rem;
  }
  @media (max-width: 1100px) {
    font-size: 0.71rem;
  }
  @media (max-width: 900px) {
    font-size: 0.7rem;
  }
  @media (max-width: 700px) {
    font-size: 0.6rem;
  }
  @media (max-width: 300px) {
    font-size: 0.1rem;
  }
}
</style>