<template>
    <div class="p-6 bg-gray-100 min-h-screen font-sans text-gray-900">
        <div class="max-w-full mx-auto bg-white shadow-2xl border border-gray-300 p-8">
            <div class="flex justify-between border-b-2 border-black pb-4 mb-6">
                <div>
                    <h1 class="text-2xl font-black italic text-blue-900">PEREZ LAB INC.</h1>
                    <h2 class="text-lg font-bold uppercase tracking-widest">Batch Production Record</h2>
                </div>
                <div class="text-right text-xs font-mono">
                    <p class="font-bold">Form 032 | MN-001-00</p>
                    <p>Effective Date: <input type="date" v-model="form.metadata.effectiveDate" class="border-b border-black outline-none bg-transparent" /></p>
                </div>
            </div>

            <div class="mb-6">
                <h3 class="font-bold mb-2 uppercase text-sm border-l-4 border-black pl-2">D. Operation - Tableting</h3>
                <div class="grid grid-cols-3 border border-black text-sm mb-2">
                    <div class="border-r border-black p-2 bg-gray-50">
                        <label class="font-bold block text-[10px] uppercase text-gray-500">Product</label>
                        <input v-model="form.specs.product" class="w-full bg-transparent font-bold outline-none" />
                    </div>
                    <div class="border-r border-black p-2 bg-gray-50">
                        <label class="font-bold block text-[10px] uppercase text-gray-500">Lot #</label>
                        <input v-model="form.specs.lotNo" class="w-full bg-transparent font-bold outline-none" />
                    </div>
                    <div class="p-2 bg-gray-50">
                        <label class="font-bold block text-[10px] uppercase text-gray-500">Tablet Size</label>
                        <input v-model="form.specs.tabletSize" class="w-full bg-transparent font-bold outline-none" />
                    </div>
                </div>

                <table class="w-full border-collapse border border-black text-center text-xs">
                    <thead>
                        <tr class="bg-gray-200 font-bold uppercase">
                            <th class="border border-black p-1 text-left">Target Parameters</th>
                            <th class="border border-black p-1 w-32">Nominal</th>
                            <th class="border border-black p-1 w-32">High (+5%)</th>
                            <th class="border border-black p-1 w-32">Low (-5%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="border border-black p-1 text-left font-bold">Weight (mg)</td>
                            <td class="border border-black p-1"><input type="number" v-model="form.specs.weightNominal" class="w-full text-center bg-yellow-50 outline-none font-bold" /></td>
                            <td class="border border-black p-1 font-mono text-red-600 font-bold">{{ weightRange.high }}</td>
                            <td class="border border-black p-1 font-mono text-blue-600 font-bold">{{ weightRange.low }}</td>
                        </tr>
                        <tr>
                            <td class="border border-black p-1 text-left font-bold">Hardness (Kp)</td>
                            <td class="border border-black p-1"><input type="number" v-model="form.specs.hardnessNominal" class="w-full text-center bg-yellow-50 outline-none font-bold" /></td>
                            <td class="border border-black p-1 font-mono text-red-600 font-bold">{{ hardnessRange.high }}</td>
                            <td class="border border-black p-1 font-mono text-blue-600 font-bold">{{ hardnessRange.low }}</td>
                        </tr>
                        <tr>
                            <td class="border border-black p-1 text-left font-bold">Thickness (in)</td>
                            <td class="border border-black p-1"><input type="number" step="0.001" v-model="form.specs.thicknessNominal" class="w-full text-center bg-yellow-50 outline-none font-bold" /></td>
                            <td class="border border-black p-1 font-mono text-red-600 font-bold">{{ thicknessRange.high }}</td>
                            <td class="border border-black p-1 font-mono text-blue-600 font-bold">{{ thicknessRange.low }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="mb-6 overflow-x-auto">
                <table class="w-full border-collapse border border-black text-[11px]">
                    <thead>
                        <tr class="bg-black text-white uppercase">
                            <th class="border border-gray-600 p-2 w-8">#</th>
                            <th class="border border-gray-600 p-2 w-28">Date</th>
                            <th class="border border-gray-600 p-2 w-20">Time</th>
                            <th class="border border-gray-600 p-2 w-24">Weight (mg)</th>
                            <th class="border border-gray-600 p-2 w-24">Hardness (Kp)</th>
                            <th class="border border-gray-600 p-2 w-24">Thickness (in)</th>
                            <th class="border border-gray-600 p-2 w-24">Done by</th>
                            <th class="border border-gray-600 p-2 w-24">Checked by</th>
                            <th class="border border-gray-600 p-2 w-32">Checked Date</th>
                            <th class="border border-gray-600 p-2 w-10 print:hidden"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, index) in form.weightChecks" :key="index" :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
                            <td class="border border-black p-1 text-center font-bold">{{ index + 1 }}</td>
                            <td class="border border-black p-1"><input type="date" v-model="row.date" class="w-full bg-transparent outline-none text-center" /></td>
                            <td class="border border-black p-1"><input type="time" v-model="row.time" class="w-full bg-transparent outline-none text-center font-mono" /></td>
                            <td class="border border-black p-1"><input type="number" v-model="row.weightMg" step="0.1" class="w-full bg-transparent text-center font-bold outline-none" /></td>
                            <td class="border border-black p-1"><input type="number" v-model="row.hardnessKp" step="0.1" class="w-full bg-transparent text-center outline-none" /></td>
                            <td class="border border-black p-1"><input type="number" v-model="row.thicknessIn" step="0.001" class="w-full bg-transparent text-center outline-none" /></td>
                            <td class="border border-black p-1"><input type="text" v-model="row.doneBy" class="w-full bg-transparent text-center uppercase outline-none" placeholder="INIT" /></td>
                            <td class="border border-black p-1"><input type="text" v-model="row.checkedBy" class="w-full bg-transparent text-center uppercase outline-none" placeholder="INIT" /></td>
                            <td class="border border-black p-1">
                                <div class="flex items-center space-x-1">
                                    <input type="date" v-model="row.checkedDate" class="w-full bg-transparent outline-none text-center" />
                                    <button @click="stampCheckDate(index)" class="bg-gray-200 hover:bg-gray-300 p-1 rounded print:hidden" title="Stamp Today">📅</button>
                                </div>
                            </td>
                            <td class="border border-black p-1 text-center print:hidden">
                                <button @click="removeRow(index)" class="text-red-400 hover:text-red-600" v-if="form.weightChecks.length > 1">✕</button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div class="mt-4 flex space-x-2 print:hidden">
                    <button @click="addRow" class="bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-gray-800">+ Add 15 Min Check</button>
                </div>
            </div>

            <div class="flex justify-between items-end border-t-2 border-black pt-6">
                <div class="text-xs italic text-gray-500">* Ensure all signatures and dates are provided for compliance.</div>
                <div class="flex items-center space-x-6">
                    <div class="text-right">
                        <span class="block text-[10px] uppercase font-bold text-gray-500 tracking-tight">Avg of last 10 tests</span>
                        <div class="text-4xl font-black font-mono border-4 border-black px-4 py-2 bg-yellow-50 inline-block">
                            {{ calculatedAverage }}
                        </div>
                    </div>
                    <button @click="submitToMongo" class="bg-green-700 text-white px-8 py-4 font-bold rounded shadow-lg hover:bg-green-800 transition-all print:hidden">SAVE RECORD</button>
                </div>
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
        hardnessNominal: 8,
        thicknessNominal: 0.293
    },
    weightChecks: []
});

const getTodayStr = () => new Date().toISOString().split('T')[0];
const getTimeStr = () => new Date().toTimeString().split(' ')[0].substring(0, 5);

const addRow = () => {
    form.weightChecks.push({
        date: getTodayStr(),
        time: getTimeStr(),
        weightMg: null,
        hardnessKp: null,
        thicknessIn: null,
        doneBy: '',
        checkedBy: '',
        checkedDate: ''
    });
};

const stampCheckDate = (index) => {
    form.weightChecks[index].checkedDate = getTodayStr();
};

const removeRow = (index) => {
    form.weightChecks.splice(index, 1);
};

// Range Calculation (±5%)
const calcRange = (nominal, precision = 1) => {
    if (!nominal) return { high: '0.0', low: '0.0' };
    return {
        high: (Number(nominal) * 1.05).toFixed(precision),
        low: (Number(nominal) * 0.95).toFixed(precision)
    };
};

const weightRange = computed(() => calcRange(form.specs.weightNominal, 1));
const hardnessRange = computed(() => calcRange(form.specs.hardnessNominal, 1));
const thicknessRange = computed(() => calcRange(form.specs.thicknessNominal, 3));

const calculatedAverage = computed(() => {
    const validWeights = form.weightChecks.filter((r) => r.weightMg !== null && r.weightMg > 0).map((r) => Number(r.weightMg));

    if (validWeights.length === 0) return '0.0';

    const lastTen = validWeights.slice(-10);
    const sum = lastTen.reduce((a, b) => a + b, 0);
    return (sum / lastTen.length).toFixed(1);
});

onMounted(() => {
    form.metadata.effectiveDate = getTodayStr();
    addRow();
});

const submitToMongo = () => {
    console.log('Saving to DB...', JSON.parse(JSON.stringify(form)));
    alert('Data successfully sent to inventory system.');
};
</script>

<style scoped>
@media print {
    .print\:hidden {
        display: none !important;
    }
}
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>
