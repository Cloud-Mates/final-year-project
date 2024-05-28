"use client"

import React, { useEffect, Suspense } from 'react'
import { useState } from 'react';
import Editor from '@monaco-editor/react';
import yaml from 'js-yaml'

const page = () => {

    const [configs, setconfigs] = useState({
        name: "",
        file: ""
    })

    const [url, seturl] = useState("");
    const [configIndentation, setconfigIndentation] = useState(0)
    const [configJSON, setconfigJSON] = useState("")
    const [connchecked, setconnchecked] = useState(0);
    const [file, setfile] = useState("");



    useEffect(() => {
        try {
            setconfigIndentation(0);
            if (!configs?.file) {
                return
            }
            yaml.loadAll(configs.file, function (data) {
                if (data) {
                    if (typeof data == "object") {
                        setconfigIndentation(1);
                        setconfigJSON(data);
                    } else {
                        setconfigIndentation(2);
                    }
                }

                if (data?.clusters?.[0]?.cluster?.server) {
                    seturl(data?.clusters?.[0]?.cluster?.server);
                }
            });
        } catch (error) {

        }
    }, [configs]);



    useEffect(() => {
        if (!file) {
            return;
        }
        // console.log(file);
        const reader = new FileReader();
        reader.onload = event => setconfigs({ ...configs, file: event.target.result }) // desired file content
        reader.onerror = error => console.log(error)
        reader.readAsText(file)
    }, [file])



    const chkConn = async () => {
        setconnchecked(3)
        const testData = await fetch(`http://localhost:4000/api/k8s/test`,
            {
                method: 'POST',
                body: JSON.stringify(configJSON),
                headers: { 'Content-Type': 'application/json', passkey: "7f2f3bc4c1bce93af91d6874a774f1573d8e133218735f63b43e30fecb36c58b" }
            },
            { cache: 'no-store' });
        // console.log(testData);
        // console.log(await testData.text());
        if (testData?.status == 200) {
            return setconnchecked(1)
        } else {
            return setconnchecked(2)
        }
    }


    const saveConn = (e) => {
        e.preventDefault()
        localStorage.setItem(`kubernetes-${configs.name}`, configs.file);
        window.location.pathname = `/cluster/${configs.name}/dashboard`
    }



    return (
        <div>
            <h1 className='text-center my-[2rem] text-[25px]'>Create New Connection</h1>
            <form className='flex flex-col max-w-[40rem] w-[90vw] mx-auto' onSubmit={saveConn}>
                <label className='flex flex-col'>
                    Connection name
                    <input onChange={(e) => { setconfigs({ ...configs, name: e.target.value }) }} value={configs.name} type='text' className={`bg-[#11232b] text-slate-200 text-lg p-[10px] rounded-lg ${configs.name ? "border outline-green-400 border-green-400 " : ""}`} />
                </label>
                <br />
                <label className='flex flex-col'>
                    URL address
                    <input value={url} readOnly type='text' className={`bg-[#11232b] text-slate-200 text-lg p-[10px] rounded-lg outline-none ${url ? "border border-green-400 " : ""}`} />
                </label>
                <br />
                <label className='flex flex-col relative'>
                    Config file
                    {/* <textarea value={configs.file} onChange={(e) => { setconfigs({ ...configs, file: e.target.value }) }} className={`bg-[#11232b] text-slate-200 text-lg p-[10px] rounded-lg h-[20rem] ${configs.file ? isJSON(configs.file) ? "border outline-green-400 border-green-400" : "border outline-red-400 border-red-400" : ""}`}></textarea> */}
                    <div className={`${configIndentation == 1 ? "border outline-green-400 border-green-400" : configIndentation == 2 ? "border outline-red-400 border-red-400" : ""}`}>
                        <Editor value={configs.file} onChange={(e) => { setconfigs({ ...configs, file: e }) }} height="20rem" defaultLanguage="yaml" theme='vs-dark' />
                    </div>


                    <div className='bg-blue-500 h-[64px] w-[64px] rounded-[50%] flex items-center justify-center absolute bottom-5 right-5 cursor-pointer hover:bg-blue-600 hover:shadow-md'>
                        <input onChange={(e) => { setfile(e.target.files[0]) }} type='file' className='bg-transparent h-[64px] w-[64px] absolute opacity-0 cursor-pointer' />
                        <svg version="1.0"
                            width="32.000000pt" height="32.000000pt" viewBox="0 0 512.000000 512.000000"
                            preserveAspectRatio="xMidYMid meet">

                            <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                                fill="#fff" stroke="none">
                                <path d="M3805 4786 c-37 -16 -70 -52 -84 -89 -6 -16 -11 -100 -11 -192 l0 -163 -178 -4 c-178 -3 -179 -3 -215 -31 -95 -72 -89 -196 12 -264 32 -22 44 -23 207 -23 l173 0 3 -179 c3 -199 6 -210 79 -259 28 -20 44 -23 92 -20 46 4 63 10 88 34 53 49 59 76 59 259 l0 165 174 0 c163 0 175 1 207 23 58 39 81 84 77 145 -6 64 -29 99 -88 130 -41 20 -58 22 -206 22 l-163 0 -3 178 -3 179 -29 37 c-46 61 -123 82 -191 52z" />
                                <path d="M1311 4639 c-265 -34 -488 -195 -605 -434 -76 -156 -70 -16 -74 -1680 -2 -1111 0 -1508 8 -1560 55 -322 321 -585 645 -635 48 -7 441 -10 1240 -8 1309 4 1205 -2 1370 77 163 78 282 195 360 356 85 172 79 80 82 1335 l3 1115 -22 45 c-13 25 -38 55 -57 67 -70 47 -177 19 -220 -57 l-21 -38 0 -1074 c0 -734 -3 -1093 -11 -1134 -15 -84 -52 -156 -116 -224 -64 -69 -135 -113 -218 -135 -88 -22 -2291 -23 -2378 0 -140 36 -242 121 -305 252 l-37 78 -3 1474 c-2 1329 -1 1480 14 1530 24 84 61 145 125 206 70 67 159 111 254 125 42 6 372 10 825 10 736 0 756 1 788 20 101 62 97 213 -8 274 -34 21 -48 21 -805 22 -424 1 -799 -2 -834 -7z" />
                                <path d="M1480 3388 c-76 -52 -98 -125 -61 -202 71 -146 283 -107 299 55 6 61 -30 128 -82 153 -50 23 -116 21 -156 -6z" />
                                <path d="M2090 3387 c-85 -57 -97 -182 -23 -249 53 -48 52 -48 720 -48 394 0 642 4 665 10 49 14 104 76 113 129 9 53 -25 126 -74 158 l-34 23 -667 0 -667 0 -33 -23z" />
                                <path d="M1481 2618 c-77 -52 -99 -125 -62 -202 41 -83 132 -115 210 -74 58 30 83 65 89 126 3 39 0 58 -17 89 -32 55 -66 76 -131 81 -45 3 -61 0 -89 -20z" />
                                <path d="M2110 2629 c-57 -23 -92 -78 -92 -144 0 -54 22 -96 69 -132 l36 -28 666 0 c630 0 668 1 696 18 41 25 73 73 80 122 8 51 -26 120 -74 152 l-34 23 -661 -1 c-411 0 -670 -4 -686 -10z" />
                                <path d="M1480 1848 c-76 -52 -98 -125 -61 -202 41 -83 132 -115 210 -74 58 30 83 65 89 126 12 128 -135 220 -238 150z" />
                                <path d="M2100 1851 c-108 -57 -111 -197 -6 -275 27 -21 36 -21 694 -21 649 0 668 1 700 20 41 25 69 69 77 120 8 51 -26 121 -74 152 l-34 23 -661 0 c-625 0 -663 -1 -696 -19z" />
                            </g>
                        </svg>
                    </div>
                </label>

                <div className='flex max-lg:flex-wrap w-[100%] gap-[1rem]'>

                    <div onClick={chkConn} className={`w-full border ${connchecked == 1 ? "border-[#38ad47]" : connchecked == 2 ? "border-[#a93c2b]" : "border-[#061924]"} bg-[#061924] p-[16px] rounded-lg mt-[2rem] flex items-center justify-center min-w-[16rem] cursor-pointer`}>
                        {
                            connchecked == 1 ?
                                <p>Cluster is active!</p> :
                                connchecked == 2 ?
                                    <p>Connection failed</p> :
                                    connchecked == 3 ?
                                        <p>Please wait...</p> :
                                        <p>Check connection</p>
                        }
                    </div>

                    {/* <Suspense fallback={
                        <div className='w-full border border-[#061924] bg-[#061924] p-[16px] rounded-lg mt-[2rem] flex items-center justify-center min-w-[16rem]'>
                            <p>Check connection</p>
                        </div>
                    }>
                        <TestConnection config={configJSON} />
                    </Suspense> */}

                    <button type="submit" value="Save" className='w-full border border-[#061924] bg-[#061924] p-[16px] rounded-lg md:mt-[2rem]'>Save & Connect</button>
                </div>

            </form>

        </div>
    )
}

export default page