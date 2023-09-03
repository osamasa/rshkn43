<template>
<div class="ml-4 mt-16">    
  <v-btn color="info" @click="gosetting">ログインして乱数表開始</v-btn>
</div>
</template>

<script setup>
import liff from '@line/liff';    
const runtimeConfig = useRuntimeConfig();
const router = useRouter();
const islogin = ref('false');
const { loading, updateLoading} = useLoading();

const successCallback = ()=> {
    updateLoading(true);    
    
    islogin.value = liff.isLoggedIn();
    if(islogin.value) {
        router.push('/setting');
    } else {
        updateLoading(false);
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
        updateLoading(true);
        liff.login()
   }
}
</script>
