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

const calcShouhai = computed(() => (s1,s2) => {
    return _calcShouhai(s1,s2);
});

onMounted(()=>{
    playererecord.value = calcPlayerGameResut(props.gameUsers,
                                              props.gameList,
                                              props.gameSetting);
})

</script>
