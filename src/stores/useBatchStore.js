// import storeReset from '@/composables/Reset/reset-store';
import { defineStore } from 'pinia';
export const useBatchStore = defineStore('inputbatch', {
    //state
    state: () => ({
        inputbatch: [],
        id: 0
    }),

    //actions
    actions: {
        addData(payload) {
            this.inputbatch.push({ payload, completed: false });
        },
        reset() {
            this.inputbatch = [];
        }
    },

    //getters

    getters: {
        Data: (state) => state.payload
    }

    // persist: true
});
