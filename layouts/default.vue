<template>
  <v-layout>
  <v-app-bar
        color="primary"
        density="compact"
      >
        <v-app-bar-title>乱数表君v4.2</v-app-bar-title>
        <template v-if="isLoggedinLiff" v-slot:append>
          <v-btn icon="mdi-logout"></v-btn>
        </template>
  </v-app-bar>
    </v-layout>

  <div v-if="loading" id="loading">
    <v-progress-circular indeterminate />
  </div>
  <slot />
</template>

<script setup>
  const { loading } = useLoading();
  const { userid, _isLoggedIn } = useUserid();

  const isLoggedinLiff = computed(()=> {
  console.log(_isLoggedIn(),userid.value);
  return _isLoggedIn()
  });
</script>

<style lang="scss">
  #loading {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;
    z-index:9999;
    position: fixed;
    background-color: rgba(#000, 0.5);
  }
</style>
