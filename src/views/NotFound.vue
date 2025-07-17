<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" class="text-center">
        <div class="error-content">
          <h1 class="display-1 font-weight-bold primary--text mb-4">404</h1>
          <p class="text-h6 grey--text text--darken-1 mb-8">Halaman tidak ditemukan</p>
          <v-btn
            color="primary"
            large
            :to="'/'"
            class="text-none"
          >
            <v-icon left>mdi-home</v-icon>
            Kembali ke Beranda
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<style scoped>
.error-content {
  max-width: 400px;
  margin: 0 auto;
}

.fill-height {
  min-height: 100vh;
}
</style>