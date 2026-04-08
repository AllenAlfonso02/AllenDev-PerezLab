// import storeReset from '@/composables/Reset/reset-store';
import { defineStore } from 'pinia';
export const useTableStore = defineStore('inputdatatable', {
    //state
    state: () => ({
        inputdatatable: [],
        id: 0
    }),

    //actions
    actions: {
        addData(inventoryTable) {
            this.inputdatatable.push({ inventoryTable, completed: false });
        },
        reset() {
            this.inventoryTable = [];
        }
    },

    //getters

    getters: {
        Data: (state) => state.inventoryTable
    }

    // persist: true
});
