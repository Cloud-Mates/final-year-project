import Loader from "@/components/ui/Loader";
import React from "react";
import { useState, useEffect } from "react";

const services = ({ config, backendURI, backendPasskey }) => {
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
        `${backendURI}/api/k8s/services`,
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

  console.log(result);

  console.log(fetchstatus);

  return (
    <>
      {result ? (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {result?.data?.services?.items.map((service, index) => (
            <div
              key={index}
              className="bg-[#7086c3] rounded-lg shadow-md p-4 w-full max-w-lg"
            >
              <div className="flex flex-col space-y-2">
                <p className="text-xl text-black font-bold">
                  <span className="">Name:</span>{" "}
                  {service.metadata.name}
                </p>
                <p>
                  <span className="font-semibold">Creation Timestamp:</span>{" "}
                  {service.metadata.creationTimestamp}
                </p>
                <p>
                  <span className="font-semibold">Namespace:</span>{" "}
                  {service.metadata.namespace}
                </p>
                <p>
                  <span className="font-semibold">Cluster IP:</span>{" "}
                  {service.spec.clusterIP}
                </p>
                <div className="bg-[#323e61] p-2 rounded-md mt-2">
                  <span className="text-lg font-semibold">Ports</span>
                  {service.spec.ports.map((port, portIndex) => (
                    <div
                      key={portIndex}
                      className="mt-2 bg-[#4c587a] rounded-sm p-2"
                    >
                      <p>
                        <span className="font-semibold">Name:</span> {port.name}
                      </p>
                      <p>
                        <span className="font-semibold">Port:</span> {port.port}
                      </p>
                      <p>
                        <span className="font-semibold">Protocol:</span>{" "}
                        {port.protocol}
                      </p>
                      <p>
                        <span className="font-semibold">Target Port:</span>{" "}
                        {port.targetPort}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
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

export default services;
