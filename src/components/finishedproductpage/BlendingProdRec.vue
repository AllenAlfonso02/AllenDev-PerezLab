<template>
    <div class="p-6 bg-gray-100 min-h-screen font-sans text-gray-900">
        <div class="max-w-6xl mx-auto bg-white shadow-2xl border border-gray-300 p-8">
            <div class="flex justify-between border-b-2 border-black pb-4 mb-6">
                <div>
                    <h1 class="text-2xl font-black italic text-blue-900">PEREZ LAB INC.</h1>
                    <h2 class="text-lg font-bold uppercase tracking-widest">Batch Production Record</h2>
                </div>
                <div class="text-right text-xs font-mono">
                    <p>Form 032 | MN-001-00</p>
                    <p>Effective Date: <input type="date" v-model="form.metadata.effectiveDate" class="border-b border-black outline-none bg-transparent" /></p>
                </div>
            </div>

            <div class="mb-6 border border-black p-4 bg-gray-50">
                <h3 class="font-bold mb-4 border-b border-black pb-2 uppercase">C. OPERATION - BLENDING</h3>
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Product:</strong> <input v-model="form.metadata.product" class="border-b border-gray-400 w-2/3 outline-none" /></div>
                    <div><strong>Customer:</strong> <input v-model="form.metadata.customer" class="border-b border-gray-400 w-2/3 outline-none" /></div>
                    <div><strong>Lot #:</strong> <input v-model="form.metadata.lotNo" class="border-b border-gray-400 w-2/3 outline-none" /></div>
                    <div><strong>Theoretical Weight (kg):</strong> <input type="number" v-model="form.metadata.theoWeight" class="border-b border-gray-400 w-1/3 outline-none" /></div>
                </div>
            </div>

            <div class="mb-6 border border-black p-2 text-xs grid grid-cols-4 gap-2">
                <div class="flex flex-col"><span>Machine ID:</span> <input v-model="form.env.machineId" class="border-b border-black" /></div>
                <div class="flex flex-col"><span>Room #:</span> <input v-model="form.env.roomNo" class="border-b border-black" /></div>
                <div class="flex flex-col"><span>Room Temp (56-86°F):</span> <input v-model="form.env.temp" class="border-b border-black" /></div>
                <div class="flex flex-col"><span>Humidity (<75%):</span> <input v-model="form.env.humidity" class="border-b border-black" /></div>
            </div>

            <table class="w-full border-collapse border border-black text-[11px] mb-6">
                <thead>
                    <tr class="bg-black text-white uppercase">
                        <th class="border border-gray-600 p-1 w-8">#</th>
                        <th class="border border-gray-600 p-1 w-1/3">Procedure</th>
                        <th class="border border-gray-600 p-1">Time (Start / Finish)</th>
                        <th class="border border-gray-600 p-1">Done By / Date</th>
                        <th class="border border-gray-600 p-1">Checked By / Date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(step, index) in form.steps" :key="index" class="border-b border-black">
                        <td class="border-r border-black p-2 text-center font-bold">{{ step.id }}</td>
                        <td class="border-r border-black p-2 italic">{{ step.desc }}</td>
                        <td class="border-r border-black p-2">
                            <div v-if="step.hasTime" class="space-y-2">
                                <div class="flex items-center justify-between">
                                    <span>Start:</span>
                                    <input type="time" v-model="step.startTime" class="border-b border-black mx-1" />
                                    <button @click="step.startTime = getTime()" class="bg-gray-200 px-1 print:hidden">Now</button>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span>Finish:</span>
                                    <input type="time" v-model="step.finishTime" class="border-b border-black mx-1" />
                                    <button @click="step.finishTime = getTime()" class="bg-gray-200 px-1 print:hidden">Now</button>
                                </div>
                            </div>
                        </td>
                        <td class="border-r border-black p-2">
                            <input v-model="step.doneBy" placeholder="Init" class="w-full border-b border-gray-300 text-center mb-1" />
                            <div class="flex items-center justify-between">
                                <input type="date" v-model="step.doneDate" class="text-[10px] w-full" />
                                <button @click="step.doneDate = getDate()" class="text-xs print:hidden">📅</button>
                            </div>
                        </td>
                        <td class="p-2">
                            <input v-model="step.checkedBy" placeholder="Init" class="w-full border-b border-gray-300 text-center mb-1" />
                            <div class="flex items-center justify-between">
                                <input type="date" v-model="step.checkedDate" class="text-[10px] w-full" />
                                <button @click="step.checkedDate = getDate()" class="text-xs print:hidden">📅</button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div class="grid grid-cols-2 gap-8">
                <div>
                    <h3 class="font-bold text-sm mb-2 underline">Record actual total weight (kg)</h3>
                    <table class="w-full border border-black text-xs text-center">
                        <tr class="bg-gray-100 font-bold">
                            <td class="border border-black p-1">Cont #</td>
                            <td class="border border-black p-1">Tare (kg)</td>
                            <td class="border border-black p-1">Net Weight (kg)</td>
                            <td class="border border-black p-1">Done By / Date</td>
                        </tr>
                        <tr v-for="(cont, idx) in form.containers" :key="idx">
                            <td class="border border-black p-2 font-bold">{{ idx + 1 }}</td>
                            <td class="border border-black p-1"><input v-model="cont.tare" type="number" step="0.1" class="w-full text-center outline-none" /></td>
                            <td class="border border-black p-1"><input v-model="cont.net" type="number" step="0.1" class="w-full text-center outline-none font-bold" /></td>
                            <td class="border border-black p-1">
                                <input v-model="cont.by" class="w-full border-b border-gray-200 mb-1" />
                                <input type="date" v-model="cont.date" class="text-[10px]" />
                            </td>
                        </tr>
                        <tr class="font-bold bg-yellow-50">
                            <td colspan="2" class="border border-black p-2 text-right">TOTAL ACTUAL WEIGHT:</td>
                            <td class="border border-black p-2 text-blue-700 underline">{{ totalActualWeight }} kg</td>
                            <td class="border border-black"></td>
                        </tr>
                    </table>
                    <button @click="addContainer" class="mt-2 text-[10px] bg-black text-white px-2 py-1 rounded print:hidden">+ Add Container</button>
                </div>
            </div>

            <div class="mt-8 flex justify-end space-x-4 border-t-2 border-black pt-6 print:hidden">
                <button @click="resetForm" class="px-4 py-2 text-red-600 border border-red-600 font-bold uppercase text-xs">Clear Form</button>
                <button @click="saveForm" class="px-8 py-2 bg-blue-700 text-white font-bold uppercase text-xs shadow-lg">Save Record</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue';

const getDate = () => new Date().toISOString().split('T')[0];
const getTime = () => new Date().toTimeString().split(' ')[0].substring(0, 5);

const form = reactive({
    metadata: { effectiveDate: getDate(), product: 'MELATONIN', customer: 'ALL CONSULTING', lotNo: '', theoWeight: 31.5 },
    env: { machineId: '', roomNo: '', temp: '', humidity: '' },
    steps: [
        { id: 1, desc: 'Ensure all RM are labeled and present.', hasTime: false, doneBy: '', doneDate: '', checkedBy: '', checkedDate: '' },
        { id: 2, desc: 'Add all ingredients into blender except RM0004 Magnesium Stearate.', hasTime: false, doneBy: '', doneDate: '', checkedBy: '', checkedDate: '' },
        { id: 3, desc: 'Mix ingredients for specified time.', hasTime: true, startTime: '', finishTime: '', doneBy: '', doneDate: '', checkedBy: '', checkedDate: '' },
        { id: 4, desc: 'Add RM0004 Magnesium Stearate and mix.', hasTime: true, startTime: '', finishTime: '', doneBy: '', doneDate: '', checkedBy: '', checkedDate: '' },
        { id: 5, desc: 'Add RM0002 Stearic Acid and mix.', hasTime: true, startTime: '', finishTime: '', doneBy: '', doneDate: '', checkedBy: '', checkedDate: '' },
        { id: 6, desc: 'Empty product into bags, weigh and identify each.', hasTime: false, doneBy: '', doneDate: '', checkedBy: '', checkedDate: '' }
    ],
    containers: [{ tare: null, net: null, by: '', date: getDate() }]
});

const totalActualWeight = computed(() => {
    return form.containers.reduce((sum, c) => sum + (Number(c.net) || 0), 0).toFixed(1);
});

const addContainer = () => form.containers.push({ tare: null, net: null, by: '', date: getDate() });

const resetForm = () => {
    if (confirm('Clear all data?')) location.reload();
};

const saveForm = () => {
    console.log('Saving to MongoDB...', JSON.parse(JSON.stringify(form)));
    alert('Blending Record Saved');
};

onMounted(() => {
    form.steps.forEach((s) => {
        s.doneDate = getDate();
        s.checkedDate = getDate();
    });
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
