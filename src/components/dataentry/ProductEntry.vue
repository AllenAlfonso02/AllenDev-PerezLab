<template>
    <div class="component-card">
        <h3>📥 Raw Material Entry</h3>
        <form @submit.prevent="submitEntry">
            <div class="grid-form">
                <div class="form-group">
                    <!-- <label>RM Code:</label>
                    <input v-model="form.RM" list="rm-list" placeholder="e.g. RM0001" /> -->
                    <datalist id="rm-list">
                        <option v-for="item in inventoryList" :key="item.RM" :value="item.RM">
                            {{ item.DESCRIPTION }}
                        </option>
                    </datalist>
                </div>
                <div class="form-group">
                    <label>Description:</label>
                    <input v-model="form.DESCRIPTION" type="text" placeholder="Material Description" />
                </div>
                <div class="form-group">
                    <label>Vendor:</label>
                    <input v-model="form.VENDOR" type="text" placeholder="Supplier Name" />
                </div>

                <div class="form-group">
                    <label>Quantity:</label>
                    <input v-model.number="form.CURRENT" type="number" step="0.01" required />
                </div>

                <div class="form-group">
                    <label>Location:</label>
                    <input v-model="form.LOCATION" type="text" placeholder="e.g. 1A" />
                </div>
            </div>
            <button type="submit" class="btn-entry">Record Entry</button>
        </form>
    </div>
</template>

<script setup>
import { defineEmits, defineProps, reactive } from 'vue';

// 1. Define Props
const props = defineProps({
    inventoryList: {
        type: Array,
        default: () => []
    }
});

// 2. Define Emits
const emit = defineEmits(['save-entry']);

// 3. Reactive State (Replaces data())
//     RM: '',
const form = reactive({
    DESCRIPTION: '',
    VENDOR: '',
    CURRENT_INV_KG: 0,
    LOCATION: '',
    DATE: new Date().toLocaleDateString()
});

// 4. Methods
const submitEntry = () => {
    console.log('Saving to product_entry collection:', { ...form });

    // Emit the form data to the parent
    emit('save-entry', { ...form });

    // Reset form logic
    resetForm();
};
//     form.RM = '';

const resetForm = () => {
    form.DESCRIPTION = '';
    form.VENDOR = '';
    form.CURRENT_INV_KG = 0;
    form.LOCATION = '';
    form.DATE = new Date().toLocaleDateString();
};
</script>

<style scoped>
/* Styles remain exactly the same as your original code */
.component-card {
    background: #1a1a1a;
    color: #00ff00; /* Terminal Green */
    padding: 20px;
    border: 1px solid #333;
    border-radius: 4px;
    font-family: 'Courier New', Courier, monospace;
}

.grid-form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    font-size: 0.8rem;
    margin-bottom: 5px;
}

input {
    width: 100%;
    background: #000;
    border: 1px solid #00ff00;
    color: #00ff00;
    padding: 8px;
}

.btn-entry {
    background: #28a745;
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
    width: 100%;
}
.btn-exit {
    background: #dc3545;
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
    width: 100%;
}
</style>
