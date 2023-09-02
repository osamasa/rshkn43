const calcRealCoatnum=(dobules_flg,player_num,coat_num) => {
    let realcoatnum = 0;
    if (dobules_flg) {
        realcoatnum = Math.floor(player_num / 4);
    } else {
        realcoatnum = Math.floor(player_num / 2);
    }
    if(realcoatnum > coat_num) {
        realcoatnum = coat_num;
    }
    return realcoatnum;
}

export const calcRealshiaiNum=((_no,dobules_flg,player_num,coat_num) => {
    let realcoatnum = calcRealCoatnum(dobules_flg,player_num,coat_num);
    let retv = realcoatnum==1 ? _no : (Math.ceil(_no / realcoatnum));

    return retv;
});

export const _calcShouhai =((s1,s2) => {
    return s1 == s2 ? '△' : s1 > s2 ? '◯' : '×';
});

export const calcPlayerGameResut = (
    (gameUsers,
     gameList,
     gameSetting) =>
    {
        let playe_win_rec = new Array(gameUsers.length).fill(0);
        let playe_lose_rec = new Array(gameUsers.length).fill(0);
        let playe_draw_rec = new Array(gameUsers.length).fill(0);

        gameList.forEach((rec) => {
            let playe_1 = Number ( rec.player_1 ) - 1;
            let playe_2 = Number ( rec.player_2 ) - 1;
            let playe_3 = Number ( rec.player_3 ) - 1;
            let playe_4 = Number ( rec.player_4 ) - 1;
            if(!((Number(rec.score_1) == 0) && (Number(rec.score_2) == 0))) {
                if(Number(rec.score_1) == Number(rec.score_2)) {
                    if(gameSetting.dobules_flg) {
                        playe_draw_rec[playe_1]=playe_draw_rec[playe_1]+1;
                        playe_draw_rec[playe_2]=playe_draw_rec[playe_2]+1;
                        playe_draw_rec[playe_3]=playe_draw_rec[playe_3]+1;
                        playe_draw_rec[playe_4]=playe_draw_rec[playe_4]+1;
                    } else {
                        playe_draw_rec[playe_1]=playe_draw_rec[playe_1]+1;
                        playe_draw_rec[playe_2]=playe_draw_rec[playe_2]+1;                    
                    }
                } else if(Number(rec.score_1) > Number(rec.score_2)) {
                    if(gameSetting.dobules_flg) {
                        playe_win_rec[playe_1]=playe_draw_rec[playe_1]+1;
                        playe_win_rec[playe_2]=playe_draw_rec[playe_2]+1;
                        playe_lose_rec[playe_3]=playe_draw_rec[playe_3]+1;
                        playe_lose_rec[playe_4]=playe_draw_rec[playe_4]+1;
                    } else {
                        playe_win_rec[playe_1]=playe_draw_rec[playe_1]+1;
                        playe_lose_rec[playe_2]=playe_draw_rec[playe_2]+1;                    
                    }                
                } else if(Number(rec.score_1) < Number(rec.score_2)) {
                    if(gameSetting.dobules_flg) {
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
        let retValue = [];
        gameUsers.map((rec,i) => {
            let resultRec = {
                player_no : rec.player_no,
                player_name : rec.player_name,
                win : playe_win_rec[i],
                lose : playe_lose_rec[i],
                draw : playe_draw_rec[i],
                rate : Math.floor((playe_win_rec[i] / (playe_win_rec[i] + playe_lose_rec[i])) * 100)
            }
            retValue.push(resultRec);
        });
        return retValue;
    }
)
