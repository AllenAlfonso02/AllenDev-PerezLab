<template>
    <div class="p-6 bg-gray-100 min-h-screen font-sans text-gray-900">
        <div class="max-w-6xl mx-auto bg-white shadow-2xl border border-gray-300 p-8">
            <div class="flex justify-between border-b-2 border-black pb-4 mb-6">
                <div>
                    <h1 class="text-2xl font-black italic">PEREZ LAB INC.</h1>
                    <h2 class="text-lg font-bold uppercase tracking-widest">Batch Production Record</h2>
                </div>
                <div class="text-right text-xs font-mono">
                    <p>Form 032 | MN-001-00</p>
                    <p>Effective Date: <input type="date" v-model="form.metadata.effectiveDate" class="border-b border-black outline-none bg-transparent" /></p>
                </div>
            </div>

            <div class="mb-6">
                <h3 class="font-bold mb-2 uppercase text-sm border-l-4 border-black pl-2">D. Operation - Tableting</h3>
                <div class="grid grid-cols-3 border border-black text-sm mb-2">
                    <div class="border-r border-black p-2 bg-gray-50">
                        <span class="font-bold block text-xs uppercase text-gray-500">Product</span>
                        <input v-model="form.specs.product" class="w-full bg-transparent font-bold outline-none" />
                    </div>
                    <div class="border-r border-black p-2 bg-gray-50">
                        <span class="font-bold block text-xs uppercase text-gray-500">Lot #</span>
                        <input v-model="form.specs.lotNo" class="w-full bg-transparent font-bold outline-none" />
                    </div>
                    <div class="p-2 bg-gray-50">
                        <span class="font-bold block text-xs uppercase text-gray-500">Tablet Size</span>
                        <input v-model="form.specs.tabletSize" class="w-full bg-transparent font-bold outline-none" />
                    </div>
                </div>

                <table class="w-full border-collapse border border-black text-center text-xs">
                    <tr class="bg-gray-200 font-bold uppercase">
                        <td class="border border-black p-1 text-left">Target Parameters</td>
                        <td class="border border-black p-1">Nominal</td>
                        <td class="border border-black p-1">High (+5%)</td>
                        <td class="border border-black p-1">Low (-5%)</td>
                    </tr>
                    <tr>
                        <td class="border border-black p-1 text-left font-bold">Weight (mg)</td>
                        <td class="border border-black p-1"><input type="number" v-model="form.specs.weightNominal" class="w-full text-center bg-yellow-50 outline-none" /></td>
                        <td class="border border-black p-1 font-mono text-red-600">{{ weightHigh }}</td>
                        <td class="border border-black p-1 font-mono text-blue-600">{{ weightLow }}</td>
                    </tr>
                </table>
            </div>

            <div class="mb-6">
                <p class="text-[10px] mb-2 italic">Take weight of 10 tablets every 15 min and record data below.</p>
                <table class="w-full border-collapse border border-black text-xs">
                    <thead>
                        <tr class="bg-black text-white uppercase">
                            <th class="border border-gray-600 p-2 w-10">#</th>
                            <th class="border border-gray-600 p-2 w-32">Date</th>
                            <th class="border border-gray-600 p-2 w-24">Time</th>
                            <th class="border border-gray-600 p-2">Weight (mg)</th>
                            <th class="border border-gray-600 p-2">Hardness (Kp)</th>
                            <th class="border border-gray-600 p-2">Done by</th>
                            <th class="border border-gray-600 p-2 w-12 print:hidden"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, index) in form.weightChecks" :key="index" :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
                            <td class="border border-black p-2 text-center font-bold">{{ index + 1 }}</td>
                            <td class="border border-black p-2">
                                <input type="date" v-model="row.date" class="w-full bg-transparent outline-none text-center" />
                            </td>
                            <td class="border border-black p-2">
                                <input type="time" v-model="row.time" class="w-full bg-transparent outline-none text-center font-mono" />
                            </td>
                            <td class="border border-black p-2">
                                <input type="number" v-model="row.weightMg" step="0.1" class="w-full bg-transparent text-center font-bold outline-none" placeholder="0.0" />
                            </td>
                            <td class="border border-black p-2">
                                <input type="number" v-model="row.hardnessKp" step="0.1" class="w-full bg-transparent text-center outline-none" />
                            </td>
                            <td class="border border-black p-2">
                                <input type="text" v-model="row.doneBy" class="w-full bg-transparent text-center uppercase outline-none" placeholder="Initials" />
                            </td>
                            <td class="border border-black p-2 text-center print:hidden">
                                <button @click="removeRow(index)" class="text-red-400 hover:text-red-600" v-if="form.weightChecks.length > 1">✕</button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <button @click="addRow" class="mt-4 bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 print:hidden">+ Add 15 Min Check</button>
            </div>

            <div class="flex justify-end items-center space-x-4 border-t-2 border-black pt-6">
                <div class="text-right">
                    <span class="block text-[10px] uppercase font-bold text-gray-500">Weight average of last 10 tablets</span>
                    <div class="text-4xl font-black font-mono border-4 border-black px-4 py-2 bg-white inline-block">
                        {{ calculatedAverage }}
                    </div>
                </div>
                <button @click="submitToMongo" class="bg-blue-700 text-white px-8 py-4 font-bold rounded shadow-lg hover:bg-blue-800 transition-all print:hidden">SAVE BATCH RECORD</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue';

const form = reactive({
    metadata: { effectiveDate: '' },
    specs: {
        product: 'MELATONIN',
        lotNo: '',
        tabletSize: '3/8',
        weightNominal: 250,
        hardnessNominal: 8
    },
    weightChecks: []
});

// Helper for real-time stamps
const getNow = () => {
    const d = new Date();
    return {
        date: d.toISOString().split('T')[0],
        time: d.toTimeString().split(' ')[0].substring(0, 5)
    };
};

// Logic for dynamic rows
const addRow = () => {
    const { date, time } = getNow();
    form.weightChecks.push({
        date,
        time,
        weightMg: null,
        hardnessKp: null,
        doneBy: ''
    });
};

const removeRow = (index) => {
    form.weightChecks.splice(index, 1);
};

// Calculation Logic
const weightHigh = computed(() => (form.specs.weightNominal * 1.05).toFixed(1));
const weightLow = computed(() => (form.specs.weightNominal * 0.95).toFixed(1));

const calculatedAverage = computed(() => {
    const validWeights = form.weightChecks.filter((r) => r.weightMg !== null && r.weightMg > 0).map((r) => Number(r.weightMg));

    if (validWeights.length === 0) return '0.0';

    const lastTen = validWeights.slice(-10);
    const sum = lastTen.reduce((a, b) => a + b, 0);
    return (sum / lastTen.length).toFixed(1);
});

// Initialize first row on load
onMounted(() => {
    const { date } = getNow();
    form.metadata.effectiveDate = date;
    addRow();
});

const submitToMongo = () => {
    const finalData = {
        ...form,
        finalAverage: calculatedAverage.value,
        createdAt: new Date()
    };
    console.log('Ready for MongoDB:', finalData);
    alert('Batch Record Logged Successfully');
};
</script>

<style scoped>
@media print {
    .print\:hidden {
        display: none !important;
    }
    body {
        background-color: white;
    }
}
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>
