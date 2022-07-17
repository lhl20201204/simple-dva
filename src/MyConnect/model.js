/* eslint-disable import/no-anonymous-default-export */
export default {
  name: 'model',
  state: {
    info: {
      name: '我是初始化名字'
    },
  },
  effects: {
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
