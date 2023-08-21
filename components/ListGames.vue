<template>
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
    <v-btn block class="ma-2" variant="elevated" color="success" @click="doAddplaydb">ゲームを追加</v-btn>
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
	      @click="doUpdatePlayer();dlgSecondMenu = false"
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
</template>
<script setup>
import { defineProps, defineEmits } from "vue";
const props = defineProps({
    gameList : Array,
    gameCurgame : Numeric,
    gameUsers : Array,
})
const emit = defineEmits(
    ['update-game-lists', 'change-curgame']
)
const games = ref([]);
const curgame = ref(0);
const users = ref([]);

const d_gameid = ref(0);
const d_player_1 = ref(0);
const d_player_2 = ref(0);
const d_player_3 = ref(0);
const d_player_4 = ref(0);
const d_score_1 = ref(0);
const d_score_2 = ref(0);

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

const getPlayearsList = computed(() =>() => {
    let m=users.value.length;
    let nplayers = [...Array(m)].map((_,i) => i + 1 );

    return nplayers;
});

const calcShouhai = computed(() =>(s1,s2) => {
    return s1 == s2 ? '△' : s1 > s2 ? '◯' : '×';
});    



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

const const changeCurGame = (_no) => {
    curgame.value=_no;
    emit('changecurgame', _no);
}

const isOnajigame = computed(()=> (_no) => {
    let realcoatnum = calcRealCoatnum();
    return realcoatnum==1 ? _no : (_no-1) % realcoatnum == 0 ? (Math.floor(_no / realcoatnum)+1) : 0;
})

const doUpdatePlayer = () => {
    emit( 'update-player', d_gameid.value, usePlayerPos.value, chPlayerNo.value);
}

const doAddplaydb = () => {
    emit ( 'add-playdb' );
}

onMounted(() => {
    curgame.value = props.gameCurgame;
    games.value = props.gameList.map((x) => 
        ({id:x.id,
          game_no:x.game_no,
          player_1:x.player_1,
          player_2:x.player_2,
          player_3:x.player_3,
          player_4:x.player_4,
          score_1:x.score_1,
          score_2:x.score_2,
          game_id:x.game_id
         }));
    
    users.value = props.gameUsers.map((x) =>
        ({id:x.id,
          player_no:x.player_no,
          player_name:x.player_name,
         }));
});
</script>
