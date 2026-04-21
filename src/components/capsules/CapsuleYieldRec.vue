<template>
    <div class="p-6 bg-gray-100 min-h-screen font-sans text-gray-900">
        <div class="max-w-6xl mx-auto bg-white shadow-2xl border border-gray-300 p-8">
            <div class="flex justify-between border-b-2 border-black pb-4 mb-6">
                <div>
                    <h1 class="text-2xl font-black italic text-blue-900">PEREZ LAB INC.</h1>
                    <h2 class="text-lg font-bold uppercase tracking-widest">Batch Production Record</h2>
                </div>
                <div class="text-right text-xs font-mono">
                    <p class="font-bold">Form 011 | MN-001-00</p>
                    <div class="mt-1 space-y-1">
                        <p>Effective Date: <input type="text" v-model="form.metadata.effectiveDate" class="border-b border-black outline-none bg-transparent w-24 text-right" /></p>
                        <p>Review Date: <input type="text" v-model="form.metadata.reviewDate" class="border-b border-black outline-none bg-transparent w-24 text-right" /></p>
                        <p>Date: <input type="text" v-model="form.metadata.formDate" class="border-b border-black outline-none bg-transparent w-24 text-right" /></p>
                    </div>
                </div>
            </div>

            <div class="mb-4">
                <h3 class="font-bold uppercase text-md mb-4 underline">C1. BLENDING RECONCILATION</h3>
                <div class="grid grid-cols-2 gap-8 text-xs font-mono mb-6">
                    <div class="flex items-end space-x-2">
                        <span>Done by:</span>
                        <input v-model="form.sigs.headerDoneBy" class="border-b border-black flex-grow outline-none uppercase font-bold" />
                        <span>Date:</span>
                        <input v-model="form.sigs.headerDoneDate" class="border-b border-black w-24 outline-none" />
                    </div>
                    <div class="flex items-end space-x-2">
                        <span>Approved by:</span>
                        <input v-model="form.sigs.headerAppBy" class="border-b border-black flex-grow outline-none uppercase font-bold" />
                    </div>
                </div>
            </div>

            <div class="flex justify-end mb-6">
                <div class="w-1/3 text-sm space-y-2">
                    <div class="flex justify-between border-b border-gray-400"><span>Lot No.:</span> <input v-model="form.metadata.lotNo" class="font-bold text-right outline-none w-1/2" /></div>
                    <div class="flex justify-between border-b border-gray-400"><span>Quantity (ML):</span> <input v-model="form.metadata.qtyMl" class="font-bold text-right outline-none w-1/2" /></div>
                    <div class="flex justify-between border-b border-gray-400"><span>Total Theoretical Weight (kg):</span> <input type="number" v-model="form.metadata.theoWeight" class="font-bold text-right outline-none w-1/2" /></div>
                </div>
            </div>

            <table class="w-full border-collapse border border-black text-[10px] mb-8">
                <thead class="bg-gray-100 uppercase font-bold text-center">
                    <tr>
                        <th class="border border-black p-2 w-24">Blending #</th>
                        <th class="border border-black p-2 w-24">Container #</th>
                        <th class="border border-black p-2">Total weight before blending (kg)</th>
                        <th class="border border-black p-2">Total weight after blending (kg)</th>
                        <th class="border border-black p-2">Difference (kg)</th>
                        <th class="border border-black p-2 w-16">Done by:</th>
                        <th class="border border-black p-2 w-20">Date:</th>
                        <th class="border border-black p-2 w-16">Checked by:</th>
                        <th class="border border-black p-2 w-20">Date:</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, idx) in form.rows" :key="idx" class="text-center font-mono">
                        <td class="border border-black p-2"><input v-model="row.blendingNo" class="w-full text-center outline-none bg-transparent" /></td>
                        <td class="border border-black p-2"><input v-model="row.containerNo" class="w-full text-center outline-none bg-transparent" /></td>
                        <td class="border border-black p-2"><input type="number" step="0.1" v-model="row.weightBefore" class="w-full text-center outline-none font-bold" /></td>
                        <td class="border border-black p-2"><input type="number" step="0.1" v-model="row.weightAfter" class="w-full text-center outline-none font-bold" /></td>
                        <td class="border border-black p-2 bg-gray-50">{{ (row.weightBefore - row.weightAfter).toFixed(1) }}</td>
                        <td class="border border-black p-2"><input v-model="row.doneBy" class="w-full text-center outline-none uppercase font-bold text-blue-800" /></td>
                        <td class="border border-black p-2"><input v-model="row.doneDate" class="w-full text-center outline-none" /></td>
                        <td class="border border-black p-2"><input v-model="row.ckBy" class="w-full text-center outline-none uppercase italic" /></td>
                        <td class="border border-black p-2"><input v-model="row.ckDate" class="w-full text-center outline-none" /></td>
                    </tr>
                    <tr class="bg-gray-200 font-bold text-center">
                        <td class="border border-black p-2">TOTAL</td>
                        <td class="border border-black p-2">{{ totalContainers }}</td>
                        <td class="border border-black p-2">{{ totalBefore }}</td>
                        <td class="border border-black p-2 text-blue-700 underline">{{ totalAfter }}</td>
                        <td class="border border-black p-2 text-red-700">{{ totalDiff }}</td>
                        <td colspan="4" class="border border-black bg-white"></td>
                    </tr>
                </tbody>
            </table>

            <div class="grid grid-cols-2 gap-12">
                <div class="border-2 border-black p-4 bg-gray-50">
                    <h4 class="font-bold text-xs uppercase mb-3">Accepted range of weight (±5%):</h4>
                    <div class="space-y-4 text-sm">
                        <div class="flex items-center space-x-4">
                            <span>Low (kg) =</span>
                            <span class="font-mono font-black border-b-2 border-black w-24 text-center">{{ acceptedRange.low }}</span>
                        </div>
                        <div class="flex items-center space-x-4">
                            <span>High (kg) =</span>
                            <span class="font-mono font-black border-b-2 border-black w-24 text-center">{{ acceptedRange.high }}</span>
                        </div>
                    </div>
                </div>

                <div class="space-y-4 font-mono text-xs">
                    <div class="flex items-end space-x-4">
                        <span class="font-bold">QC Pass/Fail:</span>
                        <input v-model="form.qc.status" class="border-b border-black flex-grow outline-none uppercase font-black italic text-center" placeholder="PASS/FAIL" />
                        <span>Date:</span>
                        <input v-model="form.qc.statusDate" class="border-b border-black w-24 outline-none" />
                    </div>
                    <div class="flex items-end space-x-4">
                        <span class="font-bold">Done by:</span>
                        <input v-model="form.qc.doneBy" class="border-b border-black flex-grow outline-none uppercase italic" />
                        <span>Date:</span>
                        <input v-model="form.qc.doneDate" class="border-b border-black w-24 outline-none" />
                    </div>
                </div>
            </div>

            <div class="mt-12 flex justify-end gap-4 print:hidden">
                <button @click="addRow" class="px-4 py-2 bg-black text-white font-bold uppercase text-xs">+ Add Row</button>
                <button @click="saveReconciliation" class="px-8 py-2 bg-blue-900 text-white font-bold uppercase text-xs shadow-lg hover:bg-blue-800">Save Reconciliation to Atlas</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, reactive } from 'vue';

const form = reactive({
    metadata: {
        effectiveDate: '03/25/26',
        reviewDate: '',
        formDate: '03/25/26',
        lotNo: '040426',
        qtyMl: '72',
        theoWeight: 50
    },
    sigs: {
        headerDoneBy: 'BP',
        headerDoneDate: '03/25/26',
        headerAppBy: 'ELV'
    },
    rows: [{ blendingNo: '1', containerNo: '1', weightBefore: 50, weightAfter: 49.8, doneBy: 'DPG', doneDate: '4/4/26', ckBy: 'MC', ckDate: '4/4/26' }],
    qc: {
        status: 'PASS',
        statusDate: '4/4/26',
        doneBy: 'MC',
        doneDate: '4/4/26'
    }
});

const addRow = () => {
    form.rows.push({ blendingNo: '', containerNo: '', weightBefore: 0, weightAfter: 0, doneBy: '', doneDate: '', ckBy: '', ckDate: '' });
};

const totalContainers = computed(() => form.rows.length);
const totalBefore = computed(() => form.rows.reduce((sum, r) => sum + (Number(r.weightBefore) || 0), 0).toFixed(1));
const totalAfter = computed(() => form.rows.reduce((sum, r) => sum + (Number(r.weightAfter) || 0), 0).toFixed(1));
const totalDiff = computed(() => (totalBefore.value - totalAfter.value).toFixed(1));

const acceptedRange = computed(() => {
    const t = Number(form.metadata.theoWeight) || 0;
    return {
        low: (t * 0.95).toFixed(1),
        high: (t * 1.05).toFixed(1)
    };
});

const saveReconciliation = () => {
    const payload = {
        ...form,
        totals: {
            before: totalBefore.value,
            after: totalAfter.value,
            difference: totalDiff.value
        }
    };
    console.log('Sending to AWS API...', payload);
    alert('Blending Reconciliation Saved Successfully.');
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
