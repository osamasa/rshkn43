<template>
    <div>
        <h1>Welcome page</h1>
        count: {{ count }}
        <v-btn color="primary" @click="addCount">+</v-btn>
    </div>
</template>

<script setup>
import liff from '@line/liff';

const supabase = useSupabaseClient();
const datas = ref([])

const runtimeConfig = useRuntimeConfig();
const islogin = ref(false);
const count = ref(0);

const addCount = () => {
    count.value++;
}

const successCallback = ()=> {
    islogin.value = liff.isLoggedIn();
    showGames();
};

const errorCallback = (err)=>{
    console.log(err.code, err.message);
};

onMounted(() => {
    liff.init({ liffId: runtimeConfig.public.liffId }, successCallback, errorCallback);
});

async function showGames() {
  const datas = await supabase
      .from("random_number_table")
      .select("*")
  console.log(datas);
}
</script>
