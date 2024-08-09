import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useCloned } from '@vueuse/core';

import { apiDeleteTest, apiGetTest, apiPostTest } from 'src/api/indexPage';

export const useIndexPage = defineStore('useIndexPage', () => {
  const data_get = ref();
  const getTest = async () => {
    try {
      const res = await apiGetTest();
      data_get.value = res;
      return res;
    } catch (error) {
      console.log('error :>> ', error);
    }
  };

  const postTest = async (param) => {
    try {
      const res = await apiPostTest(param);
      return res.data;
    } catch (error) {
      console.log('error :>> ', error);
    }
  };

  const deleteTest = async (ID) => {
    try {
      const res = await apiDeleteTest(ID);
      return res;
    } catch (error) {
      console.log('error :>> ', error);
    }
  };


  return {
    data_get,

    getTest,
    postTest,
    deleteTest,
  };
});
