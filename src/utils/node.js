// import k8s from '@kubernetes/client-node'
const k8s = require('@kubernetes/client-node');

const kc = new k8s.KubeConfig();

kc.loadFromString(JSON.stringify(
    {
        "apiVersion": "v1",
        "clusters": [
          {
            "cluster": {
              "certificate-authority-data": "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUJkekNDQVIyZ0F3SUJBZ0lCQURBS0JnZ3Foa2pPUFFRREFqQWpNU0V3SHdZRFZRUUREQmhyTTNNdGMyVnkKZG1WeUxXTmhRREUzTVRZd05UYzFNalV3SGhjTk1qUXdOVEU0TVRnek9EUTFXaGNOTXpRd05URTJNVGd6T0RRMQpXakFqTVNFd0h3WURWUVFEREJock0zTXRjMlZ5ZG1WeUxXTmhRREUzTVRZd05UYzFNalV3V1RBVEJnY3Foa2pPClBRSUJCZ2dxaGtqT1BRTUJCd05DQUFUTjlyR3pWby9TTnJHMXRPRXVTQ3g2NXZ5WWo1bDRqWXRhRXg4M3NHWHAKZzZ4eFZtYU45TGk2TlU3dEY1a0o0Y0NCWFhoR0ZnOHdlYTNMVnhRbW9XdFVvMEl3UURBT0JnTlZIUThCQWY4RQpCQU1DQXFRd0R3WURWUjBUQVFIL0JBVXdBd0VCL3pBZEJnTlZIUTRFRmdRVUhpUHdvTE5TS3hHOEErbkI3cU5yCjZZZUlibDB3Q2dZSUtvWkl6ajBFQXdJRFNBQXdSUUloQU54RExOVmw4NEhCcWR2MVYyOTg5ZlBTYkJLb1JsbUQKSUNEeUdvRndJcW0xQWlBZEJKV25oZy84TzZPblBxSnM4S05uUE5SL3kxN0g5c2d5WWtib3huWFI1UT09Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K",
              "server": "https://192.168.29.150:6443"
            },
            "name": "default"
          }
        ],
        "contexts": [
          {
            "context": {
              "cluster": "default",
              "user": "default"
            },
            "name": "default"
          }
        ],
        "current-context": "default",
        "kind": "Config",
        "preferences": {},
        "users": [
          {
            "name": "default",
            "user": {
              "client-certificate-data": "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUJrRENDQVRlZ0F3SUJBZ0lJZE16L3JmcjYrcGN3Q2dZSUtvWkl6ajBFQXdJd0l6RWhNQjhHQTFVRUF3d1kKYXpOekxXTnNhV1Z1ZEMxallVQXhOekUyTURVM05USTFNQjRYRFRJME1EVXhPREU0TXpnME5Wb1hEVEkxTURVeApPREU0TXpnME5Wb3dNREVYTUJVR0ExVUVDaE1PYzNsemRHVnRPbTFoYzNSbGNuTXhGVEFUQmdOVkJBTVRESE41CmMzUmxiVHBoWkcxcGJqQlpNQk1HQnlxR1NNNDlBZ0VHQ0NxR1NNNDlBd0VIQTBJQUJBdHNId2N0YWR1MTJoM0kKVFF6NEl4TWFXakFnNEV4Zm00ZWYrUVNUbERTbGl0NkNpZENoRFJwVGNOQWg1b0xoWlU1UGRKSmpENmVqcnQ4MwpiaDJWUmtTalNEQkdNQTRHQTFVZER3RUIvd1FFQXdJRm9EQVRCZ05WSFNVRUREQUtCZ2dyQmdFRkJRY0RBakFmCkJnTlZIU01FR0RBV2dCUU9rSFZ6dDBZalpMUFlPQkRZRVVZSksxZVFHVEFLQmdncWhrak9QUVFEQWdOSEFEQkUKQWlCQkhwSlJVNS9qTlZNNTd4dFdWNVZUSzVGV01ueU1GN2RPNkVRejh2ZTluUUlnTU9iMkpqY1E4N2dXRzZvYgp5NmtKdERuakxHdWllcUVWNFlNelM0SEhXWkU9Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0KLS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUJkekNDQVIyZ0F3SUJBZ0lCQURBS0JnZ3Foa2pPUFFRREFqQWpNU0V3SHdZRFZRUUREQmhyTTNNdFkyeHAKWlc1MExXTmhRREUzTVRZd05UYzFNalV3SGhjTk1qUXdOVEU0TVRnek9EUTFXaGNOTXpRd05URTJNVGd6T0RRMQpXakFqTVNFd0h3WURWUVFEREJock0zTXRZMnhwWlc1MExXTmhRREUzTVRZd05UYzFNalV3V1RBVEJnY3Foa2pPClBRSUJCZ2dxaGtqT1BRTUJCd05DQUFTRW1TTFFDV0MyaTdyeGFtKy9YZURJQ29tUzkwZ0VhNjRZY3N0Z0VQNjMKdXF0TFNYSERydllCckROcnhoT091bHlDWklyb3B0MmJpMDFYY0RoV0tQUjdvMEl3UURBT0JnTlZIUThCQWY4RQpCQU1DQXFRd0R3WURWUjBUQVFIL0JBVXdBd0VCL3pBZEJnTlZIUTRFRmdRVURwQjFjN2RHSTJTejJEZ1EyQkZHCkNTdFhrQmt3Q2dZSUtvWkl6ajBFQXdJRFNBQXdSUUlnY3M4QTNaTENtWEUxa1lNKy9yNlJCVzlwV1FVOWllR0kKb0liWVBhWFhGRTBDSVFEVk1laXphRjAxanhlaGNoRDFuK0ZVNXhwd0I3ZWp0ZndGNTJLbVFxK1lKZz09Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K",
              "client-key-data": "LS0tLS1CRUdJTiBFQyBQUklWQVRFIEtFWS0tLS0tCk1IY0NBUUVFSU9BSWVKWkRPOGZMRkR6R1YyNTNBeWFKRmxuZytYUWNuRnAvUytRUERkTXlvQW9HQ0NxR1NNNDkKQXdFSG9VUURRZ0FFQzJ3ZkJ5MXAyN1hhSGNoTkRQZ2pFeHBhTUNEZ1RGK2JoNS81QkpPVU5LV0szb0tKMEtFTgpHbE53MENIbWd1RmxUazkwa21NUHA2T3UzemR1SFpWR1JBPT0KLS0tLS1FTkQgRUMgUFJJVkFURSBLRVktLS0tLQo="
            }
          }
        ]
      }
));


const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

console.log("basePath:  ", k8sApi.basePath);
console.log("response:  ", k8sApi);

// k8sApi.listNamespacedPod('default')
//     .then((res) => {
//         console.log(JSON.stringify({ data: res.body }, null, 4));
//     })
//     .catch((err) => {
//         console.log(err);
//     });

k8sApi.listNode('default')
    .then((res) => {
        console.log(JSON.stringify({ data: res.body }, null, 4));
    })
    .catch((err) => {
        console.log(err);
    });