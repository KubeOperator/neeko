<template>
  <div v-loading="loading">
    <el-form ref="form" label-position='left' label-width="150px" :model="form" :rules="rules">
      <fu-steps ref="steps" footerAlign="right" finish-status="success" :beforeLeave="beforeLeave" @finish="onSubmit" @cancel="onCancel" showCancel>
        <fu-step id="cluster-info" :title="$t('cluster.creation.step6_of_bare_metal')">
          <div class="example">
            <el-scrollbar style="height:100%;overflow-x: hidden">
              <el-card>
                <div>
                  <el-button style="float: left;" :disabled="selections.length<1" @click="portShow = true">{{$t('cluster.import.batch_edit_port')}}</el-button>
                  <el-input-number :max="65536" :min="0" v-if="portShow && selections.length>0" style="float: left;width: 150px; margin-left: 5px;" v-model="port" @change="changePort" clearable />

                  <el-button style="float: left; margin-left: 20px;" :disabled="selections.length<1" @click="credentialIDShow = true">{{$t('cluster.import.batch_edit_credential')}}</el-button>
                  <el-select v-if="credentialIDShow && selections.length>0" style="float: left; width: 200px; margin-left: 5px;" @change="changeCredential" v-model="credentialID" clearable filterable>
                    <el-option v-for="cre in credentialList" :key="cre.id" :value="cre.id" :label="cre.name" />
                  </el-select>
                </div>
                <complex-table :data="form.clusterInfo.nodes" :selects.sync="selections" style="width: 100%">
                  <el-table-column type="selection" fix></el-table-column>
                  <el-table-column prop="name" :label="$t('commons.table.name')" />
                  <el-table-column prop="ip" label="ip" />
                  <el-table-column prop="architecture" :label="$t('cluster.creation.arch')" />
                  <el-table-column prop="role" label="Role" />
                  <el-table-column prop="port" :label="$t('cluster.creation.port')" min-width="70px">
                    <template v-slot:default="{row}">
                      <el-input v-model="row.port" clearable />
                    </template>
                  </el-table-column>
                  <el-table-column prop="credentialID" :label="$t('host.credential_name')" min-width="120px">
                    <template v-slot:default="{row}">
                      <el-select style="width:100%" v-model="row.credentialID" clearable filterable>
                        <el-option v-for="cre in credentialList" :key="cre.id" :value="cre.id" :label="cre.name" />
                      </el-select>
                    </template>
                  </el-table-column>
                </complex-table>
              </el-card>
            </el-scrollbar>
          </div>
        </fu-step>
        <fu-step id="cluster-setting" :title="$t('cluster.creation.step2')">
          <div class="example">
            <el-scrollbar style="height:100%">
              <el-card>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item :label="$t('cluster.creation.node_ip_num')" prop="clusterInfo.maxNodePodNum">
                      <fu-read-write-switch :data="form.clusterInfo.maxNodePodNum" v-model="editAble.maxNodePodNum">
                        <el-input v-model="form.clusterInfo.maxNodePodNum" @blur="editAble.maxNodePodNum = false" />
                      </fu-read-write-switch>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item :label="$t ('cluster.creation.pod_cidr')" prop="clusterInfo.kubePodSubnet">
                      <fu-read-write-switch :data="form.clusterInfo.kubePodSubnet" v-model="editAble.kubePodSubnet">
                        <el-input v-model="form.clusterInfo.kubePodSubnet" @blur="editAble.kubePodSubnet = false" />
                      </fu-read-write-switch>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item :label="$t ('cluster.creation.service_cidr')" prop="clusterInfo.kubeServiceSubnet">
                      <fu-read-write-switch :data="form.clusterInfo.kubeServiceSubnet" v-model="editAble.kubeServiceSubnet">
                        <el-input v-model="form.clusterInfo.kubeServiceSubnet" @blur="editAble.kubeServiceSubnet = false" />
                      </fu-read-write-switch>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item :label="$t('cluster.creation.proxy_mode')" prop="clusterInfo.kubeProxyMode">
                      <fu-select-rw-switch v-model="form.clusterInfo.kubeProxyMode">
                        <template #read>
                          <el-tag disable-transitions v-if="form.clusterInfo.kubeProxyMode === 'iptables'">Iptables</el-tag>
                          <el-tag disable-transitions v-if="form.clusterInfo.kubeProxyMode === 'ipvs'">ipvs</el-tag>
                        </template>
                        <el-option key="Iptables" label="Iptables" value="iptables" />
                        <el-option key="ipvs" label="ipvs" value="ipvs" />
                      </fu-select-rw-switch>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item :label="$t('cluster.creation.dns_cache')" prop="clusterInfo.enableDnsCache">
                      <fu-select-rw-switch v-model="form.clusterInfo.enableDnsCache">
                        <template #read>
                          <el-tag disable-transitions v-if="form.clusterInfo.enableDnsCache === 'enable'">{{$t('cluster.creation.enable')}}</el-tag>
                          <el-tag disable-transitions v-if="form.clusterInfo.enableDnsCache === 'disable'">{{$t('cluster.creation.disable')}}</el-tag>
                        </template>
                        <el-option key="enable" :label="$t('cluster.creation.enable')" value="enable" />
                        <el-option key="disable" :label="$t('cluster.creation.disable')" value="disable" />
                      </fu-select-rw-switch>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item :label="$t('cluster.creation.kubernetes_audit')" prop="clusterInfo.kubernetesAudit">
                      <fu-select-rw-switch v-model="form.clusterInfo.kubernetesAudit">
                        <template #read>
                          <el-tag disable-transitions v-if="form.clusterInfo.kubernetesAudit === 'enable'">{{$t('cluster.creation.enable')}}</el-tag>
                          <el-tag disable-transitions v-if="form.clusterInfo.kubernetesAudit === 'disable'">{{$t('cluster.creation.disable')}}</el-tag>
                        </template>
                        <el-option key="enable" :label="$t('cluster.creation.enable')" value="enable" />
                        <el-option key="disable" :label="$t('cluster.creation.disable')" value="disable" />
                      </fu-select-rw-switch>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item :label="'NodePort ' + $t ('cluster.creation.port_range')" prop="clusterInfo.kubeServiceNodePortRange">
                      <fu-read-write-switch :data="form.clusterInfo.kubeServiceNodePortRange" v-model="editAble.kubeServiceNodePortRange">
                        <el-input v-model="form.kubeServiceNodePortRange" @blur="editAble.kubeServiceNodePortRange = false" />
                      </fu-read-write-switch>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item :label="'NodePort ' + $t ('cluster.creation.address')" prop="clusterInfo.nodeportAddress">
                      <fu-read-write-switch :data="form.clusterInfo.nodeportAddress" v-model="editAble.nodeportAddress">
                        <el-input v-model="form.clusterInfo.nodeportAddress" @blur="editAble.nodeportAddress = false" />
                      </fu-read-write-switch>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-card>
            </el-scrollbar>
          </div>
        </fu-step>

        <fu-step id="runtime-setting" :title="$t ('cluster.import.other_info')">
          <div class="example">
            <el-scrollbar style="height:100%">
              <el-card>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item :label="$t ('cluster.creation.runtime_type')" prop="clusterInfo.runtimeType">
                      <fu-select-rw-switch v-model="form.clusterInfo.runtimeType">
                        <template #read>
                          <el-tag disable-transitions v-if="form.clusterInfo.runtimeType === 'docker'">docker</el-tag>
                          <el-tag disable-transitions v-if="form.clusterInfo.runtimeType === 'containerd'">containerd</el-tag>
                        </template>
                        <el-option key="docker" label="docker" value="docker" />
                        <el-option key="containerd" label="containerd" value="containerd" />
                      </fu-select-rw-switch>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item v-if="form.clusterInfo.runtimeType === 'docker'" :label="$t ('cluster.creation.docker_storage_dir')" prop="clusterInfo.dockerStorageDir">
                      <el-input v-model="form.clusterInfo.dockerStorageDir" placeholder="/var/lib/docker" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item v-if="form.clusterInfo.runtimeType === 'containerd'" :label="$t ('cluster.creation.containe_storage_dir')" prop="clusterInfo.containerdStorageDir">
                      <el-input v-model="form.clusterInfo.containerdStorageDir" placeholder="/var/lib/containerd" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item v-if="form.clusterInfo.runtimeType === 'docker'" :label="$t ('cluster.creation.subnet')" prop="clusterInfo.dockerSubnet">
                      <el-input v-model="form.clusterInfo.dockerSubnet" placeholder="172.17.0.1/16" />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item :label="$t ('cluster.creation.network_type')" prop="clusterInfo.networkType">
                      <fu-select-rw-switch v-model="form.clusterInfo.networkType">
                        <template #read>
                          <el-tag disable-transitions v-if="form.clusterInfo.networkType === 'flannel'">flannel</el-tag>
                          <el-tag disable-transitions v-if="form.clusterInfo.networkType === 'calico'">calico</el-tag>
                          <el-tag disable-transitions v-if="form.clusterInfo.networkType === 'cilium'">cilium</el-tag>
                        </template>
                        <el-option key="flannel" label="flannel" value="flannel" />
                        <el-option key="calico" label="calico" value="calico" />
                        <el-option v-if="form.clusterInfo.architectures === 'amd64'" key="cilium" label="cilium" value="cilium" />
                      </fu-select-rw-switch>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item v-if="form.clusterInfo.networkType === 'flannel'" :label="$t('cluster.creation.flannel_backend')" prop="clusterInfo.flannelBackend">
                      <el-select style="width: 100%" v-model="form.clusterInfo.flannelBackend" clearable>
                        <el-option key="host-gw" label="host-gw" value="host-gw" />
                        <el-option key="vxlan" label="vxlan" value="vxlan" />
                      </el-select>
                    </el-form-item>
                    <el-form-item v-if="form.clusterInfo.networkType === 'calico'" :label="$t('cluster.creation.flannel_backend')" prop="clusterInfo.calicoIpv4PoolIpip">
                      <el-select style="width: 100%" v-model="form.clusterInfo.calicoIpv4PoolIpip" clearable>
                        <el-option value="off" label="bgp">bgp</el-option>
                        <el-option value="Always" label="ipip">ipip</el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item v-if="form.clusterInfo.networkType === 'cilium'" :label="$t('cluster.creation.flannel_backend')" prop="clusterInfo.flannelBackend">
                      <el-select style="width: 100%" v-model="form.clusterInfo.flannelBackend" clearable>
                        <el-option value="Overlay">Overlay</el-option>
                        <el-option value="Native Routing">Native Routing</el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20" v-if="form.clusterInfo.networkType === 'flannel'">
                  <el-col :span="12">
                    <el-form-item :label="$t('cluster.creation.multi_network')" prop="multi_network">
                      <el-select style="width: 100%" v-model="multi_network" clearable>
                        <el-option value="enable">{{$t('cluster.creation.enable')}}</el-option>
                        <el-option value="disable">{{$t('cluster.creation.disable')}}</el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item v-if="multi_network === 'enable'" :label="$t ('cluster.creation.network_interface')" prop="clusterInfo.networkInterface">
                      <el-input v-model="form.clusterInfo.networkInterface" clearable></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="20" v-if="form.clusterInfo.networkType === 'calico'">
                  <el-col :span="12">
                    <el-form-item :label="$t('cluster.creation.multi_network')" prop="multi_network">
                      <el-select style="width: 100%" v-model="multi_network" clearable>
                        <el-option value="disable" :label="$t('cluster.creation.disable')">{{$t('cluster.creation.disable')}}</el-option>
                        <el-option value="name" :label="$t('cluster.creation.network_name')">{{$t('cluster.creation.network_name')}}</el-option>
                        <el-option value="cidr" :label="$t('cluster.creation.network_cidr')">{{$t('cluster.creation.network_cidr')}}</el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item v-if="multi_network === 'name'" :label="$t ('cluster.creation.network_interface')" prop="clusterInfo.networkInterface">
                      <el-input v-model="form.clusterInfo.networkInterface" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item v-if="multi_network === 'cidr'" :label="$t ('cluster.creation.network_cidr')" prop="clusterInfo.networkCidr">
                      <el-input v-model="form.clusterInfo.networkCidr" clearable placeholder="10.0.1.0/24,10.0.2.0/24"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20" v-if="form.clusterInfo.networkType === 'cilium'">
                  <el-col :span="12">
                    <el-form-item v-if="form.clusterInfo.flannelBackend === 'Overlay'" :label="$t('cluster.creation.tunnel_name')" prop="clusterInfo.ciliumTunnelMode">
                      <el-select style="width: 100%" v-model="form.clusterInfo.ciliumTunnelMode" clearable>
                        <el-option value="vxlan" label="vxlan">vxlan</el-option>
                        <el-option value="geneve" label="geneve">geneve</el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item v-if="form.clusterInfo.flannelBackend === 'Native Routing'" :label="$t('cluster.creation.native_routing')" prop="clusterInfo.ciliumNativeRoutingCidr">
                      <el-input v-model="form.clusterInfo.ciliumNativeRoutingCidr" placeholder="10.244.0.0/18" clearable></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item :label="$t ('cluster.creation.ingress_type')" prop="clusterInfo.ingressControllerType">
                      <fu-select-rw-switch v-model="form.clusterInfo.ingressControllerType">
                        <template #read>
                          <el-tag disable-transitions v-if="form.clusterInfo.ingressControllerType === 'nginx'">nginx</el-tag>
                          <el-tag disable-transitions v-if="form.clusterInfo.ingressControllerType === 'traefik'">traefik</el-tag>
                        </template>
                        <el-option key="nginx" label="nginx" value="nginx" />
                        <el-option key="traefik" v-if="form.clusterInfo.enableDnsCache === 'disable'" label="traefik" value="traefik" />
                      </fu-select-rw-switch>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-card>
            </el-scrollbar>
          </div>
        </fu-step>
      </fu-steps>
    </el-form>
  </div>
</template>

<script>
import { listCredentialAll } from "@/api/credentials"
import { importCluster } from "@/api/cluster"
import ComplexTable from "@/components/complex-table"
import { getClusterInfo } from "@/api/cluster"
import Rule from "@/utils/rules"

export default {
  name: "KoImport",
  props: {
    clusterImportInfo: Object,
  },
  components: { ComplexTable },
  data() {
    return {
      loading: false,
      credentialList: [],
      selections: [],
      credentialIDShow: false,
      credentialID: "",
      port: "",
      portShow: false,
      form: {
        name: "",
        apiServer: "",
        token: "",
        router: "",
        projectName: "",
        architectures: "",
        isKoCluster: true,

        clusterInfo: {
          version: "",
          maxNodePodNum: null,
          maxNodeNum: null,
          kubeProxyMode: "",
          nodeportAddress: "",
          kubeServiceNodePortRange: "",
          enableDnsCache: "",
          dnsCacheVersion: "1.17.0",
          kubernetesAudit: "disable",
          kubePodSubnet: "",
          kubeServiceSubnet: "",

          runtimeType: "",
          dockerStorageDir: "",
          containerdStorageDir: "",
          dockerSubnet: "",

          networkInterface: "",
          networkCidr: "",
          networkType: "",
          flannelBackend: "",
          calicoIpv4PoolIpip: "",
          ciliumVersion: "v1.9.5",
          ciliumNativeRoutingCidr: "",
          ciliumTunnelMode: "",

          ingressControllerType: "",
          helmVersion: "v3",
          supportGpu: "disable",

          nodes: [],
        },
      },

      rules: {
        clusterInfo: {
          runtimeType: [Rule.RequiredRule],
          maxNodePodNum: [Rule.RequiredRule],
          kubeServiceSubnet: [Rule.RequiredRule],
          kubeProxyMode: [Rule.RequiredRule],
          kubeServiceNodePortRange1: [Rule.NumberRule],
          kubeServiceNodePortRange2: [Rule.NumberRule],
          networkType: [Rule.RequiredRule],
          flannelBackend: [Rule.RequiredRule],
          calicoIpv4PoolIpip: [Rule.RequiredRule],
          ciliumTunnelMode: [Rule.RequiredRule],
          ingressControllerType: [Rule.RequiredRule],
        },
      },
      editAble: {
        maxNodePodNum: false,
        maxNodeNum: false,
        kubeProxyMode: false,
        nodeportAddress: false,
        kubeServiceNodePortRange: false,
        kubeServiceNodePortRange1: false,
        kubeServiceNodePortRange2: false,
        enableDnsCache: false,
        dnsCacheVersion: false,
        kubernetesAudit: false,
        kubePodSubnet: false,
        kubeServiceSubnet: false,

        runtimeType: false,
        networkType: false,
      },
      multi_network: "",
    }
  },
  methods: {
    changePort() {
      for (const node of this.selections) {
        node.port = this.port
      }
    },
    changeCredential() {
      for (const node of this.selections) {
        node.credentialID = this.credentialID
      }
    },
    beforeLeave(step, isNext) {
      if (!isNext) {
        return
      }
      if (step.index === 0) {
        for (const node of this.form.clusterInfo.nodes) {
          if (node.credentialID === "" || node.credentialID === "") {
            return false
          }
        }
      }
      let bool
      this.$refs["form"].validate((valid) => {
        if (valid) {
          bool = true
        } else {
          bool = false
        }
      })
      return bool
    },
    onSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.loadding = true
          for (const node of this.form.clusterInfo.nodes) {
            node.port = Number(node.port)
          }
          this.form.clusterInfo.kubeMaxPods = Number(this.form.clusterInfo.kubeMaxPods)
          this.form.clusterInfo.maxNodeNum = Number(this.form.clusterInfo.maxNodeNum)
          this.form.clusterInfo.maxNodePodNum = Number(this.form.clusterInfo.maxNodePodNum)
          this.form.clusterInfo.helmVersion = "v3"
          this.form.clusterInfo.ciliumVersion = "v1.9.5"
          this.form.clusterInfo.dnsCacheVersion = "1.17.0"
          importCluster(this.form)
            .then(() => {
              this.loadding = false
              this.$router.push({ name: "ClusterList" })
            })
            .catch(() => {
              this.loadding = false
            })
        } else {
          return false
        }
      })
    },

    getCredentials() {
      listCredentialAll().then((data) => {
        this.credentialList = data.items
      })
    },
    loadClusterInfo() {
      this.loading = true
      this.form.name = this.clusterImportInfo.name
      this.form.apiServer = this.clusterImportInfo.apiServer
      this.form.token = this.clusterImportInfo.token
      this.form.router = this.clusterImportInfo.router
      this.form.projectName = this.clusterImportInfo.projectName
      this.form.architectures = this.clusterImportInfo.architectures
      this.form.isKoCluster = this.clusterImportInfo.isKoCluster
      let data = {
        name: this.clusterImportInfo.name,
        apiServer: this.clusterImportInfo.apiServer,
        router: this.clusterImportInfo.router,
        token: this.clusterImportInfo.token,
        architectures: this.clusterImportInfo.architectures,
      }
      getClusterInfo(data).then((res) => {
        this.form.clusterInfo = res
        this.form.clusterInfo.kubernetesAudit = "disable"
        this.loading = false
      })
    },
    onCancel() {
      this.$router.push({ name: "ClusterList" })
    },
  },
  created() {
    this.loadClusterInfo()
    this.getCredentials()
  },
}
</script>

<style lang="scss" scoped>
.example {
  height: 300px;
  margin: 1% 10%;
  ul {
    height: 20px;
  }
  /deep/ .el-scrollbar__wrap {
    height: 100%;
    overflow-x: hidden;
  }
}
</style>