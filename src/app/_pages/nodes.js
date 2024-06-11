import Loader from '@/components/ui/Loader';
import React from 'react'
import { useState, useEffect } from 'react';


function CardComp({node}) {
  const [status,setStatus] = useState('')
  // console.log("node",node)
  // useEffect(()=>{
  //   const arr = node?.status?.conditions.filter(arr=>arr.type=='Ready')
  //   // console.log("arr",arr)
  //   setStatus(arr[0]?.status)

  // },[CardComp])

  return (
    <section className="relative w-full overflow-hidden pb-14">
      <div className="relative  z-10 mx-auto max-w-7xl px-4">
        <div className="mx-auto md:max-w-4xl">
          <div className="-m-5 flex flex-wrap">
            <div className="w-full p-5 ">
              <div className="rounded-md border  bg-opacity-90 shadow-xl bg-[#7086c3] ">
                <div className=" border-b">
                  <div className="px-9 py-1 flex items-center justify-between">
                    <h3 className="text-black m-3 text-xl font-bold leading-snug ">{node.metadata?.name}</h3>
                    <div className='flex justify-center items-center'>
                    <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                            {node.status?.phase} 
                          </span>
                    
                    
                    </div>
                  </div>
                  <div className='px-9 pb-2'>{node.metadata?.namespace}</div>
                </div>
                <div className="px-9  pt-4">
                  <ul className="mb-11">
                  <li className="mb-4 gap-2 flex items-center">
                      Port:
                      <p className="font-semibold leading-normal">
                    {node.status?.daemonEndpoints?.kubeletEndpoint?.Port}
                  </p>
                  </li>
                    <li className="mb-4 gap-2 flex items-center">
                      Os Image: 
                      <p className="font-semibold leading-normal"> {node.status?.nodeInfo?.osImage
                      }</p>
                    </li>
                    <li className="mb-4 gap-2 flex items-center">
                      Architecture: 
                      <p className="font-semibold leading-normal"> {node.status?.nodeInfo?.architecture} </p>
                    </li>
                    <li className="mb-4 gap-2 flex items-center">
                      Capacity Used:
                      <p className="font-semibold leading-normal">{(node.status.allocatable?.pods-node.status.capacity?.pods)/node.status.allocatable?.pods*100}%</p>
                    </li>
                    <li className="mb-4 gap-2 flex items-center">
                      
                      Age: 
                      <p className="font-semibold leading-normal">{new Date(node.metadata?.creationTimestamp).getDate()} days </p>
                    </li>
                    <li className="flex gap-2 items-center">
                      Images: 
                      <p className="font-semibold leading-normal">{node.status?.images?.length}</p>
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

const nodes = ({ config, backendURI, backendPasskey }) => {

  const [fetchstatus, setfetchstatus] = useState(0);
  const [result, setresult] = useState("")

  const fetchResult = async () => {
    if (!config) {
      return setfetchstatus(2);
    } else {
      setfetchstatus(3);
    }

    try {
      const testData = await fetch(`${backendURI}/api/k8s/nodes`,
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
        setresult(res.data.nodes.items)
        return setfetchstatus(1);
      } else {
        return setfetchstatus(2);
      }
    } catch (error) {
      return setfetchstatus(2);
    }
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
            <div className='font-semibold p-6 text-center text-2xl'>Nodes ({result.length})</div>
            {result.map((item)=><CardComp node={item} key={Math.random()}/>)}
            </div> :
          fetchstatus == 2 ?
            <div>Cannot fetch data, please try again</div> :
<div className="h-screen flex justify-center items-center">
          <Loader />
        </div>      }
    </>

  )
}

export default nodes