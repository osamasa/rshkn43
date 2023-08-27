<template>
  <v-container>    
    <div>試合結果</div>
    <v-table>
      <thead>
        <tr>
          <th class="text-left">
            No.
          </th>
          <th class="text-left">
            名前
          </th>
          <th class="text-left">
            勝数
          </th>
          <th class="text-left">
            負数
          </th>
          <th class="text-left">
            引分
          </th>
          <th class="text-left">
            勝率(%)
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="items in playererecord"
          :key="items.player_no">
          <td>{{ items.player_no}}</td>
          <td>{{ items.player_name}}</td>        
          <td>{{ items.win}}</td>
          <td>{{ items.lose}}</td>
          <td>{{ items.draw}}</td>
          <td>{{ items.rate}}</td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
  <v-container>
    <div>試合詳細</div>
    <v-table>
      <tbody>
        <tr
          v-for="items in props.gameList.filter((recs)=>{return (!(recs.score_1==0 && recs.score_2==0))})"
          :key="items.game_no">
          <td>{{ items.game_no}}</td>
          <td>
            <tr>
              <td>{{ items.player_1}}&nbsp;{{ items.player_2}}</td>
            </tr>
            <tr>
              <td>{{ items.score_1}}</td>
              <td>{{ calcShouhai(items.score_1,items.score_2) }}</td>
            </tr>            
          </td>
          <td>vs</td>
          <td>            <tr>
              <td>{{ items.player_3}}&nbsp;{{ items.player_4}}</td>
            </tr>
            <tr>
              <td>{{ items.score_2}}</td>
              <td>{{ calcShouhai(items.score_2,items.score_1) }}</td>              
            </tr>            
          </td>
        </tr>        
      </tbody>
    </v-table>
  </v-container>    
</template>

<script setup>
const props = defineProps({
    gameList : Array,
    gameUsers : Array,
    gameSetting : Object
})
const itemsPerPage = ref(5);
const playererecord = ref([]);

onMounted(()=>{

    let playe_win_rec = new Array(props.gameUsers.length).fill(0);
    let playe_lose_rec = new Array(props.gameUsers.length).fill(0);
    let playe_draw_rec = new Array(props.gameUsers.length).fill(0);

    props.gameList.forEach((rec) => {
        let playe_1 = Number ( rec.player_1 ) - 1;
        let playe_2 = Number ( rec.player_2 ) - 1;
        let playe_3 = Number ( rec.player_3 ) - 1;
        let playe_4 = Number ( rec.player_4 ) - 1;
        console.log(playe_1,playe_2,playe_3,playe_4,Number(rec.score_1),Number(rec.score_2));
        if(!((Number(rec.score_1) == 0) && (Number(rec.score_2) == 0))) {
            
            if(Number(rec.score_1) == Number(rec.score_2)) {
                if(props.gameSetting.dobules_flg) {
                    playe_draw_rec[playe_1]=playe_draw_rec[playe_1]+1;
                    playe_draw_rec[playe_2]=playe_draw_rec[playe_2]+1;
                    playe_draw_rec[playe_3]=playe_draw_rec[playe_3]+1;
                    playe_draw_rec[playe_4]=playe_draw_rec[playe_4]+1;
                } else {
                    playe_draw_rec[playe_1]=playe_draw_rec[playe_1]+1;
                    playe_draw_rec[playe_2]=playe_draw_rec[playe_2]+1;                    
                }
            } else if(Number(rec.score_1) > Number(rec.score_2)) {
                if(props.gameSetting.dobules_flg) {
                    playe_win_rec[playe_1]=playe_draw_rec[playe_1]+1;
                    playe_win_rec[playe_2]=playe_draw_rec[playe_2]+1;
                    playe_lose_rec[playe_3]=playe_draw_rec[playe_3]+1;
                    playe_lose_rec[playe_4]=playe_draw_rec[playe_4]+1;
                } else {
                    playe_win_rec[playe_1]=playe_draw_rec[playe_1]+1;
                    playe_lose_rec[playe_2]=playe_draw_rec[playe_2]+1;                    
                }                
            } else if(Number(rec.score_1) < Number(rec.score_2)) {
                if(props.gameSetting.dobules_flg) {
                    playe_lose_rec[playe_1]=playe_draw_rec[playe_1]+1;
                    playe_lose_rec[playe_2]=playe_draw_rec[playe_2]+1;
                    playe_win_rec[playe_3]=playe_draw_rec[playe_3]+1;
                    playe_win_rec[playe_4]=playe_draw_rec[playe_4]+1;
                } else {
                    playe_lose_rec[playe_1]=playe_draw_rec[playe_1]+1;
                    playe_win_rec[playe_2]=playe_draw_rec[playe_2]+1;                    
                }
            }
        }
    });
    props.gameUsers.map((rec,i) => {
        let resultRec = {
            player_no : rec.player_no,
            player_name : rec.player_name,
            win : playe_win_rec[i],
            lose : playe_lose_rec[i],
            draw : playe_draw_rec[i],
            rate : Math.floor((playe_win_rec[i] / (playe_win_rec[i] + playe_lose_rec[i])) * 100)
        }
        playererecord.value.push(resultRec);
    });
})

</script>
