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
