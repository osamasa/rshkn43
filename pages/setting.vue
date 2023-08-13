<template>
    <h1>乱数表君設定</h1>
    <div>{{displayname}}</div>
    <v-btn @click="logout">ログアウト</v-btn>
</template>
    
<script setup>
import liff from '@line/liff';

const runtimeConfig = useRuntimeConfig();
const router = useRouter();
const displayname = ref('');
const islogin = ref(false);
const isClient = ref(false);

const myloginCheck = () => {
      // ログインチェック
      if (liff.isLoggedIn()) {
        isClient.value = liff.isInClient()
        // プロフィール取得
        liff.getProfile()
              .then(profile => {
                  console.log(profile.userId);
          })
          .catch((err) => {
            console.log('error', err);
          })
      }
};

onMounted(() => {
    liff.init({ liffId: runtimeConfig.public.liffId },
              myloginCheck,
              errorCallback)    
});


const errorCallback = (err)=>{
    console.log(err);
};    

const logout = () => {
    liff.logout();
    router.push('/');
};
</script>
