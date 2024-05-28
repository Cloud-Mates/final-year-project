const k8s = require('@kubernetes/client-node');

const kc = new k8s.KubeConfig();


try {
    const config = ""
    kc.loadFromString(JSON.stringify(config));
    const k8sApi = kc.makeApiClient(k8s.CoreV1Api);


    const addInterceptor = await k8sApi.addInterceptor();
    const basePath = await k8sApi.basePath
    const defaultHeaders = await k8sApi.defaultHeaders
    const useQuerystring = await k8sApi.useQuerystring


    const connectDeleteNamespacedPodProxy = await k8sApi.connectDeleteNamespacedPodProxy();
    const connectDeleteNamespacedPodProxyWithPath = await k8sApi.connectDeleteNamespacedPodProxyWithPath();
    const connectDeleteNamespacedServiceProxy = await k8sApi.connectDeleteNamespacedServiceProxy();
    const connectDeleteNamespacedServiceProxyWithPath = await k8sApi.connectDeleteNamespacedServiceProxyWithPath();
    const connectDeleteNodeProxy = await k8sApi.connectDeleteNodeProxy();
    const connectDeleteNodeProxyWithPath = await k8sApi.connectDeleteNodeProxyWithPath();
    const connectGetNamespacedPodAttach = await k8sApi.connectGetNamespacedPodAttach();
    const connectGetNamespacedPodExec = await k8sApi.connectGetNamespacedPodExec();
    const connectGetNamespacedPodPortforward = await k8sApi.connectGetNamespacedPodPortforward();
    const connectGetNamespacedPodProxy = await k8sApi.connectGetNamespacedPodProxy();
    const connectGetNamespacedPodProxyWithPath = await k8sApi.connectGetNamespacedPodProxyWithPath();
    const connectGetNamespacedServiceProxy = await k8sApi.connectGetNamespacedServiceProxy();
    const connectGetNamespacedServiceProxyWithPath = await k8sApi.connectGetNamespacedServiceProxyWithPath();
    const connectGetNodeProxy = await k8sApi.connectGetNodeProxy();
    const connectGetNodeProxyWithPath = await k8sApi.connectGetNodeProxyWithPath();
    const connectHeadNamespacedPodProxy = await k8sApi.connectHeadNamespacedPodProxy()
    const connectHeadNamespacedPodProxyWithPath = await k8sApi.connectHeadNamespacedPodProxyWithPath();
    const connectHeadNamespacedServiceProxy = await k8sApi.connectHeadNamespacedServiceProxy();
    const connectHeadNamespacedServiceProxyWithPath = await k8sApi.connectHeadNamespacedServiceProxyWithPath();
    const connectHeadNodeProxy = await k8sApi.connectHeadNodeProxy()
    const connectHeadNodeProxyWithPath = await k8sApi.connectHeadNodeProxyWithPath()
    const connectOptionsNamespacedPodProxy = await k8sApi.connectOptionsNamespacedPodProxy()
    const connectOptionsNamespacedPodProxyWithPath = await k8sApi.connectOptionsNamespacedPodProxyWithPath();
    const connectOptionsNamespacedServiceProxy = await k8sApi.connectOptionsNamespacedServiceProxy()
    const connectOptionsNamespacedServiceProxyWithPath = await k8sApi.connectOptionsNamespacedServiceProxyWithPath()
    const connectOptionsNodeProxy = await k8sApi.connectOptionsNodeProxy()
    const connectOptionsNodeProxyWithPath = await k8sApi.connectOptionsNodeProxyWithPath()
    const connectPatchNamespacedPodProxy = await k8sApi.connectPatchNamespacedPodProxy()
    const connectPatchNamespacedPodProxyWithPath = await k8sApi.connectPatchNamespacedPodProxyWithPath()
    const connectPatchNamespacedServiceProxy = await k8sApi.connectPatchNamespacedServiceProxy()
    const connectPatchNamespacedServiceProxyWithPath = await k8sApi.connectPatchNamespacedServiceProxyWithPath()
    const connectPatchNodeProxy = await k8sApi.connectPatchNodeProxy()
    const connectPatchNodeProxyWithPath = await k8sApi.connectPatchNodeProxyWithPath()
    const connectPostNamespacedPodAttach = await k8sApi.connectPostNamespacedPodAttach()
    const connectPostNamespacedPodExec = await k8sApi.connectPostNamespacedPodExec()
    const connectPostNamespacedPodPortforward = await k8sApi.connectPostNamespacedPodPortforward()
    const connectPostNamespacedPodProxy = await k8sApi.connectPostNamespacedPodProxy()
    const connectPostNamespacedPodProxyWithPath = await k8sApi.connectPostNamespacedPodProxyWithPath()
    const connectPostNamespacedServiceProxy = await k8sApi.connectPostNamespacedServiceProxy()
    const connectPostNamespacedServiceProxyWithPath = await k8sApi.connectPostNamespacedServiceProxyWithPath()
    const connectPostNodeProxy = await k8sApi.connectPostNodeProxy()
    const connectPostNodeProxyWithPath = await k8sApi.connectPostNodeProxyWithPath()
    const connectPutNamespacedPodProxy = await k8sApi.connectPutNamespacedPodProxy()
    const connectPutNamespacedPodProxyWithPath = await k8sApi.connectPutNamespacedPodProxyWithPath()
    const connectPutNamespacedServiceProxy = await k8sApi.connectPutNamespacedServiceProxy()
    const connectPutNamespacedServiceProxyWithPath = await k8sApi.connectPutNamespacedServiceProxyWithPath()
    const connectPutNodeProxy = await k8sApi.connectPutNodeProxy()
    const connectPutNodeProxyWithPath = await k8sApi.connectPutNodeProxyWithPath()
    const createNamespace = await k8sApi.createNamespace()
    const createNamespacedBinding = await k8sApi.createNamespacedBinding()
    const createNamespacedConfigMap = await k8sApi.createNamespacedConfigMap()
    const createNamespacedEndpoints = await k8sApi.createNamespacedEndpoints()
    const createNamespacedEvent = await k8sApi.createNamespacedEvent()
    const createNamespacedLimitRange = await k8sApi.createNamespacedLimitRange()
    const createNamespacedPersistentVolumeClaim = await k8sApi.createNamespacedPersistentVolumeClaim()
    const createNamespacedPod = await k8sApi.createNamespacedPod()
    const createNamespacedPodBinding = await k8sApi.createNamespacedPodBinding()
    const createNamespacedPodEviction = await k8sApi.createNamespacedPodEviction()
    const createNamespacedPodTemplate = await k8sApi.createNamespacedPodTemplate()
    const createNamespacedReplicationController = await k8sApi.createNamespacedReplicationController()
    const createNamespacedResourceQuota = await k8sApi.createNamespacedResourceQuota()
    const createNamespacedSecret = await k8sApi.createNamespacedSecret()
    const createNamespacedService = await k8sApi.createNamespacedService()
    const createNamespacedServiceAccount = await k8sApi.createNamespacedServiceAccount()
    const createNamespacedServiceAccountToken = await k8sApi.createNamespacedServiceAccountToken()
    const createNode = await k8sApi.createNode()
    const createPersistentVolume = await k8sApi.createPersistentVolume()
    const deleteCollectionNamespacedConfigMap = await k8sApi.deleteCollectionNamespacedConfigMap()
    const deleteCollectionNamespacedEndpoints = await k8sApi.deleteCollectionNamespacedEndpoints()
    const deleteCollectionNamespacedEvent = await k8sApi.deleteCollectionNamespacedEvent()
    const deleteCollectionNamespacedLimitRange = await k8sApi.deleteCollectionNamespacedLimitRange()
    const deleteCollectionNamespacedPersistentVolumeClaim = await k8sApi.deleteCollectionNamespacedPersistentVolumeClaim()
    const deleteCollectionNamespacedPod = await k8sApi.deleteCollectionNamespacedPod()
    const deleteCollectionNamespacedPodTemplate = await k8sApi.deleteCollectionNamespacedPodTemplate()
    const deleteCollectionNamespacedReplicationController = await k8sApi.deleteCollectionNamespacedReplicationController()
    const deleteCollectionNamespacedResourceQuota = await k8sApi.deleteCollectionNamespacedResourceQuota()
    const deleteCollectionNamespacedSecret = await k8sApi.deleteCollectionNamespacedSecret()
    const deleteCollectionNamespacedServiceAccount = await k8sApi.deleteCollectionNamespacedServiceAccount()
    const deleteCollectionNode = await k8sApi.deleteCollectionNode()
    const deleteCollectionPersistentVolume = await k8sApi.deleteCollectionPersistentVolume()
    const deleteNamespace = await k8sApi.deleteNamespace()
    const deleteNamespacedConfigMap = await k8sApi.deleteNamespacedConfigMap()
    const deleteNamespacedEndpoints = await k8sApi.deleteNamespacedEndpoints()
    const deleteNamespacedEvent = await k8sApi.deleteNamespacedEvent()
    const deleteNamespacedLimitRange = await k8sApi.deleteNamespacedLimitRange()
    const deleteNamespacedPersistentVolumeClaim = await k8sApi.deleteNamespacedPersistentVolumeClaim()
    const deleteNamespacedPod = await k8sApi.deleteNamespacedPod()
    const deleteNamespacedPodTemplate = await k8sApi.deleteNamespacedPodTemplate()
    const deleteNamespacedReplicationController = await k8sApi.deleteNamespacedReplicationController()
    const deleteNamespacedResourceQuota = await k8sApi.deleteNamespacedResourceQuota()
    const deleteNamespacedSecret = await k8sApi.deleteNamespacedSecret()
    const deleteNamespacedService = await k8sApi.deleteNamespacedService()
    const deleteNamespacedServiceAccount = await k8sApi.deleteNamespacedServiceAccount()
    const deleteNode = await k8sApi.deleteNode()
    const deletePersistentVolume = await k8sApi.deletePersistentVolume()
    const getAPIResources = await k8sApi.getAPIResources()
    const listComponentStatus = await k8sApi.listComponentStatus()
    const listConfigMapForAllNamespaces = await k8sApi.listConfigMapForAllNamespaces()
    const listEndpointsForAllNamespaces = await k8sApi.listEndpointsForAllNamespaces()
    const listEventForAllNamespaces = await k8sApi.listEventForAllNamespaces()
    const listLimitRangeForAllNamespaces = await k8sApi.listLimitRangeForAllNamespaces()
    const listNamespace = await k8sApi.listNamespace()
    const listNamespacedConfigMap = await k8sApi.listNamespacedConfigMap()
    const listNamespacedEndpoints = await k8sApi.listNamespacedEndpoints()
    const listNamespacedEvent = await k8sApi.listNamespacedEvent()
    const listNamespacedLimitRange = await k8sApi.listNamespacedLimitRange()
    const listNamespacedPersistentVolumeClaim = await k8sApi.listNamespacedPersistentVolumeClaim()
    const listNamespacedPod = await k8sApi.listNamespacedPod()
    const listNamespacedPodTemplate = await k8sApi.listNamespacedPodTemplate()
    const listNamespacedReplicationController = await k8sApi.listNamespacedReplicationController()
    const listNamespacedResourceQuota = await k8sApi.listNamespacedResourceQuota()
    const listNamespacedSecret = await k8sApi.listNamespacedSecret()
    const listNamespacedService = await k8sApi.listNamespacedService()
    const listNamespacedServiceAccount = await k8sApi.listNamespacedServiceAccount()
    const listNode = await k8sApi.listNode()
    const listPersistentVolume = await k8sApi.listPersistentVolume()
    const listPersistentVolumeClaimForAllNamespaces = await k8sApi.listPersistentVolumeClaimForAllNamespaces()
    const listPodForAllNamespaces = await k8sApi.listPodForAllNamespaces()
    const listPodTemplateForAllNamespaces = await k8sApi.listPodTemplateForAllNamespaces()
    const listReplicationControllerForAllNamespaces = await k8sApi.listReplicationControllerForAllNamespaces()
    const listResourceQuotaForAllNamespaces = await k8sApi.listResourceQuotaForAllNamespaces()
    const listSecretForAllNamespaces = await k8sApi.listSecretForAllNamespaces()
    const listServiceAccountForAllNamespaces = await k8sApi.listServiceAccountForAllNamespaces()
    const listServiceForAllNamespaces = await k8sApi.listServiceForAllNamespaces()
    const patchNamespace = await k8sApi.patchNamespace()
    const patchNamespaceStatus = await k8sApi.patchNamespaceStatus()
    const patchNamespacedConfigMap = await k8sApi.patchNamespacedConfigMap()
    const patchNamespacedEndpoints = await k8sApi.patchNamespacedEndpoints()
    const patchNamespacedEvent = await k8sApi.patchNamespacedEvent()
    const patchNamespacedLimitRange = await k8sApi.patchNamespacedLimitRange()
    const patchNamespacedPersistentVolumeClaim = await k8sApi.patchNamespacedPersistentVolumeClaim()
    const patchNamespacedPersistentVolumeClaimStatus = await k8sApi.patchNamespacedPersistentVolumeClaimStatus()
    const patchNamespacedPod = await k8sApi.patchNamespacedPod()
    const patchNamespacedPodEphemeralcontainers = await k8sApi.patchNamespacedPodEphemeralcontainers()
    const patchNamespacedPodStatus = await k8sApi.patchNamespacedPodStatus()
    const patchNamespacedPodTemplate = await k8sApi.patchNamespacedPodTemplate()
    const patchNamespacedReplicationController = await k8sApi.patchNamespacedReplicationController()
    const patchNamespacedReplicationControllerScale = await k8sApi.patchNamespacedReplicationControllerScale()
    const patchNamespacedReplicationControllerStatus = await k8sApi.patchNamespacedReplicationControllerStatus()
    const patchNamespacedResourceQuota = await k8sApi.patchNamespacedResourceQuota()
    const patchNamespacedResourceQuotaStatus = await k8sApi.patchNamespacedResourceQuotaStatus()
    const patchNamespacedSecret = await k8sApi.patchNamespacedSecret()
    const patchNamespacedService = await k8sApi.patchNamespacedService()
    const patchNamespacedServiceAccount = await k8sApi.patchNamespacedServiceAccount()
    const patchNamespacedServiceStatus = await k8sApi.patchNamespacedServiceStatus()
    const patchNode = await k8sApi.patchNode()
    const patchNodeStatus = await k8sApi.patchNodeStatus()
    const patchPersistentVolume = await k8sApi.patchPersistentVolume()
    const patchPersistentVolumeStatus = await k8sApi.patchPersistentVolumeStatus()
    const readComponentStatus = await k8sApi.readComponentStatus()
    const readNamespace = await k8sApi.readNamespace()
    const readNamespaceStatus = await k8sApi.readNamespaceStatus()
    const readNamespacedConfigMap = await k8sApi.readNamespacedConfigMap()
    const readNamespacedEndpoints = await k8sApi.readNamespacedEndpoints()
    const readNamespacedEvent = await k8sApi.readNamespacedEvent()
    const readNamespacedLimitRange = await k8sApi.readNamespacedLimitRange()
    const readNamespacedPersistentVolumeClaim = await k8sApi.readNamespacedPersistentVolumeClaim()
    const readNamespacedPersistentVolumeClaimStatus = await k8sApi.readNamespacedPersistentVolumeClaimStatus()
    const readNamespacedPod = await k8sApi.readNamespacedPod()
    const readNamespacedPodEphemeralcontainers = await k8sApi.readNamespacedPodEphemeralcontainers()
    const readNamespacedPodLog = await k8sApi.readNamespacedPodLog()
    const readNamespacedPodStatus = await k8sApi.readNamespacedPodStatus()
    const readNamespacedPodTemplate = await k8sApi.readNamespacedPodTemplate()
    const readNamespacedReplicationController = await k8sApi.readNamespacedReplicationController()
    const readNamespacedReplicationControllerScale = await k8sApi.readNamespacedReplicationControllerScale()
    const readNamespacedReplicationControllerStatus = await k8sApi.readNamespacedReplicationControllerStatus()
    const readNamespacedResourceQuota = await k8sApi.readNamespacedResourceQuota()
    const readNamespacedResourceQuotaStatus = await k8sApi.readNamespacedResourceQuotaStatus()
    const readNamespacedSecret = await k8sApi.readNamespacedSecret()
    const readNamespacedService = await k8sApi.readNamespacedService()
    const readNamespacedServiceAccount = await k8sApi.readNamespacedServiceAccount()
    const readNamespacedServiceStatus = await k8sApi.readNamespacedServiceStatus()
    const readNode = await k8sApi.readNode()
    const readNodeStatus = await k8sApi.readNodeStatus()
    const readPersistentVolume = await k8sApi.readPersistentVolume()
    const readPersistentVolumeStatus = await k8sApi.readPersistentVolumeStatus()
    const replaceNamespace = await k8sApi.replaceNamespace()
    const replaceNamespaceFinalize = await k8sApi.replaceNamespaceFinalize()
    const replaceNamespaceStatus = await k8sApi.replaceNamespaceStatus()
    const replaceNamespacedConfigMap = await k8sApi.replaceNamespacedConfigMap()
    const replaceNamespacedEndpoints = await k8sApi.replaceNamespacedEndpoints()
    const replaceNamespacedEvent = await k8sApi.replaceNamespacedEvent()
    const replaceNamespacedLimitRange = await k8sApi.replaceNamespacedLimitRange()
    const replaceNamespacedPersistentVolumeClaim = await k8sApi.replaceNamespacedPersistentVolumeClaim()
    const replaceNamespacedPersistentVolumeClaimStatus = await k8sApi.replaceNamespacedPersistentVolumeClaimStatus()
    const replaceNamespacedPod = await k8sApi.replaceNamespacedPod()
    const replaceNamespacedPodEphemeralcontainers = await k8sApi.replaceNamespacedPodEphemeralcontainers()
    const replaceNamespacedPodStatus = await k8sApi.replaceNamespacedPodStatus()
    const replaceNamespacedPodTemplate = await k8sApi.replaceNamespacedPodTemplate()
    const replaceNamespacedReplicationController = await k8sApi.replaceNamespacedReplicationController()
    const replaceNamespacedReplicationControllerScale = await k8sApi.replaceNamespacedReplicationControllerScale()
    const replaceNamespacedReplicationControllerStatus = await k8sApi.replaceNamespacedReplicationControllerStatus()
    const replaceNamespacedResourceQuota = await k8sApi.replaceNamespacedResourceQuota()
    const replaceNamespacedResourceQuotaStatus = await k8sApi.replaceNamespacedResourceQuotaStatus()
    const replaceNamespacedSecret = await k8sApi.replaceNamespacedSecret()
    const replaceNamespacedService = await k8sApi.replaceNamespacedService()
    const replaceNamespacedServiceAccount = await k8sApi.replaceNamespacedServiceAccount()
    const replaceNamespacedServiceStatus = await k8sApi.replaceNamespacedServiceStatus()
    const replaceNode = await k8sApi.replaceNode()
    const replaceNodeStatus = await k8sApi.replaceNodeStatus()
    const replacePersistentVolume = await k8sApi.replacePersistentVolume()
    const replacePersistentVolumeStatus = await k8sApi.replacePersistentVolumeStatus()
    // const setApiKey = await k8sApi.setApiKey()
    // const setDefaultAuthentication = await k8sApi.setDefaultAuthentication()

} catch (error) {
    console.log(error);
}