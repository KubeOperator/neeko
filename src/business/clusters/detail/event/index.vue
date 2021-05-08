<template>
  <div v-loading="loading">
    <el-form :inline="true">
      <el-form-item>
        <el-select size="small" @change="changeNamespace()" allow-create filterable v-model="currentNamespace">
          <el-option v-for="item in namespaces" :key="item['metadata'].name" :label="item['metadata'].name" :value="item['metadata'].name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="float: right">
        <el-switch v-model="isNPDon" @change="changeNpd()" :active-text="$t('cluster.detail.event.enable_npd')">
        </el-switch>
      </el-form-item>
    </el-form>

    <complex-table :data="data">
      <el-table-column :label="$t('cluster.detail.event.msg_info')" min-width="100" prop="message" fix />
      <el-table-column :label="$t('cluster.detail.event.msg_type')" min-width="100" prop="type" fix />
      <el-table-column :label="$t('cluster.detail.event.component')" min-width="100" prop="source.component" fix />
      <el-table-column label="Namespave" min-width="100" prop="metadata.namespace" fix />
      <el-table-column :label="$t('cluster.detail.log.time')">
        <template v-slot:default="{row}">
          {{ row.firstTimestamp | datetimeFormat }}
        </template>
      </el-table-column>
    </complex-table>
    <k8s-page @pageChange="pageChange" :nextToken="page.nextToken" />
  </div>
</template>

<script>
import ComplexTable from "@/components/complex-table"
import { listNamespace } from "@/api/cluster/namespace"
import { listPod } from "@/api/cluster/cluster"
import K8sPage from "@/components/k8s-page"
import { listEvents, changeNpd } from "@/api/cluster/event"

export default {
  name: "ClusterEvent",
  components: { ComplexTable, K8sPage },
  data() {
    return {
      loading: false,
      page: {
        continueToken: "",
        nextToken: "",
      },
      clusterName: "",
      namespaces: [],
      currentNamespace: "",
      isNPDon: false,
      data: [],
    }
  },
  methods: {
    search() {
      this.loading = true
      listNamespace(this.clusterName).then((data) => {
        this.namespaces = data.items
        if (data.items.length > 0) {
          this.currentNamespace = this.currentNamespace ? this.currentNamespace : this.namespaces[0].metadata.name
          this.loadEvents(this.currentNamespace)
        }
      })
      this.getNpdExists()
    },
    pageChange(continueToken) {
      this.page.continueToken = continueToken
      this.search()
    },
    loadEvents(namespace) {
      listEvents(this.clusterName, this.page.continueToken, namespace)
        .then(() => {
          let kk = {
            kind: "EventList",
            apiVersion: "v1",
            metadata: {
              selfLink: "/api/v1/namespaces/default/events",
              resourceVersion: "33864",
              continue: "eyJ2IjoibWV0YS5rOHMuaW8vdjEiLCJydiI6MzM4NjQsInN0YXJ0Ijoid2FuZ2hlLTM3MC1tYXN0ZXItMS4xNjdkMDc5ZjYzZGUzOThiXHUwMDAwIn0",
              remainingItemCount: 73,
            },
            items: [
              {
                metadata: {
                  name: ".167d07cc839789dc",
                  namespace: "default",
                  selfLink: "/api/v1/namespaces/default/events/.167d07cc839789dc",
                  uid: "875899fa-aaef-439d-a01f-0c4e6b0efc4c",
                  resourceVersion: "1183",
                  creationTimestamp: "2021-05-08T07:46:56Z",
                  managedFields: [
                    {
                      manager: "kube-controller-manager",
                      operation: "Update",
                      apiVersion: "v1",
                      time: "2021-05-08T07:46:56Z",
                      fieldsType: "FieldsV1",
                      fieldsV1: { "f:count": {}, "f:firstTimestamp": {}, "f:involvedObject": { "f:apiVersion": {}, "f:kind": {} }, "f:lastTimestamp": {}, "f:message": {}, "f:reason": {}, "f:source": { "f:component": {} }, "f:type": {} },
                    },
                  ],
                },
                involvedObject: {
                  kind: "Lease",
                  apiVersion: "coordination.k8s.io/v1",
                },
                reason: "LeaderElection",
                message: "wanghe-370-master-1_89c0345e-9187-4b6b-8139-f77aeb48b47a stopped leading",
                source: {
                  component: "kube-controller-manager",
                },
                firstTimestamp: "2021-05-08T07:46:55Z",
                lastTimestamp: "2021-05-08T07:46:55Z",
                count: 1,
                type: "Normal",
                eventTime: null,
                reportingComponent: "",
                reportingInstance: "",
              },
              {
                metadata: {
                  name: ".167d07d2dcffef5f",
                  namespace: "default",
                  selfLink: "/api/v1/namespaces/default/events/.167d07d2dcffef5f",
                  uid: "c6cc3e9c-0c04-4182-acf4-537c6ed7d961",
                  resourceVersion: "1356",
                  creationTimestamp: "2021-05-08T07:47:23Z",
                  managedFields: [
                    {
                      manager: "kube-controller-manager",
                      operation: "Update",
                      apiVersion: "v1",
                      time: "2021-05-08T07:47:23Z",
                      fieldsType: "FieldsV1",
                      fieldsV1: { "f:count": {}, "f:firstTimestamp": {}, "f:involvedObject": { "f:apiVersion": {}, "f:kind": {} }, "f:lastTimestamp": {}, "f:message": {}, "f:reason": {}, "f:source": { "f:component": {} }, "f:type": {} },
                    },
                  ],
                },
                involvedObject: {
                  kind: "Lease",
                  apiVersion: "coordination.k8s.io/v1",
                },
                reason: "LeaderElection",
                message: "wanghe-370-master-3_3f5058b9-f86f-4bd6-ae1d-355406b70445 stopped leading",
                source: {
                  component: "kube-controller-manager",
                },
                firstTimestamp: "2021-05-08T07:47:23Z",
                lastTimestamp: "2021-05-08T07:47:23Z",
                count: 1,
                type: "Normal",
                eventTime: null,
                reportingComponent: "",
                reportingInstance: "",
              },
              {
                metadata: {
                  name: ".167d07ed2a171862",
                  namespace: "default",
                  selfLink: "/api/v1/namespaces/default/events/.167d07ed2a171862",
                  uid: "7ac2be61-4548-441d-8f26-07a3bfe893bc",
                  resourceVersion: "6889",
                  creationTimestamp: "2021-05-08T07:49:16Z",
                  managedFields: [
                    {
                      manager: "kube-controller-manager",
                      operation: "Update",
                      apiVersion: "v1",
                      time: "2021-05-08T07:49:16Z",
                      fieldsType: "FieldsV1",
                      fieldsV1: { "f:count": {}, "f:firstTimestamp": {}, "f:involvedObject": { "f:apiVersion": {}, "f:kind": {} }, "f:lastTimestamp": {}, "f:message": {}, "f:reason": {}, "f:source": { "f:component": {} }, "f:type": {} },
                    },
                  ],
                },
                involvedObject: {
                  kind: "Lease",
                  apiVersion: "coordination.k8s.io/v1",
                },
                reason: "LeaderElection",
                message: "wanghe-370-master-2_546e8374-52c9-4667-99c8-35f79cba9c79 stopped leading",
                source: {
                  component: "kube-controller-manager",
                },
                firstTimestamp: "2021-05-08T07:49:16Z",
                lastTimestamp: "2021-05-08T07:49:16Z",
                count: 1,
                type: "Normal",
                eventTime: null,
                reportingComponent: "",
                reportingInstance: "",
              },
              {
                metadata: {
                  name: "ingress-nginx.167d07dee547b802",
                  namespace: "default",
                  selfLink: "/api/v1/namespaces/default/events/ingress-nginx.167d07dee547b802",
                  uid: "51d0ccdb-533a-4af6-959c-e041672e287d",
                  resourceVersion: "3536",
                  creationTimestamp: "2021-05-08T07:48:14Z",
                  managedFields: [
                    {
                      manager: "kube-controller-manager",
                      operation: "Update",
                      apiVersion: "v1",
                      time: "2021-05-08T07:48:14Z",
                      fieldsType: "FieldsV1",
                      fieldsV1: { "f:count": {}, "f:firstTimestamp": {}, "f:involvedObject": { "f:apiVersion": {}, "f:kind": {}, "f:name": {} }, "f:lastTimestamp": {}, "f:message": {}, "f:reason": {}, "f:source": { "f:component": {} }, "f:type": {} },
                    },
                  ],
                },
                involvedObject: {
                  kind: "Endpoints",
                  name: "ingress-nginx",
                  apiVersion: "v1",
                },
                reason: "FailedToCreateEndpoint",
                message: 'Failed to create endpoint for service kube-system/ingress-nginx: endpoints "ingress-nginx" already exists',
                source: {
                  component: "endpoint-controller",
                },
                firstTimestamp: "2021-05-08T07:48:14Z",
                lastTimestamp: "2021-05-08T07:48:14Z",
                count: 1,
                type: "Warning",
                eventTime: null,
                reportingComponent: "",
                reportingInstance: "",
              },
              {
                metadata: {
                  name: "wanghe-370-master-1.167d07904eba7651",
                  namespace: "default",
                  selfLink: "/api/v1/namespaces/default/events/wanghe-370-master-1.167d07904eba7651",
                  uid: "9b8a7657-61be-4945-b81b-1e172ed7ef5f",
                  resourceVersion: "222",
                  creationTimestamp: "2021-05-08T07:43:34Z",
                  managedFields: [
                    {
                      manager: "kubelet",
                      operation: "Update",
                      apiVersion: "v1",
                      time: "2021-05-08T07:43:34Z",
                      fieldsType: "FieldsV1",
                      fieldsV1: { "f:count": {}, "f:firstTimestamp": {}, "f:involvedObject": { "f:kind": {}, "f:name": {}, "f:uid": {} }, "f:lastTimestamp": {}, "f:message": {}, "f:reason": {}, "f:source": { "f:component": {}, "f:host": {} }, "f:type": {} },
                    },
                  ],
                },
                involvedObject: {
                  kind: "Node",
                  name: "wanghe-370-master-1",
                  uid: "wanghe-370-master-1",
                },
                reason: "Starting",
                message: "Starting kubelet.",
                source: {
                  component: "kubelet",
                  host: "wanghe-370-master-1",
                },
                firstTimestamp: "2021-05-08T07:42:37Z",
                lastTimestamp: "2021-05-08T07:42:37Z",
                count: 1,
                type: "Normal",
                eventTime: null,
                reportingComponent: "",
                reportingInstance: "",
              },
              {
                metadata: {
                  name: "wanghe-370-master-1.167d079058d26641",
                  namespace: "default",
                  selfLink: "/api/v1/namespaces/default/events/wanghe-370-master-1.167d079058d26641",
                  uid: "2a658e52-1b4b-463d-bf76-c3e0523a8594",
                  resourceVersion: "244",
                  creationTimestamp: "2021-05-08T07:43:34Z",
                  managedFields: [
                    {
                      manager: "kubelet",
                      operation: "Update",
                      apiVersion: "v1",
                      time: "2021-05-08T07:43:34Z",
                      fieldsType: "FieldsV1",
                      fieldsV1: { "f:count": {}, "f:firstTimestamp": {}, "f:involvedObject": { "f:kind": {}, "f:name": {}, "f:uid": {} }, "f:lastTimestamp": {}, "f:message": {}, "f:reason": {}, "f:source": { "f:component": {}, "f:host": {} }, "f:type": {} },
                    },
                  ],
                },
                involvedObject: {
                  kind: "Node",
                  name: "wanghe-370-master-1",
                  uid: "wanghe-370-master-1",
                },
                reason: "NodeHasSufficientMemory",
                message: "Node wanghe-370-master-1 status is now: NodeHasSufficientMemory",
                source: {
                  component: "kubelet",
                  host: "wanghe-370-master-1",
                },
                firstTimestamp: "2021-05-08T07:42:37Z",
                lastTimestamp: "2021-05-08T07:42:38Z",
                count: 4,
                type: "Normal",
                eventTime: null,
                reportingComponent: "",
                reportingInstance: "",
              },
              {
                metadata: {
                  name: "wanghe-370-master-1.167d079058d28437",
                  namespace: "default",
                  selfLink: "/api/v1/namespaces/default/events/wanghe-370-master-1.167d079058d28437",
                  uid: "8c4700ef-3dc1-483f-90ab-bf8a8eb77931",
                  resourceVersion: "241",
                  creationTimestamp: "2021-05-08T07:43:34Z",
                  managedFields: [
                    {
                      manager: "kubelet",
                      operation: "Update",
                      apiVersion: "v1",
                      time: "2021-05-08T07:43:34Z",
                      fieldsType: "FieldsV1",
                      fieldsV1: { "f:count": {}, "f:firstTimestamp": {}, "f:involvedObject": { "f:kind": {}, "f:name": {}, "f:uid": {} }, "f:lastTimestamp": {}, "f:message": {}, "f:reason": {}, "f:source": { "f:component": {}, "f:host": {} }, "f:type": {} },
                    },
                  ],
                },
                involvedObject: {
                  kind: "Node",
                  name: "wanghe-370-master-1",
                  uid: "wanghe-370-master-1",
                },
                reason: "NodeHasNoDiskPressure",
                message: "Node wanghe-370-master-1 status is now: NodeHasNoDiskPressure",
                source: {
                  component: "kubelet",
                  host: "wanghe-370-master-1",
                },
                firstTimestamp: "2021-05-08T07:42:37Z",
                lastTimestamp: "2021-05-08T07:42:38Z",
                count: 3,
                type: "Normal",
                eventTime: null,
                reportingComponent: "",
                reportingInstance: "",
              },
              {
                metadata: {
                  name: "wanghe-370-master-1.167d079058d29414",
                  namespace: "default",
                  selfLink: "/api/v1/namespaces/default/events/wanghe-370-master-1.167d079058d29414",
                  uid: "dc679abc-6da7-458d-9bad-94393d49b44a",
                  resourceVersion: "243",
                  creationTimestamp: "2021-05-08T07:43:35Z",
                  managedFields: [
                    {
                      manager: "kubelet",
                      operation: "Update",
                      apiVersion: "v1",
                      time: "2021-05-08T07:43:35Z",
                      fieldsType: "FieldsV1",
                      fieldsV1: { "f:count": {}, "f:firstTimestamp": {}, "f:involvedObject": { "f:kind": {}, "f:name": {}, "f:uid": {} }, "f:lastTimestamp": {}, "f:message": {}, "f:reason": {}, "f:source": { "f:component": {}, "f:host": {} }, "f:type": {} },
                    },
                  ],
                },
                involvedObject: {
                  kind: "Node",
                  name: "wanghe-370-master-1",
                  uid: "wanghe-370-master-1",
                },
                reason: "NodeHasSufficientPID",
                message: "Node wanghe-370-master-1 status is now: NodeHasSufficientPID",
                source: {
                  component: "kubelet",
                  host: "wanghe-370-master-1",
                },
                firstTimestamp: "2021-05-08T07:42:37Z",
                lastTimestamp: "2021-05-08T07:42:38Z",
                count: 3,
                type: "Normal",
                eventTime: null,
                reportingComponent: "",
                reportingInstance: "",
              },
              {
                metadata: {
                  name: "wanghe-370-master-1.167d079f566c24e8",
                  namespace: "default",
                  selfLink: "/api/v1/namespaces/default/events/wanghe-370-master-1.167d079f566c24e8",
                  uid: "785a22b8-1dc9-47a1-9072-d7c4f1c85c53",
                  resourceVersion: "293",
                  creationTimestamp: "2021-05-08T07:43:41Z",
                  managedFields: [
                    {
                      manager: "kubelet",
                      operation: "Update",
                      apiVersion: "v1",
                      time: "2021-05-08T07:43:41Z",
                      fieldsType: "FieldsV1",
                      fieldsV1: { "f:count": {}, "f:firstTimestamp": {}, "f:involvedObject": { "f:kind": {}, "f:name": {}, "f:uid": {} }, "f:lastTimestamp": {}, "f:message": {}, "f:reason": {}, "f:source": { "f:component": {}, "f:host": {} }, "f:type": {} },
                    },
                  ],
                },
                involvedObject: {
                  kind: "Node",
                  name: "wanghe-370-master-1",
                  uid: "wanghe-370-master-1",
                },
                reason: "Starting",
                message: "Starting kubelet.",
                source: {
                  component: "kubelet",
                  host: "wanghe-370-master-1",
                },
                firstTimestamp: "2021-05-08T07:43:41Z",
                lastTimestamp: "2021-05-08T07:43:41Z",
                count: 1,
                type: "Normal",
                eventTime: null,
                reportingComponent: "",
                reportingInstance: "",
              },
              {
                metadata: {
                  name: "wanghe-370-master-1.167d079f63de398b",
                  namespace: "default",
                  selfLink: "/api/v1/namespaces/default/events/wanghe-370-master-1.167d079f63de398b",
                  uid: "15e974e6-d9d2-4eac-8232-5e8c253e5e1e",
                  resourceVersion: "296",
                  creationTimestamp: "2021-05-08T07:43:42Z",
                  managedFields: [
                    {
                      manager: "kubelet",
                      operation: "Update",
                      apiVersion: "v1",
                      time: "2021-05-08T07:43:42Z",
                      fieldsType: "FieldsV1",
                      fieldsV1: { "f:count": {}, "f:firstTimestamp": {}, "f:involvedObject": { "f:kind": {}, "f:name": {}, "f:uid": {} }, "f:lastTimestamp": {}, "f:message": {}, "f:reason": {}, "f:source": { "f:component": {}, "f:host": {} }, "f:type": {} },
                    },
                  ],
                },
                involvedObject: {
                  kind: "Node",
                  name: "wanghe-370-master-1",
                  uid: "wanghe-370-master-1",
                },
                reason: "NodeHasSufficientMemory",
                message: "Node wanghe-370-master-1 status is now: NodeHasSufficientMemory",
                source: {
                  component: "kubelet",
                  host: "wanghe-370-master-1",
                },
                firstTimestamp: "2021-05-08T07:43:42Z",
                lastTimestamp: "2021-05-08T07:43:42Z",
                count: 1,
                type: "Normal",
                eventTime: null,
                reportingComponent: "",
                reportingInstance: "",
              },
            ],
          }
          this.loading = false
          this.data = kk.items
          this.page.nextToken = kk.metadata["continue"] ? kk.metadata["continue"] : ""
          console.log(this.page)
        })
        .finally(() => {
          this.loading = false
        })
    },
    getNpdExists() {
      listPod(this.clusterName).then((data) => {
        const pods = data.items
        for (const pod of pods) {
          if (pod.metadata.generateName === "node-problem-detector-") {
            this.isNPDon = true
            break
          }
        }
      })
    },
    changeNpd() {
      let op = this.isNPDon ? "create" : "delete"
      changeNpd(this.clusterName, op).then(
        () => {
          if (op === "delete") {
            this.isNPDon = false
            this.$message({ type: "success", message: this.$t("cluster.detail.event.enable_npd_success") })
          } else {
            this.isNPDon = true
            this.$message({ type: "success", message: this.$t("cluster.detail.event.disable_npd_success") })
          }
        },
        () => {
          this.isNPDon = op === "delete"
        }
      )
    },
    changeNamespace() {
      this.loading = true
      this.loadEvents(this.currentNamespace)
    },
  },
  created() {
    this.clusterName = this.$route.params.name
    this.search()
  },
}
</script>

<style scoped>
</style>
