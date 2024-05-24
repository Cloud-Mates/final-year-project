"use client"

import Image from "next/image";
import { useState, useEffect } from "react";
import yaml from 'js-yaml'

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

import { useRouter } from 'next/navigation'



export default function Home() {

  const router = useRouter()

  const [allClusters, setallClusters] = useState([]);
  const [deleteclusterName, setdeleteclusterName] = useState("")

  useEffect(() => {
    let localConfigs = { ...localStorage }
    localConfigs = Object.entries(localConfigs).map((e) => ({ [e[0]]: e[1] }));
    localConfigs = localConfigs?.filter(item => { return (Object.keys(item)?.[0]?.substring(0, 11) == "kubernetes-") })

    // setconfigJSON(localConfigs);
    for (let i = 0; i < localConfigs.length; i++) {
      yaml.loadAll(Object.values(localConfigs[i])[0], function (data) {
        if (data) {
          if (typeof data == "object") {
            localConfigs[i]["name"] = Object.keys(localConfigs[i])[0]?.slice(11, Object.keys(localConfigs[i])[0].length)
            localConfigs[i]["address"] = data.clusters?.[0]?.cluster?.server?.slice(8, data.clusters?.[0]?.cluster?.server?.length)
          } else {
            setconfigJSON("");
          }
        }
      });

      setallClusters(localConfigs);
    }

  }, []);


  const deletecluster = () => {
    localStorage.removeItem(`kubernetes-${deleteclusterName}`);
    router.push("/redirecting");
  }


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-500 pb-6 pt-8 backdrop-blur-2xl border-neutral-800 bg-zinc-800/30 from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:bg-zinc-800/30">
          Kubernetes monitoring & execution tool
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-[#3e4965] via-[#4a4d5e] from-black via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            {/* <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="invert"
              width={100}
              height={24}
              priority
            /> */}
            <span className="text-[30px] font-semibold font-serif">CloudMates</span>
          </a>
        </div>
      </div>

      <Dialog>
        <div className="relative flex w-[100%] gap-4 place-items-center min-h-[20rem]">
          { allClusters.length == 0 ?
          <div className="w-full text-center text-[32px] text-slate-500 flex items-center justify-center gap-4"><span className="text-[44px]">+</span> Add a new cluster connection</div> :
            allClusters.map(((item, index) => {
              return (
                <a
                  key={index}
                  href={`/cluster/${item.name}/dashboard`}
                  className="relative rounded-lg shadow-[#5c5c5c] shadow-md px-8 py-6 transition-colors border border-neutral-600 hover:border-neutral-700 hover:bg-neutral-800/30"
                  // target="_blank"
                  rel="noopener noreferrer"
                >
                  <h2 className={`mb-3 text-2xl font-semibold`}>
                    {item.name}
                  </h2>
                  <p className={`m-0 max-w-[30ch] text-lg opacity-50`}>
                    {item.address}
                  </p>

                  <DropdownMenu>
                    <DropdownMenuTrigger className="bg-[#606060] absolute top-1 right-1 p-2 rounded-md">
                      <svg fill="none" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M10 6C8.89543 6 8 5.10457 8 4C8 2.89543 8.89543 2 10 2C11.1046 2 12 2.89543 12 4C12 5.10457 11.1046 6 10 6Z" fill="white" /><path d="M10 12C8.89543 12 8 11.1046 8 10C8 8.89543 8.89543 8 10 8C11.1046 8 12 8.89543 12 10C12 11.1046 11.1046 12 10 12Z" fill="white" /><path d="M10 18C8.89543 18 8 17.1046 8 16C8 14.8954 8.89543 14 10 14C11.1046 14 12 14.8954 12 16C12 17.1046 11.1046 18 10 18Z" fill="white" /></svg>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-[#4c4f51] text-slate-100 border-[#4c4f51]">
                      <DropdownMenuLabel>Options</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-slate-500" />
                      <DropdownMenuItem className="cursor-pointer"><DialogTrigger onClick={() => { setdeleteclusterName(item.name) }}>Delete Cluster</DialogTrigger></DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                </a>
              )
            }))
          }
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

      <hr className="w-[70vw] border border-[#535963] "/>


      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <a
          href="/auth/kubernetes"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors  hover:border-neutral-700 hover:bg-neutral-800/30"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-xl font-semibold`}>
            New Cluster Connection{" "}
          </h2>
          <p className={`m-0 max-w-[30ch] text-xs opacity-50`}>
            connect new cluster by importing k8s config file
          </p>
        </a>

        <a
          href="#"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors  hover:border-neutral-700 hover:bg-neutral-800 hover:bg-opacity-30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-xl font-semibold`}>
            About this project{" "}
          </h2>
          <p className={`m-0 max-w-[30ch] text-xs opacity-50`}>
            Get a detailed informaton about this project
          </p>
        </a>

        <a
          href="https://github.com/Cloud-Mates/demo-server/tree/main"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors  hover:border-neutral-700 hover:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-xl font-semibold`}>
            Github Repository{" "}
          </h2>
          <p className={`m-0 max-w-[30ch] text-xs opacity-50`}>
            Explore the codebase and other projects also!
          </p>
        </a>

      </div>
    </main>
  );
}
