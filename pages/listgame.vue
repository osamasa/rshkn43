<template>
<div>
    {{games}}
</div>
<div>
    {{users}}
</div>        
</template>
<script setup>
const supabase = useSupabaseClient();
const games = ref([]);
const users = ref([]);
const { gameid } = useGameid();

const readsecond = async() => {
    let { data , error } = await supabase
       .from('game_user')
       .select('*')
       .eq('game_id',gameid.value);
    if(error) {
        console.log(error)
    } else {
        users.value = data;
    }
}

const readfirst = async() => {
    let { data , error } = await supabase
       .from('game_record')
       .select('*')
       .eq('game_id',gameid.value);
    if(error) {
        console.log(error)
    } else {
        games.value = data;
    }
}

onMounted(() => {
    readfirst();
    readsecond();
    let gameRecord = supabase.channel('custom-all-channel')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'game_record,game_user' },
            (payload) => {
                console.log('Change received!', payload)
                if((payload.table === 'game_record') && (payload.eventType === 'INSERT')) {
                    if(payload.new.game_id === gameid.value) {
                        games.value.push(payload.new);
                    }
                } else if((payload.table === 'game_record') && (payload.eventType === 'UPDATE')) {
                    if(payload.new.game_id === gameid.value) {
                        let result = games.value.filter((game) => {
                            return (game.id != payload.old.id);
                        });
                        games.value = result;
                        games.value.push(payload.new);
                        games.value.sort((a,b) => a.id - b.id);
                    }
                } else if((payload.table === 'game_record') && (payload.eventType === 'DELETE')) {
                    let result = games.value.filter((game) => {
                        return (game.id != payload.old.id);
                    });
                    games.value = result;
                } else if((payload.table === 'game_user') && (payload.eventType === 'INSERT')) {
                    if(payload.new.game_id === gameid.value) {
                        users.value.push(payload.new);
                    }
                } else if((payload.table === 'game_user') && (payload.eventType === 'UPDATE')) {
                    if(payload.new.game_id === gameid.value) {
                        let result = users.value.filter((user) => {
                            return (user.id != payload.old.id);
                        });
                        users.value = result;
                        users.value.push(payload.new);
                        users.value.sort((a,b) => a.id - b.id);
                    }
                } else if((payload.table === 'game_user') && (payload.eventType === 'DELETE')) {
                    let result = users.value.filter((user) => {
                        return (user.id != payload.old.id);
                    });
                    users.value = result;
                }
            }
        )
        .subscribe()    
});
</script>
