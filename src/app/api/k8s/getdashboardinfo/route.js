import { NextResponse } from "next/server";
const k8s = require('@kubernetes/client-node');

const kc = new k8s.KubeConfig();


export async function POST(request) {

    try {
        const config = await request.json()
        kc.loadFromString(JSON.stringify(config));
        const k8sApi = kc.makeApiClient(k8s.CoreV1Api);


        const nodes = await k8sApi.listNode()
        const componentStatus = await k8sApi.listComponentStatus()
        const namespace = await k8sApi.listNamespace()
        const services = await k8sApi.listServiceForAllNamespaces()
        const events = await k8sApi.listEventForAllNamespaces()
        const pods = await k8sApi.listPodForAllNamespaces()
        const listAllEndpoints = await k8sApi.listEndpointsForAllNamespaces()


        // const nodes = await k8sApi.getAPIResources('default')
        // const listReplicationControllerForAllNamespaces = await k8sApi.listReplicationControllerForAllNamespaces()
        // const listResourceQuotaForAllNamespaces = await k8sApi.listResourceQuotaForAllNamespaces()
        // const readNodeStatus = await k8sApi.readNodeStatus('8bitboy')

        // const nodes = await k8sApi.listNamespacedPod('default')
        // const nodes = await k8sApi.listSecretForAllNamespaces()
        // const nodes = await k8sApi.listPersistentVolume()
        // const node_8bitboy = await k8sApi.readNode('node1-lenovo')


        var podStatus = {
            "PodReadyToStartContainers": [0, 0],
            "Initialized": [0, 0],
            "Ready": [0, 0],
            "ContainersReady": [0, 0],
            "PodScheduled": [0, 0],
            "DisruptionTarget": [0, 0],
        }

        for (let index = 0; index < pods?.body?.items?.map(item => { return item.status?.conditions?.map(item => { return { [item?.type]: item?.status } }) }).length; index++) {

            pods?.body?.items?.map(item => { return item.status?.conditions?.map(item => { return { [item?.type]: item?.status } }) })[index].forEach(item => { item[Object.keys(item)[0]] == "True" ? podStatus[Object.keys(item)[0]][0] += 1 : podStatus[Object.keys(item)[0]][1] += 1 })

        }

        const apiServerEndpoint = listAllEndpoints?.body?.items?.filter(item => item?.metadata?.name == "kubernetes")?.[0]?.subsets?.[0];


        const data = {
            apiServerEndpoint: `${apiServerEndpoint?.addresses?.[0]?.ip}:${apiServerEndpoint?.ports?.[0]?.port}`,
            componentStatus: componentStatus?.body?.items?.map(item => { return { name: item?.metadata?.name, conditions: item?.conditions } }),
            namespace: namespace?.body?.items?.map(item => item?.metadata?.name),
            events: [...new Set(events?.body?.items?.map(item => item.type))].map(item => { return { [item]: events?.body?.items?.map(item => item.type).filter(x => x == item).length } }),
            nodes: nodes?.body?.items?.map(item => {
                return {
                    hostname: item?.metadata?.name,
                    addresses: item?.status?.addresses?.filter(item => item.type == "InternalIP").map(item => { return item?.address }),
                    ready: item?.status?.conditions?.filter(item => item?.type == "Ready")[0].status,
                    capacity: item?.status?.allocatable,
                    nodeInfo: item?.status?.nodeInfo,
                }
            }),
            pods: {
                totalPods: pods?.body?.items?.length,
                runningPods: podStatus?.ContainersReady[0] - podStatus?.DisruptionTarget[0],
                terminatedPods: podStatus?.DisruptionTarget[0],
                failedPods: podStatus?.PodScheduled[1]
            },
            // pods: pods?.body?.items?.filter(item => { return item?.status?.phase == "Running"}).length,
            services: services?.body?.items.map(item => {
                return {
                    name: item?.metadata?.name, network: `${item?.spec?.clusterIP}: ${item?.spec?.ports[0].port}-> ${item?.spec?.ports[0].targetPort}`
                }
            }).reduce((obj, item) => Object.assign(obj, { [item.name]: item.network }), {}),
        }

        return NextResponse.json({ message: "dashboard data fatched successfully!", data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 400 });
    }
}
