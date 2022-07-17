/* eslint-disable import/no-anonymous-default-export */
export default {
  name: 'model2',
  state: {
    action: {
      hobby: '乒乓球'
    },
    introduction: '当前没有介绍',
  },
  effects: {
    * request ({ payload, callback }, { select, put, call }) {
      const { name } = yield select(m => m.model.info);
      const career = yield call(() => new Promise(resolve => setTimeout(() => resolve('前端开发工程师'), 3000)));
      const { hobby } = yield select(m => m.model2.action);
      yield put(
        {
          type: 'save',
          payload: {
            introduction: '姓名：' + name + ', 职业：' + career + ',爱好：' + hobby 
          },
        }
      );
    },
  },
  reducers: {
    save (state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
