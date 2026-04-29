<script setup>
import { computed, reactive } from 'vue';

const API_URL = 'https://bfgpekkkg4egxr7i2tjwtlvaim0riqdq.lambda-url.us-east-1.on.aws/ ';

const saveToAWS = async () => {
    if (!state.product.quote) return alert('Quote ID required');
    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(state)
        });
        if (res.ok) alert('Quote Saved to DynamoDB');
    } catch (e) {
        alert('Save Failed');
    }
};

const loadFromAWS = async () => {
    const id = prompt('Quote ID:');
    if (!id) return;
    try {
        const res = await fetch(`${API_URL}/${id}`);
        const data = await res.json();
        if (data) Object.assign(state, data);
        else alert('Not Found');
    } catch (e) {
        alert('Load Failed');
    }
};

const state = reactive({
    product: {
        quote: '',
        name: '',
        company: '',
        quantityM: 0,
        qtyPerBottle: 0,
        quantityBottles: 0
    },

    packaging: {
        bottleDescription: '',
        capDescription: '',
        neckBandDescription: '',
        cotton: '',
        silica: '',
        label: '',
        innerBox: '',
        masterBoxQty: 0,
        masterBoxPack: 0,
        bottlesPerMaster: 0
    },

    packagingCosts: {
        capsuleM: 0,
        bottle: 0,
        cap: 0,
        neckBand: 0,
        cotton: 0,
        silica: 0,
        label: 0,
        overhead: 0,
        masterBox: 0,
        innerBox: 0
    },

    capsule: {
        size: '',
        color: '',
        emptyCapsule: '',
        weightMg: 0
    },

    fees: {
        sellingMarginPacking: 0,
        sellingMarginBulk: 0,
        encapsulationLabor: 0,
        encapOverhead: 0,
        labFee: 0,
        packagingLabor: 0
    },

    materials: [
        {
            mgDosage: 0,
            mgBracket: 0,
            mgUnit: 0,
            rwCode: '',
            name: '',
            totalKg: 0,
            priceKg: 0,
            totalPrice: 0,
            bracket: 0,
            wwPercent: 0
        }
    ],

    facts: {
        servingSizeQty: '',
        servingSizeUnit: '',
        servingsPer: '',
        items: [
            {
                name: '',
                amount: '',
                dv: ''
            }
        ],
        otherIngredients: '',
        directionsLine1: '',
        directionsLine2: ''
    }
});

const totalKg = computed(() => {
    return state.materials.reduce((sum, item) => {
        return sum + Number(item.totalKg || 0);
    }, 0);
});

const totalRawMaterialPrice = computed(() => {
    return state.materials.reduce((sum, item) => {
        return sum + Number(item.totalPrice || 0);
    }, 0);
});

const totalWwPercent = computed(() => {
    return state.materials.reduce((sum, item) => {
        return sum + Number(item.wwPercent || 0);
    }, 0);
});

const rawMaterialKg = computed(() => totalKg.value);

const encapsulatedKg = computed(() => {
    return totalKg.value + Number(state.capsule.weightMg || 0) / 1000000;
});

const unitWeightMg = computed(() => {
    return state.materials.reduce((sum, item) => {
        return sum + Number(item.mgUnit || 0);
    }, 0);
});

// -=============================================================================================-
// NEED TO FIX BULK COST INFO
const bulkCost = computed(() => totalRawMaterialPrice.value);

// NEED TO FIX BULK PRRICE INFO
const bulkSellingPrice = computed(() => {
    const margin = Number(state.fees.sellingMarginBulk || 0);
    return bulkCost.value + bulkCost.value * margin;
});
// -=============================================================================================-

const bottleCost = computed(() => {
    return (
        Number(state.packagingCosts.bottle || 0) +
        Number(state.packagingCosts.cap || 0) +
        Number(state.packagingCosts.neckBand || 0) +
        Number(state.packagingCosts.cotton || 0) +
        Number(state.packagingCosts.silica || 0) +
        Number(state.packagingCosts.label || 0) +
        Number(state.packagingCosts.innerBox || 0) +
        Number(state.packagingCosts.masterBox || 0) +
        Number(state.fees.packagingLabor || 0)
    );
});

const bottleSellingPrice = computed(() => {
    const margin = Number(state.fees.sellingMarginPacking || 0);
    return bottleCost.value + bottleCost.value * margin;
});

function addMaterial() {
    state.materials.push({
        mgDosage: 0,
        mgBracket: 0,
        mgUnit: 0,
        rwCode: '',
        name: '',
        totalKg: 0,
        priceKg: 0,
        totalPrice: 0,
        bracket: 0,
        wwPercent: 0
    });
}

function addFactRow() {
    state.facts.items.push({
        name: '',
        amount: '',
        dv: ''
    });
}

function removeMaterial(index) {
    state.materials.splice(index, 1);
}

function removeFactRow(index) {
    state.facts.items.splice(index, 1);
}
</script>

<template>
    <div class="excel-page">
        <div class="excel-sheet">
            <div class="toolbar">
                <button type="button" @click="loadFromAWS">Load</button>
                <button type="button" class="save-btn" @click="saveToAWS">Save to AWS</button>
            </div>

            <!-- GROUP 1: QUOTE / PRODUCT / PRICING -->
            <section class="box">
                <h3>Quote / Product / Pricing</h3>

                <div class="group-grid three-col">
                    <div class="field">
                        <label>Quote</label>
                        <input v-model="state.product.quote" />
                    </div>

                    <div class="field">
                        <label>Product Name</label>
                        <input v-model="state.product.name" />
                    </div>

                    <div class="field">
                        <label>Company</label>
                        <input v-model="state.product.company" />
                    </div>

                    <div class="field">
                        <label>Quantity (M)</label>
                        <input v-model.number="state.product.quantityM" type="number" />
                    </div>

                    <div class="field">
                        <label>Qty per Bottle</label>
                        <input v-model.number="state.product.qtyPerBottle" type="number" />
                    </div>

                    <div class="field">
                        <label>Quantity Bottles</label>
                        <input v-model.number="state.product.quantityBottles" type="number" />
                    </div>

                    <div class="field result-field">
                        <label>Bulk Cost</label>
                        <div class="result">{{ bulkCost.toFixed(2) }}</div>
                    </div>

                    <div class="field result-field">
                        <label>Bulk Selling Price</label>
                        <div class="result">{{ bulkSellingPrice.toFixed(2) }}</div>
                    </div>

                    <div class="field result-field">
                        <label>Bottle Selling Price</label>
                        <div class="result">{{ bottleSellingPrice.toFixed(2) }}</div>
                    </div>

                    <div class="field result-field">
                        <label>Bottle Cost</label>
                        <div class="result">{{ bottleCost.toFixed(2) }}</div>
                    </div>
                </div>
            </section>

            <!-- GROUP 2: PACKAGING COMPONENTS -->
            <section class="box">
                <h3>Packaging Components</h3>

                <div class="component-grid">
                    <div class="field wide">
                        <label>Bottle Description</label>
                        <input v-model="state.packaging.bottleDescription" />
                    </div>

                    <div class="field">
                        <label>Bottle Cost</label>
                        <input v-model.number="state.packagingCosts.bottle" type="number" />
                    </div>

                    <div class="field wide">
                        <label>Cap Description</label>
                        <input v-model="state.packaging.capDescription" />
                    </div>

                    <div class="field">
                        <label>Cap Cost</label>
                        <input v-model.number="state.packagingCosts.cap" type="number" />
                    </div>

                    <div class="field wide">
                        <label>Neck Band</label>
                        <input v-model="state.packaging.neckBandDescription" />
                    </div>

                    <div class="field">
                        <label>Neck Band Cost</label>
                        <input v-model.number="state.packagingCosts.neckBand" type="number" />
                    </div>

                    <div class="field wide">
                        <label>Cotton</label>
                        <input v-model="state.packaging.cotton" />
                    </div>

                    <div class="field">
                        <label>Cotton Cost</label>
                        <input v-model.number="state.packagingCosts.cotton" type="number" />
                    </div>

                    <div class="field wide">
                        <label>Silica</label>
                        <input v-model="state.packaging.silica" />
                    </div>

                    <div class="field">
                        <label>Silica Cost</label>
                        <input v-model.number="state.packagingCosts.silica" type="number" />
                    </div>

                    <div class="field wide">
                        <label>Label</label>
                        <input v-model="state.packaging.label" />
                    </div>

                    <div class="field">
                        <label>Label Cost</label>
                        <input v-model.number="state.packagingCosts.label" type="number" />
                    </div>

                    <div class="field wide">
                        <label>Inner Box</label>
                        <input v-model="state.packaging.innerBox" />
                    </div>

                    <div class="field">
                        <label>Inner Box Cost</label>
                        <input v-model.number="state.packagingCosts.innerBox" type="number" />
                    </div>

                    <div class="field wide">
                        <label>Master Box Qty</label>
                        <input v-model.number="state.packaging.masterBoxQty" type="number" />
                    </div>

                    <div class="field">
                        <label>Master Box Cost</label>
                        <input v-model.number="state.packagingCosts.masterBox" type="number" />
                    </div>

                    <div class="field wide">
                        <label>Bottles Per Master</label>
                        <input v-model.number="state.packaging.bottlesPerMaster" type="number" />
                    </div>
                </div>
            </section>

            <!-- GROUP 3: CAPSULE INFORMATION -->
            <section class="box">
                <h3>Capsule Information</h3>

                <div class="group-grid four-col">
                    <div class="field">
                        <label>Capsule (M)</label>
                        <input v-model.number="state.packagingCosts.capsuleM" type="number" />
                    </div>

                    <div class="field">
                        <label>Capsule Size</label>
                        <input v-model="state.capsule.size" />
                    </div>

                    <div class="field">
                        <label>Capsule Color</label>
                        <input v-model="state.capsule.color" />
                    </div>

                    <div class="field">
                        <label>Empty Capsule</label>
                        <input v-model="state.capsule.emptyCapsule" />
                    </div>

                    <div class="field">
                        <label>Capsule Weight mg</label>
                        <input v-model.number="state.capsule.weightMg" type="number" />
                    </div>
                </div>
            </section>

            <!-- GROUP 4: WEIGHT CALCULATIONS -->
            <section class="box">
                <h3>Weight Calculations</h3>

                <div class="group-grid three-col">
                    <div class="field result-field">
                        <label>Total Theoretical Weight Raw Materials (Kg)</label>
                        <div class="result">{{ rawMaterialKg.toFixed(3) }}</div>
                    </div>

                    <div class="field result-field">
                        <label>Total Theoretical Weight Encapsulated (Kg)</label>
                        <div class="result">{{ encapsulatedKg.toFixed(3) }}</div>
                    </div>

                    <div class="field result-field">
                        <label>Unit Weight (mg)</label>
                        <div class="result">{{ unitWeightMg.toFixed(3) }}</div>
                    </div>
                </div>
            </section>

            <!-- GROUP 5: LABOR / OVERHEAD / FEES -->
            <section class="box">
                <h3>Labor / Overhead / Fees</h3>

                <div class="group-grid three-col">
                    <div class="field">
                        <label>Selling Margin Packing</label>
                        <input v-model.number="state.fees.sellingMarginPacking" type="number" />
                    </div>

                    <div class="field">
                        <label>Selling Margin Bulk</label>
                        <input v-model.number="state.fees.sellingMarginBulk" type="number" />
                    </div>

                    <div class="field">
                        <label>Encapsulation Labor (M)</label>
                        <input v-model.number="state.fees.encapsulationLabor" type="number" />
                    </div>

                    <div class="field">
                        <label>Encap Overhead Labor (M)</label>
                        <input v-model.number="state.fees.encapOverhead" type="number" />
                    </div>

                    <div class="field">
                        <label>Overhead</label>
                        <input v-model.number="state.packagingCosts.overhead" type="number" />
                    </div>

                    <div class="field">
                        <label>Lab Fee</label>
                        <input v-model.number="state.fees.labFee" type="number" />
                    </div>

                    <div class="field">
                        <label>Packaging Labor</label>
                        <input v-model.number="state.fees.packagingLabor" type="number" />
                    </div>
                </div>
            </section>

            <!-- GROUP 6: RAW MATERIALS -->
            <section class="box">
                <div class="section-header">
                    <h3>Raw Materials</h3>
                    <button type="button" @click="addMaterial">+ Add Raw Material</button>
                </div>

                <table class="excel-table">
                    <thead>
                        <tr>
                            <th>mg/dosage</th>
                            <th>mg/[ ]</th>
                            <th>mg/unit</th>
                            <th>RW Code</th>
                            <th>Raw Material Description</th>
                            <th>Total Kg</th>
                            <th>Price/Kg</th>
                            <th>Total Price</th>
                            <th>[ ]</th>
                            <th>W/W %</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="(item, index) in state.materials" :key="index">
                            <td><input v-model.number="item.mgDosage" type="number" /></td>
                            <td><input v-model.number="item.mgBracket" type="number" /></td>
                            <td><input v-model.number="item.mgUnit" type="number" /></td>
                            <td><input v-model="item.rwCode" /></td>
                            <td><input v-model="item.name" /></td>
                            <td><input v-model.number="item.totalKg" type="number" /></td>
                            <td><input v-model.number="item.priceKg" type="number" /></td>
                            <td><input v-model.number="item.totalPrice" type="number" /></td>
                            <td><input v-model.number="item.bracket" type="number" /></td>
                            <td><input v-model.number="item.wwPercent" type="number" /></td>
                            <td>
                                <button type="button" class="delete-btn" @click="removeMaterial(index)">×</button>
                            </td>
                        </tr>
                    </tbody>

                    <tfoot>
                        <tr>
                            <td colspan="5">Total</td>
                            <td>{{ totalKg.toFixed(3) }}</td>
                            <td></td>
                            <td>{{ totalRawMaterialPrice.toFixed(2) }}</td>
                            <td></td>
                            <td>{{ totalWwPercent.toFixed(2) }}</td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </section>

            <!-- GROUP 7: SUPPLEMENT FACTS -->
            <section class="facts-box">
                <h1>Supplement Facts:</h1>

                <div class="facts-row">
                    <label>Serving Size:</label>
                    <input v-model="state.facts.servingSizeQty" />
                    <input v-model="state.facts.servingSizeUnit" />
                </div>

                <div class="facts-row">
                    <label>Servings Per Container:</label>
                    <input v-model="state.facts.servingsPer" />
                </div>

                <div class="facts-header">
                    <span>Amount per Serving</span>
                    <span>%DV</span>
                </div>

                <div v-for="(fact, index) in state.facts.items" :key="index" class="facts-item">
                    <input v-model="fact.name" />
                    <input v-model="fact.amount" />
                    <span>mg</span>
                    <input v-model="fact.dv" />
                    <button type="button" class="delete-btn" @click="removeFactRow(index)">×</button>
                </div>

                <button type="button" class="add-fact-btn" @click="addFactRow">+ Add Label Row</button>

                <p class="daily">* Daily Value not established</p>

                <div class="other">
                    <label>Other Ingredients:</label>
                    <input v-model="state.facts.otherIngredients" />
                </div>

                <div class="directions">
                    <input v-model="state.facts.directionsLine1" />
                    <input v-model="state.facts.directionsLine2" />
                </div>
            </section>
        </div>
    </div>
</template>

<style scoped>
.excel-page {
    min-height: 100vh;
    background: radial-gradient(circle at top left, #dbeafe 0, transparent 32%), linear-gradient(135deg, #f8fafc, #eef2ff);
    padding: 28px;
    overflow-x: auto;
    font-family: Inter, Arial, sans-serif;
    color: #111827;
}

.excel-sheet {
    width: 1180px;
    margin: 0 auto;
    background: #ffffff;
    padding: 26px;
    border-radius: 18px;
    border: 1px solid #e5e7eb;
    box-shadow: 0 24px 60px rgba(15, 23, 42, 0.12);
}

.toolbar {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-bottom: 18px;
}

.toolbar button,
.section-header button,
.add-fact-btn {
    border: none;
    background: #f1f5f9;
    color: #334155;
    padding: 9px 15px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 800;
    cursor: pointer;
    transition: 0.15s ease;
}

.toolbar button:hover,
.section-header button:hover,
.add-fact-btn:hover {
    background: #e2e8f0;
    transform: translateY(-1px);
}

.toolbar .save-btn {
    background: #16a34a;
    color: #ffffff;
    box-shadow: 0 8px 18px rgba(22, 163, 74, 0.24);
}

.toolbar .save-btn:hover {
    background: #15803d;
}

.box {
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 18px;
    margin-bottom: 18px;
    background: linear-gradient(180deg, #ffffff, #f8fafc);
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
}

.box h3,
.section-header h3 {
    margin: 0 0 14px;
    font-size: 13px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #0f172a;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 9px;
}

.group-grid {
    display: grid;
    gap: 14px;
}

.three-col {
    grid-template-columns: repeat(3, 1fr);
}

.four-col {
    grid-template-columns: repeat(4, 1fr);
}

.component-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 12px 16px;
}

.field {
    border: 1px solid #e5e7eb;
    border-radius: 14px;
    padding: 10px;
    background: #ffffff;
    transition: 0.15s ease;
}

.field:hover {
    border-color: #bfdbfe;
    box-shadow: 0 8px 18px rgba(37, 99, 235, 0.08);
}

.field.wide {
    background: #ffffff;
}

label {
    display: block;
    margin-bottom: 5px;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #64748b;
}

input {
    width: 100%;
    border: 1px solid #cbd5e1;
    border-radius: 10px;
    padding: 8px 9px;
    outline: none;
    font-size: 13px;
    background: #ffffff;
    box-sizing: border-box;
    transition: 0.15s ease;
}

input:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14);
}

.result {
    min-height: 35px;
    border: 1px solid #bfdbfe;
    border-radius: 10px;
    padding: 8px 9px;
    background: #eff6ff;
    color: #1e3a8a;
    font-weight: 900;
    text-align: right;
    box-sizing: border-box;
}

.result-field {
    background: linear-gradient(180deg, #eff6ff, #ffffff);
    border-color: #bfdbfe;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.section-header h3 {
    margin: 0;
    border-bottom: none;
}

.excel-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-size: 11px;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    overflow: hidden;
    background: #ffffff;
}

.excel-table th {
    background: #f1f5f9;
    color: #334155;
    font-weight: 900;
    text-align: center;
    padding: 9px 7px;
    border-bottom: 1px solid #cbd5e1;
    border-right: 1px solid #e5e7eb;
}

.excel-table td {
    padding: 6px;
    border-bottom: 1px solid #f1f5f9;
    border-right: 1px solid #f1f5f9;
}

.excel-table tbody tr:hover td {
    background: #f8fafc;
}

.excel-table td:last-child,
.excel-table th:last-child {
    border-right: none;
}

.excel-table tfoot td {
    background: #eef2ff;
    color: #1e3a8a;
    font-weight: 900;
}

.excel-table input {
    border: 1px solid transparent;
    padding: 6px;
    background: transparent;
    border-radius: 8px;
}

.excel-table input:focus {
    background: #ffffff;
    border-color: #93c5fd;
}

.delete-btn {
    border: none;
    background: #fee2e2;
    color: #b91c1c;
    width: 24px;
    height: 24px;
    border-radius: 999px;
    font-size: 16px;
    font-weight: 900;
    cursor: pointer;
    line-height: 1;
}

.delete-btn:hover {
    background: #fecaca;
}

.facts-box {
    width: 560px;
    margin: 24px auto 0;
    border: 2px solid #020617;
    border-radius: 12px;
    padding: 14px;
    background: #ffffff;
    box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
}

.facts-box h1 {
    font-family:
        Arial Black,
        Arial,
        sans-serif;
    font-size: 25px;
    margin: 0;
    border-bottom: 5px solid #000000;
    padding-bottom: 4px;
}

.facts-row {
    display: grid;
    grid-template-columns: 190px 90px 130px;
    gap: 8px;
    padding: 7px 0;
}

.facts-header {
    display: flex;
    justify-content: space-between;
    border-top: 3px solid #000000;
    border-bottom: 1px solid #000000;
    padding: 6px 0;
    font-weight: 900;
}

.facts-item {
    display: grid;
    grid-template-columns: 1fr 80px 35px 60px 24px;
    gap: 5px;
    align-items: center;
    border-bottom: 1px solid #cbd5e1;
    padding: 5px 0;
}

.facts-box input {
    border: none;
    border-bottom: 1px solid #94a3b8;
    border-radius: 0;
    padding: 5px 3px;
}

.facts-box input:focus {
    box-shadow: none;
    border-bottom-color: #2563eb;
}

.daily {
    font-size: 11px;
    margin: 7px 0;
}

.other {
    margin-top: 9px;
    font-weight: 800;
}

.other input {
    width: 390px;
}

.directions {
    margin-top: 16px;
}

.directions input {
    display: block;
    margin-top: 6px;
}
</style>
