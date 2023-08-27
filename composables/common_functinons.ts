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

export const calcShouhai = computed(() =>(s1,s2) => {
    return s1 == s2 ? '△' : s1 > s2 ? '◯' : '×';
});    
