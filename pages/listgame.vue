<template>
  <div v-if="vtoggle==0">
    <v-container class="pa-0" v-for="game in games">
    <v-row class="pl-2 pt-1 pb-1 bg-grey-lighten-2" no-gutters v-if="isOnajigame(game.game_no)>0"><v-btn @click="changeCurGame(game.game_no);" variant="text">第{{isOnajigame(game.game_no)}}試合<v-spacer/></v-btn></v-row>
        <v-row no-gutters :class="getCurColor(game.game_no)">
          <v-col class="ma-1"><v-btn block size="large" variant="outlined">{{game.player_1}}</v-btn></v-col>
          <v-col class="ma-1"><v-btn block size="large" variant="outlined">{{game.player_2}}</v-btn></v-col>
          <v-col cols="1">&nbsp;</v-col>
          <v-col class="ma-1"><v-btn block size="large" variant="outlined">{{game.player_3}}</v-btn></v-col>
          <v-col class="ma-1"><v-btn block size="large" variant="outlined">{{game.player_4}}</v-btn></v-col>
        </v-row>
      <v-divider v-if="isLastOnajigame(game.game_no)"></v-divider>
    </v-container>
  </div>
  <div v-if="vtoggle==1">
    <v-container>
      <v-row class="bg-grey-lighten-2 mb-5" >
        <v-col cols="1">No</v-col>
        <v-col>お名前</v-col>
      </v-row>
      <v-row  v-for="user in users" no-gutters>
        <v-col cols="1">{{user.player_no}}</v-col>
        <v-col>
          <v-text-field v-model="user.player_name" label="お名前" clearable></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn block>更新</v-btn>
        </v-col>
        <v-col>
          <v-btn block>キャンセル</v-btn>          
        </v-col>
      </v-row>
    </v-container>
  </div>
  <v-layout class="overflow-visible" style="height: 56px;">
    <v-bottom-navigation
      v-model="vtoggle"
      active
      bg-color="blue-grey-lighten-2"
    >
      <v-btn>
        <v-icon>mdi-play-circle-outline</v-icon>
        ゲーム
      </v-btn>
      <v-btn>
        <v-icon>mdi-account-multiple</v-icon>
        プレイヤー
      </v-btn>
      <v-btn>
        <v-icon>mdi-table-clock</v-icon>
        <span>結果</span>
      </v-btn>
    </v-bottom-navigation>
  </v-layout>
</template>
<script setup>
const supabase = useSupabaseClient();

const games = ref([]);
const users = ref([]);
const vtoggle = ref(0);
const { gameid } = useGameid();
const { coatnum } = useCoatnum();
const { person } = usePerson();
const { doblesflg } = useDoblesflg();

const curgame = ref(1);

const readsecond = async() => {
    let { data , error } = await supabase
       .from('game_user')
       .select('*')
       .eq('game_id',gameid.value);
    if(error) {
        console.log(error)
    } else {
        users.value = data.filter(elm => {
            if(elm.player_name==='NULL') {
                elm.player_name='';
            };
            return elm;
        });
    }
}

const readfirst = async() => {
    let { data , error } = await supabase
       .from('game_record')
       .select('*')
       .eq('game_id',gameid.value);
    if(error) {
        console.log(error)
    } else {
        games.value = data;
    }
}

const calcRealCoatnum=() => {
    let realcoatnum = 0;
    if (doblesflg) {
        realcoatnum = Math.floor(person.value / 4);
    } else {
        realcoatnum = Math.floor(person.value / 2);
    }
    if(realcoatnum > coatnum.value) {
        realcoatnum = coatnum.value;
    }
    return realcoatnum;
}

const isOnajigame = computed(()=> (_no) => {
    let realcoatnum = calcRealCoatnum();
    return realcoatnum==1 ? _no : (_no-1) % realcoatnum == 0 ? (Math.floor(_no / realcoatnum)+1) : 0;
})

const isLastOnajigame = computed(()=> (_no) => {
    let realcoatnum = calcRealCoatnum();
    return (_no-1) % realcoatnum == realcoatnum-1;
});

const getCurColor = computed(()=>(_game_no) => {
    let realcoatnum = calcRealCoatnum();
    if(((curgame.value-1) * realcoatnum < _game_no) && (curgame.value*realcoatnum+1 > _game_no)) {
        return 'bg-grey-lighten-3';
    } else {
        return '';
    }
});

const changeCurGame=((_no) => {
    let realcoatnum = calcRealCoatnum();
    let realshiainum = realcoatnum==1 ? _no : (Math.floor(_no / realcoatnum)+1);
    curgame.value = realshiainum;
});

onMounted(() => {
    readfirst();
    readsecond();
    let gameRecord = supabase.channel('custom-all-channel')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'game_record,game_user' },
            (payload) => {
                console.log('Change received!', payload)
                if((payload.table === 'game_record') && (payload.eventType === 'INSERT')) {
                    if(payload.new.game_id === gameid.value) {
                        games.value.push(payload.new);
                    }
                } else if((payload.table === 'game_record') && (payload.eventType === 'UPDATE')) {
                    if(payload.new.game_id === gameid.value) {
                        let result = games.value.filter((game) => {
                            return (game.id != payload.old.id);
                        });
                        games.value = result;
                        games.value.push(payload.new);
                        games.value.sort((a,b) => a.id - b.id);
                    }
                } else if((payload.table === 'game_record') && (payload.eventType === 'DELETE')) {
                    let result = games.value.filter((game) => {
                        return (game.id != payload.old.id);
                    });
                    games.value = result;
                } else if((payload.table === 'game_user') && (payload.eventType === 'INSERT')) {
                    if(payload.new.game_id === gameid.value) {
                        users.value.push(payload.new);
                    }
                } else if((payload.table === 'game_user') && (payload.eventType === 'UPDATE')) {
                    if(payload.new.game_id === gameid.value) {
                        let result = users.value.filter((user) => {
                            return (user.id != payload.old.id);
                        });
                        users.value = result;
                        users.value.push(payload.new);
                        users.value.sort((a,b) => a.id - b.id);
                    }
                } else if((payload.table === 'game_user') && (payload.eventType === 'DELETE')) {
                    let result = users.value.filter((user) => {
                        return (user.id != payload.old.id);
                    });
                    users.value = result;
                }
            }
        )
        .subscribe()    
});
</script>
