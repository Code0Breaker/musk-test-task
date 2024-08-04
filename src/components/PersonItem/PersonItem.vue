<template>
  <tr class="person-row">
    <td class="person-info name">
      {{ person.name }}
    </td>
    <td class="person-info phone">
      {{ person.phone }}
    </td>
  </tr>
  <tr v-if="person.children" class="children-row">
    <td colspan="2">
      <div class="children-container">
        <table class="children-table">
          <tbody>
            <PersonItem v-for="child in person.children" :key="child.id" :person="child"
              @updatePeople="emit('updatePeople', $event)" />
          </tbody>
        </table>
      </div>
    </td>
  </tr>
</template>

<script lang="ts" setup>
import { IPerson } from '../../types'

defineProps<{ person: IPerson }>();
const emit = defineEmits<{ (event: 'updatePeople', person: IPerson[]): void }>();
</script>

<style scoped>
@import './personItem.css';
</style>