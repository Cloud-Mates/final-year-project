import React from 'react'
import { useState, useEffect } from 'react';


const people = [
  {
    name: 'John Doe',
    title: 'Front-end Developer',
    department: 'Engineering',
    email: 'john@devui.com',
    role: 'Developer',
    image:
      'https://images.unsplash.com/photo-1628157588553-5eeea00af15c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80',
  },
  {
    name: 'Jane Doe',
    title: 'Back-end Developer',
    department: 'Engineering',
    email: 'jane@devui.com',
    role: 'CTO',
    image:
      'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=928&q=80',
  },
]



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
        return setfetchstatus(1);
      } else {
        return setfetchstatus(2)
      }
    } catch (error) {
      return setfetchstatus(2)
    }
  }


  function TableOne() {
    return (
      <>
        <section className="mx-auto w-full max-w-7xl px-4 py-4">
          
          <div className="mt-6 flex flex-col">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden border border-gray-200 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                        >
                          <span>Ip</span>
                        </th>
                        <th
                          scope="col"
                          className="px-12 py-3.5 text-left text-sm font-normal text-gray-700"
                        >
                          Title
                        </th>

                        <th
                          scope="col"
                          className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                        >
                          Status
                        </th>

                        <th
                          scope="col"
                          className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                        >
                          Age 
                        </th>
                        {/* <th scope="col" className="relative px-4 py-3.5">
                          <span className="sr-only">Edit</span>
                        </th> */}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {result.map((pod) => (
                        pod.status.startTime?
                        (<tr key={Math.random()}>
                          <td className="whitespace-nowrap px-4 py-4">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0 text-black">
                                {pod.status?.podIP}
                              </div>
                             
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-12 py-4">
                            <div className="text-sm text-gray-900 ">{(pod.metadata.generateName)}</div>
                          </td>
                          <td className="whitespace-nowrap px-4 py-4">
                            <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                              {pod.status.phase}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                            {new Date(pod.status.startTime).getDate()}
                          </td>
                          
                        </tr>):<div></div>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    )
  }


  useEffect(() => {
    fetchResult();
  }, [config])

  console.log(result)


  console.log(fetchstatus);



  return (
    <>
      <div className='font-semibold p-6 text-center text-2xl'>Pods ({result.length})</div>

      {
        result ?
          <div className='text-[14px] font-thin font-serif'><TableOne /></div> :
          fetchstatus == 2 ?
            <div>Cannot fetch data, please try again</div> :
            <div>please wait...</div>
      }
    </>

  )
}

export default pods