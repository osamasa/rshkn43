<template>
<div class="ml-4 mt-8">    
  <v-btn color="info" @click="gosetting">ログインして乱数表開始</v-btn>
</div>
</template>

<script setup>
import liff from '@line/liff';    
const runtimeConfig = useRuntimeConfig();
const router = useRouter();
const islogin = ref('false');
const { loading, updateLoading} = useLoading();
const { updateErrorMsg } = useErrorMsg();

const successCallback = ()=> {
    updateLoading(true);    
    
    islogin.value = liff.isLoggedIn();
    if(islogin.value) {
        router.push('/setting');
    } else {
        updateLoading(false);
    }
};

const errorCallback = (error)=>{
    updateErrorMsg('[index.vue][ERR401]' + error);
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
