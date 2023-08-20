<template>
  <div v-if="vtoggle==0">
    <v-container class="pa-0" v-for="game in games">
    <v-row @click="changeCurGame(game.game_no);" class="pl-2 pt-1 pb-1 bg-grey-lighten-2" no-gutters v-if="isOnajigame(game.game_no)>0">第{{isOnajigame(game.game_no)}}試合</v-row>
        <v-row no-gutters :class="getCurColor(game.game_no)">
          <v-col class="ma-1"><v-btn block size="large" variant="outlined" @click="d_gameid=game.id;usePlayerPos=1;chPlayerNo=game.player_1;dlgFirstMenu=!dlgFirstMenu;d_player_1=game.player_1;d_player_2=game.player_2;d_player_3=game.player_3;d_player_4=game.player_4;d_score_1=game.score_1;d_score_2=game.score_2"><v-row class="pb-3">{{game.player_1}}</v-row><v-row class="pb-1">{{ getUserName( game.player_1 ) }}</v-row></v-btn></v-col>
          <v-col class="ma-1"><v-btn block size="large" variant="outlined" @click="d_gameid=game.id;usePlayerPos=2;chPlayerNo=game.player_2;dlgFirstMenu=!dlgFirstMenu;d_player_1=game.player_1;d_player_2=game.player_2;d_player_3=game.player_3;d_player_4=game.player_4;d_score_1=game.score_1;d_score_2=game.score_2"><v-row class="pb-3">{{game.player_2}}</v-row><v-row class="pb-1">{{ getUserName( game.player_2 ) }}</v-row></v-btn></v-col>
          <v-col @click='changeCurGame(game.game_no);' cols="1">&nbsp;</v-col>
          <v-col class="ma-1"><v-btn block size="large" variant="outlined" @click="d_gameid=game.id;usePlayerPos=3;chPlayerNo=game.player_3;dlgFirstMenu=!dlgFirstMenu;d_player_1=game.player_1;d_player_2=game.player_2;d_player_3=game.player_3;d_player_4=game.player_4;d_score_1=game.score_1;d_score_2=game.score_2"><v-row class="pb-3">{{game.player_3}}</v-row><v-row class="pb-1">{{ getUserName( game.player_3 ) }}</v-row></v-btn></v-col>
          <v-col class="ma-1"><v-btn block size="large" variant="outlined" @click="d_gameid=game.id;usePlayerPos=1;chPlayerNo=game.player_4;dlgFirstMenu=!dlgFirstMenu;d_player_1=game.player_1;d_player_2=game.player_2;d_player_3=game.player_3;d_player_4=game.player_4;d_score_1=game.score_1;d_score_2=game.score_2"><v-row class="pb-3">{{game.player_4}}</v-row><v-row class="pb-1">{{ getUserName( game.player_4 ) }}</v-row></v-btn></v-col>
        </v-row>
	<v-row @click="changeCurGame(game.game_no)" no-gutters :class="getCurColor(game.game_no)" v-if="!(game.score_1==0 && game.score_2==0)">
	  <v-col class="text-center">{{ calcShouhai(game.score_1, game.score_2)}}{{ game.score_1 }}</v-col>
	  <v-col class="text-center">{{ calcShouhai(game.score_2, game.score_1)}}{{ game.score_2 }}</v-col>	  
	</v-row>	
    </v-container>
    <v-row no-gutters>
      <v-btn block class="ma-2" variant="elevated" color="success" @click="addplaydb()">ゲームを追加</v-btn>
    </v-row>        
    <v-dialog
      v-model="dlgFirstMenu"
      width="auto"
      >
      <v-card>
        <v-card-title>
          メニュー
          </v-card-title>
        <v-card-text>
          <v-btn
	    class="ma-2"
	    @click="dlgSecondMenu=!dlgSecondMenu"
	    color="primary"
	    block
            >
            プレイヤーを変更する
            </v-btn>
            <v-btn
              class="ma-2"
	      block
	      color="secondary"
	      @click="dlgThridMenu=!dlgThridMenu"
            >
              得点を入力する
            </v-btn>	    
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="info"
              variant="text"
              @click="dlgFirstMenu = false"
            >
              閉じる
            </v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog
      v-model="dlgSecondMenu"
      width="auto"
      >
      <v-card>
        <v-card-title>
        第{{ getCurShiainum() }}試合の{{ getCurUserNo() }}さんの変更
        </v-card-title>
        <v-card-text>
        <v-select v-model="chPlayerNo" labele="プレイヤー番号" :items="getPlayearsList()"></v-select>
        </v-card-text>
	<v-card-actions>
	  <v-row>
	    <v-col>
              <v-btn
		color="success"
		@click="updatePlayer();dlgSecondMenu = false"
		>
		更新		
              </v-btn>
	    </v-col>
	    <v-col>
              <v-btn
		color="info"		
		variant="text"
		@click="dlgSecondMenu = false"
		>
		キャンセル
              </v-btn>
	    </v-col>
	  </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dlgThridMenu"
      width="auto"
      >
      <v-card>
        <v-card-title>
          第{{ getCurShiainum() }}試合の得点入力
        </v-card-title>
        <v-card-text>
	  <v-row>
	    <v-col>
	      {{ d_player_1 }},{{ d_player_2 }}
	    </v-col>
	    <v-col>&nbsp;VS&nbsp;</v-col>
	    <v-col>
	      {{ d_player_3 }},{{ d_player_4 }}
	    </v-col>
	  </v-row>
	  <v-row>
	    <v-col>
	      <v-select density="compact" v-model="d_score_1" labele="得点" :items="[0,1,2,3,4,5,6,7,8,9,10]"></v-select>
	    </v-col>
	    <v-col>
	      <v-select density="compact" v-model="d_score_2" labele="得点" :items="[0,1,2,3,4,5,6,7,8,9,10]"></v-select>
	    </v-col>	    
	  </v-row>	    
        </v-card-text>
        <v-card-actions>
	  <v-row>
	    <v-col>
              <v-btn
		color="success"
		@click="updateGameScore();dlgThridMenu = false"
		>
		更新
              </v-btn>
	    </v-col>
	    <v-col>
              <v-btn
		color="info"
		@click="dlgThridMenu=false"
		>
		キャンセル
              </v-btn>
	    </v-col>
	  </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
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

const games = ref([]);
const users = ref([]);
const vtoggle = ref(0);
const dlgFirstMenu = ref(false);
const dlgSecondMenu = ref(false);
const dlgThridMenu = ref(false);
const coatnum = ref(0);
const person = ref(0);
const doblesflg = ref(false);
const curgame = ref(0);

const usePlayerPos = ref(0);
const chPlayerNo = ref(0);

const d_gameid = ref(0);
const d_player_1 = ref(0);
const d_player_2 = ref(0);
const d_player_3 = ref(0);
const d_player_4 = ref(0);
const d_score_1 = ref(0);
const d_score_2 = ref(0);

const readcurgame = async() => {
    let { data , error } = await supabase
       .from('games')
        .select('curgame,player_num,coat_num,dobules_flg')
       .eq('id',gameid.value);
    if(error) {
        console.log(error)
} else {
        curgame.value = data[0].curgame;
        doblesflg.value = data[0].dobules_flg;
        person.value= data[0].player_num;
        coatnum.value = data[0].coat_num;
    }
}

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

const calcRealshiaiNum=((_no) => {
    let realcoatnum = calcRealCoatnum();
    let retv = realcoatnum==1 ? _no : (Math.ceil(_no / realcoatnum));

    return retv;
});

const getUserName = computed(()=> (_player_no) => {
    let a = users.value.find((e) => e.player_no == _player_no);
    if(typeof a === 'object') {
        let name = a.player_name;
        if((typeof name === 'string') && (name !== '')) {
            if (name.length > 2) {
                name = name.substr(name,2) + '..';
            }
            return ' (' + name + ')';
        } else {
            return '';
        }
    } else
        return ''
})

const isOnajigame = computed(()=> (_no) => {
    let realcoatnum = calcRealCoatnum();
    return realcoatnum==1 ? _no : (_no-1) % realcoatnum == 0 ? (Math.floor(_no / realcoatnum)+1) : 0;
})


const getCurColor = computed(()=>(_game_no) => {
    let realcoatnum = calcRealCoatnum();
    if(((curgame.value-1) * realcoatnum < _game_no) && (curgame.value*realcoatnum+1 > _game_no)) {
        return 'bg-yellow-lighten-4';
    } else {
        return '';
    }
});

const getCurUserNo = computed(()=>() => {
    let pgame = games.value.filter((game) => {return(game.id === d_gameid.value)});
    return pgame[0]['player_' + usePlayerPos.value];
});

const getCurShiainum = computed(()=>() => {
    let pgame = games.value.filter((game) => {return(game.id === d_gameid.value)});
    return calcRealshiaiNum(pgame[0].game_no);
});
    
const changeCurGame = async (_no) => {

    let realshiainum = calcRealshiaiNum(_no);
    let _gameid = gameid.value;
    
    curgame.value = realshiainum;
    
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

const getPlayearsList = computed(() =>() => {
    let m=users.value.length;
    let nplayers = [...Array(m)].map((_,i) => i + 1 );

    return nplayers;
});

const calcShouhai = computed(() =>(s1,s2) => {
    return s1 == s2 ? '△' : s1 > s2 ? '◯' : '×';
});    

const updatePlayer = async() => {
    let _rerodGameid = d_gameid.value;
    let _playername = 'player_' + usePlayerPos.value;
    let newValue = chPlayerNo.value;

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

const updateGameScore = async() => {
    let _rerodGameid = d_gameid.value;

    const { data, error } = await supabase
          .from('game_record')
          .update(
	      {
	      	  'modified_at' : 'now()',
		  'score_1' : d_score_1.value,
		  'score_2' : d_score_2.value
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

const addplaydb = async() => {
    let _v_id = gameid.value;
    let _coat_num = coatnum.value;
    let _dobules_flg = doblesflg.value;
    let _person_num = person.value;
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

onMounted(() => {
    readfirst();
    readsecond();
    readcurgame();
    let gameRecord = supabase.channel('custom-all-channel')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'games,game_record,game_user' },
            (payload) => {
                if((payload.table === 'games') && (payload.eventType === 'UPDATE')) {
                    if(payload.new.game_id === gameid.value) {
                        curgame.value = payload.new.curgame;
                    }
                } else if((payload.table === 'game_record') && (payload.eventType === 'INSERT')) {
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
