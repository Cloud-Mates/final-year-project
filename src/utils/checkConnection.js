import k8s from '@kubernetes/client-node'

const checkConnection = ({ configString }) => {
    const kc = new k8s.KubeConfig();
    kc.loadFromString(JSON.stringify(configString));
    const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

    return k8sApi
}

export default checkConnection