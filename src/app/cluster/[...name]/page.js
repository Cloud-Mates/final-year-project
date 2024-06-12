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

const page = ({ params }) => {
  // console.log({params});
  const [configJSON, setconfigJSON] = useState("");
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
      // alert(`unable to match pin :(`);
      window.location.pathname = `/connection/${params.name[0]}`
    }

    // console.log(decryptedData);
    setbackendURI(decryptedData?.backend?.uri);
    setbackendPasskey(decryptedData?.backend?.passkey);

    var value = decryptedData?.kubernetes?.configs

    yaml.loadAll(value, function (data) {
      if (data) {
        if (typeof data == "object") {
          setconfigJSON(data);
        } else {
          setconfigJSON("");
        }
      }
    });
  }, []);


  switch (params?.name?.[1]) {

    case "dashboard":

      return <Dashboard backendURI={backendURI} backendPasskey={backendPasskey} config={configJSON} params={params}/>
      break;

    case "events":

      return <Events backendURI={backendURI} backendPasskey={backendPasskey} config={configJSON} params={params}/>
      break;

    case "namespace":

      return <Namespace backendURI={backendURI} backendPasskey={backendPasskey} config={configJSON} params={params}/>
      break;

    case "nodes":

      return <Nodes backendURI={backendURI} backendPasskey={backendPasskey} config={configJSON} params={params}/>
      break;

    case "pods":

      return <Pods backendURI={backendURI} backendPasskey={backendPasskey} config={configJSON} params={params}/>
      break;

    case "services":

      return <Services backendURI={backendURI} backendPasskey={backendPasskey} config={configJSON} params={params}/>
      break;

    case "component-status":

      return <Components backendURI={backendURI} backendPasskey={backendPasskey} config={configJSON} params={params}/>
      break;

    default:
      break;
  }

  return (
    <>
      {/* <div>{(window.location.href)}</div> */}
      <div>page</div>
      <div>{JSON.stringify(configJSON)}</div>
    </>
  )
}

export default page