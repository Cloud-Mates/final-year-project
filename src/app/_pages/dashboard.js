"use client";
import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import PieChartCom from "@/components/ui/PieChartCom";
import Loader from "@/components/ui/Loader";

const dashboard = ({ config, backendURI, backendPasskey, params }) => {
  const param = params.name[0];
  const [fetchstatus, setfetchstatus] = useState(0);
  const [result, setresult] = useState("");

  const fetchResult = async () => {
    if (!config) {
      return setfetchstatus(2);
    } else {
      setfetchstatus(3);
    }

    try {
      const testData = await fetch(
        `${backendURI}/api/k8s/dashboard`,
        {
          method: "POST",
          body: JSON.stringify(config),
          headers: {
            "Content-Type": "application/json",
            passkey: backendPasskey,
          },
          mode: "cors",
        },
        { cache: "no-store" }
      );

      // console.log(testData);
      if (testData?.status == 200) {
        setresult(await testData.json());
        return setfetchstatus(1);
      } else {
        return setfetchstatus(2);
      }
    } catch (error) {
      return setfetchstatus(2);
    }
  };

  useEffect(() => {
    fetchResult();
  }, [config]);

  const checkComponentStatus = (componentStatus) => {
    const healthyComponents = componentStatus.filter(
      (component) =>
        component.conditions[0].type === "Healthy" &&
        component.conditions[0].status === "True"
    );
    const unhealthyComponents = componentStatus.filter(
      (component) =>
        !(
          component.conditions[0].type === "Healthy" &&
          component.conditions[0].status === "True"
        )
    );

    return {
      healthyCount: healthyComponents.length,
      unhealthyCount: unhealthyComponents.length,
    };
  };

  const [healthyComponent, setHealthyComponent] = useState();
  const [unhealthyComponent, setUnHealthyComponent] = useState();

  const filterEvents = (events) => {
    let normalCount = 0;
    let warningCount = 0;

    events.forEach((event) => {
      if (event.Normal !== undefined) {
        normalCount += event.Normal;
      }
      if (event.Warning !== undefined) {
        warningCount += event.Warning;
      }
    });

    return { normalCount, warningCount };
  };

  const [normalEvent, setNormalEvent] = useState();
  const [warningEvents, setWarningEvents] = useState();

  useEffect(() => {
    if (result) {
      setHealthyComponent(
        checkComponentStatus(result?.data?.componentStatus).healthyCount
      );
      setUnHealthyComponent(
        checkComponentStatus(result?.data?.componentStatus).unhealthyCount
      );
      setNormalEvent(filterEvents(result?.data?.events).normalCount);
      setWarningEvents(filterEvents(result?.data?.events).warningCount);
    }
  }, [result]);

  console.log(result);
  console.log(fetchstatus);
  const [currIndex, setCurrIndex] = useState();

  return (
    <>
      {result ? (
        <div className="p-4 flex gap-4 flex-col">
          <div className="bg-[#8696c3] w-full rounded-md shadow-md text-center flex justify-center items-center p-2 text-2xl text-black font-bold">
            <p className="text-lg">Api Server Endpoint : </p>
            <p className="font-bold text-yellow-400 text-base">
              {result?.data?.apiServerEndpoint}
            </p>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* pods */}
            <div className="flex flex-col gap-2 w-full justify-center items-center bg-[#8696c3] rounded-md shadow-md p-4">
              <span className="text-2xl font-bold text-teal-900">Pods</span>
              {result?.data?.pods && (
                <div className="text-gray-800 mb-2 text-xl">
                  <p>
                    <span className="font-semibold">Total Pods:</span>{" "}
                    {result.data.pods.totalPods}
                  </p>
                  <p>
                    <span className="font-semibold">Running Pods:</span>{" "}
                    {result.data.pods.runningPods}
                  </p>
                  <p>
                    <span className="font-semibold">Terminated Pods:</span>{" "}
                    {result.data.pods.terminatedPods}
                  </p>
                  <p>
                    <span className="font-semibold">Failed Pods:</span>{" "}
                    {result.data.pods.failedPods}
                  </p>
                </div>
              )}
              <PieChartCom
                data={[
                  {
                    name: "Running Pods",
                    value: result.data.pods.runningPods,
                    color: "#00C49F",
                  },
                  {
                    name: "Terminated Pods",
                    value: result.data.pods.terminatedPods,
                    color: "#fa0303",
                  },
                  {
                    name: "Failed Pods",
                    value: result.data.pods.failedPods,
                    color: "#d94c05",
                  },
                ]}
              />
              <a href={`/cluster/${param}/pods`}>
                <button className="bg-teal-900 text-white rounded-sm p-4 hover:bg-teal-700 hover:text-gray-200 hover:shadow-lg transition duration-300 z-50">
                  Click here for more Details
                </button>
              </a>
            </div>

            {/* nodes */}
            <div className="flex flex-col gap-4 w-full justify-center items-center bg-[#8696c3] rounded-md shadow-md p-6">
              <span className="text-2xl font-bold text-teal-900">Nodes</span>
              {result?.data?.nodes.map((node, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-2 w-full justify-center items-center bg-[#323e61] rounded-md shadow-md p-4  cursor-pointer"
                  onClick={() => setCurrIndex(index)}
                >
                  <div>
                    <span className="text-lg font-semibold">
                      Hostname: {node.hostname}
                    </span>
                  </div>
                  <div
                    className={`flex flex-col justify-center  gap-4 ${
                      currIndex === index
                        ? "visible transition duration-1000 ease-in-out"
                        : "hidden"
                    }`}
                  >
                    <div className="text-lg font-semibold">Addresses:</div>
                    <div>
                      <ul className="list-disc pl-6">
                        {node.addresses.map((address, idx) => (
                          <li key={idx} className="text-sm">
                            {address}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-lg font-semibold">
                      Ready: {node.ready}
                    </div>
                    <div className="text-lg font-semibold">Capacity:</div>
                    <div>
                      <ul className="list-disc pl-6">
                        {Object.entries(node.capacity).map(
                          ([key, value], idx) => (
                            <li key={idx}>
                              <span className="font-semibold">{key}:</span>{" "}
                              {value}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
              <a href={`/cluster/${param}/nodes`}>
                <button className="bg-teal-900 text-white rounded-sm p-4 hover:bg-teal-700 hover:text-gray-200 hover:shadow-lg transition duration-300">
                  Click here for more Details
                </button>
              </a>
            </div>

            

            {/* componentStatus */}

            <div className="flex flex-col gap-4 w-full justify-center items-center bg-[#8696c3] rounded-md shadow-md p-6">
              <span className="text-2xl font-bold text-teal-900">
                Component Status
              </span>
              <span className="text-green-900 font-bold">
                Healthy Component : {healthyComponent}
              </span>
              <span className="text-red font-bold">
                Unhealthy Component : {unhealthyComponent}
              </span>
              <span className="flex flex-col gap-4">
                {result?.data?.componentStatus.map((component, index) => (
                  <div
                    key={index}
                    className="text-white bg-[#323e61] border-slate-100 p-2 rounded-sm"
                  >
                    <p className="font-bold">
                      <span className="font-semibold text-lg">Name:</span>{" "}
                      {component.name}
                    </p>
                    <p className="">
                      <span className="font-semibold text-lg">Type:</span>{" "}
                      {component.conditions[0].type}
                    </p>
                  </div>
                ))}
              </span>
              <PieChartCom
                data={[
                  {
                    name: "Healthy Components",
                    value: healthyComponent,
                    color: "#00C49F",
                  },
                  {
                    name: "Unhealthy Components",
                    value: unhealthyComponent,
                    color: "#FF8042",
                  },
                ]}
              />
            </div>
            {/* events */}
            <div className="flex flex-col gap-2 w-full justify-center items-center bg-[#8696c3] rounded-md shadow-md p-4">
              <span className="text-2xl font-bold text-teal-900">Events</span>
              <div className="w-full flex flex-col justify-center items-center">
                <div className="text-gray-800 mb-2">
                  <div></div>
                  <p>
                    <span className="font-semibold">Normal</span> {normalEvent}
                  </p>
                </div>
                <div className="text-gray-800 mb-2">
                  <div></div>
                  <p>
                    <span className="font-semibold">warning</span>{" "}
                    {warningEvents}
                  </p>
                </div>
              </div>
              <PieChartCom
                data={[
                  {
                    name: "Normal Events",
                    value: normalEvent,
                    color: "#36A2EB",
                  },
                  {
                    name: "Warning Events",
                    value: warningEvents,
                    color: "#d94c05",
                  },
                ]}
              />
            </div>

            {/* Services */}
            <div className="flex flex-col gap-4 w-full justify-center items-center bg-[#8696c3] rounded-md shadow-md p-4">
              <span className="text-2xl font-bold text-teal-900">Services</span>

              {result?.data?.services && (
                <div className="text-gray-800 mb-2 flex flex-col gap-2 justify-center items-start">
                  {Object.entries(result.data.services)
                    .slice(0, 5)
                    .map(([serviceName, serviceInfo], index) => (
                      <p key={index}>
                        <span className="font-semibold">{serviceName}:</span>{" "}
                        {serviceInfo}
                      </p>
                    ))}
                </div>
              )}

              <a href={`/cluster/${param}/services`}>
                <button className="bg-teal-900 text-white rounded-sm p-4 hover:bg-teal-700 hover:text-gray-200 hover:shadow-lg transition duration-300">
                  Explore more Services
                </button>
              </a>
            </div>
            {/* Namespace */}
            <div className="flex flex-col gap-2 w-full justify-center items-center bg-[#8696c3] rounded-md shadow-md p-4">
              <span className="text-2xl font-bold text-teal-900">
                Namespaces
              </span>
              <div className="w-full flex flex-col justify-center items-center">
                {result?.data?.namespace.map((namespace, index) => (
                  <div key={index} className="text-gray-800 mb-2">
                    <p>
                      <span className="font-semibold">Namespace:</span>{" "}
                      {namespace}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            
            
            
          </div>
        </div>
      ) : fetchstatus == 2 ? (
        <div>Cannot fetch data, please try again</div>
      ) : (
        <div className="h-screen flex justify-center items-center">
          <Loader />
        </div>
      )}
    </>
  );
};

export default dashboard;
