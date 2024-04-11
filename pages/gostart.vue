<template>
  <v-container class="pt-16">
    <v-row>
      <v-col>
        <v-select
          v-model="v_coatnum"
          label="面数"
          :items="['1','2','3','4','5','6','7']"
          >        
        </v-select>
      </v-col>
    </v-row>  
    <v-row>
      <v-col>
        <v-select
          v-model="v_person"
          label="人数"
          :items="['2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30']"
          >        
        </v-select>
      </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-switch
            v-model="v_doblesflg"
            label="ゲーム形式"
            disabled
            ></v-switch> 
        </v-col>
        <v-col>
          {{ gameName }}
        </v-col><v-spacer/>
      </v-row>
  </v-container>
  <v-container>
    <v-row>
    <v-col>
      <v-btn block color="info" @click="router.back()">戻る</v-btn>
    </v-col>
    <v-col>
      <v-btn block color="success" @click="mkgamedb">作成</v-btn>
    </v-col>    
    </v-row>
  </v-container>
</template>
<script setup>
const supabase = useSupabaseClient();    

const runtimeConfig = useRuntimeConfig();
const router = useRouter();

const { userid, updateUserid } = useUserid();
const { updateErrorMsg } = useErrorMsg();
const { loading, updateLoading} = useLoading();

const v_coatnum = ref('1');
const v_person = ref('6');
const v_doblesflg = ref(true);

const gameName = computed(() => {
  if(v_doblesflg.value == true)
    return "ダブルス"
  else
    return "シングルス";
});

const mkgamedb = async() => {
    updateLoading(true);    

    let _userid = userid.value;
    let _coat_num = v_coatnum.value;
    let _dobules_flg = Number(v_doblesflg.value);
    let _person_num = Number(v_person.value);
 
    const { data, error } = await supabase
          .rpc('newmakenewgame', {
              _userid,
              _person_num,               
              _coat_num,
              _dobules_flg
        })
    if (error) {
        updateErrorMsg('[gostart.vue][ERR301]' + error);
    } else {
        router.push('/' + data);
    }
}

const myloginCheck = () => {
    // ログインチェック
      if (liff.isLoggedIn()) {
        if(!(userid)) {
            // プロフィール取得
            liff.getProfile()
                .then(profile => {
                    updateUserid(profile.userId);
                })
                .catch((error) => {
                    updateErrorMsg('[gostart.vue][ERR302]' + error);
                })
        }
      } else {
          router.push('/');
      }
    updateLoading(false);
};

onMounted(() => {
    liff.init({ liffId: runtimeConfig.public.liffId },
              myloginCheck,
              errorCallback)    
});
const errorCallback = (error)=>{
    updateErrorMsg('[gostart.vue][ERR303]' + error);
};    

</script>
