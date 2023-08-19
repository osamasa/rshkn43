export const useUserid = () => {
    // stateの定義
    const userid: ref<string> = useState('userid', () => '')

    // stateの更新処理
    const updateUserid = (userid: ref<string>) => (value: ref<string>) => {
        userid.value = value;
    }

    return {
        userid: readonly(userid), 
        updateUserid: updateUserid(userid),
    }
};
export const useGameid = () => {
    // stateの定義
    const gameid: ref<numeric> = useState('gameid', () => 0)

    // stateの更新処理
    const updateGameid = (gameid: ref<numeric>) => (value: ref<numeric>) => {
       gameid.value = value;
    }

    return {
        gameid: readonly(gameid), 
        updateGameid: updateGameid(gameid),
    }
}
