import { useTableStore } from '@/stores/useTableStore';
import { useFetch } from '@vueuse/core';
import { computed, watch } from 'vue';

export default function useTabledata() {
    const tableStore = useTableStore();

    // URL for your Lambda Function URL
    const url = computed(() => 'https://4bwrlqxpkgzlurxxonwn2kwbva0erqsx.lambda-url.us-east-1.on.aws/');

    // useFetch setup
    const { data, execute, isFetching, error } = useFetch(url, {
        immediate: false,
        mode: 'cors'
    })
        .get()
        .json();

    const getTabledataFunc = async () => {
        await execute();
    };

    // WATCHER: This is where the data transformation happens
    watch(data, (newVal) => {
        if (!newVal) return;

        let finalData = [];

        // Case A: Lambda returned the standard { statusCode, body } object
        if (newVal.body) {
            try {
                finalData = typeof newVal.body === 'string' ? JSON.parse(newVal.body) : newVal.body;
            } catch (e) {
                console.error('Parsing error in Composable:', e);
            }
        }
        // Case B: Lambda returned the array directly (Payload Format 1.0)
        else if (Array.isArray(newVal)) {
            finalData = newVal;
        }

        // console.log('Pushing to Store:', finalData);

        // Update the Pinia store property that the component is watching
        // Assumes your store has an 'inputdata' ref/state
        tableStore.inputdatatable = finalData;
    });

    return {
        getTabledataFunc,
        isFetching,
        error,
        tableStore
    };
}
