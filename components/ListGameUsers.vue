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
        <v-btn color="secondary" block @click="doChange()">更新</v-btn>
      </v-col>
      <v-col>
        <v-btn color="info" block @click="doCancel()">キャンセル</v-btn>
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
    ['update-game-users', 'cancel-game-users']
)
const users = ref([]);
const doChange = () => {
    emit('update-game-users',users);
}
const doCancel = () => {
    emit('cancel-game-users');
}

onMounted(() => {
    users.value = props.usersList.map((x) => 
        ({id:x.id, player_no:x.player_no, player_name:x.player_name, game_id: x.game_id})
    );
});
</script>
