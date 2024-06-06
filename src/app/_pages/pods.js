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
        setresult(await testData.json())
        return setfetchstatus(1);
      } else {
        return setfetchstatus(2)
      }
    } catch (error) {
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

export default pods