<template>
  <v-container fluid class="login-container fill-height pa-0 ma-0">
    <v-row no-gutters class="fill-height">
      <v-col
        cols="12"
        class="d-flex flex-column justify-center align-center login-position-tweak"
      >
        <div class="login-form-container pa-8">
          <h1 class="sintas-title mb-1 text-center">SINTAS</h1>
          <p class="sintas-subtitle mb-8 text-center">
            Sistem Integrasi Data Santri AL-MATLAB
          </p>

          <v-form ref="formRef" v-model="valid" @submit.prevent="handleLogin">
            <v-text-field
              v-model="username"
              label="User ID / Nomor Induk"
              prepend-inner-icon="mdi-account"
              :rules="usernameRules"
              variant="outlined"
              density="comfortable"
              required
              class="mb-4"
            />

            <v-text-field
              v-model="password"
              label="Password"
              prepend-inner-icon="mdi-key"
              :type="showPassword ? 'text' : 'password'"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="togglePasswordVisibility"
              :rules="passwordRules"
              variant="outlined"
              density="comfortable"
              required
              class="mb-6"
              @keydown.enter="handleLogin"
            />

            <v-btn
              type="submit"
              color="#4DB6AC"
              class="login-button"
              :disabled="!valid || loading"
              :loading="loading"
              block
              size="large"
            >
              Login
            </v-btn>
          </v-form>
        </div>
      </v-col>
    </v-row>

    <!-- Dialog Pesan -->
    <v-dialog v-model="messageDialog.show" max-width="400" persistent>
      <v-card>
        <v-card-title class="text-h6">{{ messageDialog.title }}</v-card-title>
        <v-card-text>{{ messageDialog.message }}</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="closeMessageDialog">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const router = useRouter();
const store = useStore();

const formRef = ref();
const valid = ref(false);
const loading = ref(false);
const showPassword = ref(false);
const username = ref('');
const password = ref('');

const usernameRules = [
  (v) => !!v || 'Username wajib diisi',
];

const passwordRules = [
  (v) => !!v || 'Password wajib diisi',
  (v) => (v && v.length >= 4) || 'Password minimal 4 karakter',
];

const messageDialog = reactive({
  show: false,
  title: '',
  message: ''
});

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const showMessage = (title, message) => {
  messageDialog.title = title;
  messageDialog.message = message;
  messageDialog.show = true;
};

const closeMessageDialog = () => {
  messageDialog.show = false;
};

const handleLogin = async () => {
  const { valid: isValid } = await formRef.value.validate();
  if (!isValid) return;

  loading.value = true;

  try {
    const result = await store.dispatch('login', {
      username: username.value.trim(),
      password: password.value.trim()
    });

    if (result.success) {
      const targetRoute = store.getters.dashboardRoute;
      if (targetRoute) {
        await router.push(targetRoute);
      } else {
        showMessage('Login Gagal', 'Role pengguna tidak dikenali.');
      }
    } else {
      showMessage('Login Gagal', result.message || 'Username atau Password salah!');
    }
  } catch (error) {
    console.error('Login error:', error);
    showMessage('Error', 'Terjadi kesalahan saat login. Coba lagi nanti.');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background-color: white;
}

.login-form-container {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  background-color: white;
  border-radius: 0px;
  padding: 2rem;
  box-shadow: none;
}

.sintas-title {
  font-size: 2.2rem;
  font-weight: bold;
  letter-spacing: 2px;
  color: #4DB6AC;
}

.sintas-subtitle {
  font-size: 0.9rem;
  color: #555;
}

.login-button {
  text-transform: none;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 4px;
}

/* 👉 Penyesuaian posisi form agar naik sedikit */
.login-position-tweak {
  transform: translateY(-12%);
  transition: transform 0.3s ease;
}

/* Responsif: di layar kecil, posisi tetap normal */
@media (max-width: 600px) {
  .login-position-tweak {
    transform: translateY(-3%);
  }
}
</style>
