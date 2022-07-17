import _ from 'lodash';
import React, { useCallback, useMemo, useRef, useState } from 'react';

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
  return (Component: any) => (selfProps: any) => {
    const [ , setUpdate ] = useState({});

    const dispatch = ({ type, payload, ...elseProps }: DispatchProps) => {
      const name = type.split('/')[0];
      if (_.get(store.reducers, type)) {
        store.state = {
          ...store.state,
          [name]: store.reducers[type](store.state[name], { payload, ...elseProps }),
        };
        setUpdate({});
      }
    };
    return useMemo(() => {
      console.log('bian');
      return <Component {...fn(store.state)} {...(selfProps || {})} dispatch={dispatch}/>;
    }, [ fn(store.state) ]);
  };
};
