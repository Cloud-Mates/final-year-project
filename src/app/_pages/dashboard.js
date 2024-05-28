import React from 'react'
import { useState, useEffect } from 'react';



const dashboard = ({ config }) => {

  const [fetchstatus, setfetchstatus] = useState(0);
  const [result, setresult] = useState("")

  const fetchResult = async () => {
    if (!config) {
      return setfetchstatus(2);
    }else{
      setfetchstatus(3);
    }

    const testData = await fetch(`http://localhost:4000/api/k8s/dashboard`,
      {
        method: 'POST',
        body: JSON.stringify(config),
        headers: { 'Content-Type': 'application/json', passkey: "7f2f3bc4c1bce93af91d6874a774f1573d8e133218735f63b43e30fecb36c58b" },
        mode: "cors"
      },
      { cache: 'no-store' });

      // console.log(testData);
    if (testData?.status == 200) {
      setresult(await testData.json())
      return setfetchstatus(1);
    } else {
      return setfetchstatus(2)
    }
  }

  useEffect(() => {
    fetchResult();
  }, [config])

  console.log(result)


  console.log(fetchstatus);

  return (
    <>
      <div>dashboard</div>

      {
        result ?
          <div className='text-[14px] font-thin font-serif'><pre>{JSON.stringify(result, null, 3)}</pre></div> :
          fetchstatus == 2 ?
            <div>Cannot fetch data, please try again</div> :
            <div>please wait...</div>
      }
    </>

  )
}

export default dashboard