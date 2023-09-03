export const useUserid = () => {
    // stateの定義
    const userid: ref<string> = useState('userid', () => '')

    // stateの更新処理
    const updateUserid = (userid: ref<string>) => (value: ref<string>) => {
        userid.value = value;
    }
    // login中かどうか？
    const _isLoggedIn = () => () => {
        if((userid.value === undefined) || (userid.value === null) || (userid.value.length == 0)) {
            return false;
        } else
            return true;
    }

    return {
        userid: readonly(userid), 
        updateUserid: updateUserid(userid),
        _isLoggedIn : _isLoggedIn(),
    }
};

export const useLoading = () => {
  const loading: ref<boolean> = useState('laoding',()=> true );

    // stateの更新処理
    const updateLoading = (loading: ref<boolean>) => (value: ref<boolean>) => {
        loading.value = value;
    }

    return {
        loading: readonly(loading), 
        updateLoading: updateLoading(loading),
    }
};
