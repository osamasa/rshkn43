<template>
  <v-container no-gutters>
    <v-row class="bg-grey-lighten-2 mb-5">
      <v-col cols="1">No</v-col>
      <v-col>お名前</v-col>
    </v-row>
    <v-row  v-for="user in users" no-gutters>
      <v-col cols="1">{{user.player_no}}</v-col>
      <v-col>
        <v-text-field v-model="user.player_name" label="お名前" clearable></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn block @click="doChange()">更新</v-btn>
      </v-col>
      <v-col>
        <v-btn block>キャンセル</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>

import { defineProps, defineEmits } from "vue";

const props = defineProps({
  usersList : Array
})
const emit = defineEmits(
    ['update-game-users']
)
const users = ref([]);
const doChange = () => {
    emit('update-game-users',users);
}

onMounted(() => {
    let l=props.usersList.length;
    for(let i=0;i<l;i++) {
        let _id = props.usersList[i].id;
        let _name = props.usersList[i].player_name;
        let _no = props.usersList[i].player_no;
        let _game_id = props.usersList[i].game_id;

        users.value.push({
            id: _id,
            player_no: _no,
            player_name: _name,
            game_id: _game_id
        });
    }
});
</script>
