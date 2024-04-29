<template>
  <v-container class="pt-8">
    <v-row>
      <v-col>
        <v-btn color="success" block @click="gostart">新規で開始する</v-btn>
      </v-col>
    </v-row>
    <v-row v-if="hasHistory">
      <v-col>
        <v-btn color="info" block @click="recover">前回の続きから</v-btn>
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
const hasHistory = ref(true);
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
                  hasHistoryFnc(profile.userId);
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
    updateLoading(false);       
});


const errorCallback = (err)=>{
    updateErrorMsg('[setting.vue][ERR103]' + err);
};    

const hasHistoryFnc = async (_userid) => {
    const { count,error } = await supabase
          .from('games_view')
          .select('*',{ count: 'exact' })
          .eq('loginid', _userid)
    if(error) {
        updateErrorMsg('[setting.vue][ERR108]' + error.code + ' ' + error.message);
        hasHistory.value = false;
    } else {
        if(count > 0) {
            hasHistory.value = true;
        } else {
            hasHistory.value = false;
        }
    }
}

const gostart = async () => {
    updateLoading(true);
    const { count ,data, error } = await supabase
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
          .from('games_view')
          .select('id')
          .eq('loginid',userid.value)
          .single()
    if(error) {
        updateErrorMsg('[setting.vue][ERR105]' + error.code + ' ' + error.message);
        updateLoading(false);        
    } else {
        router.push('/'+ data.id)
    }
};

</script>
