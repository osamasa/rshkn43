<template>
  <v-container>
    <v-row>
      userid: {{ useState('userid') }}
    </v-row>
    <v-row>
      <v-col>
        <v-slider
          v-model="coat_num"
          label="面数"
          min=1
          max=8
          step=1
          >        
        </v-slider>
      </v-col>
      <v-col>
        {{coat_num}}
      </v-col>
      <v-spacer/>
    </v-row>  
    <v-row>
      <v-col>
        <v-slider
          v-model="person_num"
          label="人数"
          min=2
          max=12
          step=1
          >        
        </v-slider>
      </v-col>
      <v-col>
        {{person_num}}
      </v-col>
      <v-spacer/>
      </v-row>
      <v-row>
        <v-col>
          <v-switch
            v-model="dobules_flg"
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
const dobules_flg = ref( true );
const coat_num = ref(1);
const person_num = ref(4);

const runtimeConfig = useRuntimeConfig();
const router = useRouter();
const { userid, updateUserid } = useUserid();
const { gameid, updateGameid } = useGameid();


const gameName = computed(() => {
  if(dobules_flg.value == true)
    return "ダブルス"
  else
    return "シングルス";
});

const mkgamedb = async() => {
    let _userid = userid.value;
    let _coat_num = coat_num.value;
    let _dobules_flg = dobules_flg.value;
    let _person_num = person_num.value

    const { data, error } = await supabase
          .rpc('newmakenewgame', {
              _userid,
              _person_num,               
              _coat_num,
              _dobules_flg, 
          })
    if (error) console.error(error)
    else {
         updateGameid(data);
         router.push('/listgame');
    }
}
</script>
