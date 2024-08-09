import axios from 'axios';

axios.defaults.baseURL = 'https://dahua.metcfire.com.tw/api';

// error handle -------
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log('MainError :>> ', error);
  }
);

export const apiPostTest = (params) => {
  return axios.post('/CRUDTest', params);
};

export const apiGetTest = () => {
  return axios.get('/CRUDTest/a');
};

export const apiPutTest = (params) => {
  return axios.put('/CRUDTest', params);
};

export const apiDeleteTest = (id) => {
  return axios.delete(`/CRUDTest/${id}`);
};
