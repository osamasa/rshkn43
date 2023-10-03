<template>
  <div class="mt-0" v-if="vtoggle==0">
    <ListGames :game-list="games" :game-users="users" :game-setting="gameSetting" @update-player="doUpdatePlayer" @change-curgame="doChangeCurgame" @add-playdb="doAddplaydb" @update-game-score="doUpdateGameScore"/>
  </div>
  <div class="mt-0" v-if="vtoggle==1">
    <ListGameUsers :users-list="users" @update-game-users="doUpdateGameUsers" @cancel-game-users="doCancel" />
  </div>
  <div class="mt-0" v-if="vtoggle==2">
    <ShowReslut :game-list="games" :game-users="users" :game-setting="gameSetting" />
  </div>
  
  <div class="mt-0" v-if="vtoggle==3">
    <v-container no-gutters>
      <div>
        お友達と一緒にスコアをつける場合、お友達にこちらのURLからアクセスしてもらってください。
      </div>
      <div>
        <img :src=imgdata />
      </div>
      <div class="mt-1">
        {{ getMyURL() }}
      </div>
      <div v-if="isLiffAppNai()">
        <div class="mt-2">
          Lineに送信したい場合は下のボタンを押してください
        </div>
        <div class="mt-3">
          <v-btn @click="sendLiffShareSend()" color="success">スコアをラインに送信</v-btn>
        </div>
      </div>
<!--      <div v-else>
        <div class="mt-2">
          Lineに送信したい場合は下のボタンを押してください
        </div>
        <div class="mt-3">
          <v-btn @click="sendPickSend()" color="success">スコアをラインに送信</v-btn>
        </div>
    </div>
-->
      <div class="mt-2">
        スコアを文字列でコピーしたい場合は下のボタンをおしてください
      </div>
      <div class="mt-3">
        <v-btn @click="clickCopyMethod()" color="primary">スコアのコピー</v-btn>
      </div>    
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
      <v-btn>
        <v-icon>mdi-share-variant</v-icon>
        <span>共有</span>
      </v-btn>      
    </v-bottom-navigation>
  </v-layout>
</template>
<script setup>
import liff from '@line/liff';
const supabase = useSupabaseClient();
const runtimeConfig = useRuntimeConfig();
const router = useRoute();
const gameid = ref( router.params.gameid );
const { loading, updateLoading} = useLoading();
const { userid, updateUserid } = useUserid();
const { updateErrorMsg } = useErrorMsg();
const { snackbartext } = useSnackBarText();
const { snackbarboolean } = useStateBarBoolean();

import QRCode from 'qrcode';

const vtoggle = ref(0);
const games = ref([]);
const users = ref([]);
const gameSetting = ref({});
const gameRecord = ref();
const isSwhoShareTag = ref(false);
const imgdata = ref('');

updateLoading(true);

const zeroPadding = (NUM, LEN) => {
    return ( Array(LEN).join('0') + NUM ).slice( -LEN );
}

const readcurgame = async() => {
    let { data , error } = await supabase
        .from('games_view')
        .select('*')
        .eq('id',gameid.value)
        .single()
    if(error) {
        updateErrorMsg('[gameid.vue][ERR201]' +  error.code + ' ' + error.message);
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
        updateErrorMsg('[gameid.vue][ERR202]' +  error.code + ' ' + error.message);
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
        updateErrorMsg('[gameid.vue][ERR203]' +  error.code + ' ' + error.message);
    } else {
        games.value = data;
    }
}

const doChangeCurgame = async (_no) => {
    let realshiainum = calcRealshiaiNum(_no,
                                        gameSetting.value.dobules_flg,
                                        gameSetting.value.player_num,
                                        gameSetting.value.coat_num );
    let _gameid = gameid.value;


    const { data, error } =  await supabase
          .from('games')
          .update({ 'curgame' : realshiainum ,
                    'modified_at' : 'now()'})
          .eq('id', _gameid)
	  .select()
    if(error) {
        updateErrorMsg('[gameid.vue][ERR204]' +  error.code + ' ' + error.message);
    }
};

const doUpdateGameScore = async(d_gameid, d_score_1, d_score_2) => {
    let _rerodGameid = d_gameid;
    let updategamedata = {
	modified_at : 'now()',
	score_1 : d_score_1,
	score_2 : d_score_2
    };
    const { data, error } = await supabase
          .from('game_record')
          .update(
              updategamedata
	  )
          .eq('id', _rerodGameid )
          .select()
    if(error) {
        updateErrorMsg('[gameid.vue][ERR205]' +  error.code + ' ' + error.message);
    } else {
	let result = games.value.filter((game) => {
	    return game.id != _rerodGameid;
	});
	games.value=result;
	games.value.push(data[0]);
	games.value.sort((a,b) => a.id - b.id);
        snackbarboolean.value=true;
        snackbartext.value="スコア更新完了"
    }
}


const doUpdatePlayer = async(_gameid,_usePlayerPos,_chPlayerNo) => {
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
        updateErrorMsg('[gameid.vue][ERR206]' +  error.code + ' ' + error.message);
    } else {
	let result = games.value.filter((game) => {
	    return game.id != _rerodGameid;
	});
	games.value=result;
	games.value.push(data[0]);
	games.value.sort((a,b) => a.id - b.id);
        snackbarboolean.value=true;
        snackbartext.value="プレイヤー変更完了"
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
        updateErrorMsg('[gameid.vue][ERR207]' + error.code + ' ' + error.message);
}

const doUpdateGameUsers = (_users) => {
    updateLoading(true);
    _users.value.forEach(async (_user) => {
        let _player_name = _user.player_name;
        let _user_id = _user.id;
        let { data , error } = await supabase
            .from('game_user')
            .update({
                'player_name' : _player_name,
                'modified_at' : 'now()'})
            .eq('id', _user_id)
        if(error)
            updateErrorMsg('[gameid.vue][ERR208]' + error.code + ' ' + error.message);
    });
    updateLoading(false);
    
    users.value=[..._users.value];
    vtoggle.value=0;
    snackbarboolean.value=true;
    snackbartext.value="メンバー設定完了" 
}

const doCancel = () => {
    vtoggle.value=0;
}

const myloginCheck = () => {
    readfirst();
    readsecond();
    readcurgame();    

    if(liff.isLoggedIn()) {
        liff.getProfile()
            .then(profile => {
                updateUserid(profile.userId);
                if(profile.userId === userid.value) {
                    isSwhoShareTag.value=true;
                }
            })}

    doSubscribed();
};

const getMyURL = computed(() =>() => {
    return window.location.href;
});

const errorCallback = ((err)=>{
    console.log(err);
    updateLoading(false);
});    

const doSubscribed = () => {
    
    let channel1 = zeroPadding(gameid.value,10);   
    gameRecord.value = supabase.channel(channel1)
        .on('postgres_changes',
            { event: 'UPDATE',
              schema: 'public',
              table:'games',
              filter: 'id=eq.'+gameid.value
            },
            (payload) => {
                gameSetting.value = { ...payload.new }
                gameSetting.value.loginid = userid.value
            })
        .on('postgres_changes',
            { event: 'INSERT',
              schema: 'public',
              table: 'game_record',
              filter: 'game_id=eq.'+gameid.value
            },
            (payload) => {
                updateLoading(true);
                games.value.push(payload.new);
                games.value.sort((a,b) => a.game_no - b.game_no);
                updateLoading(false);                
            })
        .on('postgres_changes',
            { event: 'UPDATE',
              schema: 'public',
              table: 'game_record',
              filter: 'game_id=eq.'+gameid.value
            },
            (payload) => {
                updateLoading(true);
                let result = games.value.filter((game) => {
                    return (game.id != payload.old.id);
                });
                games.value = result;
                games.value.push(payload.new);
                games.value.sort((a,b) => a.id - b.id);
                updateLoading(false);                                
            })
        .on('postgres_changes',
            { event: 'UPDATE',
              schema: 'public',
              table: 'game_user',
              filter: 'game_id=eq.'+gameid.value
            },
            (payload) => {
                updateLoading(true);                
            
                let result = users.value.filter((user) => {
                    return (user.id != payload.old.id);
                });
                users.value = result;
                users.value.push(payload.new);
                users.value.sort((a,b) => a.id - b.id);
                updateLoading(false);                
                
            })
        .subscribe()        
}

const untrackPresence = async() => {
    const presenceUntrackStatus = await gameRecord.value.untrack();
}

const onUnmounted = async () => {
    if(gameRecord.value) {
        untrackPresence();
    }
};

const getShoHaiText = () => {
    let hiduke=new Date(); 

    //年・月・日・曜日を取得する
    let year = hiduke.getFullYear();
    let month = hiduke.getMonth()+1;
    let week = hiduke.getDay();
    let day = hiduke.getDate();
    
    let modelValue = '';
    let playerRest = [];
    playerRest = calcPlayerGameResut( users.value,
                                      games.value,
                                      gameSetting.value );

    modelValue = modelValue + '本日（' + year + '年' + month + '月' + day + '日) の試合結果です' + "\r\n";
    modelValue = modelValue + "\r\n";
    
    playerRest.forEach((rec) => {
        modelValue = modelValue + rec.player_no + ': ' + (rec.player_name ? rec.player_name : rec.player_no)+ " さん " + rec.win + " 勝 " + rec.lose + " 負 " + rec.draw + " 分 " + "\r\n";
    });
    modelValue = modelValue + "\r\n";
    games.value.filter(recs=>{return (!(recs.score_1==0 && recs.score_2==0))}).forEach((rec,i) => {
        modelValue = modelValue + '第' + (i+1) + '試合 '
        if(gameSetting.value.dobules_flg) {
            modelValue = modelValue + rec.player_1 + ' ' + rec.player_2 + ' (' + rec.score_1 + ' ' + _calcShouhai(rec.score_1,rec.score_2)+ ') VS ';
            modelValue = modelValue + rec.player_3 + ' ' + rec.player_4 + ' (' + rec.score_2 + ' ' + _calcShouhai(rec.score_2,rec.score_1) + ")\r\n";
        } else {
            modelValue = modelValue + rec.player_1 + ' ' + rec.score_1 + ' ' + _calcShouhai(rec.score_1,rec.score_2) + ' ' + _calcShouhai(rec.score_1,rec.score_2)+ ') VS ';
            modelValue = modelValue + rec.player_2 + ' ' + rec.score_2 + ' ' + _calcShouhai(rec.score_2,rec.score_1) + ' ' + _calcShouhai(rec.score_2,rec.score_1) + ")\r\n";
        }
    });

    modelValue = modelValue + "\r\n--\r\n";
    modelValue = modelValue + "乱数表君V4.2\r\n";
    modelValue = modelValue + "https://liff.line.me/2000361330-n0YLlRAm\r\n";

    return modelValue;
    
}

const isLiffAppNai = computed(() => ()=> {
    return _isLiffAppNai(liff);
});

const sendLiffShareSend = () => {
    let txtValue = getShoHaiText();    
    liff.sendMessages({
        type: "text",
        text: txtValue
    })
        .then(() => {
    snackbarboolean.value=true;
    snackbartext.value="送信完了"
        })
        .catch((err) => {
        updateErrorMsg('[gameid.vue][ERR208]' + err);
        })
}

const sendPickSend = () => {
    let txtValue = getShoHaiText();

    if(!liff.isLoggedIn()) {
        liff.login();
    }
    liff.shareTargetPicker(txtValue.split(/\r\n/));
}

const clickCopyMethod = () => {
    
    let textarea = document.createElement('textarea');
    textarea.value = getShoHaiText();
    textarea.style.top = '-100px';
    textarea.style.maxHeight = '100px';
    textarea.style.position = 'absolute';
    document.body.appendChild(textarea);
    
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    snackbarboolean.value=true;
    snackbartext.value="コピー完了"     
};

onMounted(() => {
    QRCode.toDataURL( window.location.href )
        .then(url => {
            imgdata.value=url;
        })
        .catch(err => {
            console.error(err)
        })

    liff.init({ liffId: runtimeConfig.public.liffId },
              myloginCheck,
              errorCallback);
    updateLoading(false);
    snackbarboolean.value=true;
    snackbartext.value="乱数表設定終了"    
});
</script>

