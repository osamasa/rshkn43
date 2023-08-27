<template>
  <div v-if="vtoggle==0">
    <ListGames :game-list="games" :game-users="users" :game-setting="gameSetting" @update-player="doUpdatePlayer" @change-curgame="doChangeCurgame" @add-playdb="doAddplaydb" @update-game-score="doUpdateGameScore"/>
  </div>
  <div v-if="vtoggle==1">
    <ListGameUsers :users-list="users" @update-game-users="doUpdateGameUsers" @cancel-game-users="doCancel" />
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
      <v-btn>
        <v-icon>mdi-share-variant</v-icon>
        <span>共有</span>
      </v-btn>      
    </v-bottom-navigation>
  </v-layout>
</template>
<script setup>
const supabase = useSupabaseClient();
const { gameid } = useGameid();

const vtoggle = ref(0);
const games = ref([]);
const users = ref([]);
const gameSetting = ref({});
const gameRecord = ref();

const zeroPadding = (NUM, LEN) => {
    return ( Array(LEN).join('0') + NUM ).slice( -LEN );
}

const readcurgame = async() => {
    let { data , error } = await supabase
        .from('games')
        .select('*')
        .eq('id',gameid.value)
        .single()
    if(error) {
        console.log(error)
    } else {
        gameSetting.value = data;
    }
}

const readsecond = async() => {
    let { data , error } = await supabase
       .from('game_user')
       .select('*')
       .eq('game_id',gameid.value)
       .order('player_no', { ascending: true })
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
        .eq('game_id',gameid.value)
        .order('game_no', { ascending: true })    
    if(error) {
        console.log(error)
    } else {
        games.value = data;
    }
}

const calcRealCoatnum=() => {
    let realcoatnum = 0;
    if (gameSetting.value.dobules_flg) {
        realcoatnum = Math.floor(gameSetting.value.player_num / 4);
    } else {
        realcoatnum = Math.floor(gameSetting.value.player_num / 2);
    }
    if(realcoatnum > gameSetting.value.coat_num) {
        realcoatnum = gameSetting.value.coat_num;
    }
    return realcoatnum;
}

const calcRealshiaiNum=((_no) => {
    let realcoatnum = calcRealCoatnum();
    let retv = realcoatnum==1 ? _no : (Math.ceil(_no / realcoatnum));

    return retv;
});

const doChangeCurgame = async (_no) => {
    let realshiainum = calcRealshiaiNum(_no);
    let _gameid = gameid.value;
    
    gameSetting.value.curgame = realshiainum;
    
    const { data, error } =  await supabase
          .from('games')
          .update({ 'curgame' : realshiainum ,
                   'modified_at' : 'now()'})
          .eq('id', _gameid)
	  .select()
    if(error) {
        console.log(error)
    }
};

const doUpdatePlayer = async(_gameid,_usePlayerpos,_chPlayerNo) => {
    let _rerodGameid = _gameid;
    let _playername = 'player_' + _usePlayerPos;
    let newValue = _chPlayerNo;

    let updatedatas = {
	'modified_at' : 'now()'
    };
    updatedatas[_playername]=newValue;
    
    const { data, error } = await supabase
          .from('game_record')
          .update(updatedatas)
          .eq('id', _rerodGameid )
          .select()
    if(error) {
        console.log(error)
    } else {
	let result = games.value.filter((game) => {
	    return game.id != _rerodGameid;
	});
	games.value=result;
	games.value.push(data[0]);
	games.value.sort((a,b) => a.id - b.id);
    }
}

const doUpdateGameScore = async(d_gameid, d_score_1, d_score_2) => {
    let _rerodGameid = d_gameid;

    const { data, error } = await supabase
          .from('game_record')
          .update(
	      {
	      	  'modified_at' : 'now()',
		  'score_1' : d_score_1,
		  'score_2' : d_score_2
	      }
	  )
          .eq('id', _rerodGameid )
          .select()
    if(error) {
        console.log(error)
    } else {
	let result = games.value.filter((game) => {
	    return game.id != _rerodGameid;
	});
	games.value=result;
	games.value.push(data[0]);
	games.value.sort((a,b) => a.id - b.id);
    }
}

const doAddplaydb = async() => {
    let _v_id = gameid.value;
    let _coat_num = gameSetting.value.coat_num;
    let _dobules_flg = gameSetting.value.dobules_flg;
    let _person_num = gameSetting.value.player_num;
    let _last_no = games.value.length;
    
    const { data, error } = await supabase
          .rpc('addnewgames', {
	      _v_id,
              _person_num,               
              _coat_num,
              _dobules_flg,
	      _last_no
        });
    if(error)
       console.error(error)
    else {
    	games.value.push(...data);
	games.value.sort((a,b) => a.id - b.id);
    }
}

const doUpdateGameUsers = (_users) => {
    _users.value.forEach(async (_user) => {
        let _player_name = _user.player_name;
        let _user_id = _user.id;
        let { data , error } = await supabase
            .from('game_user')
            .update({
                'player_name' : _player_name,
                'modified_at' : 'now()'})
            .eq('id', _user_id)
    });
    users.value=[..._users.value];
    vtoggle.value=0;
}

const doCancel = () => {
    vtoggle.value=0;
}

onMounted(()=>{
    let channel1 = zeroPadding(gameid.value,10);
    
    readfirst();
    readsecond();
    readcurgame();
    gameRecord.value = supabase.channel(channel1)
          .on('postgres_changes',
              { event: 'UPDATE',
                schema: 'public',
                table:'games',
                filter: 'id=eq.'+gameid.value
              },
              (payload) => {
                  gameSetting.value = payload.new;
              })
          .on('postgres_changes',
            { event: 'INSERT',
              schema: 'public',
              table: 'game_record',
              filter: 'game_id=eq.'+gameid.value
            },
            (payload) => {
                games.value.push(payload.new);
                games.value.sort((a,b) => a.game_no - b.game_no);
            })
          .on('postgres_changes',
            { event: 'UPDATE',
              schema: 'public',
              table: 'game_record',
              filter: 'game_id=eq.'+gameid.value
            },
            (payload) => {
                let result = games.value.filter((game) => {
                    return (game.id != payload.old.id);
                });
                games.value = result;
                games.value.push(payload.new);
                games.value.sort((a,b) => a.id - b.id);
            })
          .on('postgres_changes',
            { event: 'UPDATE',
              schema: 'public',
              table: 'game_user',
              filter: 'game_id=eq.'+gameid.value
            },
            (payload) => {
                let result = users.value.filter((user) => {
                    return (user.id != payload.old.id);
                });
                users.value = result;
                users.value.push(payload.new);
                users.value.sort((a,b) => a.id - b.id);
            })
        .subscribe()
})

const untrackPresence = async () => {
  const presenceUntrackStatus = await gameRecord.value.untrack();
}

onUnmounted(() => {
    if(gameRecord.value) {
        untrackPresence();
    }
});
</script>
