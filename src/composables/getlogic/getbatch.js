import { useBatchStore } from '@/stores/useBatchStore';
import axios from 'axios';
import { computed, ref } from 'vue';

export default function useBatch() {
    const batchStore = useBatchStore();

    // State
    const batches = ref([]);
    const filterQuery = ref(''); // Bound to your search input
    const loading = ref(false);
    const errors = ref(null);

    const url = 'https://khm27mawsmoj7jrk2d6ehctpoy0sligv.lambda-url.us-east-1.on.aws/';

    // Action
    const getTableFunc = async () => {
        loading.value = true;
        errors.value = null;
        try {
            const res = await axios.get(url);
            console.log('Batch data fetched:', res.data);
            batches.value = res.data;
            if (batchStore.inputbatch) batchStore.addData(res.data);
            return res.data;
        } catch (err) {
            errors.value = err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    };

    // 1. Reactive Filtering Logic
    const filteredBatches = computed(() => {
        if (!filterQuery.value) return batches.value;

        const query = filterQuery.value.toLowerCase();
        return batches.value.filter((batch) => {
            // Adjust 'name' or 'id' to match your actual data keys
            return batch.name?.toLowerCase().includes(query) || batch.id?.toString().includes(query);
        });
    });

    return {
        batches, // Raw data
        filteredBatches, // Data for the <table>
        filterQuery, // Bound to <input v-model="filterQuery">
        loading,
        errors,
        getTableFunc
    };
}
