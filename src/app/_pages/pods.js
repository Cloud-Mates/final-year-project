import Loader from '@/components/ui/Loader';
import { UserSquare2 } from 'lucide-react';
import React from 'react'
import { useState, useEffect } from 'react';





const pods = ({ config, backendURI, backendPasskey }) => {

  const [fetchstatus, setfetchstatus] = useState(0);
  const [result, setresult] = useState("")


  const fetchResult = async () => {
    if (!config) {
      return setfetchstatus(2);
    } else {
      setfetchstatus(3);
    }

    try {
      const testData = await fetch(`${backendURI}/api/k8s/pods`,
        {
          method: 'POST',
          body: JSON.stringify(config),
          headers: { 'Content-Type': 'application/json', passkey: backendPasskey },
          mode: "cors"
        },
        { cache: 'no-store' });

      // console.log(testData);
      if (testData?.status == 200) {
        const res = await testData.json()
        setresult(res.data.pods.items)
        // setStatus(status)
        return setfetchstatus(1);
        } else {
          return setfetchstatus(2)
          }
          } catch (error) {
            return setfetchstatus(2)
            }
            }
            const status = result[0]?.status?.conditions[0]?.type
            // console.log("status",status);

// console.log("status",a);
  


  
   function CardComp({pod}) {
    const [status,setStatus] = useState('')
    useEffect(()=>{
      const arr = pod?.status?.conditions.filter(arr=>arr.type=='Ready')
      // console.log("arr",arr)
      setStatus(arr[0]?.status)

    },[CardComp])

    return (
      <section className="relative w-full overflow-hidden pb-14">
        <div className="relative  z-10 mx-auto max-w-7xl px-4 ">
          <div className="mx-auto md:max-w-4xl">
            <div className="-m-5 flex flex-wrap">
              <div className="w-full p-5">
                <div className="rounded-md border  bg-opacity-90 shadow-xl bg-[#7086c3]">
                  <div className=" border-b">
                    <div className="px-9 py-1 flex items-center justify-between">
                      <h3 className="text-black mb-3 text-xl font-bold leading-snug ">{pod.metadata.generateName}</h3>
                      <div className='flex justify-center items-center'>
                      <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                              {pod.status.phase} 
                            </span>
                      <span className="inline-flex rounded-full px-1  text-xs font-semibold leading-5">
                              @
                            </span>
                      <span className="inline-flex rounded-full bg-white-100  text-xs font-semibold leading-5 text-black-800">
                              {pod.status.podIP}
                            </span>
                      </div>
                    </div>
                    <div className='px-9 pb-2'>{pod.metadata.namespace}</div>
                  </div>
                  <div className="px-9  pt-4">
                    <ul className="mb-11">
                    <li className="mb-4 gap-2 flex items-center">
                        Host IP:
                        <p className="font-semibold leading-normal">
                      {pod.status?.hostIP}
                    </p>
                    </li>
                      <li className="mb-4 gap-2 flex items-center">
                        Type: 
                        <p className="font-semibold leading-normal"> {pod.metadata?.ownerReferences?.[0]?.kind
                        }</p>
                      </li>
                      <li className="mb-4 gap-2 flex items-center">
                        Label: 
                        <p className="font-semibold leading-normal"> {pod.metadata?.labels?.app} </p>
                      </li>
                      <li className="mb-4 gap-2 flex items-center">
                        Node:
                        <p className="font-semibold leading-normal">{pod.spec?.nodeName}</p>
                      </li>
                      <li className="mb-4 gap-2 flex items-center">
                        
                        Ready: 
                        <p className="font-semibold leading-normal">{status} </p>
                      </li>
                      <li className="flex gap-2 items-center">
                        Images: 
                        <p className="font-semibold leading-normal">{pod.spec?.containers?.length}</p>
                      </li>
                    </ul>
                    
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </section>
    )
  }
  



  useEffect(() => {
    fetchResult();
  }, [config])

  // console.log(result)


  // console.log(fetchstatus);



  return (
    <>

      {
        result ?
        <div className='text-[14px] font-thin font-serif'>
<div className='font-semibold p-6 text-center text-2xl'>Pods ({result.length})</div>
            {result.map((i)=>(<CardComp key={i.metadata.uid} className='' pod={i}></CardComp>))}
          </div> :
          fetchstatus == 2 ?
            <div>Cannot fetch data, please try again</div> :
            <div className="h-screen flex justify-center items-center">
              <Loader />
            </div>
      }
    </>

  )
}

export default pods