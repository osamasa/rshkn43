<template>
<v-btn @click="gosetting">セッティングへ</v-btn>
</template>

<script setup>
import liff from '@line/liff';    
const runtimeConfig = useRuntimeConfig();
const router = useRouter();
const islogin = ref('false');

const successCallback = ()=> {
    islogin.value = liff.isLoggedIn();
    if(islogin.value) {
        router.push('/setting');
    }
};

const errorCallback = (err)=>{
    console.log(err);
};

onMounted(() => {
    liff.init({ liffId: runtimeConfig.public.liffId }, successCallback, errorCallback);
});


const gosetting = () => {
   if (!liff.isLoggedIn()) {
       liff.login('https://localhost:3000/setting')
   }
}
</script>
