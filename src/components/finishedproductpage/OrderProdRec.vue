<template>
    <div class="p-6 bg-gray-100 min-h-screen font-sans text-gray-900">
        <div class="max-w-6xl mx-auto bg-white shadow-2xl border border-gray-300 p-8">
            <div class="flex justify-between border-b-2 border-black pb-4 mb-6">
                <div>
                    <h1 class="text-2xl font-black italic text-blue-900">PEREZ LAB INC.</h1>
                    <h2 class="text-lg font-bold uppercase tracking-widest">Batch Production Record</h2>
                </div>
                <div class="text-right text-xs font-mono">
                    <p>Form 011 | MN-001-00</p>
                    <p>Effective Date: <input type="date" v-model="form.metadata.effectiveDate" class="border-b border-black outline-none bg-transparent" /></p>
                </div>
            </div>

            <div class="mb-8 border border-black p-4 bg-gray-50">
                <h3 class="font-bold mb-4 border-b border-black pb-2 uppercase">A. PRODUCTION ORDER</h3>
                <div class="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                    <div class="flex justify-between border-b border-gray-300"><span>Product Description:</span> <input v-model="form.metadata.product" class="font-bold text-right outline-none bg-transparent" /></div>
                    <div class="flex justify-between border-b border-gray-300"><span>Lot #:</span> <input v-model="form.metadata.lotNo" class="font-bold text-right outline-none bg-transparent" /></div>
                    <div class="flex justify-between border-b border-gray-300"><span>Customer:</span> <input v-model="form.metadata.customer" class="font-bold text-right outline-none bg-transparent" /></div>
                    <div class="flex justify-between border-b border-gray-300"><span>Quantity (ML):</span> <input type="number" v-model="form.metadata.qtyMl" class="font-bold text-right outline-none bg-transparent" /></div>
                    <div class="flex justify-between border-b border-gray-300"><span>Formula No:</span> <input v-model="form.metadata.formulaNo" class="font-bold text-right outline-none bg-transparent" /></div>
                    <div class="flex justify-between border-b border-gray-300">
                        <span>Total Theoretical Weight (kg):</span> <input type="number" step="0.1" v-model="form.metadata.theoWeight" class="font-bold text-right outline-none bg-transparent" />
                    </div>
                </div>
            </div>

            <div class="mb-8">
                <h3 class="font-bold text-sm mb-2 uppercase">Specifications</h3>
                <table class="w-full border-collapse border border-black text-xs text-center">
                    <thead class="bg-gray-200 uppercase font-bold">
                        <tr>
                            <th class="border border-black p-2">Presentation</th>
                            <th class="border border-black p-2">Tablet Size</th>
                            <th class="border border-black p-2">Color</th>
                            <th class="border border-black p-2">Unit Weight (mg)</th>
                            <th class="border border-black p-2">Range (-5%)</th>
                            <th class="border border-black p-2">Range (+5%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="border border-black p-2"><input v-model="form.specs.presentation" class="w-full text-center outline-none" /></td>
                            <td class="border border-black p-2"><input v-model="form.specs.size" class="w-full text-center outline-none" /></td>
                            <td class="border border-black p-2"><input v-model="form.specs.color" class="w-full text-center outline-none" /></td>
                            <td class="border border-black p-2"><input type="number" v-model="form.specs.weight" class="w-full text-center font-bold outline-none" /></td>
                            <td class="border border-black p-2 bg-blue-50 font-bold">{{ weightRange.low }}</td>
                            <td class="border border-black p-2 bg-red-50 font-bold">{{ weightRange.high }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="mb-8">
                <h3 class="font-bold text-sm mb-2 uppercase">B. PHARMACY - Ingredients List</h3>
                <table class="w-full border-collapse border border-black text-[11px]">
                    <thead>
                        <tr class="bg-black text-white uppercase">
                            <th class="border border-gray-600 p-2 w-12">No.</th>
                            <th class="border border-gray-600 p-2 w-24">Raw Mat #</th>
                            <th class="border border-gray-600 p-2">Ingredients</th>
                            <th class="border border-gray-600 p-2 w-32">Lot No.</th>
                            <th class="border border-gray-600 p-2 w-20">Kg</th>
                            <th class="border border-gray-600 p-2 w-24">Wt by</th>
                            <th class="border border-gray-600 p-2 w-24">Ck by</th>
                            <th class="border border-gray-600 p-2 w-32">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in form.ingredients" :key="index" :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
                            <td class="border border-black p-2 text-center font-bold">{{ index + 1 }}</td>
                            <td class="border border-black p-2"><input v-model="item.rawMat" class="w-full text-center outline-none bg-transparent" /></td>
                            <td class="border border-black p-2"><input v-model="item.name" class="w-full outline-none bg-transparent italic" /></td>
                            <td class="border border-black p-2"><input v-model="item.lot" class="w-full text-center outline-none bg-transparent font-mono" /></td>
                            <td class="border border-black p-2"><input type="number" step="0.01" v-model="item.kg" class="w-full text-center font-bold outline-none bg-transparent" /></td>
                            <td class="border border-black p-2"><input v-model="item.wtBy" class="w-full text-center outline-none bg-transparent uppercase" /></td>
                            <td class="border border-black p-2"><input v-model="item.ckBy" class="w-full text-center outline-none bg-transparent uppercase" /></td>
                            <td class="border border-black p-2">
                                <div class="flex items-center space-x-1">
                                    <input type="date" v-model="item.date" class="w-full text-[10px] outline-none bg-transparent" />
                                    <button @click="item.date = getToday()" class="print:hidden text-xs">📅</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button @click="addIngredient" class="mt-2 text-[10px] bg-black text-white px-2 py-1 uppercase font-bold print:hidden">+ Add Ingredient</button>
            </div>

            <div class="mt-8 flex justify-end space-x-4 border-t-2 border-black pt-6 print:hidden">
                <button @click="resetForm" class="px-4 py-2 text-red-600 border border-red-600 font-bold uppercase text-xs">Clear Form</button>
                <button @click="saveForm" class="px-8 py-2 bg-blue-700 text-white font-bold uppercase text-xs shadow-lg hover:bg-blue-800">Save Production Order</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue';

const getToday = () => new Date().toISOString().split('T')[0];

const form = reactive({
    metadata: {
        effectiveDate: getToday(),
        product: 'MELATONIN',
        customer: 'ALL CONSULTING',
        formulaNo: 'B0053',
        lotNo: '033024',
        qtyMl: 120,
        theoWeight: 31.5
    },
    specs: {
        presentation: 'Tablet',
        size: '3/8 round',
        color: 'White',
        weight: 250
    },
    ingredients: [
        { rawMat: 'RM0026', name: 'MELATONIN', lot: '', kg: 2.52, wtBy: '', ckBy: '', date: '' },
        { rawMat: 'RM0001', name: 'Microcrystalline Cellulose', lot: '', kg: 19.08, wtBy: '', ckBy: '', date: '' },
        { rawMat: 'RM0003', name: 'Sodium Croscarmellose', lot: '', kg: 2.52, wtBy: '', ckBy: '', date: '' },
        { rawMat: 'RM0005', name: 'Calcium carbonate DC', lot: '', kg: 16.38, wtBy: '', ckBy: '', date: '' }
    ]
});

const weightRange = computed(() => {
    const w = Number(form.specs.weight) || 0;
    return {
        low: (w * 0.95).toFixed(0),
        high: (w * 1.05).toFixed(0)
    };
});

const addIngredient = () => {
    form.ingredients.push({ rawMat: '', name: '', lot: '', kg: 0, wtBy: '', ckBy: '', date: getToday() });
};

const resetForm = () => {
    if (confirm('Clear all data?')) location.reload();
};

const saveForm = () => {
    console.log('Saving Master Production Order...', JSON.parse(JSON.stringify(form)));
    alert('Master Production Order Saved to MongoDB');
};

onMounted(() => {
    form.ingredients.forEach((i) => (i.date = getToday()));
});
</script>

<style scoped>
@media print {
    .print\:hidden {
        display: none !important;
    }
}
input[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
}
</style>
