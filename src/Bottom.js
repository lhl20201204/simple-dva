import React, { useEffect } from 'react';
import MyConnect from './MyConnect';
import './App.css'
export default MyConnect(m =>({ 
    introduction: m.model2.introduction, 
    name: m.model.info.name
}))(({introduction, name, dispatch}) => {
    useEffect(( ) => {
        dispatch({
            type: 'model2/request',
        })
    })
    return (
        <>
        <div className='center grey'>Bottom组件订阅的 {name}</div> 
        <div className='center grey'>
            <div>Bottom组件订阅 :{introduction}</div>
        </div>
        </>
    )
})