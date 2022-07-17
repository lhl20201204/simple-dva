import React, { useEffect } from 'react';
import MyConnect from './MyConnect';
import './App.css'
export default MyConnect(m =>({ info: m.model.info}))(({info, dispatch}) => {
    useEffect(( ) => {
        setTimeout(() => {
            dispatch({
                type: 'model/save',
                payload: {
                    info: {
                        name: 'lhl'
                    }
                }
            })
        }, 1300)
    })
    return (
       <div className='center'>Top组件订阅的姓名{info.name}</div>
    )
})