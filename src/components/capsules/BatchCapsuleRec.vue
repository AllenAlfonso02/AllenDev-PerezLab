<template>
    <div class="p-6 bg-gray-100 min-h-screen font-sans text-gray-900">
        <div class="max-w-6xl mx-auto bg-white shadow-2xl border border-gray-300 p-8">
            <div class="flex justify-between border-b-2 border-black pb-4 mb-6">
                <div>
                    <h1 class="text-2xl font-black italic text-blue-900">PEREZ LAB INC.</h1>
                    <h2 class="text-lg font-bold uppercase tracking-widest text-gray-700">Batch Production Record</h2>
                </div>
                <div class="text-right text-xs font-mono">
                    <p class="font-bold">Form 011 | MN-001-00</p>
                    <p>Effective Date: <input type="date" v-model="form.metadata.effectiveDate" class="border-b border-black outline-none bg-transparent" /></p>
                    <p>Review Date: <input type="date" v-model="form.metadata.reviewDate" class="border-b border-black outline-none bg-transparent" /></p>
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
                    <thead class="bg-gray-200 uppercase font-bold text-[10px]">
                        <tr>
                            <th class="border border-black p-2">Presentation</th>
                            <th class="border border-black p-2">Empty Capsule Color</th>
                            <th class="border border-black p-2">Filler Color</th>
                            <th class="border border-black p-2">Total Unit Weight (mg)</th>
                            <th class="border border-black p-2">Range (-10%)</th>
                            <th class="border border-black p-2">Range (+10%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="font-mono">
                            <td class="border border-black p-2 font-bold italic">Capsule "{{ form.specs.size }}"</td>
                            <td class="border border-black p-2"><input v-model="form.specs.capsuleColor" class="w-full text-center outline-none uppercase" /></td>
                            <td class="border border-black p-2"><input v-model="form.specs.fillerColor" class="w-full text-center outline-none uppercase" /></td>
                            <td class="border border-black p-2"><input type="number" v-model="form.specs.weight" class="w-full text-center font-bold outline-none" /></td>
                            <td class="border border-black p-2 bg-blue-50 font-bold text-blue-800">{{ weightRange.low }}</td>
                            <td class="border border-black p-2 bg-red-50 font-bold text-red-800">{{ weightRange.high }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="mb-8">
                <h3 class="font-bold text-sm mb-2 uppercase">B. PHARMACY - Raw Materials</h3>
                <div class="flex gap-4 mb-2 text-[10px] font-mono">
                    <div class="border border-gray-300 px-2 py-1">Scale # used: <input v-model="form.env.scaleNo" class="w-8 outline-none bg-transparent border-b" /></div>
                    <div class="border border-gray-300 px-2 py-1">Room #: <input v-model="form.env.roomNo" class="w-8 outline-none bg-transparent border-b" /></div>
                    <div class="border border-gray-300 px-2 py-1">Temp (56-86°F): <input v-model="form.env.temp" class="w-8 outline-none bg-transparent border-b" /></div>
                    <div class="border border-gray-300 px-2 py-1">Humidity (&lt;75%): <input v-model="form.env.humidity" class="w-8 outline-none bg-transparent border-b" /></div>
                </div>

                <table class="w-full border-collapse border border-black text-[11px]">
                    <thead>
                        <tr class="bg-gray-800 text-white uppercase">
                            <th class="border border-gray-600 p-2 w-12">No.</th>
                            <th class="border border-gray-600 p-2 w-24">Raw Mat.</th>
                            <th class="border border-gray-600 p-2">Ingredients</th>
                            <th class="border border-gray-600 p-2 w-32">Lot #</th>
                            <th class="border border-gray-600 p-2 w-20">Kg</th>
                            <th class="border border-gray-600 p-2 w-32 text-center">Date</th>
                            <th class="border border-gray-600 p-2 w-24">Wt by</th>
                            <th class="border border-gray-600 p-2 w-24">Ck by</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in form.ingredients" :key="index" :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
                            <td class="border border-black p-2 text-center font-bold">{{ index + 1 }}</td>
                            <td class="border border-black p-2"><input v-model="item.rawMat" class="w-full text-center outline-none bg-transparent font-mono" /></td>
                            <td class="border border-black p-2 font-bold"><input v-model="item.name" class="w-full outline-none bg-transparent uppercase" /></td>
                            <td class="border border-black p-2"><input v-model="item.lot" class="w-full text-center outline-none bg-transparent font-mono text-blue-700 font-bold" /></td>
                            <td class="border border-black p-2"><input type="number" step="0.01" v-model="item.kg" class="w-full text-center font-bold outline-none bg-transparent" /></td>
                            <td class="border border-black p-2">
                                <div class="flex items-center space-x-1">
                                    <input type="text" v-model="item.date" placeholder="MM/DD/YY" class="w-full text-[10px] outline-none bg-transparent text-center" />
                                </div>
                            </td>
                            <td class="border border-black p-2"><input v-model="item.wtBy" class="w-full text-center outline-none bg-transparent uppercase font-bold text-blue-900" /></td>
                            <td class="border border-black p-2"><input v-model="item.ckBy" class="w-full text-center outline-none bg-transparent uppercase italic" /></td>
                        </tr>
                    </tbody>
                </table>
                <button @click="addIngredient" class="mt-2 text-[10px] bg-black text-white px-2 py-1 uppercase font-bold print:hidden">+ Add Ingredient</button>
            </div>

            <div class="grid grid-cols-2 gap-8 text-[10px] font-mono border-t border-black pt-4">
                <div class="flex justify-between border-b border-black"><span>Done by:</span> <input v-model="form.sigs.doneBy" class="outline-none w-1/2" /> <span>Date:</span> <input v-model="form.sigs.doneDate" class="outline-none" /></div>
                <div class="flex justify-between border-b border-black">
                    <span>Approved by:</span> <input v-model="form.sigs.approvedBy" class="outline-none w-1/2" /> <span>Date:</span> <input v-model="form.sigs.approvedDate" class="outline-none" />
                </div>
            </div>

            <div class="mt-8 flex justify-end space-x-4 print:hidden">
                <button @click="resetForm" class="px-4 py-2 text-red-600 border border-red-600 font-bold uppercase text-xs">Clear Form</button>
                <button @click="saveForm" class="px-8 py-2 bg-blue-700 text-white font-bold uppercase text-xs shadow-lg hover:bg-blue-800">Submit Batch to Atlas</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, reactive } from 'vue';

const getToday = () => new Date().toLocaleDateString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' });

const form = reactive({
    metadata: {
        effectiveDate: '03/25/26',
        reviewDate: '',
        product: 'GLYCOL',
        customer: 'SERGIO',
        formulaNo: 'B0196 A',
        lotNo: '040426',
        qtyMl: 72,
        theoWeight: 50
    },
    env: {
        scaleNo: '1',
        roomNo: '2',
        temp: '70',
        humidity: '45'
    },
    specs: {
        size: '00',
        capsuleColor: 'CLEAR',
        fillerColor: 'YELLOW',
        weight: 759
    },
    ingredients: [
        { rawMat: 'RM0026A', name: 'VITAMIN C', lot: 'H80226', kg: 8, wtBy: 'DPG', ckBy: 'MC', date: '4/4/26' },
        { rawMat: 'RM0177A', name: 'BERBERINE - BERBEVIS', lot: '450326', kg: 20, wtBy: 'DPG', ckBy: 'MC', date: '4/4/26' },
        { rawMat: 'RM0102', name: 'GARLIC', lot: '060724', kg: 0.79, wtBy: 'DPG', ckBy: 'MC', date: '4/4/26' },
        { rawMat: 'RM0409', name: 'ROSE HPS', lot: '020326', kg: 4.83, wtBy: 'DPG', ckBy: 'MC', date: '4/4/26' },
        { rawMat: 'RM0007', name: 'RICE', lot: '', kg: 16, wtBy: 'DPG', ckBy: 'MC', date: '4/4/26' },
        { rawMat: 'RM0004', name: 'MAGNESIUM STEREATE', lot: '490226', kg: 1.03, wtBy: 'DPG', ckBy: 'MC', date: '4/4/26' }
    ],
    sigs: {
        doneBy: 'BT',
        doneDate: '03/25/26',
        approvedBy: 'ELV',
        approvedDate: '03/25/26'
    }
});

const weightRange = computed(() => {
    const w = Number(form.specs.weight) || 0;
    // Form shows +/- 10% for capsules
    return {
        low: Math.round(w * 0.9),
        high: Math.round(w * 1.1)
    };
});

const addIngredient = () => {
    form.ingredients.push({ rawMat: '', name: '', lot: '', kg: 0, wtBy: '', ckBy: '', date: getToday() });
};

const resetForm = () => {
    if (confirm('Clear all data?')) location.reload();
};

const saveForm = async () => {
    // This is where you connect to your AWS API
    console.log('Sending to AWS API...', JSON.parse(JSON.stringify(form)));
    alert('Batch ' + form.metadata.lotNo + ' submitted to MongoDB Atlas');
};
</script>

<style scoped>
@media print {
    .print\:hidden {
        display: none !important;
    }
    input {
        border: none !important;
    }
}
input[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
}
input:focus {
    background-color: #fff9c4;
}
</style>
