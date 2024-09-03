<template>
  <div>
    <form @submit="onSubmit">
      <div class="grouped">
        <Input :value="inputValue" :disabled="isLoading" :placeholder="placeholder" @onInput="handleChange" />
        <Button :class="getButtonClass()" :isLoading="isLoading" type="submit">
          {{ label }}
        </Button>
      </div>
    </form>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import Input from '../../atoms/Input/Input.component.vue';
import Button from '../../atoms/Button/Button.component.vue';

export default defineComponent({
  components: { Input, Button },
  props: ['buttonInfo', 'placeholder', 'isLoading', 'onTodoAdd', 'onTodoUpdate', 'todoValue'],
  data() {
    return {
      label: 'Add',
      variant: 'primary',
      inputValue: '',
    };
  },
  watch: {
    todoValue() {
      this.inputValue = this.todoValue;
    },
    buttonInfo() {
      this.label = this.buttonInfo.label;
      this.variant = this.buttonInfo.variant
    }
  },
  methods: {
    getButtonClass() {
      return `button ${this.variant}`;
    },
    onSubmit(e) {
      console.log('onSubmit', this.inputValue);
      e.preventDefault();
      if (!this.inputValue.trim()) {
        return;
      }
      if (this.todoValue) {
        this.$emit('onTodoUpdate', this.inputValue);
      } else {
        this.$emit('onTodoAdd', this.inputValue);
      }
      this.inputValue = '';
    },
    handleChange(e) {
      const { value } = e.target;
      this.inputValue = value;
    }
  },
})
</script>

