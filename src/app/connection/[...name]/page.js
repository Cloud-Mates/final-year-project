"use client"

import React, { useState } from 'react'
import { useEffect } from 'react';
import yaml from 'js-yaml'
import Dashboard from '@/app/_pages/dashboard';
import Events from '@/app/_pages/events';
import Namespace from '@/app/_pages/namespace';
import Nodes from '@/app/_pages/nodes';
import Pods from '@/app/_pages/pods';
import Services from '@/app/_pages/services';
import Components from '@/app/_pages/componentstatus';
import CryptoJS from 'crypto-js';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"


const page = ({ params }) => {
    const [data, setdata] = useState({});
    const [pinvalid, setpinvalid] = useState(0);
    const [pin, setpin] = useState("");
    const [deleteclusterName, setdeleteclusterName] = useState("")

    useEffect(() => {
        let sessionpin = sessionStorage.getItem(`kubernetes-${params.name[0]}`);

        let lsdata = localStorage.getItem(`kubernetes-${params.name[0]}`) || ""

        try {
            var bytes = CryptoJS.AES.decrypt(lsdata, sessionpin);
            var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            setdata(decryptedData);
            setpinvalid(1);
        } catch (error) {
            setpinvalid(2);
        }

    }, []);

    const updatepin = (e) => {
        e.preventDefault()
        sessionStorage.setItem(`kubernetes-${params.name[0]}`, pin);
        let lsdata = localStorage.getItem(`kubernetes-${params.name[0]}`) || ""

        try {
            var bytes = CryptoJS.AES.decrypt(lsdata, pin);
            var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            setdata(decryptedData);
            setpinvalid(1);
        } catch (error) {
            setpinvalid(2);
            alert("pin doesn't match :(");
        }
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

    const logout = () => {
        sessionStorage.removeItem(`kubernetes-${params.name[0]}`);
        window.location.pathname = `/`;
    }

    const deletecluster = () => {
        localStorage.removeItem(`kubernetes-${deleteclusterName}`);
        window.location.href = "/";
    }


    return (
        <>
            {
                pinvalid == 2 ?
                    <>
                        <div>
                            <h1 className='text-center my-[2rem] text-[25px]'>Enter pin to authorize <span className='text-[#ffd3a1]'>{params.name[0]}</span></h1>
                            <form className='flex flex-col max-w-[40rem] w-[90vw] mx-auto' onSubmit={updatepin}>
                                <label className='flex flex-col w-full'>
                                    Enter PIN
                                    <div className={`relative flex flex-row items-center rounded-lg border ${false ? "outline-green-400 border-green-400 " : "border-[#11232b]"}`}>
                                        <input id='pin' onChange={(e) => { setpin(e.target.value) }} value={pin} type='password' className={`bg-[#11232b] text-slate-200 text-lg p-[10px] rounded-lg w-full`} />
                                        <p onClick={() => { hideshow('pin') }} className='bg-[#11232b] border-[2.5px] border-[#11232b] p-[10px] rounded-lg absolute right-0 cursor-pointer'>
                                            <img id='pintoggle' src='/assets/eye-icon.svg' alt='show' width={20} />
                                        </p>
                                    </div>
                                </label>
                                <br />

                                <button type="submit" value="Save" className='w-full border border-[#061924] bg-[#061924] p-[16px] rounded-lg md:mt-[2rem]'>Confirm & Connect</button>

                            </form>
                        </div>

                    </>
                    : pinvalid == 1 ?
                        <>
                            <Dialog>
                                <div className='relative mt-[5rem] flex flex-col max-w-[40rem] w-[90vw] mx-auto border border-black p-5 pt-20 gap-5'>
                                    {
                                        data?.kubernetes?.configs ?
                                            <a href={`/cluster/${params.name[0]}/dashboard`} className='rounded-lg hover:bg-slate-700 bg-slate-600 shadow-sm shadow-[#cacaca] p-5 pl-2'>
                                                <div>
                                                    <h3>Kubernetes API</h3>
                                                    <p>{data?.kubernetes?.url}</p>
                                                </div>
                                            </a> :
                                            <a href={`/auth/kubernetes?edit=${params.name[0]}`} className='rounded-lg hover:bg-slate-700 bg-slate-600 shadow-sm shadow-[#cacaca] p-5 pl-2'>
                                                add kubernetes Config
                                            </a>
                                    }

                                    {
                                        data?.ssh?.privateKey ?
                                            <a href={`/ssh/${params.name[0]}`} className='rounded-lg hover:bg-slate-700 bg-slate-600 shadow-sm shadow-[#cacaca] p-5 pl-2'>
                                                <div>
                                                    <h3>SSH console</h3>
                                                    <p>{data?.ssh?.host}:{data?.ssh?.port}@{data?.ssh?.username}</p>
                                                </div>
                                            </a> :
                                            <a href={`/auth/kubernetes?edit=${params.name[0]}`} className='rounded-lg hover:bg-slate-700 bg-slate-600 shadow-sm shadow-[#cacaca] p-5 pl-2'>
                                                Configure SSH connection
                                            </a>
                                    }

                                    <h1 className='absolute top-5 left-5 text-[#ffd3a1] text-[21px]'>{params.name[0]}</h1>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="bg-[#606060] absolute top-5 right-5 p-2 rounded-md">
                                            <svg fill="none" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M10 6C8.89543 6 8 5.10457 8 4C8 2.89543 8.89543 2 10 2C11.1046 2 12 2.89543 12 4C12 5.10457 11.1046 6 10 6Z" fill="white" /><path d="M10 12C8.89543 12 8 11.1046 8 10C8 8.89543 8.89543 8 10 8C11.1046 8 12 8.89543 12 10C12 11.1046 11.1046 12 10 12Z" fill="white" /><path d="M10 18C8.89543 18 8 17.1046 8 16C8 14.8954 8.89543 14 10 14C11.1046 14 12 14.8954 12 16C12 17.1046 11.1046 18 10 18Z" fill="white" /></svg>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="bg-[#4c4f51] text-slate-100 border-[#4c4f51]">
                                            <DropdownMenuLabel>Options</DropdownMenuLabel>
                                            <DropdownMenuSeparator className="bg-slate-500" />
                                            <DropdownMenuItem className="cursor-pointer"><a href={`/auth/kubernetes?edit=${params.name[0]}`}>Edit configuration</a></DropdownMenuItem>
                                            <DropdownMenuItem className="cursor-pointer"><DialogTrigger onClick={() => { setdeleteclusterName(params.name[0]) }}>Delete Connection</DialogTrigger></DropdownMenuItem>
                                            <DropdownMenuItem className="cursor-pointer" onClick={logout}>Log out</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                </div>


                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                                        <DialogDescription>
                                            This action cannot be undone. This will permanently delete your account
                                            and remove your data from our servers.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="w-full flex gap-4 ">
                                        <button onClick={deletecluster} className="w-full bg-red-700 py-1 rounded-md hover:scale-[1.1] duration-200">Delete</button>
                                        <DialogClose asChild>
                                            <button className="w-full border py-1 rounded-md hover:scale-[1.1] duration-200">cancel</button>
                                        </DialogClose>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </> :
                        <> </>
            }
        </>
    )
}

export default page