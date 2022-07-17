/* eslint-disable import/no-anonymous-default-export */
import React, { useCallback, useEffect, useState } from 'react';
import model from './model';
import model2 from './model2';
const models = [ model, model2 ];
const store = {
  state: {},
  reducers: {},
  effects: {},
};

for (const x of models) { // 初始化reducer和 effects
  store.state[x.name] = x.state;
  for (const m of Reflect.ownKeys(x.reducers || {})) {
    store.reducers[`${x.name}/${m}`] = x.reducers[m];
  }
  for (const m of Reflect.ownKeys(x.effects || {})) {
    store.effects[`${x.name}/${m}`] = x.effects[m];
  }
}

const configList = [];
let globalId = 0;
export default (fn = () => ({})) => {
  return Component => selfProps => {
    const [ , setUpdate ] = useState({}); // 更新函数 ，setUpdate 本身就是个闭包，！！！！无论何时何地调用都会更新定义它的组件

    const dispatch = useCallback(({ type, payload, ...elseProps }) => {
      const name = type.split('/')[0];
      if (Reflect.has(store.reducers, type)) {
        store.state = {
          ...store.state,
          [name]: store.reducers[type](store.state[name], { payload, ...elseProps }), // 闭包保存 全局状态
        };
        configList.forEach(v => {
          const newState = v.fn(store.state);
          if (JSON.stringify(newState) !== JSON.stringify(v.lastState)) { // 比对依赖是否变更，
            v.lastState = newState; // 更新状态
            v.setUpdate({}); // 通知对应组件去更新
          }
        });
      }

      if (Reflect.has(store.effects, type)) {
        const generator = store.effects[type]({ payload, ...elseProps }, {
          call: async (method, params) => method(params),
          select: fn => fn(store.state),
          put: ({ type, ...p }, ...q) => dispatch({ type: `${name}/${type}`, ...p }, ...q), // 递归
        });
        let v;
        const run = async (lastValue = null) => { // 生成器运行
          v = generator.next(lastValue);
          lastValue = v.value;
          if (v.value instanceof Promise) {
            lastValue = await v.value;
          }
          if (!v.done) {
            run(lastValue);
          }
        };
        run();
      }
    }, []);

    useEffect(() => {
      const id = globalId++
      configList.push({ id, setUpdate, lastState: fn(store.state), fn }); // 挂载的时候收集更新函数
      return () => {
        for(let i =0; i< configList.length; i++) {
          if (configList[i].id === id) {
            configList.splice(i, 1) // 销毁的时候移除依赖
            break;
          }
        }
      }
    }, []);

    return <Component {...fn(store.state)} {...(selfProps || {})} dispatch={dispatch}/>;
  };
};
