<template>
  <v-container>
    <v-row>
      userid: {{ useState('userid') }}
    </v-row>
    <v-row>
      <v-col>
        <v-slider
          v-model="v_coatnum"
          label="面数"
          min=1
          max=8
          step=1
          >        
        </v-slider>
      </v-col>
      <v-col>
        {{v_coatnum}}
      </v-col>
      <v-spacer/>
    </v-row>  
    <v-row>
      <v-col>
        <v-slider
          v-model="v_person"
          label="人数"
          min=2
          max=12
          step=1
          >        
        </v-slider>
      </v-col>
      <v-col>
        {{v_person}}
      </v-col>
      <v-spacer/>
      </v-row>
      <v-row>
        <v-col>
          <v-switch
            v-model="v_doblesflg"
            label="ゲーム形式"
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
      <v-btn @click="mkgamedb">作成</v-btn>
    </v-col>
    <v-col>
      <v-btn>戻る</v-btn>
    </v-col><v-spacer />
    </v-row>
  </v-container>
</template>
<script setup>
const supabase = useSupabaseClient();    

const runtimeConfig = useRuntimeConfig();
const router = useRouter();

const { userid, updateUserid } = useUserid();
const { gameid, updateGameid } = useGameid();

const v_coatnum = ref(1);
const v_person = ref(6);
const v_doblesflg = ref(true);


const gameName = computed(() => {
  if(v_doblesflg.value == true)
    return "ダブルス"
  else
    return "シングルス";
});

const mkgamedb = async() => {
    let _userid = userid.value;
    let _coat_num = v_coatnum.value;
    let _dobules_flg = v_doblesflg.value;
    let _person_num = v_person.value;
 
    const { data, error } = await supabase
          .rpc('newmakenewgame', {
              _userid,
              _person_num,               
              _coat_num,
              _dobules_flg
        })
    if (error) console.error(error)
    else {
         updateGameid(data);
         router.push('/listgame');
    }
}
</script>
