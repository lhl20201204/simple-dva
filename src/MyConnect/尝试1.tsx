import _ from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';

interface DispatchProps{
    type: string,
    payload?:any
}

import model from './model';
import model2 from './model2';
const models : Array<any> = [ model, model2 ];
const store = {
  state: {},
  reducers: {},
};
for (const x of models) {
  store.state[x.name] = x.state;
  for (const m of _.keys(x.reducers)) {
    store.reducers[`${x.name}/${m}`] = x.reducers[m];
  }
}
export default (fn?: (x: Record<string, any>) => any) => {
  fn = fn || (() => ({}));
  return (Component: any) => (selfProps:any) => {
    const [ obj, setObj ] = useState(store.state);
    const dispatch = useCallback(({ type, payload, ...elseProps }: DispatchProps) => {
      const name = type.split('/')[0];
      if (_.get(store.reducers, type)) {
        setObj({
          ...obj,
          [name]: store.reducers[type](obj[name], { payload, ...elseProps }),
        });
      }
    }, [ obj ]);

    return useMemo(() => {
      return <Component {...fn(obj)} {...(selfProps || {})} dispatch={dispatch}/>;
    }, [ fn(obj) ]);
  };
};
