<template>
    <div class="p-4 bg-gray-100 min-h-screen font-sans text-gray-900">
        <div id="pdf-content" class="max-w-full mx-auto bg-white shadow-2xl border border-gray-300 p-6">
            <div class="flex justify-between border-b-2 border-black pb-2 mb-4">
                <div>
                    <h1 class="text-xl font-black italic text-blue-900 leading-none">PEREZ LAB INC.</h1>
                    <h2 class="text-md font-bold uppercase tracking-tighter">Batch Production Record</h2>
                </div>
                <div class="text-right text-[10px] font-mono">
                    <p class="font-bold">Form 010 | MN-001-00</p>
                    <p>Effective Date: <input type="text" v-model="form.metadata.effectiveDate" class="border-b border-black outline-none bg-transparent w-20 text-right" /></p>
                </div>
            </div>

            <div class="mb-4">
                <div class="flex justify-between items-center mb-1">
                    <h3 class="font-bold uppercase text-xs">D. OPERATION - ENCAPSULATION</h3>
                    <div class="text-[11px] font-bold">Lot #: <input v-model="form.specs.lotNo" class="border-b border-black bg-transparent outline-none w-24 text-center" /></div>
                </div>

                <div class="grid grid-cols-4 gap-2 border border-black p-2 text-[10px] bg-gray-50 uppercase font-bold">
                    <div class="flex flex-col"><span>Product:</span> <input v-model="form.specs.product" class="border-b border-gray-400 bg-transparent" /></div>
                    <div class="flex flex-col"><span>Machine ID:</span> <input v-model="form.specs.machineId" class="border-b border-gray-400 bg-transparent" /></div>
                    <div class="flex flex-col"><span>Capsule Size:</span> <input v-model="form.specs.capsuleSize" class="border-b border-gray-400 bg-transparent" /></div>
                    <div class="flex flex-col"><span>Capsule Color:</span> <input v-model="form.specs.capsuleColor" class="border-b border-gray-400 bg-transparent" /></div>
                    <div class="flex flex-col"><span>Filler Color:</span> <input v-model="form.specs.fillerColor" class="border-b border-gray-400 bg-transparent" /></div>
                    <div class="flex flex-col"><span>Target Weight (mg):</span> <input type="number" v-model="form.specs.weightTarget" class="border-b border-gray-400 bg-transparent" /></div>
                    <div class="flex flex-col">
                        <span>Range Low (-10%):</span> <span class="text-blue-700 font-mono">{{ weightRange.low }}</span>
                    </div>
                    <div class="flex flex-col">
                        <span>Range High (+10%):</span> <span class="text-red-700 font-mono">{{ weightRange.high }}</span>
                    </div>
                </div>
            </div>

            <div class="flex justify-end mb-4">
                <div class="border border-black p-2 text-[9px] font-mono bg-yellow-50">
                    <p class="font-bold border-b border-black mb-1">Average calculation (10 Caps)</p>
                    <div class="grid grid-cols-2 gap-x-2">
                        <span>A. Weight 10 caps (grs) =</span> <input v-model="calc.weightGrs" class="border-b border-black text-right outline-none bg-transparent" /> <span>B. A * 1.000 (mg) =</span>
                        <span class="text-right border-b border-black">{{ calc.weightMgTotal }}</span> <span>C. B / 10 cap = Weight / cap =</span> <span class="text-right font-bold text-lg leading-none">{{ calculatedAverage }}</span>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <table v-for="col in [0, 21]" :key="col" class="w-full border-collapse border border-black text-[9px]">
                    <thead class="bg-gray-800 text-white uppercase">
                        <tr>
                            <th class="border border-gray-600 p-1 w-6">#</th>
                            <th class="border border-gray-600 p-1">Date</th>
                            <th class="border border-gray-600 p-1">Time</th>
                            <th class="border border-gray-600 p-1">Weight (mg)</th>
                            <th class="border border-gray-600 p-1">Done</th>
                            <th class="border border-gray-600 p-1">Checked</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="n in 21" :key="n + col" class="h-6">
                            <td class="border border-black p-0.5 text-center font-bold bg-gray-100">{{ n + col }}</td>
                            <td class="border border-black p-0.5"><input v-model="form.checks[n + col - 1].date" class="w-full text-center outline-none bg-transparent" /></td>
                            <td class="border border-black p-0.5"><input v-model="form.checks[n + col - 1].time" class="w-full text-center outline-none bg-transparent font-mono" /></td>
                            <td class="border border-black p-0.5"><input type="number" v-model="form.checks[n + col - 1].weight" class="w-full text-center font-bold outline-none bg-transparent" /></td>
                            <td class="border border-black p-0.5"><input v-model="form.checks[n + col - 1].done" class="w-full text-center uppercase outline-none bg-transparent text-blue-700" /></td>
                            <td class="border border-black p-0.5"><input v-model="form.checks[n + col - 1].checked" class="w-full text-center uppercase outline-none bg-transparent italic" /></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="mt-4 grid grid-cols-2 gap-4 text-[9px] font-mono border-t border-black pt-2">
                <div class="flex justify-between border-b border-black"><span>Done by:</span> <input v-model="form.sigs.doneBy" class="outline-none" /> <span>Date:</span> <input v-model="form.sigs.doneDate" class="outline-none w-20" /></div>
                <div class="flex justify-between border-b border-black"><span>Approved by:</span> <input v-model="form.sigs.appBy" class="outline-none" /> <span>Date:</span> <input v-model="form.sigs.appDate" class="outline-none w-20" /></div>
            </div>

            <div class="mt-4 flex justify-end gap-2 print:hidden">
                <button @click="submitToAtlas" class="bg-blue-800 text-white px-6 py-2 font-bold rounded uppercase text-xs">Save to MongoDB Atlas</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, reactive } from 'vue';

const form = reactive({
    metadata: { effectiveDate: '03/25/26' },
    specs: {
        product: 'GLYCOL',
        lotNo: '040426',
        machineId: '',
        capsuleSize: '00',
        capsuleColor: 'CLEAR',
        fillerColor: 'YELLOW',
        weightTarget: 759
    },
    checks: Array.from({ length: 42 }, (_, i) => ({
        date: '4/6/26',
        time: '',
        weight: null,
        done: 'ARQ',
        checked: 'MC'
    })),
    sigs: { doneBy: 'VJ', doneDate: '03/25/26', appBy: 'ELV', appDate: '03/25/26' }
});

const calc = reactive({
    weightGrs: ''
});

const weightRange = computed(() => {
    const t = Number(form.specs.weightTarget) || 0;
    return {
        low: Math.round(t * 0.9),
        high: Math.round(t * 1.1)
    };
});

// Logic for the mg conversion in the calc box
calc.weightMgTotal = computed(() => {
    return calc.weightGrs ? (Number(calc.weightGrs) * 1000).toFixed(0) : '0';
});

const calculatedAverage = computed(() => {
    return (Number(calc.weightMgTotal) / 10).toFixed(1);
});

const submitToAtlas = () => {
    console.log('Sending BPR to AWS API...', JSON.parse(JSON.stringify(form)));
    alert('Encapsulation log saved successfully.');
};
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
input:focus {
    background-color: #fefce8;
}
</style>
