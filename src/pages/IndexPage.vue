<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { QTableProps } from 'quasar';
import { useIndexPage } from 'src/stores/indexPage';
import { storeToRefs } from 'pinia';
import { useCloned } from '@vueuse/core';
import { useQuasar } from 'quasar';

// interface btnType {
//   label: string;
//   icon: string;
//   status: string;
// }
const $q = useQuasar();

const store_indexPage = useIndexPage();
const { data_get } = storeToRefs(store_indexPage);
const { getTest, postTest, deleteTest } = store_indexPage;

onMounted(async () => {
  await refresh();
});

async function refresh() {
  await getTest();
  blockData.value = data_get.value.data;
}

const blockData = ref();
const init_tempData = {
  name: '',
  age: '',
};
const { cloned: tempData, sync: initTempData } = useCloned(init_tempData);

const nameRef = ref(null);
const ageRef = ref(null);
const status = ref('post');

const onSubmit = async () => {
  nameRef.value.validate();
  ageRef.value.validate();

  if (nameRef.value.hasError || ageRef.value.hasError) return;

  if (status.value === 'post') {
    await postData();
  } else {
    await putData();
  }
};

async function postData() {
  const result = await postTest(tempData.value);

  if (result) {
    blockData.value.push(tempData.value);
    initTempData();
  }
}

async function putData() {
  console.log('tempData :>> ', tempData.value);
}

async function handleClickOption(btn, data) {
  if (btn.status === 'delete') {
    $q.dialog({
      title: '提示',
      message: '是否確定刪除該筆資料',
      cancel: true,
      persistent: true,
    })
      .onOk(async() => {
        const res = await deleteTest(data.id);
        if (res.data) refresh();
      })
  }
}

const tableConfig = ref([
  {
    label: '姓名',
    name: 'name',
    field: 'name',
    align: 'left',
  },
  {
    label: '年齡',
    name: 'age',
    field: 'age',
    align: 'left',
  },
]);
const tableButtons = ref([
  {
    label: '編輯',
    icon: 'edit',
    status: 'edit',
  },
  {
    label: '刪除',
    icon: 'delete',
    status: 'delete',
  },
]);
</script>

<template>
  <q-page class="row q-pt-xl">
    <div class="full-width q-px-xl">
      <form @submit.prevent.stop="onSubmit" class="q-mb-xl">
        <q-input
          ref="nameRef"
          v-model="tempData.name"
          label="姓名"
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
        />
        <q-input
          ref="ageRef"
          type="number"
          v-model="tempData.age"
          label="年齡"
          :rules="[
            (val) => (val !== null && val !== '') || 'Please type your age',
            (val) => (val > 0 && val < 170) || 'Please type a real age',
          ]"
        />
        <q-input
          v-model="tempData.age"
          label="年齡"
          :rules="[(val) => !!val || 'Field is required']"
        />
        <q-btn type="submit" color="primary" class="q-mt-md">新增</q-btn>
      </form>

      <q-table
        flat
        bordered
        ref="tableRef"
        :rows="blockData"
        :columns="(tableConfig as QTableProps['columns'])"
        row-key="id"
        hide-pagination
        separator="cell"
        :rows-per-page-options="[0]"
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
            <q-th></q-th>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <!-- <pre>{{ props }}</pre> -->
          <q-tr :props="props">
            <q-td
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              style="min-width: 120px"
            >
              <div>{{ col.value }}</div>
            </q-td>
            <q-td class="text-right" auto-width v-if="tableButtons.length > 0">
              <q-btn
                @click="handleClickOption(btn, props.row)"
                v-for="(btn, index) in tableButtons"
                :key="index"
                size="sm"
                color="grey-6"
                round
                dense
                :icon="btn.icon"
                class="q-ml-md"
                padding="5px 5px"
              >
                <q-tooltip
                  transition-show="scale"
                  transition-hide="scale"
                  anchor="top middle"
                  self="bottom middle"
                  :offset="[10, 10]"
                >
                  {{ btn.label }}
                </q-tooltip>
              </q-btn>
            </q-td>
          </q-tr>
        </template>

        <template v-slot:no-data="{ icon }">
          <div
            class="full-width row flex-center items-center text-primary q-gutter-sm"
            style="font-size: 18px"
          >
            <q-icon size="2em" :name="icon" />
            <span> 無相關資料 </span>
          </div>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<style lang="scss" scoped>
.q-table th {
  font-size: 20px;
  font-weight: bold;
}

.q-table tbody td {
  font-size: 18px;
}
</style>
