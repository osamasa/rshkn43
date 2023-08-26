<template>
    <h1>乱数表君設定</h1>
    <div>
    <v-btn @click="gostart">新規作成</v-btn>
    </div>
    <div>
    <v-btn @click="recover">前回の続き</v-btn>
    </div>    
    <div>
    <v-btn @click="logout">ログアウト</v-btn>
    </div>
</template>
    
<script setup>
import liff from '@line/liff';

const supabase = useSupabaseClient();
const runtimeConfig = useRuntimeConfig();
const router = useRouter();
const islogin = ref(false);
const isClient = ref(false);
const { userid, updateUserid } = useUserid()

const myloginCheck = () => {
      // ログインチェック
      if (liff.isLoggedIn()) {
        isClient.value = liff.isInClient()
        // プロフィール取得
        liff.getProfile()
              .then(profile => {
                  updateUserid(profile.userId);
          })
          .catch((err) => {
            console.log('error', err);
          })
      } else {
          router.push('/');
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
};

const gostart = async () => {
    const { data, error } = await supabase
       .from('users')
       .upsert({ loginid : userid.value })
       .select();
    if(error) {
        console.log(error)
        // なにもしない
    }
    router.push('/gostart');
};

const recover = async () => {
let { data, error } = await supabase
  .rpc('hello_world')

if (error) console.error(error)
else console.log(data)    
};

</script>
