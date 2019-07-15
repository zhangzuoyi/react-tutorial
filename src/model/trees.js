import * as treesService from '../service/trees';
import request from '../util/request';

export default {

  namespace: 'trees',

  state: {
    treesList: [],
  },

  effects: {
    *queryList({ _ }, { call, put }) {
      //const rsp = yield call(treesService.queryList);
      const rsp = yield call(request, "/ele/get");
      console.log('queryList');
      let data=[];
      data[0]=rsp;
      console.log(data);
      yield put({ type: 'saveList', payload: { treesList: data } });
    },
    *updateTree({ payload }, { call, put }) {
      console.log(payload)
      // const rsp = yield call(treesService.addOne, payload);
      const rsp = yield call(request, "/ele/update",{
        headers: {
          'content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(payload)
      });
      yield put({ type: 'queryList' });
      return rsp;
    },
  },

  reducers: {
    saveList(state, { payload: { treesList } }) {
      //let data=[];
      //data[0]=treesList;
      //console.log(data)
      return {
        ...state,
        treesList,
      }
    },
  },
};
