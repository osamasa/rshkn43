<template>
<div>{{props.game.id}}/{{props.game_user[props.game.player_1-1].player_no}}/{{props.game_user[props.game.player_1-1].player_name}}</div>
</template>
<script setup>
const props = defineProps({
  game : Object,
  game_user : Array,
  position : Number
})
onMounted(() => {
  console.log(props.game_user);
})
</script>
