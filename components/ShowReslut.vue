<template>
<div>試合結果</div>
</template>

<script setup>
const props = defineProps({
    gameList : Array,
    gameUsers : Array,
    gameSetting : Object
})
const itemsPerPage = ref(5);
const playererecord = ref([]);
const headers = [
    {
        title: '',
        align: 'start',
        sortable: false,
        key: 'player_no',
    },
    { title: '番号', key: 'player_no', align: 'end' },
    { title: '名前', key: 'player_name', align: 'end' },
    { title: '勝ち', key: 'win', align: 'end' },
    { title: '負け', key: 'lose', align: 'end' },
    { title: '引き分け', key: 'draw', align: 'end' },
    { title: '勝率(%)', key: 'rate', align: 'end' }
];
onUpdated(()=>{
    playe_win_rec = new Array(props.gameUsers.length).fill(0);
    playe_lose_rec = new Array(props.gameUsers.length).fill(0);
    playe_draw_rec = new Array(props.gameUsers.length).fill(0);

    props.gameList.forEach((rec)=> {
        if(!((rec.score_1 == 0) && (rec.score_2 == 0))) {
            if(rec.score_1 == rec.score_2) {
                if(props.gameSetting.dobules_flg) {
                    playe_draw_rec[rec.playe_1]=playe_draw_rec[rec.playe_1]+1;
                    playe_draw_rec[rec.playe_2]=playe_draw_rec[rec.playe_2]+1;
                    playe_draw_rec[rec.playe_3]=playe_draw_rec[rec.playe_3]+1;
                    playe_draw_rec[rec.playe_4]=playe_draw_rec[rec.playe_4]+1;
                } else {
                    playe_draw_rec[rec.playe_1]=playe_draw_rec[rec.playe_1]+1;
                    playe_draw_rec[rec.playe_2]=playe_draw_rec[rec.playe_2]+1;                    
                }
            } else if(rec.score_1 > rec.score_2){
                if(props.gameSetting.dobules_flg) {
                    playe_win_rec[rec.playe_1]=playe_draw_rec[rec.playe_1]+1;
                    playe_win_rec[rec.playe_2]=playe_draw_rec[rec.playe_2]+1;
                    playe_lose_rec[rec.playe_3]=playe_draw_rec[rec.playe_3]+1;
                    playe_lose_rec[rec.playe_4]=playe_draw_rec[rec.playe_4]+1;
                } else {
                    playe_win_rec[rec.playe_1]=playe_draw_rec[rec.playe_1]+1;
                    playe_lose_rec[rec.playe_2]=playe_draw_rec[rec.playe_2]+1;                    
                }                
            } else if(rec.score_1 < rec.score_2){
                if(props.gameSetting.dobules_flg) {
                    playe_lose_rec[rec.playe_1]=playe_draw_rec[rec.playe_1]+1;
                    playe_lose_rec[rec.playe_2]=playe_draw_rec[rec.playe_2]+1;
                    playe_win_rec[rec.playe_3]=playe_draw_rec[rec.playe_3]+1;
                    playe_win_rec[rec.playe_4]=playe_draw_rec[rec.playe_4]+1;
                } else {
                    playe_lose_rec[rec.playe_1]=playe_draw_rec[rec.playe_1]+1;
                    playe_win_rec[rec.playe_2]=playe_draw_rec[rec.playe_2]+1;                    
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
    console.log(playererecord.value);
})

</script>
