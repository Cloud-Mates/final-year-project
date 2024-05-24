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

const page = ({ params }) => {
  const [configJSON, setconfigJSON] = useState("")

  useEffect(() => {
    let value = localStorage.getItem(`kubernetes-${params.name[0]}`) || ""
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

      return <Dashboard config={configJSON} />
      break;

    case "events":

      return <Events config={configJSON} />
      break;

    case "namespace":

      return <Namespace config={configJSON} />
      break;

    case "nodes":

      return <Nodes config={configJSON} />
      break;

    case "pods":

      return <Pods config={configJSON} />
      break;

    case "services":

      return <Services config={configJSON} />
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