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

    const testData = await fetch(`/api/k8s/getdashboardinfo`,
      {
        method: 'POST',
        body: JSON.stringify(config)
      },
      { cache: 'no-store' });

      console.log(testData);
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