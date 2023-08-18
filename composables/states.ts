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

export const useCoatnum = () => {
    // stateの定義
    const coatnum: ref<numeric> = useState('coatnum', () => 1)

    // stateの更新処理
    const updateCoatnum = (coatnum: ref<numeric>) => (value: ref<numeric>) => {
       coatnum.value = value;
    }

    return {
        coatnum: readonly(coatnum), 
        updateCoatnum: updateCoatnum(coatnum)
    }
}

export const usePerson = () => {
    // stateの定義
    const person: ref<numeric> = useState('person', () => 6)


    // stateの更新処理
    const updatePerson = (person: ref<numeric>) => (value: ref<numeric>) => {
       person.value = value;
    }

    return {
        person: readonly(person), 
        updatePerson: updatePerson(person),
    }
}

export const useDoblesflg = () => {
    // stateの定義
    const doblesflg: ref<numeric> = useState('doblesflg', () => true)


    // stateの更新処理
    const updateDoblesflg = (doblesflg: ref<boolean>) => (value: ref<boolean>) => {
       doblesflg.value = value;
    }

    return {
        doblesflg: readonly(doblesflg), 
        updateDoblesflg: updateDoblesflg(doblesflg),
    }
}
