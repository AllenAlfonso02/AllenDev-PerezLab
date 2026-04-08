<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="New Entry" icon="pi pi-plus" class="mr-2" @click="openNew" />
                </template>

                <template #end>
                    <Button label="Export CSV" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                </template>
            </Toolbar>

            <DataTable
                ref="dt"
                v-model:selection="selectedItems"
                :value="inventory"
                dataKey="RM"
                :paginator="true"
                :rows="10"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} items"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Manage Raw Materials</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </IconField>
                    </div>
                </template>

                <Column field="RM" header="RM Code" sortable style="min-width: 8rem"></Column>
                <Column field="DESCRIPTION" header="Description" sortable style="min-width: 16rem"></Column>
                <Column field="VENDOR" header="Vendor" sortable style="min-width: 10rem"></Column>
                <Column field="LOCATION" header="Location" sortable style="min-width: 8rem"></Column>
                <Column field="CURRENT_INV_KG" header="Stock (KG)" sortable style="min-width: 8rem">
                    <template #body="slotProps">
                        {{ slotProps.data.CURRENT_INV_KG?.toFixed(2) }}
                    </template>
                </Column>
                <Column field="DATE" header="Last Updated" sortable style="min-width: 10rem"></Column>

                <Column :exportable="false" style="min-width: 8rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" variant="outlined" rounded class="mr-2" @click="editItem(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="itemDialog" :style="{ width: '450px' }" header="Inventory Details" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="description" class="block font-bold mb-3">Description</label>
                    <InputText id="description" v-model.trim="item.DESCRIPTION" required="true" autofocus :invalid="submitted && !item.DESCRIPTION" fluid />
                    <small v-if="submitted && !item.DESCRIPTION" class="text-red-500">Description is required.</small>
                </div>
                <div>
                    <label for="vendor" class="block font-bold mb-3">Vendor</label>
                    <InputText id="vendor" v-model="item.VENDOR" fluid />
                </div>
                <div>
                    <label for="location" class="block font-bold mb-3">Location</label>
                    <InputText id="location" v-model="item.LOCATION" placeholder="e.g. 1A" fluid />
                </div>

                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-12">
                        <label for="quantity" class="block font-bold mb-3">Initial Quantity (KG) | {{ item.CURRENT_INV_KG?.toFixed(2) }}</label>
                        <InputNumber id="quantity" v-model="item.CURRENT_INV_KG" :minFractionDigits="2" fluid />
                    </div>
                </div>
                <!-- <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-12">
                        <label for="quantity" class="block font-bold mb-3">Initial Quantity (KG) </label>
                        <InputNumber id="quantity" v-model="item.CURRENT_INV_KG" :minFractionDigits="2" fluid :disabled="true" />
                    </div>
                </div> -->
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" :loading="apiLoading" @click="saveItem" />
            </template>
        </Dialog>
    </div>
</template>

<script setup>
import useTabledata from '@/composables/getlogic/getTabledata';
import getUpdateInventory from '@/composables/postlogic/postInventoryData';
import { useTableStore } from '@/stores/useTableStore';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref } from 'vue';

const { getTabledataFunc } = useTabledata();
const { postUpdateInventory } = getUpdateInventory();

// Pinia store
const tableStore = useTableStore();
const tableInventory = computed(() => tableStore.inputdatatable ?? []);

const toast = useToast();
const dt = ref();
const inventory = ref([]);
const itemDialog = ref(false);
const item = ref({});
const ACTION = ref('');

const selectedItems = ref();
const submitted = ref(false);
const apiLoading = ref(false);

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

onMounted(async () => {
    await fetchInventory();
});
const fetchInventory = async () => {
    try {
        await getTabledataFunc();
        inventory.value = tableInventory.value;
    } catch (err) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load inventory', life: 3000 });
    }
};

const openNew = () => {
    item.value = { CURRENT_INV_KG: 0 };
    submitted.value = false;
    ACTION.value = 'create';
    itemDialog.value = true;
};

const hideDialog = () => {
    itemDialog.value = false;
    submitted.value = false;
};

const saveItem = async () => {
    console.log('Saving item:', item.value);
    submitted.value = true;

    if (item.value.DESCRIPTION?.trim()) {
        apiLoading.value = true;
        try {
            console.log('item value', item.value);
            // Prepare payload for your POST Lambda
            const payload = {
                ACTION: ACTION.value, // Use create if no RM exists
                RM: item.value.RM || null, // Added here
                VENDOR: item.value.VENDOR,
                DESCRIPTION: item.value.DESCRIPTION,
                LOCATION: item.value.LOCATION,
                CURRENT_INV_KG: item.value.CURRENT_INV_KG,
                DATE: new Date().toLocaleDateString(),
                name: 'Web Portal'
            };
            await postUpdateInventory(payload);

            // Refresh table and close
            await fetchInventory();
            console.log(inventory.value);
            itemDialog.value = false;
            item.value = {};
            apiLoading.value = false;
        } catch (err) {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Save failed', life: 3000 });
        } finally {
            apiLoading.value = false;
        }
    }
};

const editItem = async (data) => {
    item.value = { ...data };
    itemDialog.value = true;
    ACTION.value = 'update';
};

const exportCSV = () => {
    dt.value.exportCSV();
};
</script>
