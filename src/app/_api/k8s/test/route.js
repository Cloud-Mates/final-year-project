import { NextResponse } from "next/server";
const k8s = require('@kubernetes/client-node');

const kc = new k8s.KubeConfig();


export async function POST(request) {

    try {
        const config = await request.json()
        kc.loadFromString(JSON.stringify(config));
        const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

        const nodes = await k8sApi.listNamespace()

        // const nodes = await k8sApi.getAPIResources('default')
        // const nodes = await k8sApi.listNode('default')
        // const nodes = await k8sApi.listComponentStatus('default')
        // const nodes = await k8sApi.listNamespacedPod('default')
        // const nodes = await k8sApi.listPodForAllNamespaces()
        // const nodes = await k8sApi.listServiceForAllNamespaces()
        // const nodes = await k8sApi.listSecretForAllNamespaces()
        // const nodes = await k8sApi.listPersistentVolume()
        // const nodes = await k8sApi.readNode('8bitboy')

        return NextResponse.json({ message: "API is working", data: nodes?.body }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error }, { status: 400 });
    }
}