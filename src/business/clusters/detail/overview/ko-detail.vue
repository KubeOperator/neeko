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
              <span>{{clusterDetailInfo.spec.version}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :span="10">
            <el-form-item :label="$t ('cluster.creation.arch') + ': '">
              <span>{{clusterDetailInfo.spec.architectures}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t ('cluster.creation.yum_repo') + ': '">
              <span>{{clusterDetailInfo.spec.yumOperate}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">{{$t ('cluster.creation.step2')}}</el-divider>
        <el-row type="flex" justify="center">
          <el-col :span="10">
            <el-form-item :label="$t ('cluster.creation.node_ip_num') + ': '">
              <span>{{loadNodeIPNum(clusterDetailInfo.spec.kubeNetworkNodePrefix)}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t ('cluster.creation.pod_cidr') + ': '">
              <span>{{clusterDetailInfo.spec.kubePodSubnet}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :span="10">
            <el-form-item :label="$t ('cluster.creation.service_cidr') + ': '">
              <span>{{clusterDetailInfo.spec.kubeServiceSubnet}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t ('cluster.creation.proxy_mode') + ': '">
              <span>{{clusterDetailInfo.spec.kubeProxyMode}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :span="10">
            <el-form-item :label="$t ('cluster.creation.dns_cache') + ': '">
              <span v-if="clusterDetailInfo.spec.enableDnsCache === 'enable'">{{$t ('commons.button.enable')}}</span>
              <span v-if="clusterDetailInfo.spec.enableDnsCache === 'disable'">{{$t ('commons.button.disable')}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t ('cluster.creation.kubernetes_audit') + ': '">
              <span v-if="clusterDetailInfo.spec.kubernetesAudit === 'yes'">{{$t ('commons.button.enable')}}</span>
              <span v-if="clusterDetailInfo.spec.kubernetesAudit === 'no'">{{$t ('commons.button.disable')}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :span="10">
            <el-form-item :label="'NodePort ' + $t ('cluster.creation.port_range') + ': '">
              <span>{{clusterDetailInfo.spec.kubeServiceNodePortRange}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="'NodePort ' + $t ('cluster.creation.address') + ': '">
              <span>{{clusterDetailInfo.spec.nodeportAddress}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">{{$t ('cluster.creation.step3')}}</el-divider>
        <el-row type="flex" justify="center">
          <el-col :span="10">
            <el-form-item :label="$t ('cluster.creation.runtime_type') + ': '">
              <span>{{clusterDetailInfo.spec.runtimeType}}</span>
            </el-form-item>
          </el-col>
          <el-col v-if="clusterDetailInfo.spec.runtimeType === 'docker'" :span="10">
            <el-form-item :label="$t ('cluster.creation.docker_storage_dir') + ': '">
              <span>{{clusterDetailInfo.spec.dockerStorageDir}}</span>
            </el-form-item>
          </el-col>
          <el-col v-if="clusterDetailInfo.spec.runtimeType === 'containerd'" :span="10">
            <el-form-item :label="$t ('cluster.creation.containe_storage_dir') + ': '">
              <span>{{clusterDetailInfo.spec.containerdStorageDir}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col v-if="clusterDetailInfo.spec.runtimeType === 'docker'" :span="10">
            <el-form-item :label="$t ('cluster.creation.subnet') + ': '">
              <span>{{clusterDetailInfo.spec.docker_subnet}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10"></el-col>
        </el-row>

        <el-divider content-position="left">{{$t ('cluster.creation.step4')}}</el-divider>
        <el-row type="flex" justify="center">
          <el-col :span="10">
            <el-form-item :label="$t ('cluster.creation.network_type') + ': '">
              <span>{{clusterDetailInfo.spec.networkType}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t ('cluster.creation.flannel_backend') + ': '">
              <span v-if="clusterDetailInfo.spec.networkType !== 'calico'">{{clusterDetailInfo.spec.flannelBackend}}</span>
              <span v-if="clusterDetailInfo.spec.networkType === 'calico' && clusterDetailInfo.spec.calicoIpv4PoolIpip === 'off'">bgp</span>
              <span v-if="clusterDetailInfo.spec.networkType === 'calico' && clusterDetailInfo.spec.calicoIpv4PoolIpip === 'Always'">ipip</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="clusterDetailInfo.spec.networkType === 'flannel'" type="flex" justify="center">
          <el-col :span="10">
            <el-form-item :label="$t ('cluster.creation.network_interface') + ': '">
              <span>{{clusterDetailInfo.spec.networkInterface}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
          </el-col>
        </el-row>
        <el-row v-if="clusterDetailInfo.spec.networkType === 'calico'" type="flex" justify="center">
          <el-col :span="10">
            <el-form-item :label="$t ('cluster.creation.network_cidr') + ': '">
              <span>{{clusterDetailInfo.spec.networkCidr}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t ('cluster.creation.network_interface') + ': '">
              <span>{{clusterDetailInfo.spec.networkInterface}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="clusterDetailInfo.spec.networkType === 'cilium'" type="flex" justify="center">
          <el-col v-if="clusterDetailInfo.spec.flannelBackend === 'Overlay'" :span="10">
            <el-form-item :label="$t ('cluster.creation.tunnel_name') + ': '">
              <span>{{clusterDetailInfo.spec.ciliumTunnelMode}}</span>
            </el-form-item>
          </el-col>
          <el-col v-if="clusterDetailInfo.spec.flannelBackend === 'Native Routing'" :span="10">
            <el-form-item :label="$t ('cluster.creation.native_routing') + ': '">
              <span>{{clusterDetailInfo.spec.ciliumNativeRoutingCidr}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">{{$t ('cluster.creation.step5')}}</el-divider>
        <el-row type="flex" justify="center">
          <el-col :span="10">
            <el-form-item label="helm:">
              <span>{{clusterDetailInfo.spec.helmVersion}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t ('cluster.creation.ingress_type') + ': '">
              <span>{{clusterDetailInfo.spec.ingressControllerType}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :span="10">
            <el-form-item :label="$t ('cluster.creation.support_gpu') + ': '">
              <span v-if="clusterDetailInfo.spec.supportGpu === 'enable'">{{$t ('commons.button.enable')}}</span>
              <span v-if="clusterDetailInfo.spec.supportGpu === 'disable'">{{$t ('commons.button.disable')}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
          </el-col>
        </el-row>

        <el-divider v-if="clusterDetailInfo.spec.lbMode === 'external'" content-position="left">{{$t ('cluster.creation.step6_of_bare_metal')}}</el-divider>
        <el-row v-if="clusterDetailInfo.spec.lbMode === 'external'" type="flex" justify="center">
          <el-col :span="10">
            <el-form-item label="VIP">
              <span>{{clusterDetailInfo.spec.lbKubeApiserverIp}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t('cluster.creation.port') + ': '">
              <span>{{clusterDetailInfo.spec.kubeApiServerPort}}</span>
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
