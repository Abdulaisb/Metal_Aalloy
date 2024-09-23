import { useState } from 'react';
import MetalTable from './MetalTable.js';
import MetalChart from './MetalChart.js';
const apiURL = 'http://localhost:3000';

function Info() {
    const [select,setSelect] = useState("properties");
    const setProp = () => {
        setSelect("properties");
    };
    const setSS = () => {
        setSelect("stress strain");
    };
    const [props, setProps] = useState(null);
    const [curve, setCurve] = useState(null);
    const [name,setName] = useState("");
    const nameHandler = (event) => {setName(event.target.value);};
    const go = async () => {
        const payload = {
            'alloyName' : name,
            'type' : select
        }
        fetch(apiURL + '/userRequest', {
            method : 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).then(res => res.json()).then( data => {
            console.log(data);
            if (select === "properties") {
                setProps(data);
            }
            if (select === "stress strain") {
                setCurve(data);
            }
        })
    };
    return (
        <div className='flex flex-col w-full items-center h-full border-4 border-black overflow-y-scroll'>
            <div className='text-3xl font-semibold'>Alloy Information</div>
            <div>Enter Alloy Name</div>
            <input onChange = {nameHandler} className='border-2 border-black' type='text'></input>
            <div className='flex flex-row items-center space-x-6 mt-4 px-4'>
                <div
                    onClick={setProp}
                    className={`cursor-pointer w-36 border-black rounded-lg flex items-center justify-center px-2 py-2  ${
                        select === 'properties' ? 'bg-violet-600 text-white border-4 font-bold' : 'border-2'
                    }`}
                >Properties</div>
                <div>or</div>
                <div
                    onClick={setSS}
                    className={`cursor-pointer w-36  border-black rounded-lg flex items-center justify-center px-2 py-2 ${
                        select === 'stress strain' ? 'bg-violet-600 text-white border-4 font-bold' : 'border-2'
                    }`}
                >Stress Strain</div>
                <div onClick = {go} className='cursor-pointer w-12 border-2 border-black rounded-lg flex items-center justify-center px-2 py-2 bg-teal-400 hover:bg-teal-600'>
                    Go
                </div>
            </div>
            {select === "properties" && props !== null && (<MetalTable properties = {props}/>)}
            {select === "stress strain" && curve !== null && (<MetalChart curve = {curve}/>)}

        </div>
    );
  }
  
  export default Info;
  