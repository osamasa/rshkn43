<template>
  <div v-if="vtoggle==1">  
    <v-container class="pa-0" v-for="game in games">
      <v-row class="pl-2 pt-1 pb-1 bg-grey-lighten-2" no-gutters v-if="isOnajigame(game.game_no)>0">第{{isOnajigame(game.game_no)}}試合</v-row>
        <v-row no-gutters>
          <v-col class="ma-1"><v-btn variant="outlined">{{game.player_1}}</v-btn></v-col>
          <v-col class="ma-1"><v-btn variant="outlined">{{game.player_2}}</v-btn></v-col>
          <v-col>&nbsp;</v-col>
          <v-col class="ma-1"><v-btn variant="outlined">{{game.player_3}}</v-btn></v-col>
          <v-col class="ma-1"><v-btn  variant="outlined">{{game.player_4}}</v-btn></v-col>
        </v-row>
      <v-divider v-if="isLastOnajigame(game.game_no)"></v-divider>
    </v-container>
  </div>
  <div v-if="vtoggle==2">
    <v-container>
      <v-row class="bg-grey-lighten-2">
        <v-col cols="2">No</v-col><v-col>お名前</v-col>
      </v-row>
      <v-row v-for="user in users">
        <v-col cols="2">{{user.player_no}}</v-col>
        <v-col>{{user.player_name}}</v-col>
      </v-row>
    </v-container>
  </div>
<div>
    
</div>        
</template>
<script setup>
const supabase = useSupabaseClient();
const games = ref([]);
const users = ref([]);
const vtoggle = ref(2);
const { gameid } = useGameid();
const { coatnum } = useCoatnum();
const { person } = usePerson();
const { doblesflg } = useDoblesflg();

const readsecond = async() => {
    let { data , error } = await supabase
       .from('game_user')
       .select('*')
       .eq('game_id',gameid.value);
    if(error) {
        console.log(error)
    } else {
        users.value = data;
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
