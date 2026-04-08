<script setup>
import useFinProdForm from '@/composables/finishedProductLogic/FinishedProductData';
import useProduct from '@/composables/getlogic/getprodpull';
import useTabledata from '@/composables/getlogic/getTabledata';
import { useProductStore } from '@/stores/useProductStore';
import { useTableStore } from '@/stores/useTableStore';
import { useToast } from 'primevue/usetoast';

import MultiSelect from 'primevue/multiselect';

import { computed, onBeforeMount, onMounted, ref, watch } from 'vue';
// NOTE: make sure you imported Select globally or locally (PrimeVue v4 uses "Select")
const productStore = useProductStore();
const { fetchData, isFetching } = useProduct();
const { getTabledataFunc } = useTabledata();
const products = computed(() => productStore.inputproduct ?? []);
const { postFinProdForm } = useFinProdForm();
const selectedProductId = ref(null);
const selectedProduct = computed(() => products.value.find((p) => p._id === selectedProductId.value) ?? null);
const toast = useToast();

// Pinia store
const tableStore = useTableStore();
const tableInventory = computed(() => tableStore.inputdatatable ?? []);

// Form Fields
const selectedProductName = ref(null);
const selectedRMnumb = ref(null);
const selectedLotNumb = ref(null);
const inputAmountKG = ref(null);
const selectedClientName = ref(null);
const selectedCapsPerK = ref(null);
const selectedStaffName = ref(null);
const inputMixes = ref(1);
const selectedRM = ref([]);

// ---- Your raw lists (primitives) ----
const ProductName = ref(['SLIPPERY', 'Vitamin D3', 'ANAMU']);
const RMnumbs = ref([]);
const LOTnumbs = ref([]);
const KGAmounts = ref([]);
const inventory = ref([]);

const ClientNames = ref(['ALL CONSULTING GROUP', 'BLUE ORGANIX LLC', 'GERARDO BARILLA', 'GERMA PRODUCT', 'GOLD CROWN', 'MARCELINO SUAREZ', 'NELCIA', 'RAINFOREST', 'SABIO THERAPEUTICS']);
const productType = ref(['Capsules', 'Tablets']);
const RMName = ref([]);
// ---- Convert primitive arrays to Select-friendly {label,value} ----
const ClientNamesOptions = computed(() => ClientNames.value.map((v) => ({ label: v, value: v })));

// Dosage form options from selected product (yours was fine)
onMounted(async () => {
    await fetchInventory();
});
const fetchInventory = async () => {
    try {
        await getTabledataFunc();
        inventory.value = tableInventory.value;
        // 2. Map inventory to RMName structure
        // Assuming inventory items have 'item_name' and 'item_id' or similar fields
        RMName.value = inventory.value.map((item) => ({
            rm: item.RM || '',
            name: item.DESCRIPTION || 'Unknown Item', // Adjust key based on your API
            code: item.RM || item._id,
            weight: 0 // Initialize weight at 0 for the user to fill in
        }));

        console.log(RMName.value);
    } catch (err) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load inventory', life: 3000 });
    }
};
const dosageFormOptions = computed(() => {
    const p = selectedProduct.value;
    if (!p) return [];

    const raw = p.dosage_form;

    const list = typeof raw === 'string' ? [raw] : Array.isArray(raw) ? raw : [];

    return list
        .map((v) => String(v).trim())
        .filter((v) => v.length > 0)
        .map((v) => ({ label: v, value: v }));
});

watch(
    () => selectedProductId.value,
    () => {
        selectedStaffName.value = null;
        // auto-pick if only one option
        if (dosageFormOptions.value.length === 1) {
            selectedStaffName.value = dosageFormOptions.value[0].value;
        }
    }
);

// Reset dependent fields when product changes
watch(selectedProductId, () => {
    selectedStaffName.value = null;
    inputMixes.value = 1;

    // optional: reset packaging picks too
    selectedProductName.value = null;
    selectedRMnumb.value = null;
    selectedLotNumb.value = null;
    inputAmountKG.value = null;
    selectedClientName.value = null;
});
// Watch the selectedRM array deeply to catch changes in the 'weight' property
watch(
    selectedRM,
    (newSelection) => {
        // sum up the weight of all items currently in the selectedRM array
        const total = newSelection.reduce((sum, item) => {
            return sum + (Number(item.weight) || 0);
        }, 0);

        // Update your inputAmountKG ref with the result
        // Using .toFixed(2) if you want to keep it to 2 decimal places as a string
        inputAmountKG.value = total > 0 ? total.toFixed(2) : null;
    },
    { deep: true }
);

const resetForm = () => {
    selectedStaffName.value = null;
    selectedProductName.value = null;
    selectedRMnumb.value = null;
    selectedLotNumb.value = null;
    inputAmountKG.value = null;
    selectedClientName.value = null;
    inputMixes.value = 1;
};

const submitStatus = ref('');
const submitError = ref('');

const loadingVideoSrc = '/loading.mp4';
onBeforeMount(async () => {
    await fetchData();
});
</script>

<template>
    <div>
        <h1>Batch Process</h1>
        <!-- Loading Spinner -->
        <transition name="fade">
            <div v-if="isFetching" class="absolute inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center rounded-lg">
                <ProgressSpinner style="width: 40px; height: 40px" strokeWidth="4" />
            </div>
        </transition>
        <transition name="fade">
            <div v-if="isFetching" class="absolute inset-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center rounded-lg overflow-hidden" style="z-index: 50">
                <video class="absolute inset-0 w-full h-full object-cover blur-md opacity-60" :src="loadingVideoSrc" autoplay muted loop playsinline preload="auto" />
                <!-- Optional: darken + add text on top -->
                <div class="absolute inset-0 bg-black/20"></div>
                <div class="absolute text-white font-semibold">Loading products…</div>
            </div>
        </transition>
        <div class="inner mx-auto max-w-5xl p-8 bg-white/40 backdrop-blur-xl border border-white/30 rounded-4xl shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- <div class="inner mx-auto max-w-5xl p-6 bg-white rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6" style="margin-left: 100px; border-radius: 5px"> -->
            <!-- Product -->
            <div class="max-w-[200px] flex flex-col gap-2">
                <label style="color: #122620">Select Product</label>
                <Select v-model="selectedProductId" :options="products" optionLabel="product_name" optionValue="_id" placeholder="Select product" />
            </div>

            <!-- Mixes -->
            <div class="w-96 flex flex-col gap-2">
                <label>Number of Mixes</label>
                <InputText v-model="selectedProductName" placeholder="Number of Mixes" class="w-full mt-5 md:w-56" />
            </div>

            <!-- Client -->
            <div class="w-64 flex flex-col gap-2">
                <label>Client</label>
                <Select v-model="selectedClientName" :options="ClientNamesOptions" optionLabel="label" optionValue="value" placeholder="Client" class="w-full mt-5 md:w-56" />
            </div>

            <!-- Lot Number -->
            <div class="w-64 flex flex-col gap-2">
                <label>Lot Number</label>
                <InputText v-model="selectedLotNumb" placeholder="Lot #" class="w-full mt-5 md:w-56" />
            </div>

            <!-- RM Names -->
            <div class="w-auto flex flex-col gap-2">
                <label>Raw Materials</label>
                <MultiSelect v-model="selectedRM" display="chip" :options="RMName" optionLabel="name" filter placeholder="Select RM Name" class="w-full" style="width: fit-content">
                    <template #option="slotProps">
                        <div class="flex items-center justify-between w-full gap-4 py-1">
                            <span>{{ slotProps.option.rm }} : {{ slotProps.option.name }}</span>
                            <div v-if="slotProps.selected" class="flex items-center gap-2">
                                <InputNumber v-model="slotProps.option.weight" placeholder="0.00" :minFractionDigits="2" class="small-input" @click.stop />
                                <span class="text-xs">kg</span>
                            </div>
                        </div>
                    </template>

                    <template #chip="slotProps">
                        <div class="flex items-center gap-2 px-2">
                            <span class="font-bold">{{ slotProps.value.rm }}: {{ slotProps.value.name }}</span>
                            <span v-if="slotProps.value.weight" class="badge-weight"> ({{ slotProps.value.weight }} kg) </span>
                        </div>
                    </template>
                </MultiSelect>
                <label>Total Weight:{{ inputAmountKG }}</label>
            </div>

            <!-- Mixes -->
            <div class="max-w-[280px] flex flex-col mb-4 mt-6 gap-3 space-y-2" style="margin-left: 10px">
                <label># of Capsules in thousands</label>
                <div style="display: flex; gap: 12px; align-items: center">
                    <input type="number" min="1" v-model.number="inputMixes" style="width: 150px; padding: 8px; border-radius: 4px; border: 1px solid #ccc; background-color: #f0f4f8" />

                    <Select
                        v-model="productType"
                        :options="[
                            { label: 'Tablets', value: 'tablets' },
                            { label: 'Capsules', value: 'capsules' }
                        ]"
                        optionLabel="label"
                        optionValue="value"
                        style="width: 160px"
                    />
                </div>
            </div>

            <!-- Summary -->
            <div v-if="selectedProduct" class="mt-6 p-6 bg-slate-50/50 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-sm max-w-lg">
                <div class="flex items-center gap-3 mb-4">
                    <span class="bg-indigo-600 text-white font-semibold rounded-md px-3 py-1 text-xs uppercase tracking-wider"> Summary </span>
                    <div class="h-px flex-1 bg-slate-200"></div>
                </div>

                <div class="space-y-3">
                    <div class="grid grid-cols-2 py-1 border-b border-slate-100 last:border-0">
                        <span class="text-sm font-medium text-slate-500 italic">Selected Product:</span>
                        <span class="text-sm font-bold text-slate-800 text-right">{{ selectedProduct.product_name }}</span>
                    </div>

                    <div class="grid grid-cols-2 py-1 border-b border-slate-100 last:border-0">
                        <span class="text-sm font-medium text-slate-500 italic"># of Mixes:</span>
                        <span class="text-sm font-semibold text-slate-700 text-right">{{ selectedProductName || '—' }}</span>
                    </div>

                    <div class="grid grid-cols-2 py-1 border-b border-slate-100 last:border-0">
                        <span class="text-sm font-medium text-slate-500 italic">Lot Number:</span>
                        <span class="text-sm font-mono text-slate-700 text-right">{{ selectedLotNumb || '—' }}</span>
                    </div>

                    <div class="grid grid-cols-2 py-1 border-b border-indigo-100 bg-indigo-50/30 -mx-2 px-2 rounded">
                        <span class="text-sm font-bold text-indigo-600 italic">Total Amount:</span>
                        <span class="text-sm font-black text-indigo-700 text-right">{{ inputAmountKG || '0' }} kg</span>
                    </div>

                    <div class="grid grid-cols-2 py-1 border-b border-slate-100 last:border-0">
                        <span class="text-sm font-medium text-slate-500 italic">Client Name:</span>
                        <span class="text-sm font-semibold text-slate-700 text-right">{{ selectedClientName || '—' }}</span>
                    </div>
                </div>
            </div>

            <!-- Submit -->
            <div style="margin-left: 10px; margin-top: 16px">
                <!-- <Button :disabled="!canSubmit" label="Submit" severity="contrast" @click="submitSelection" style="padding: 10px 14px; border-radius: 8px" /> -->

                <div v-if="submitStatus" style="margin-top: 8px">{{ submitStatus }}</div>
                <div v-if="submitError" style="margin-top: 8px; color: #b00020">{{ submitError }}</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* // 1. Force the container to a column layout */
:deep(.p-multiselect-label) {
    display: flex !important;
    flex-direction: column !important;
    gap: 8px; /* Space between vertical items */
    padding: 10px !important;
    height: auto !important; /* Allows it to grow vertically  */
    min-height: 44px;
}

/* 2. Make each chip take up the full width  */
:deep(.p-multiselect-token) {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin: 0 !important; /* Remove default chip margins */
}

/* 3. Ensure the main component itself can grow */
.w-full {
    height: auto !important;
}
/* Custom utility for the Glass Inputs */
.glass-input {
    background: rgba(255, 255, 255, 0.2) !important;
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.3) !important;
    border-radius: 12px !important;
    transition: all 0.3s ease;
}

.glass-input:hover {
    background: rgba(255, 255, 255, 0.3) !important;
}

/* Make sure the text is readable over the background */
label {
    color: #1e293b; /* slate-800 */
    font-weight: 600;
    letter-spacing: 0.025em;
}

/* Modernize the page background to see the blur effect */
:deep(body) {
    background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
    min-height: 100vh;
}
</style>
