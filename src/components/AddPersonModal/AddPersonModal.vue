<template>
  <div class="modal">
    <div class="modal-content">
      <h3>Добавить нового человека</h3>
      <div class="form-group">
        <label for="name">Имя:</label>
        <input v-model="name" id="name" placeholder="Имя" />
      </div>
      <div class="form-group">
        <label for="phone">Номер телефона:</label>
        <input v-model="phone" id="phone" placeholder="Номер телефона" />
      </div>
      <div class="form-group">
        <label for="parent">Родитель:</label>
        <select v-model="selectedParentId" id="parent">
          <option :value="null">Без родителя</option>
          <option v-for="person in allPeople" :key="person.id" :value="person.id">
            {{ person.name }}
          </option>
        </select>
      </div>
      <div class="form-actions">
        <button @click="addPerson" :disabled="!isFormValid">Добавить</button>
        <button @click="emit('close')">Закрыть</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { IPerson } from '../../types';

const props = defineProps<{ people: IPerson[] }>();
const emit = defineEmits<{ (event: 'addPerson', person: IPerson, parentId: number | null): void; (event: 'close'): void; }>();

const name = ref('');
const phone = ref('');
const selectedParentId = ref<number | null>(null);

const allPeople = computed(() => flattenPeople(props.people));

const isFormValid = computed(() => name.value.trim() !== '' && phone.value.trim() !== '');

const flattenPeople = (people: IPerson[]): IPerson[] => {
  return people.reduce((acc: IPerson[], person) => {
    acc.push(person);
    if (person.children && person.children.length > 0) {
      acc.push(...flattenPeople(person.children));
    }
    return acc;
  }, []);
};

const addPerson = () => {
  if (isFormValid.value) {
    const newPerson: IPerson = { id: Date.now(), name: name.value, phone: phone.value, children: [] };
    emit('addPerson', newPerson, selectedParentId.value);
    resetForm();
  }
};

const resetForm = () => {
  name.value = '';
  phone.value = '';
  selectedParentId.value = null;
};
</script>

<style scoped>
@import './addPersonModal.css';
</style>
