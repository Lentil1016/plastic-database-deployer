let manifestMaker = {
  createNamespaceManifest(namespace) {
    return {
      "apiVersion": "v1",
      "kind": "Namespace",
      "metadata": {
        "name": `${namespace}`
      }
    }
  },
  createOracleDeployManifest(namespace, releaseName) {
    return {
      "apiVersion": "extensions/v1beta1",
      "kind": "Deployment",
      "metadata": {
        "labels": {
          "plastic-oracle": `${releaseName}`
        },
        "name": `${releaseName}`,
        "namespace": `${namespace}`
      },
      "spec": {
        "replicas": 1,
        "revisionHistoryLimit": 2,
        "selector": {
          "matchLabels": {
            "plastic-oracle": `${releaseName}`
          }
        },
        "template": {
          "metadata": {
            "labels": {
              "plastic-oracle": `${releaseName}`
            }
          },
          "spec": {
            "containers": [
              {
                "image": "harbor.io:1180/plastic-db/oracle:0.1",
                "imagePullPolicy": "always",
                "name": `${releaseName}`,
              }
            ],
            "restartPolicy": "Always",
            "terminationGracePeriodSeconds": 0
          }
        }
      }
    }
  },
}
export default manifestMaker