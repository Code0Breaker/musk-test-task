<template>
  <div class="people-list">
    <button @click="showModal = true" class="add-button">Добавить человека</button>
    <table class="people-table">
      <thead>
        <tr>
          <th>Имя</th>
          <th>Телефон</th>
        </tr>
      </thead>
      <tbody>
        <PersonItem
          v-for="person in people"
          :key="person.id"
          :person="person"
          @updatePeople="updatePeople"
        />
      </tbody>
    </table>
    <AddPersonModal
      v-if="showModal"
      :people="people"
      @addPerson="handleAddPerson"
      @close="showModal = false"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import PersonItem from '../PersonItem/PersonItem.vue';
import AddPersonModal from '../AddPersonModal/AddPersonModal.vue';
import { IPerson } from '../../types';

const showModal = ref(false);
const people = ref<IPerson[]>(getPeopleFromLocalStorage());

const handleAddPerson = (person: IPerson, parentId: number | null) => {
  if (parentId === null) {
    people.value.push(person);
  } else {
    const parent = findPersonById(people.value, parentId);
    if (parent) {
      parent.children = parent.children || [];
      parent.children.push(person);
    }
  }
  savePeopleToLocalStorage(people.value);
  showModal.value = false;
};

const updatePeople = (updatedPeople: IPerson[]) => {
  people.value = updatedPeople;
  savePeopleToLocalStorage(people.value);
};

const findPersonById = (list: IPerson[], id: number): IPerson | null => {
  for (const person of list) {
    if (person.id === id) return person;
    if (person.children) {
      const result = findPersonById(person.children, id);
      if (result) return result;
    }
  }
  return null;
};

watch(people, (newPeople) => {
  savePeopleToLocalStorage(newPeople);
}, { deep: true });

function getPeopleFromLocalStorage(): IPerson[] {
  const data = localStorage.getItem('people');
  return data ? JSON.parse(data) : [];
}

function savePeopleToLocalStorage(people: IPerson[]) {
  localStorage.setItem('people', JSON.stringify(people));
}
</script>

<style scoped>
@import './peopleList.css';
</style>
