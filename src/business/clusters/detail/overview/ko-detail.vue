<template>
  <div v-loading="loading">
    <el-dialog :visible.sync="dialogDetailVisible" :title="$t ('cluster.cluster_detail')" :before-close="onCancel" width="70%" :close-on-click-modal="false">
      <el-form>
        <el-divider content-position="left">{{$t ('cluster.creation.base_setting')}}</el-divider>
        <el-row type="flex" justify="center">
          <el-col :span="10">
            <el-form-item :label="$t ('cluster.creation.name') + ': '">
              <span>{{clusterDetailInfo.name}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t ('cluster.creation.name_type') + ': '">
              <span>{{clusterDetailInfo.nodeNameRule}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :span="10">
            <el-form-item :label="$t ('cluster.creation.provider') + ': '">
              <span v-if="clusterDetailInfo.provider === 'plan'">{{$t ('cluster.creation.provide_plan')}}</span>
              <span v-if="clusterDetailInfo.provider === 'bareMetal'">{{$t ('cluster.creation.provide_bare_metal')}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t ('cluster.creation.version') + ': '">
              <span>{{clusterDetailInfo.version}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :span="10">
            <el-form-item :label="$t ('cluster.creation.arch') + ': '">
              <span>{{clusterDetailInfo.architectures}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t ('cluster.creation.yum_repo') + ': '">
              <span>{{clusterDetailInfo.specConf.yumOperate}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">{{$t ('cluster.creation.step2')}}</el-divider>
        <el-row type="flex" justify="center">
          <el-col :span="10">
            <el-form-item :label="$t ('cluster.creation.node_ip_num') + ': '">
              <span>{{loadNodeIPNum(clusterDetailInfo.specConf.kubeNetworkNodePrefix)}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t ('cluster.creation.pod_cidr') + ': '">
              <span>{{clusterDetailInfo.specConf.kubePodSubnet}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :span="10">
            <el-form-item :label="$t ('cluster.creation.service_cidr') + ': '">
              <span>{{clusterDetailInfo.specConf.kubeServiceSubnet}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t ('cluster.creation.proxy_mode') + ': '">
              <span>{{clusterDetailInfo.specConf.kubeProxyMode}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :span="10">
            <el-form-item :label="$t ('cluster.creation.dns_cache') + ': '">
              <span v-if="clusterDetailInfo.specConf.enableDnsCache === 'enable'">{{$t ('commons.button.enable')}}</span>
              <span v-if="clusterDetailInfo.specConf.enableDnsCache === 'disable'">{{$t ('commons.button.disable')}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t ('cluster.creation.kubernetes_audit') + ': '">
              <span v-if="clusterDetailInfo.specConf.kubernetesAudit === 'yes'">{{$t ('commons.button.enable')}}</span>
              <span v-if="clusterDetailInfo.specConf.kubernetesAudit === 'no'">{{$t ('commons.button.disable')}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :span="10">
            <el-form-item :label="'NodePort ' + $t ('cluster.creation.port_range') + ': '">
              <span>{{clusterDetailInfo.specConf.kubeServiceNodePortRange}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="'NodePort ' + $t ('cluster.creation.address') + ': '">
              <span>{{clusterDetailInfo.specConf.nodeportAddress}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">{{$t ('cluster.creation.step3')}}</el-divider>
        <el-row type="flex" justify="center">
          <el-col :span="10">
            <el-form-item :label="$t ('cluster.creation.runtime_type') + ': '">
              <span>{{clusterDetailInfo.specRuntime.runtimeType}}</span>
            </el-form-item>
          </el-col>
          <el-col v-if="clusterDetailInfo.specRuntime.runtimeType === 'docker'" :span="10">
            <el-form-item :label="$t ('cluster.creation.docker_storage_dir') + ': '">
              <span>{{clusterDetailInfo.specRuntime.dockerStorageDir}}</span>
            </el-form-item>
          </el-col>
          <el-col v-if="clusterDetailInfo.specRuntime.runtimeType === 'containerd'" :span="10">
            <el-form-item :label="$t ('cluster.creation.containe_storage_dir') + ': '">
              <span>{{clusterDetailInfo.specRuntime.containerdStorageDir}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col v-if="clusterDetailInfo.specRuntime.runtimeType === 'docker'" :span="10">
            <el-form-item :label="$t ('cluster.creation.subnet') + ': '">
              <span>{{clusterDetailInfo.specRuntime.dockerSubnet}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10"></el-col>
        </el-row>

        <el-divider content-position="left">{{$t ('cluster.creation.step4')}}</el-divider>
        <el-row type="flex" justify="center">
          <el-col :span="10">
            <el-form-item :label="$t ('cluster.creation.network_type') + ': '">
              <span>{{clusterDetailInfo.specNetwork.networkType}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t ('cluster.creation.flannel_backend') + ': '">
              <span v-if="clusterDetailInfo.specNetwork.networkType !== 'calico'">{{clusterDetailInfo.specNetwork.flannelBackend}}</span>
              <span v-if="clusterDetailInfo.specNetwork.networkType === 'calico' && clusterDetailInfo.specNetwork.calicoIpv4PoolIpip === 'off'">bgp</span>
              <span v-if="clusterDetailInfo.specNetwork.networkType === 'calico' && clusterDetailInfo.specNetwork.calicoIpv4PoolIpip === 'Always'">ipip</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="clusterDetailInfo.specNetwork.networkType === 'flannel'" type="flex" justify="center">
          <el-col :span="10">
            <el-form-item :label="$t ('cluster.creation.network_interface') + ': '">
              <span>{{clusterDetailInfo.specNetwork.networkInterface}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
          </el-col>
        </el-row>
        <el-row v-if="clusterDetailInfo.specNetwork.networkType === 'calico'" type="flex" justify="center">
          <el-col :span="10">
            <el-form-item :label="$t ('cluster.creation.network_cidr') + ': '">
              <span>{{clusterDetailInfo.specNetwork.networkCidr}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t ('cluster.creation.network_interface') + ': '">
              <span>{{clusterDetailInfo.specNetwork.networkInterface}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="clusterDetailInfo.specNetwork.networkType === 'cilium'" type="flex" justify="center">
          <el-col v-if="clusterDetailInfo.specNetwork.flannelBackend === 'Overlay'" :span="10">
            <el-form-item :label="$t ('cluster.creation.tunnel_name') + ': '">
              <span>{{clusterDetailInfo.specNetwork.ciliumTunnelMode}}</span>
            </el-form-item>
          </el-col>
          <el-col v-if="clusterDetailInfo.specNetwork.flannelBackend === 'Native Routing'" :span="10">
            <el-form-item :label="$t ('cluster.creation.native_routing') + ': '">
              <span>{{clusterDetailInfo.specNetwork.ciliumNativeRoutingCidr}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">{{$t ('cluster.creation.step5')}}</el-divider>
        <el-row type="flex" justify="center">
          <el-col :span="10">
            <el-form-item label="helm:">
              <span>{{clusterDetailInfo.specRuntime.helmVersion}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t ('cluster.creation.ingress_type') + ': '">
              <span>{{clusterDetailInfo.specConf.ingressControllerType}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row type="flex" justify="center">
          <el-col :span="10">
            <el-form-item :label="$t ('cluster.creation.support_gpu') + ': '">
              <span v-if="clusterDetailInfo.spec.supportGpu === 'enable'">{{$t ('commons.button.enable')}}</span>
              <span v-if="clusterDetailInfo.spec.supportGpu === 'disable'">{{$t ('commons.button.disable')}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
          </el-col>
        </el-row> -->

        <el-divider v-if="clusterDetailInfo.specConf.lbMode === 'external'" content-position="left">{{$t ('cluster.creation.step6_of_bare_metal')}}</el-divider>
        <el-row v-if="clusterDetailInfo.specConf.lbMode === 'external'" type="flex" justify="center">
          <el-col :span="10">
            <el-form-item label="VIP">
              <span>{{clusterDetailInfo.specConf.lbKubeApiserverIp}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t('cluster.creation.port') + ': '">
              <span>{{clusterDetailInfo.specConf.kubeApiServerPort}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "KoDetail",
  props: {
    clusterDetailInfo: Object,
    visible: Boolean,
  },
  data() {
    return {
      dialogDetailVisible: false,
      loading: false,
    }
  },
  methods: {
    onCancel() {
      this.dialogDetailVisible = false
      this.$emit("changeVisble", this.dialogDetailVisible)
    },
    loadNodeIPNum(maxNodeNum) {
      return Math.pow(2, 32 - maxNodeNum)
    },
  },
  created() {
    this.dialogDetailVisible = true
  },
}
</script>
