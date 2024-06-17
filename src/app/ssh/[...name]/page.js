'use client'

import React, { useState, useEffect } from 'react';
import Terminal, { ColorMode, TerminalOutput } from 'react-terminal-ui';
import CryptoJS from 'crypto-js';


const TerminalController = ({ params }) => {

  const [configSSH, setconfigSSH] = useState("");
  const [backendURI, setbackendURI] = useState("");
  const [backendPasskey, setbackendPasskey] = useState("");

  useEffect(() => {
    let sessionpin = sessionStorage.getItem(`kubernetes-${params.name[0]}`);

    let lsdata = localStorage.getItem(`kubernetes-${params.name[0]}`) || "";

    if (!lsdata) {
      return window.location.href = "/";
    }

    try {
      var bytes = CryptoJS.AES.decrypt(lsdata, sessionpin);
      var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      // console.log(error);
      // alert(`unable to match pin :(`);
      window.location.pathname = `/connection/${params.name[0]}`
    }

    // console.log(decryptedData);
    setbackendURI(decryptedData?.backend?.uri);
    setbackendPasskey(decryptedData?.backend?.passkey);

    var value = decryptedData?.ssh;
    setconfigSSH(value)

  }, []);



  const [terminalLineData, setTerminalLineData] = useState([
    <TerminalOutput>Terminal is ready to run command!</TerminalOutput>
  ]);

  const execCommand = async (terminalInput) => {
    //execute command here
    if (!terminalInput) {
      console.log("Empty input");
      return
    }

    if (terminalInput == "clear") {
      setTerminalLineData(data => []);
      return
    }


    try {
      setTerminalLineData(data => [
        ...data,
        <TerminalOutput><span className='font-black text-[#8fffbf]'>$ {terminalInput}</span></TerminalOutput>,
        <TerminalOutput><span className='font-thin text-[#dbd15e]'>Fetching...</span></TerminalOutput>
      ]);

      const testData = await fetch(`${backendURI}/api/ssh/exec`,
        {
          method: 'POST',
          body: JSON.stringify({
            "host": configSSH?.host,
            "port": configSSH?.port,
            "username": configSSH?.username,
            "privateKey": configSSH?.privateKey,
            "command": terminalInput
          }),
          headers: { 'Content-Type': 'application/json', passkey: backendPasskey },
          mode: "cors"
        },
        { cache: 'no-store' });


      if (testData?.status == 200) {
        const output = await testData.json();
        // console.log(output?.data);

        const parsedOutput = output?.data?.replace(/\\n/g, "<br/>");
        setTerminalLineData(data => {
          return [
            ...data.slice(0, data.length - 1),
            <TerminalOutput><span className='font-thin text-[#5edb94]' dangerouslySetInnerHTML={{ __html: parsedOutput }}></span></TerminalOutput>
          ]
        });
        return
      } else {
        console.log(testData.status);
        return
      }
    } catch (error) {
      console.log(error);
      return
    }
  }

  return (
    <div className="container max-md:px-2">
      <br />
      <div>
        {/* {configSSH?.host}:{configSSH?.port}@{configSSH?.username} <br /> */}
        {/* {JSON.stringify(configSSH)} <br /> */}
        {/* {JSON.stringify(backendURI)} <br /> */}
        {/* {JSON.stringify(backendPasskey)} <br /> */}
      </div>
      <Terminal name={`${configSSH?.host}:${configSSH?.port}@${configSSH?.username}`} colorMode={ColorMode.Dark} onInput={terminalInput => { execCommand(terminalInput) }}>
        {terminalLineData}
      </Terminal>
    </div>
  )
};

export default TerminalController