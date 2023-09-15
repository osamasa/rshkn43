<template>
  <v-container class="pt-8">
    <v-row>
      <v-col>
        <v-btn color="success" block @click="gostart">新規作成</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>    
        <v-btn color="info" block @click="recover">前回の続き</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
    
<script setup>
import liff from '@line/liff';

const supabase = useSupabaseClient();
const runtimeConfig = useRuntimeConfig();
const router = useRouter();
const islogin = ref(false);
const isClient = ref(false);
const { userid, updateUserid } = useUserid();
const { loading, updateLoading} = useLoading();
const { updateErrorMsg } = useErrorMsg();
const { snackbartext } = useSnackBarText();
const { snackbarboolean } = useStateBarBoolean();

updateLoading(true);

const myloginCheck = () => {
      // ログインチェック
      if (liff.isLoggedIn()) {
        isClient.value = liff.isInClient()
        // プロフィール取得
        liff.getProfile()
              .then(profile => {
                  updateUserid(profile.userId);
                  updateLoading(false);   
                  snackbartext.value="ログイン完了"
                  snackbarboolean.value=true;
              })
              .catch((error) => {
                  updateErrorMsg('[setting.vue][ERR102]' + error.code + ' ' + error.message);
              })
      } else {
          router.push('/');
      }
};

onMounted(() => {
    liff.init({ liffId: runtimeConfig.public.liffId },
              myloginCheck,
              errorCallback);
});


const errorCallback = (err)=>{
    updateErrorMsg('[setting.vue][ERR103]' + err);
};    

const gostart = async () => {
    updateLoading(true);
    const { data, error,count } = await supabase
          .from('users')
          .select('*', { count: 'exact' })
          .eq('loginid', userid.value)
    if(error) {
        updateErrorMsg('[setting.vue][ERR107]' + error.code + ' ' + error.message);
    } else {
        if(count<1) {
            const { data, error } = await supabase
                  .from('users')
                  .upsert({ loginid : userid.value })
                  .select();
            if(error) {
                updateErrorMsg('[setting.vue][ERR104]' + error.code + ' ' + error.message);
            } else
                if(!data) {
                    updateErrorMsg('[setting.vue][ERR101] ユーザー情報更新エラー');
                } else {
                    router.push('/gostart');
                }                
        } else {
            router.push('/gostart');
        }
    }
};

const recover = async () => {
    updateLoading(true);
    const { data, error } = await supabase
          .from('users')
          .select('id')
          .eq('loginid',userid.value)
          .single()
    if(error) {
        updateErrorMsg('[setting.vue][ERR105]' + error.code + ' ' + error.message);
        updateLoading(false);        
    } else {
        const { data, error } = await supabase
              .from('games')
              .select('id')
              .eq('userid',userid.value)
              .single()        
        if(error) {
            updateErrorMsg('[setting.vue][ERR106]' + error.code + ' ' + error.message);
            updateLoading(false);
        } else {
            router.push('/'+ data.id)
        }
    }
};

</script>
