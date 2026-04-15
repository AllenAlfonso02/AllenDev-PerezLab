<template>
    <div class="p-6 bg-gray-50 min-h-screen font-sans text-gray-900">
        <div class="max-w-7xl mx-auto bg-white shadow-lg border border-gray-300 p-8">
            <div class="flex justify-between border-b-2 border-black pb-4 mb-6">
                <div>
                    <h1 class="text-2xl font-black">PEREZ LAB INC.</h1>
                    <h2 class="text-lg font-bold uppercase tracking-tight">Batch Production Record</h2>
                </div>
                <div class="text-right text-xs space-y-1">
                    <p class="font-bold">Form 032 | MN-001-00</p>
                    <p>Effective Date: <input type="date" v-model="form.metadata.effectiveDate" class="border-b border-gray-400 outline-none p-1" /></p>
                </div>
            </div>

            <div class="mb-6">
                <h3 class="font-bold mb-2 uppercase text-sm">D1. OPERATION - FINAL TABLETING</h3>
                <div class="grid grid-cols-2 border border-black">
                    <div class="border-r border-black p-2 flex items-center">
                        <span class="font-bold mr-2 uppercase text-sm">Product:</span>
                        <input v-model="form.operation.product" class="flex-1 bg-transparent border-b border-dotted border-gray-400 outline-none font-medium" />
                    </div>
                    <div class="p-2 flex items-center">
                        <span class="font-bold mr-2 uppercase text-sm">Tablet Size:</span>
                        <input v-model="form.operation.tabletSize" class="flex-1 bg-transparent border-b border-dotted border-gray-400 outline-none font-medium" />
                    </div>
                </div>
            </div>

            <div class="mb-6 overflow-x-auto">
                <table class="w-full border-collapse border border-black text-sm">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="border border-black p-2 w-12">#</th>
                            <th class="border border-black p-2">Tare</th>
                            <th class="border border-black p-2">Net Weight (kg)</th>
                            <th class="border border-black p-2">Done by</th>
                            <th class="border border-black p-2 w-40">Date</th>
                            <th class="border border-black p-2">Checked by</th>
                            <th class="border border-black p-2 w-40">Checked Date</th>
                            <th class="border border-black p-2 w-12 print:hidden"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, index) in form.tabletingRows" :key="index">
                            <td class="border border-black p-2 text-center font-bold">{{ index + 1 }}</td>
                            <td class="border border-black p-2"><input type="number" v-model="row.tare" class="w-full text-center outline-none" /></td>
                            <td class="border border-black p-2"><input type="number" v-model="row.netWeight" class="w-full text-center font-bold outline-none" /></td>
                            <td class="border border-black p-2"><input type="text" v-model="row.doneBy" placeholder="Initials" class="w-full outline-none text-center" /></td>
                            <td class="border border-black p-1">
                                <div class="flex items-center space-x-1">
                                    <input type="date" v-model="row.doneDate" class="w-full text-xs outline-none bg-transparent" />
                                    <button @click="stampDate(index, 'doneDate')" class="bg-gray-200 hover:bg-gray-300 p-1 rounded print:hidden">📅</button>
                                </div>
                            </td>
                            <td class="border border-black p-2"><input type="text" v-model="row.checkedBy" placeholder="Initials" class="w-full outline-none text-center" /></td>
                            <td class="border border-black p-1">
                                <div class="flex items-center space-x-1">
                                    <input type="date" v-model="row.checkedDate" class="w-full text-xs outline-none bg-transparent" />
                                    <button @click="stampDate(index, 'checkedDate')" class="bg-gray-200 hover:bg-gray-300 p-1 rounded print:hidden">📅</button>
                                </div>
                            </td>
                            <td class="border border-black p-2 text-center print:hidden">
                                <button @click="removeRow(index)" class="text-red-500 hover:text-red-700" v-if="form.tabletingRows.length > 1">✕</button>
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr class="bg-gray-50 font-bold text-base">
                            <td colspan="2" class="border border-black p-2 text-right">TOTAL (B)</td>
                            <td class="border border-black p-2 text-center underline">{{ totalWeight }} kg</td>
                            <td colspan="5" class="border border-black p-2">
                                <button @click="addRow" class="bg-green-600 text-white px-3 py-1 rounded text-xs print:hidden uppercase font-bold tracking-wider">+ Add Container</button>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div class="border-2 border-black p-4 mb-6 bg-white">
                <h3 class="font-bold text-center underline mb-4 uppercase">Actual Yield</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                        <p><strong>A</strong> = Total Quantity of Tablets Produced</p>
                        <p><strong>C</strong> = Average 10 Tablets Weight (mg)</p>
                    </div>
                    <div>
                        <p>
                            <strong>B</strong> = Total Weight of Tablets (kg): <span class="font-bold underline">{{ totalWeight }}</span>
                        </p>
                    </div>
                </div>

                <div class="flex flex-col items-center justify-center p-4 border border-dashed border-gray-400 bg-gray-50">
                    <div class="flex items-center space-x-4">
                        <span class="font-bold">A = B / C =</span>
                        <div class="flex flex-col items-center">
                            <span class="border-b border-black px-4">{{ totalWeight }} kg</span>
                            <input type="number" v-model="form.yieldCalc.avgWeightMg" placeholder="Avg mg" class="w-24 text-center bg-transparent outline-none pt-1" />
                        </div>
                        <span class="font-bold">* 1,000,000.00</span>
                    </div>
                    <div class="mt-4 font-bold text-lg">
                        A = Total Quantity Produced (Actual Yield) = <span class="underline ml-2 text-blue-700">{{ actualYield }}</span>
                    </div>
                </div>
            </div>

            <div class="border border-black p-4">
                <div class="flex justify-between items-center border-b border-black pb-2 mb-4">
                    <h3 class="font-bold uppercase">D2. TABLETING RECONCILIATION</h3>
                    <div class="text-sm">Lot No.: <input v-model="form.reconciliation.lotNo" class="border-b border-black w-32 outline-none font-mono px-2" /></div>
                </div>

                <div class="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                    <div class="flex justify-between border-b border-gray-300 pb-1">
                        <span>Quantity (k):</span>
                        <div class="font-bold text-blue-700 bg-gray-50 px-2 rounded">{{ actualYield }}</div>
                    </div>
                    <div class="flex justify-between border-b border-gray-300 pb-1">
                        <span>Theoretical Weight (kg):</span>
                        <input type="number" v-model="form.reconciliation.theoWeight" class="w-24 text-right font-bold outline-none bg-yellow-50" />
                    </div>

                    <div class="col-span-1 flex flex-col space-y-1">
                        <div class="flex justify-between border-b border-gray-300">
                            <span>Accepted Range:</span>
                            <span class="font-bold">±5%</span>
                        </div>
                        <div class="flex justify-between text-[11px] text-gray-600 px-1 italic">
                            <span
                                >Low: <b class="text-blue-700">{{ theoRange.low }} kg</b></span
                            >
                            <span
                                >High: <b class="text-red-700">{{ theoRange.high }} kg</b></span
                            >
                        </div>
                    </div>

                    <div class="flex justify-between border-b border-gray-300 pb-1">
                        <span>QC Pass/Fail:</span>
                        <select v-model="form.reconciliation.qcPass" class="font-bold text-right outline-none bg-transparent">
                            <option :value="null">PENDING</option>
                            <option :value="true">PASS</option>
                            <option :value="false">FAIL</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="mt-8 flex justify-end space-x-4 print:hidden">
                <button @click="resetForm" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded border border-gray-300">Clear Form</button>
                <button @click="saveData" class="px-8 py-2 bg-black text-white font-bold rounded hover:bg-gray-800 shadow-md uppercase tracking-widest">Finalize Record</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, reactive } from 'vue';

const form = reactive({
    metadata: { effectiveDate: new Date().toISOString().split('T')[0] },
    operation: { product: '', tabletSize: '' },
    tabletingRows: [
        {
            tare: null,
            netWeight: null,
            doneBy: '',
            doneDate: '',
            checkedBy: '',
            checkedDate: ''
        }
    ],
    yieldCalc: {
        avgWeightMg: null
    },
    reconciliation: {
        lotNo: '',
        theoWeight: 31.5,
        qcPass: null
    }
});

const stampDate = (index, field) => {
    form.tabletingRows[index][field] = new Date().toISOString().split('T')[0];
};

const addRow = () => {
    form.tabletingRows.push({
        tare: null,
        netWeight: null,
        doneBy: '',
        doneDate: '',
        checkedBy: '',
        checkedDate: ''
    });
};

const removeRow = (index) => {
    form.tabletingRows.splice(index, 1);
};

const totalWeight = computed(() => {
    return form.tabletingRows.reduce((acc, row) => acc + (Number(row.netWeight) || 0), 0);
});

const actualYield = computed(() => {
    if (!form.yieldCalc.avgWeightMg || form.yieldCalc.avgWeightMg === 0) return 0;
    const result = (totalWeight.value / form.yieldCalc.avgWeightMg) * 1000000;
    return Math.round(result);
});

const theoRange = computed(() => {
    const val = Number(form.reconciliation.theoWeight) || 0;
    return {
        low: (val * 0.95).toFixed(3),
        high: (val * 1.05).toFixed(3)
    };
});

const saveData = () => {
    const payload = {
        ...form,
        calculatedActualYield: actualYield.value, // Auto-populated value
        timestamp: new Date().toISOString()
    };
    console.log('Saving to MongoDB:', payload);
    alert('Data processed successfully.');
};

const resetForm = () => {
    if (confirm('Are you sure you want to clear this record?')) {
        location.reload();
    }
};
</script>

<style scoped>
@media print {
    .print\:hidden {
        display: none !important;
    }
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>
