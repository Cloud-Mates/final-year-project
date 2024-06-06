"use client"

import React, { useEffect, Suspense } from 'react'
import { useState } from 'react';
import Editor from '@monaco-editor/react';
import yaml from 'js-yaml'
import CryptoJS from 'crypto-js';
import { useSearchParams } from 'next/navigation'

const page = () => {

    const [configs, setconfigs] = useState({
        name: "",
        file: ""
    })

    const [backendURI, setbackendURI] = useState("")
    const [passkey, setpasskey] = useState("");
    const [pin, setpin] = useState("");

    const [url, seturl] = useState("");
    const [configIndentation, setconfigIndentation] = useState(0)
    const [configJSON, setconfigJSON] = useState("")
    const [k8sconnchecked, setk8sconnchecked] = useState(0);
    const [file, setfile] = useState("");

    const [host, sethost] = useState("127.0.0.1");
    const [port, setport] = useState("22");
    const [username, setusername] = useState("");
    const [sshfile, setsshfile] = useState("");
    const [sshfilename, setsshfilename] = useState("");
    const [sshkey, setsshkey] = useState("");
    const [sshcommand, setsshcommand] = useState("uptime");
    const [sshconnchecked, setsshconnchecked] = useState(0);


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



    useEffect(() => {
        if (!sshfile) {
            return;
        }
        // console.log(sshfile);
        setsshfilename(sshfile?.name)

        const reader = new FileReader();
        reader.onload = event => setsshkey(event.target.result) // desired file content
        reader.onerror = error => console.log(error)
        reader.readAsText(sshfile)
    }, [sshfile])



    const chkConn = async () => {
        if (!backendURI) {
            setsshconnchecked(5);
            return setk8sconnchecked(5);
        }
        setk8sconnchecked(3);
        setsshconnchecked(3);
        try {
            console.log(JSON.stringify(configJSON));
            var testKubernetes;
            if (!configJSON) {
                testKubernetes = "";
            } else {
                testKubernetes = await fetch(`${backendURI}/api/k8s/test`,
                    {
                        method: 'POST',
                        body: JSON.stringify(configJSON),
                        headers: { 'Content-Type': 'application/json', passkey: passkey },
                    },
                    { cache: 'no-store' });
            }

            const testSSH = await fetch(`${backendURI}/api/ssh/exec`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        "host": host,
                        "port": port,
                        "username": username,
                        "privateKey": sshkey,
                        "command": sshcommand
                    }),
                    headers: { 'Content-Type': 'application/json', passkey: passkey },
                },
                { cache: 'no-store' });

            // console.log(testKubernetes);
            // console.log(await testKubernetes.text());
            if (testKubernetes?.status == 200) {
                setk8sconnchecked(1);
            } else {
                setk8sconnchecked(2);
            }

            if (testSSH?.status == 200) {
                setsshconnchecked(1);
            } else {
                setsshconnchecked(2);
            }
        } catch (error) {
            console.log(error);
            setsshconnchecked(4);
            return setk8sconnchecked(4);
        }
    }


    const saveConn = (e) => {
        e.preventDefault()
        if (!configs?.name) {
            return alert("add an unique name for this connection")
        }
        if (!pin) {
            return alert("add pin to securely save connection details")
        }

        const configData = {
            backend: {
                "uri": backendURI,
                "passkey": passkey
            },
            kubernetes: {
                "url": url,
                "configs": configs.file
            },
            ssh: {
                "host": host,
                "port": port,
                "username": username,
                "privateKey": sshkey,
                "privateKeyName": sshfilename,
                "command": sshcommand
            }
        }

        const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(configData), `${pin}`).toString();

        localStorage.setItem(`kubernetes-${configs.name}`, ciphertext);
        sessionStorage.setItem(`kubernetes-${configs.name}`, pin)
        window.location.href = `/connection/${configs.name}/`
    }

    const hideshow = (id) => {
        var x = document.getElementById(id);
        var y = document.getElementById(id + 'toggle');
        if (x.type === "password") {
            x.type = "text";
            y.src = '/assets/eye-blind-icon.svg';
        } else {
            x.type = "password";
            y.src = '/assets/eye-icon.svg';
        }
    }


    const searchParams = useSearchParams();
    const connName = searchParams.get('edit');

    useEffect(() => {
        if (!connName) {
            return
        }

        let sessionpin = sessionStorage.getItem(`kubernetes-${connName}`)

        let lsdata = localStorage.getItem(`kubernetes-${connName}`) || ""

        if (!lsdata) {
            return window.location.href = "/auth/kubernetes"
        }

        try {
            let bytes = CryptoJS.AES.decrypt(lsdata, sessionpin);
            let decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));


            setbackendURI(decryptedData?.backend?.uri);
            setpasskey(decryptedData?.backend?.passkey);
            setpin(sessionpin);
            setconfigs({
                name: connName,
                file: decryptedData?.kubernetes?.configs
            });
            seturl(decryptedData?.kubernetes?.url);
            sethost(decryptedData?.ssh?.host);
            setport(decryptedData?.ssh?.port);
            setusername(decryptedData?.ssh?.username);
            setsshfilename(decryptedData?.ssh?.privateKeyName);
            setsshkey(decryptedData?.ssh?.privateKey);
            setsshcommand(decryptedData?.ssh?.command);

        } catch (error) {
            alert("unable to match pin :(");
            let inputpin = prompt(`Try again with pin for connName`);
            sessionStorage.setItem(`kubernetes-${connName}`, inputpin);

            try {
                let bytes = CryptoJS.AES.decrypt(lsdata, inputpin);
                let decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

                setbackendURI(decryptedData?.backend?.uri);
                setpasskey(decryptedData?.backend?.passkey);
                setpin(inputpin);
                setconfigs({
                    name: connName,
                    file: decryptedData?.kubernetes?.configs
                });
                seturl(decryptedData?.kubernetes?.url);
                sethost(decryptedData?.ssh?.host)
                setport(decryptedData?.ssh?.port)
                setusername(decryptedData?.ssh?.username)
                setsshfilename(decryptedData?.ssh?.privateKeyName)
                setsshkey(decryptedData?.ssh?.privateKey)
                setsshcommand(decryptedData?.ssh?.command)
            } catch (error) {
                let deteleconfirmation = confirm('Delete this connection?');
                if (deteleconfirmation) {
                    localStorage.removeItem(`kubernetes-${connName}`);
                    sessionStorage.removeItem(`kubernetes-${connName}`);
                    router.push("/redirecting");
                }
                window.location.pathname = "/"
            }
        }
    }, [])



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
                    Backend URI
                    <input onChange={(e) => { setbackendURI(e.target.value) }} value={backendURI} type='text' className={`bg-[#11232b] text-slate-200 text-lg p-[10px] rounded-lg ${configs.name ? "border outline-green-400 border-green-400 " : ""}`} />
                </label>
                <br />
                <div className='flex w-full  gap-4 max-sm:flex-col'>
                    <label className='flex flex-col w-full'>
                        Pass Key
                        <div className={`relative flex flex-row items-center rounded-lg border ${false ? "outline-green-400 border-green-400 " : "border-[#11232b]"}`}>
                            <input id='password' onChange={(e) => { setpasskey(e.target.value) }} value={passkey} type='password' className={`bg-[#11232b] text-slate-200 text-lg p-[10px] rounded-lg w-full`} />
                            <p onClick={() => { hideshow('password') }} className='bg-[#11232b] border-[2.5px] border-[#11232b] p-[10px] rounded-lg absolute right-0 cursor-pointer'>
                                <img id='passwordtoggle' src='/assets/eye-icon.svg' alt='show' width={20} />
                            </p>
                        </div>
                    </label>
                    <label className='flex flex-col w-full'>
                        Set PIN
                        <div className={`relative flex flex-row items-center rounded-lg border ${false ? "outline-green-400 border-green-400 " : "border-[#11232b]"}`}>
                            <input id='pin' onChange={(e) => { setpin(e.target.value) }} value={pin} type='password' className={`bg-[#11232b] text-slate-200 text-lg p-[10px] rounded-lg w-full`} />
                            <p onClick={() => { hideshow('pin') }} className='bg-[#11232b] border-[2.5px] border-[#11232b] p-[10px] rounded-lg absolute right-0 cursor-pointer'>
                                <img id='pintoggle' src='/assets/eye-icon.svg' alt='show' width={20} />
                            </p>
                        </div>
                    </label>
                </div>
                <br />

                <details open className='rounded-lg p-5 border border-[#11232b]'>
                    <summary className='cursor-pointer'>Basic options</summary>
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
                    <br />
                    <label className='flex flex-col'>
                        URL address
                        <input value={url} readOnly type='text' className={`bg-[#11232b] text-slate-200 text-lg p-[10px] rounded-lg outline-none ${url ? "border border-green-400 " : ""}`} />
                    </label>


                </details>

                <br />

                <details className='rounded-lg p-5 border border-[#11232b]'>
                    <summary className='cursor-pointer'>Advanced options</summary>
                    <br />
                    <div className='flex w-full  gap-4 max-sm:flex-col'>
                        <label className='flex flex-col w-full'>
                            HOST
                            <div className={`relative flex flex-row items-center rounded-lg border ${false ? "outline-green-400 border-green-400 " : "border-[#11232b]"}`}>
                                <input onChange={(e) => { sethost(e.target.value) }} value={host} className={`bg-[#11232b] text-slate-200 text-lg p-[10px] rounded-lg w-full`} />
                            </div>
                        </label>
                        <label className='flex flex-col w-full'>
                            PORT
                            <div className={`relative flex flex-row items-center rounded-lg border ${false ? "outline-green-400 border-green-400 " : "border-[#11232b]"}`}>
                                <input onChange={(e) => { setport(e.target.value) }} value={port} className={`bg-[#11232b] text-slate-200 text-lg p-[10px] rounded-lg w-full`} />
                            </div>
                        </label>
                    </div>
                    <br />
                    <label className='flex flex-col'>
                        username
                        <input onChange={(e) => { setusername(e.target.value) }} value={username} type='text' className={`bg-[#11232b] text-slate-200 text-lg p-[10px] rounded-lg ${configs.name ? "border outline-green-400 border-green-400 " : ""}`} />
                    </label>
                    <br />
                    <label className='flex flex-col'>
                        SSH private key
                        <div className={`bg-[#11232b] text-slate-200 text-lg p-[10px] rounded-lg ${false ? "border outline-green-400 border-green-400 " : ""}`} >
                            <input onChange={(e) => { setsshfile(e.target.files[0]) }} type='file' className='opacity-0 absolute' />
                            <div className='bg-[#11232b] text-[#5bb0cd] z-1'> {sshfilename || "Add ssh private key file"} </div>
                        </div>
                    </label>
                    <br />
                    <label className='flex flex-col'>
                        command
                        <input onChange={(e) => { setsshcommand(e.target.value) }} value={sshcommand} type='text' className={`bg-[#11232b] text-slate-200 text-lg p-[10px] rounded-lg ${configs.name ? "border outline-green-400 border-green-400 " : ""}`} />
                    </label>
                </details>

                <div className='flex max-lg:flex-wrap w-[100%] gap-[1rem] mb-[5rem]'>

                    <div onClick={chkConn} className={`w-full border ${k8sconnchecked == 1 || sshconnchecked == 1 ? "border-[#38ad47]" : k8sconnchecked == 2 ? "border-[#a93c2b]" : "border-[#061924]"} bg-[#061924] p-[16px] rounded-lg mt-[2rem] flex items-center gap-5 justify-center min-w-[16rem] cursor-pointer`}>
                        {
                            (k8sconnchecked === 0 & sshconnchecked === 0) ? <p>Check Connection</p> : ""
                        }
                        {
                            (k8sconnchecked === 4 & sshconnchecked === 4) ? <p>Backend refused to connect</p> : ""
                        }
                        {
                            (k8sconnchecked === 5 & sshconnchecked === 5) ? <p>Empty backend URI</p> : ""
                        }
                        {
                            k8sconnchecked == 1 ?
                                <p className='relative'>
                                    <img className='w-[30px]' src="data:image/png;base64,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" />
                                    <img className='w-[25px] absolute top-[-5px] right-[-10px]' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC60lEQVR4nO2Zz2tTQRDHH/46ePTHyR//hFjsKTcp7MrOOzyUelHRnqUQLb3k1noQW6glLf4HKW8GUvWi4NGW9qIogje1J/vj3Aj1yWxfAw0vyW7evk2EDAykDcn7fGd3ZmcnQTC0oQ0tt0W16KREGBWkpiWpWCB8lQh7ktQf7Qh7AuGLfo/U9K04vFGpVE4E/TZF6opEeCYRtiRBYufqlyA1OxaHl72Dj9Wii5JgWZBq2IMfd0GqIUhVZV1e8AIvSY1LUrt5wTOE7Ig4vFMY+LXlidMC4ZVrcNkqBGGJn+UUXtblWUHqbdHw8sgR3vAz3UXeJzw1RbyLatGZ3AJ8bBvZPi+q+eDj8G6/4GXT1e2e4AHhvEDYHgABuz2VWK7zPkHvvR9vv5UQFq3g+XR0cUiZ+uTHB8nawYtk/vtku1xoyLq8ah59bg88w28m89o7iJg1gucmi/sUH/DltUfJ+sFcE56d/76ftZ0QtrhpNIn+aD8iv5nCs6gOuTDSVcBhS1ws/JP1h5mRL3eAT1dhymQFcCDhSQtY6b4C+uIxgPCkBXzuvgIWrXKn2m2asGVT+MMc2DbJAaP6//zbY2OA3JGn5grsOxHA8KYgzuDJUEC3LcQ12hTIKTyZbiGDJM6q4Rt/55KpjYnC4KVxEhuW0U4iCoEn0zJqcZC1qyxZ/2NRueBJ90NPuwrgoZPNl2athPPIU+pxeN2omRMIP12IcAkvEH4YT/O4dbV9QKsIp5EndjUTFH2hORLhHB5hX6yKS8YC0lWo9vIwTlYXCSuPR38hsLWbtejcIFzqBamdnuemPKvsuwAMo57gmyIQlvoY/ZdBXuN7qEAg/wLU69KH0qnAhfGgVQ9c/UV+1dlwt2XIW/WxbUquIp9lPKsspjqp37kT1nJuusgHTG5w5O9QC1y2A9/GpyO3Hba9k94q+jNqxvqELcLSBnCE5zbcs/PFg2926Q94Df0a4RO/xy0xd5UD8TPr0IYW/P/2D5+LFXPdole1AAAAAElFTkSuQmCC" />
                                </p> :
                                k8sconnchecked == 2 ?
                                    <p className='relative'>
                                        <img className='w-[30px]' src="data:image/png;base64,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" />
                                        <img className='w-[25px] absolute top-[-5px] right-[-10px]' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAADDUlEQVR4nO1Zy2oUQRRtfC1c+lj5+ABXQs+9TlYDVW1w4XZQdOnadWICBg1ksjdhIn6CqAsTQQX/QdEPMLoyiWiqZuhxHiW3cGZ0ppOu6q7uHmEuFAx00XNO1X2ce9vzpja1qaU2Va0ebXKYkQwXJMNnksMnyeG74PiLFv2WHD/qZwwXGgGW1ZJ3xCvamrOlC4LjquDwVXJUNktw+CIY1hoVPJ878P1rl88KBo8Fw5Yt8DEiDFuCY32/4p/JBbwI4JZksJcW+NhiuCvYlZuZAVe+f1xwfOIcOB9zrQ36L7fgr/snBcdXWYOXQxJb9J8uTz438HLoUm9V9dKJ1ATycBt54E1gPSV4uF0UeDkgUbqRCPxPDqclx52iCUgGe4lSLOX5wsHzQTysW4Gn6mhVpIKyat69YwxI7w3K5m7EsNUM/Ivmp89x1QZ8+/WmUt2uCmtLsfvDh/eU6nRU+90bJWdnbEjUjMCTyCKdYgW+bzEk+uD71rYgQXqLRGMsAa0qLVzhb0DaOh0VLi+Og19ejNzbtHC9BvMxloCWxBYBFj6YHwc2chOjJz/Ys3LfLpgDmDfx/+dWL40h4Qw8pwVP42+AGg/rFx9AotfVYN2AR6oJHwxcKLlUjiThCjzXayfehVI2KZrE6Knr2+ilBa8EwzB7AuTzkQTM6oRMSyCVC0UFbERgZ+pCMmkQR4Hv9aKDOCkJZhDEidLoIanSpE5Ip2nUtpAZ5HlnJBjMxRKgodPESgleAjMxx3A7sZg7JFWO3kSbxNxVM1ktGH42nuaRdE0kpw3yfJ+EDXipCcCKEfgJbWjCBiufMyagb4Fj3SrAMl3wyLO1H7PlU5PR1ONu4rkpzSqLJiAYVhOBH5DgsFGg66x5aY36UMHhRf4nD5uqUjmWmsBwuAtbObrNS2fD3ZEhbw6ZCdacnXyU0awyk+zE8FvqgLWamzJcpwLjwF1CyvOUtr28jaojyQ5j7fQv8G2SB9YVNgsjkUVDJ5rbkGanxoM6O/0BjySJ7vLg/Z9nc6QqJ+Iz69Sm5v3/9htwCyTCs1agAgAAAABJRU5ErkJggg==" />
                                    </p> :
                                    k8sconnchecked == 3 ?
                                        <p className='relative'>
                                            <img className='w-[30px]' src="data:image/png;base64,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" />
                                            <img className='w-[25px] absolute top-[-5px] right-[-10px]' src='/assets/loading.gif' />
                                        </p> :
                                        ""
                        }
                        <br />
                        {
                            sshconnchecked == 1 ?
                                <p className='relative'>
                                    <img className='w-[30px]' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABO0lEQVR4nO2YQUsCQRiG92esrkliOz9gO7gdvGSHOnrx4k/p4KF7RPYTQumyeghPeXID8eCAGi7kJb0UeKqjyBspScQSGeTO4PvAexjmMg/ffN/AGAYhhCiJHD52ZDCCCukOR+31BRQ4uPySPwt4dy2UKzV4TT90rbxAuVLHxbWHq2o9dK28gNf0F4eufVbg21p5AalIjK0VEI4baSQFHFYAvEIBm9jlFBIco//wkCXaHaQLRX0fMhOAOZ9j57YB++hEPwGr119KfOT1DbvnlxCZrD4CYv8AqdMSYs8vK5H4eKKRgLOMfXgM62m8ktC6AtbgQc8eiE+nSJXOFlLaCJgAYrMZktUb2Nlc6P5vIqISSPj32MsXfhRUWkBsIJICDisAXqGATexyCgmO0TWJ+i9Ubv3nLiGEGJvgHdGPbD+Sd2BeAAAAAElFTkSuQmCC" />
                                    <img className='w-[25px] absolute top-[-5px] right-[-10px]' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC60lEQVR4nO2Zz2tTQRDHH/46ePTHyR//hFjsKTcp7MrOOzyUelHRnqUQLb3k1noQW6glLf4HKW8GUvWi4NGW9qIogje1J/vj3Aj1yWxfAw0vyW7evk2EDAykDcn7fGd3ZmcnQTC0oQ0tt0W16KREGBWkpiWpWCB8lQh7ktQf7Qh7AuGLfo/U9K04vFGpVE4E/TZF6opEeCYRtiRBYufqlyA1OxaHl72Dj9Wii5JgWZBq2IMfd0GqIUhVZV1e8AIvSY1LUrt5wTOE7Ig4vFMY+LXlidMC4ZVrcNkqBGGJn+UUXtblWUHqbdHw8sgR3vAz3UXeJzw1RbyLatGZ3AJ8bBvZPi+q+eDj8G6/4GXT1e2e4AHhvEDYHgABuz2VWK7zPkHvvR9vv5UQFq3g+XR0cUiZ+uTHB8nawYtk/vtku1xoyLq8ah59bg88w28m89o7iJg1gucmi/sUH/DltUfJ+sFcE56d/76ftZ0QtrhpNIn+aD8iv5nCs6gOuTDSVcBhS1ws/JP1h5mRL3eAT1dhymQFcCDhSQtY6b4C+uIxgPCkBXzuvgIWrXKn2m2asGVT+MMc2DbJAaP6//zbY2OA3JGn5grsOxHA8KYgzuDJUEC3LcQ12hTIKTyZbiGDJM6q4Rt/55KpjYnC4KVxEhuW0U4iCoEn0zJqcZC1qyxZ/2NRueBJ90NPuwrgoZPNl2athPPIU+pxeN2omRMIP12IcAkvEH4YT/O4dbV9QKsIp5EndjUTFH2hORLhHB5hX6yKS8YC0lWo9vIwTlYXCSuPR38hsLWbtejcIFzqBamdnuemPKvsuwAMo57gmyIQlvoY/ZdBXuN7qEAg/wLU69KH0qnAhfGgVQ9c/UV+1dlwt2XIW/WxbUquIp9lPKsspjqp37kT1nJuusgHTG5w5O9QC1y2A9/GpyO3Hba9k94q+jNqxvqELcLSBnCE5zbcs/PFg2926Q94Df0a4RO/xy0xd5UD8TPr0IYW/P/2D5+LFXPdole1AAAAAElFTkSuQmCC" />
                                </p> :
                                sshconnchecked == 2 ?
                                    <p className='relative'>
                                        <img className='w-[30px]' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABO0lEQVR4nO2YQUsCQRiG92esrkliOz9gO7gdvGSHOnrx4k/p4KF7RPYTQumyeghPeXID8eCAGi7kJb0UeKqjyBspScQSGeTO4PvAexjmMg/ffN/AGAYhhCiJHD52ZDCCCukOR+31BRQ4uPySPwt4dy2UKzV4TT90rbxAuVLHxbWHq2o9dK28gNf0F4eufVbg21p5AalIjK0VEI4baSQFHFYAvEIBm9jlFBIco//wkCXaHaQLRX0fMhOAOZ9j57YB++hEPwGr119KfOT1DbvnlxCZrD4CYv8AqdMSYs8vK5H4eKKRgLOMfXgM62m8ktC6AtbgQc8eiE+nSJXOFlLaCJgAYrMZktUb2Nlc6P5vIqISSPj32MsXfhRUWkBsIJICDisAXqGATexyCgmO0TWJ+i9Ubv3nLiGEGJvgHdGPbD+Sd2BeAAAAAElFTkSuQmCC" />
                                        <img className='w-[25px] absolute top-[-5px] right-[-10px]' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAADDUlEQVR4nO1Zy2oUQRRtfC1c+lj5+ABXQs+9TlYDVW1w4XZQdOnadWICBg1ksjdhIn6CqAsTQQX/QdEPMLoyiWiqZuhxHiW3cGZ0ppOu6q7uHmEuFAx00XNO1X2ce9vzpja1qaU2Va0ebXKYkQwXJMNnksMnyeG74PiLFv2WHD/qZwwXGgGW1ZJ3xCvamrOlC4LjquDwVXJUNktw+CIY1hoVPJ878P1rl88KBo8Fw5Yt8DEiDFuCY32/4p/JBbwI4JZksJcW+NhiuCvYlZuZAVe+f1xwfOIcOB9zrQ36L7fgr/snBcdXWYOXQxJb9J8uTz438HLoUm9V9dKJ1ATycBt54E1gPSV4uF0UeDkgUbqRCPxPDqclx52iCUgGe4lSLOX5wsHzQTysW4Gn6mhVpIKyat69YwxI7w3K5m7EsNUM/Ivmp89x1QZ8+/WmUt2uCmtLsfvDh/eU6nRU+90bJWdnbEjUjMCTyCKdYgW+bzEk+uD71rYgQXqLRGMsAa0qLVzhb0DaOh0VLi+Og19ejNzbtHC9BvMxloCWxBYBFj6YHwc2chOjJz/Ys3LfLpgDmDfx/+dWL40h4Qw8pwVP42+AGg/rFx9AotfVYN2AR6oJHwxcKLlUjiThCjzXayfehVI2KZrE6Knr2+ilBa8EwzB7AuTzkQTM6oRMSyCVC0UFbERgZ+pCMmkQR4Hv9aKDOCkJZhDEidLoIanSpE5Ip2nUtpAZ5HlnJBjMxRKgodPESgleAjMxx3A7sZg7JFWO3kSbxNxVM1ktGH42nuaRdE0kpw3yfJ+EDXipCcCKEfgJbWjCBiufMyagb4Fj3SrAMl3wyLO1H7PlU5PR1ONu4rkpzSqLJiAYVhOBH5DgsFGg66x5aY36UMHhRf4nD5uqUjmWmsBwuAtbObrNS2fD3ZEhbw6ZCdacnXyU0awyk+zE8FvqgLWamzJcpwLjwF1CyvOUtr28jaojyQ5j7fQv8G2SB9YVNgsjkUVDJ5rbkGanxoM6O/0BjySJ7vLg/Z9nc6QqJ+Iz69Sm5v3/9htwCyTCs1agAgAAAABJRU5ErkJggg==" />
                                    </p> :
                                    sshconnchecked == 3 ?
                                        <p className='relative'>
                                            <img className='w-[30px]' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABO0lEQVR4nO2YQUsCQRiG92esrkliOz9gO7gdvGSHOnrx4k/p4KF7RPYTQumyeghPeXID8eCAGi7kJb0UeKqjyBspScQSGeTO4PvAexjmMg/ffN/AGAYhhCiJHD52ZDCCCukOR+31BRQ4uPySPwt4dy2UKzV4TT90rbxAuVLHxbWHq2o9dK28gNf0F4eufVbg21p5AalIjK0VEI4baSQFHFYAvEIBm9jlFBIco//wkCXaHaQLRX0fMhOAOZ9j57YB++hEPwGr119KfOT1DbvnlxCZrD4CYv8AqdMSYs8vK5H4eKKRgLOMfXgM62m8ktC6AtbgQc8eiE+nSJXOFlLaCJgAYrMZktUb2Nlc6P5vIqISSPj32MsXfhRUWkBsIJICDisAXqGATexyCgmO0TWJ+i9Ubv3nLiGEGJvgHdGPbD+Sd2BeAAAAAElFTkSuQmCC" />
                                            <img className='w-[25px] absolute top-[-5px] right-[-10px]' src='/assets/loading.gif' />
                                        </p> :
                                        ""
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