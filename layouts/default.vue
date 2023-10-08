<template>
  <v-app>
    <v-app-bar
      color="primary"
      density="compact"
      >
      <v-app-bar-title>乱数表君v4.2</v-app-bar-title>
      <template v-if="isLoggedinLiff" v-slot:append>
        <v-btn @click="logout">ログアウト</v-btn>
        <v-btn @click="logout" icon="mdi-logout"></v-btn>
      </template>
    </v-app-bar>
    <div v-if="loading" id="loading">
      <v-progress-circular indeterminate />
    </div>
    <v-alert class="pt-16" color="error" v-if="iserrormsg">{{ errormsg }}</v-alert>
    <v-main>
      <slot />
    </v-main>
    <v-footer class="bg-white">
      <div class="px-4 py-2 text-center w-100">
        {{ new Date().getFullYear() }} — <strong>(C)OSAMASA</strong>
      </div>
    </v-footer>
    <v-snackbar v-model="snackbarboolean">{{ snackbartext }}
      <template v-slot:actions>
        <v-btn
          color="blue"
          variant="text"
          @click="snackbarboolean = false"
          >
          閉じる
        </v-btn>
      </template>
    </v-snackbar>    
  </v-app>
</template>

<script setup>
import liff from '@line/liff';

const { loading } = useLoading();
const { iserrormsg, errormsg } = useErrorMsg();
  
const { userid, updateUserid, _isLoggedIn } = useUserid();
  
const { snackbartext } = useSnackBarText();
const { snackbarboolean }  = useStateBarBoolean();
const router = useRouter();  
  
const isLoggedinLiff = computed(()=> {
    let ret=false;
    if(!(liff.isInClient()))
        if( _isLoggedIn() )
            ret = true;
    return ret;
});
const logout = () => {
    liff.logout();
    updateUserid('');
      router.push('/');      
};
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
