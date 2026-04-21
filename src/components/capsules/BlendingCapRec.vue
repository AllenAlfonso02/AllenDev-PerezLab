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
                    <p>Effective Date: <input type="text" v-model="form.metadata.effectiveDate" class="border-b border-black outline-none bg-transparent w-20 text-right" /></p>
                    <p>Review Date: <input type="text" v-model="form.metadata.reviewDate" class="border-b border-black outline-none bg-transparent w-20 text-right" /></p>
                </div>
            </div>

            <div class="mb-6 border border-black p-4 bg-gray-50">
                <div class="flex justify-between items-center border-b border-black pb-2 mb-4">
                    <h3 class="font-bold uppercase text-sm">C. OPERATION - BLENDING</h3>
                    <div class="text-xs font-bold">Lot #: <input v-model="form.metadata.lotNo" class="border-b border-black bg-transparent outline-none w-24 text-center" /></div>
                </div>
                <div class="grid grid-cols-2 gap-y-4 gap-x-12 text-sm">
                    <div class="flex justify-between border-b border-gray-300"><span>Product & Description:</span> <input v-model="form.metadata.product" class="font-bold text-right outline-none bg-transparent" /></div>
                    <div class="flex justify-between border-b border-gray-300"><span>Quantity (ML):</span> <input type="number" v-model="form.metadata.qtyMl" class="font-bold text-right outline-none bg-transparent" /></div>
                    <div class="flex justify-between border-b border-gray-300"><span>Customer:</span> <input v-model="form.metadata.customer" class="font-bold text-right outline-none bg-transparent" /></div>
                    <div class="flex justify-between border-b border-gray-300"><span>Total Theoretical Weight (kg):</span> <input type="number" v-model="form.metadata.theoWeight" class="font-bold text-right outline-none bg-transparent" /></div>
                </div>
            </div>

            <div class="mb-6 border border-black p-2 text-[10px] grid grid-cols-4 gap-x-4 gap-y-2 uppercase font-bold">
                <div class="flex justify-between border-b border-black"><span>Machine ID to be used:</span> <input v-model="form.env.machineId" class="w-12 text-center outline-none" /></div>
                <div class="flex justify-between border-b border-black"><span>Room temperature (56-86°F):</span> <input v-model="form.env.temp" class="w-12 text-center outline-none" /></div>
                <div class="flex justify-between border-b border-black"><span>Machine cleaning checked by:</span> <input v-model="form.env.machineCheckBy" class="w-12 text-center outline-none" /></div>
                <div class="flex justify-between border-b border-black"><span>Date:</span> <input v-model="form.env.machineCheckDate" class="w-16 text-center outline-none" /></div>
                <div class="flex justify-between border-b border-black"><span>Room #:</span> <input v-model="form.env.roomNo" class="w-12 text-center outline-none" /></div>
                <div class="flex justify-between border-b border-black"><span>Room humidity (&lt;75%):</span> <input v-model="form.env.humidity" class="w-12 text-center outline-none" /></div>
                <div class="flex justify-between border-b border-black"><span>Room cleaning checked by:</span> <input v-model="form.env.roomCheckBy" class="w-12 text-center outline-none" /></div>
                <div class="flex justify-between border-b border-black"><span>Date:</span> <input v-model="form.env.roomCheckDate" class="w-16 text-center outline-none" /></div>
            </div>

            <table class="w-full border-collapse border border-black text-[10px] mb-6">
                <thead>
                    <tr class="bg-gray-100 uppercase font-bold text-center">
                        <th class="border border-black p-1 w-8">#</th>
                        <th class="border border-black p-1">Procedure</th>
                        <th class="border border-black p-1 w-24">Done</th>
                        <th class="border border-black p-1 w-32">Date</th>
                        <th class="border border-black p-1 w-24">Checked By</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(step, index) in form.steps" :key="index" class="border-b border-black">
                        <td class="border-r border-black p-2 text-center font-bold">{{ step.id }}</td>
                        <td class="border-r border-black p-2">
                            <div class="font-semibold">{{ step.descEn }} /</div>
                            <div class="italic text-gray-600">{{ step.descEs }}</div>

                            <div v-if="step.hasTime" class="mt-2 flex items-center space-x-4 border-t pt-1 border-dotted border-gray-400">
                                <div>Mix <input v-model="step.mixMinutes" class="w-8 border-b border-black text-center" /> minutes</div>
                                <div>Start Time <input type="text" v-model="step.startTime" class="w-16 border border-black text-center" /></div>
                                <div>Finish Time <input type="text" v-model="step.finishTime" class="w-16 border border-black text-center" /></div>
                            </div>
                        </td>
                        <td class="border-r border-black p-2"><input v-model="step.done" class="w-full text-center outline-none uppercase font-bold text-blue-800" /></td>
                        <td class="border-r border-black p-2"><input v-model="step.date" class="w-full text-center outline-none" /></td>
                        <td class="p-2"><input v-model="step.checkedBy" class="w-full text-center outline-none uppercase italic" /></td>
                    </tr>
                </tbody>
            </table>

            <div class="grid grid-cols-2 gap-8">
                <div>
                    <h3 class="font-bold text-[10px] mb-1 uppercase underline">Record actual total weight (kg) / Anotar el peso total (kg)</h3>
                    <table class="w-full border border-black text-[10px] text-center">
                        <tr class="bg-gray-100 font-bold uppercase">
                            <td class="border border-black p-1">Container #</td>
                            <td class="border border-black p-1">Tare (kg)</td>
                            <td class="border border-black p-1">Net Weight (kg)</td>
                            <td class="border border-black p-1">Done</td>
                            <td class="border border-black p-1">Date</td>
                            <td class="border border-black p-1">Checked By</td>
                        </tr>
                        <tr v-for="(cont, idx) in form.containers" :key="idx">
                            <td class="border border-black p-1 font-bold">{{ idx + 1 }}</td>
                            <td class="border border-black p-1"><input v-model="cont.tare" class="w-full text-center outline-none" /></td>
                            <td class="border border-black p-1"><input v-model="cont.net" class="w-full text-center outline-none font-bold" /></td>
                            <td class="border border-black p-1"><input v-model="cont.done" class="w-full text-center outline-none uppercase" /></td>
                            <td class="border border-black p-1"><input v-model="cont.date" class="w-full text-center outline-none" /></td>
                            <td class="border border-black p-1"><input v-model="cont.checked" class="w-full text-center outline-none uppercase" /></td>
                        </tr>
                        <tr class="font-bold bg-blue-50">
                            <td colspan="2" class="border border-black p-1 text-right">TOTAL ACTUAL:</td>
                            <td class="border border-black p-1 text-blue-700 underline">{{ totalActualWeight }} kg</td>
                            <td colspan="3" class="border border-black"></td>
                        </tr>
                    </table>
                </div>
            </div>

            <div class="mt-6 grid grid-cols-2 gap-4 text-[10px] font-mono border-t border-black pt-4">
                <div class="flex justify-between border-b border-black pb-1">
                    <span>Done by:</span> <input v-model="form.sigs.doneBy" class="outline-none w-1/2" /> <span>Date:</span> <input v-model="form.sigs.doneDate" class="outline-none w-20" />
                </div>
                <div class="flex justify-between border-b border-black pb-1">
                    <span>Approved by:</span> <input v-model="form.sigs.approvedBy" class="outline-none w-1/2" /> <span>Date:</span> <input v-model="form.sigs.approvedDate" class="outline-none w-20" />
                </div>
            </div>

            <div class="mt-8 flex justify-end space-x-4 print:hidden">
                <button @click="resetForm" class="px-4 py-2 text-red-600 border border-red-600 font-bold uppercase text-xs">Reset</button>
                <button @click="saveForm" class="px-8 py-2 bg-blue-900 text-white font-bold uppercase text-xs shadow-lg">Save Blending Record</button>
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
        product: 'GLYCOL',
        customer: 'SERGIO',
        lotNo: '040426',
        qtyMl: 72,
        theoWeight: 50
    },
    env: {
        machineId: '103',
        roomNo: '2',
        temp: '70',
        humidity: '45',
        machineCheckBy: 'MC',
        machineCheckDate: '4/4/26',
        roomCheckBy: 'MC',
        roomCheckDate: '4/4/26'
    },
    steps: [
        { id: 1, descEn: 'Ensure that all the RM are labeled and present', descEs: 'Asegurarse quetodos los ingredientes esten presentes y etiqueteados', done: 'DPG', date: '04/04/26', checkedBy: 'MC' },
        { id: 2, descEn: 'Add RM0026A Vitamin C powder into blender', descEs: 'Adicionar RM0026A Vitamin C powder en el mezclador', done: 'DPG', date: '04/04/26', checkedBy: 'MC' },
        { id: 3, descEn: 'Add RM0177A Berberine - Berbevis into blender', descEs: 'Adicionar RM0177A Berberine - Berbevis en el mezclador', done: 'DPG', date: '04/04/26', checkedBy: 'MC' },
        { id: 4, descEn: 'Add RM0102 Garlic into blender', descEs: 'Adicionar RM0102 Garlic en el mezclador', done: 'DPG', date: '04/04/26', checkedBy: 'MC' },
        { id: 5, descEn: 'Add RM0409 Rose hips into blender', descEs: 'Adicionar RM0409 Rose hips en el mezclador', done: 'DPG', date: '04/04/26', checkedBy: 'MC' },
        { id: 6, descEn: 'Add RM0007 Rice into blender', descEs: 'Adicionar RM0007 Arroz en el mezclador', done: 'DPG', date: '04/04/26', checkedBy: 'MC' },
        { id: 7, descEn: 'Mix', descEs: 'Mezclar', hasTime: true, mixMinutes: '20', startTime: '10:30', finishTime: '10:50', done: 'DPG', date: '04/04/26', checkedBy: 'MC' },
        { id: 8, descEn: 'Add RM0004 Magnesium Stearate and mix', descEs: 'Adicionar RM0004 Magnesium Stearate y mezclar', hasTime: true, mixMinutes: '5', startTime: '10:55', finishTime: '11:00', done: 'DPG', date: '04/04/26', checkedBy: 'MC' },
        { id: 9, descEn: 'Empty the product into polyethylene bags, weigh and identify each one', descEs: 'Descargar el producto mezclado en bolsa de polietileno, pesar e identificar cada una', done: 'DPG', date: '04/04/26', checkedBy: 'MC' }
    ],
    containers: [{ tare: '5.5', net: '49.8', done: 'DPG', date: '04/04/26', checked: 'MC' }],
    sigs: {
        doneBy: 'VJ',
        doneDate: '03/25/26',
        approvedBy: 'ELV',
        approvedDate: '03/25/26'
    }
});

const totalActualWeight = computed(() => {
    return form.containers.reduce((sum, c) => sum + (Number(c.net) || 0), 0).toFixed(1);
});

const resetForm = () => {
    if (confirm('Clear form?')) location.reload();
};

const saveForm = () => {
    console.log('Syncing to MongoDB Atlas...', JSON.parse(JSON.stringify(form)));
    alert('Blending batch recorded.');
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
input:focus {
    background-color: #fff9c4;
}
</style>
