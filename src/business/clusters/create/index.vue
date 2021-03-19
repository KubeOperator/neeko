<template>
  <layout-content>
    <el-form :model="form" ref="form" :rules="rules" label-width="160px" style="" size="small">
      <el-steps :active="activeStep" finish-status="success" simple style="margin-top: 16px">
        <el-step style="font-size: 10px!" :title="$t ('cluster.creation.step1')"></el-step>
        <el-step :title="$t ('cluster.creation.step2')"></el-step>
        <el-step :title="$t ('cluster.creation.step3')"></el-step>
        <el-step :title="$t ('cluster.creation.step4')"></el-step>
        <el-step :title="$t ('cluster.creation.step5')"></el-step>
        <el-step :title="$t ('cluster.creation.step6_of_bare_metal')"></el-step>
        <el-step :title="$t ('cluster.creation.step7')"></el-step>
      </el-steps>

      <div style="margin-top:40px; margin-right:140px;">
        <div v-if="activeStep === 0">
          <el-form-item :label="$t('cluster.creation.name')" prop="name">
            <el-input v-model="form.name" @blur="onNameCheck()" clearable></el-input>
            <div v-if="isNameChecking"><span class="input-help">{{$t('cluster.creation.name_check')}}</span></div>
            <div v-if="!nameValid"><span class="input-error">{{$t('cluster.creation.name_invalid_err')}}</span></div>
            <div><span class="input-help">{{$t('cluster.creation.name_help')}}</span></div>
          </el-form-item>
          <el-form-item :label="$t('cluster.creation.provider')" prop="provider">
            <el-select style="width: 100%" v-model="form.provider" clearable>
              <el-option value="bareMetal" :label="$t('cluster.creation.provide_bare_metal')">{{$t('cluster.creation.provide_bare_metal')}}</el-option>
              <el-option value="plan" :label="$t('cluster.creation.provide_plan')">{{$t('cluster.creation.provide_plan')}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('cluster.creation.version')" prop="version">
            <el-select style="width: 100%" v-model="form.version" clearable>
              <el-option v-for="item of versions" :key="item" :value="item">{{item}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('cluster.creation.arch')" prop="architectures">
            <el-select style="width: 100%" v-model="form.architectures" clearable>
              <el-option value="amd64" label="AMD64">AMD64</el-option>
              <el-option v-if="form.provider === 'bareMetal'" value="arm64" label="ARM64">ARM64</el-option>
              <el-option v-if="form.provider === 'bareMetal'" value="all" label="MIXED">MIXED</el-option>
            </el-select>
            <div v-if="!archValid"><span class="input-error">{{$t('cluster.creation.repo_err')}}</span></div>
          </el-form-item>
          <el-form-item :label="$t('cluster.creation.yum_repo')" prop="yumOperate">
            <el-select style="width: 100%" v-model="form.yumOperate" clearable>
              <el-option value="replace">replace</el-option>
              <el-option value="coexist">coexist</el-option>
              <el-option value="no">no</el-option>
            </el-select>
            <div v-if="form.yumOperate === 'replace'"><span class="input-help">{{$t('cluster.creation.yum_repo_replace_help')}}</span></div>
            <div v-if="form.yumOperate === 'coexist'"><span class="input-help">{{$t('cluster.creation.yum_repo_coexist_help')}}</span></div>
            <div v-if="form.yumOperate === 'no'"><span class="input-help">{{$t('cluster.creation.yum_repo_no_help')}}</span></div>
          </el-form-item>
        </div>

        <div v-if="activeStep === 1">
          <el-form-item :label="$t ('cluster.creation.container_network')" prop="networkType">
            <el-select filterable @change="onPart1Change()" style="width: 10%" v-model="parts[0]" clearable>
              <el-option v-for="item of part1Options" :key="item" :value="item">{{item}}</el-option>
            </el-select>
            <span> . </span>
            <el-select filterable :disabled="part2Options.length < 2" @change="getNodeNum()" style="width: 10%" v-model="parts[1]" clearable>
              <el-option v-for="item of part2Options" :key="item" :value="item">{{item}}</el-option>
            </el-select>
            <span> . </span>
            <el-select filterable :disabled="part3Options.length < 2" @change="getNodeNum()" style="width: 10%" v-model="parts[2]" clearable>
              <el-option v-for="item of part3Options" :key="item" :value="item">{{item}}</el-option>
            </el-select>
            <span> . </span>
            <el-select filterable style="width: 10%" disabled v-model="parts[3]" clearable>
              <el-option value="0">0</el-option>
            </el-select>
            <span> / </span>
            <el-select filterable @change="onMaskChange()" style="width: 10%" v-model="parts[4]" clearable>
              <el-option v-for="item of maskOptions" :key="item" :value="item">{{item}}</el-option>
            </el-select>
            <div><span class="input-help">{{$t('cluster.creation.network_help')}}</span></div>
          </el-form-item>
          <el-form-item :label="$t('cluster.creation.max_node_pod_num')" prop="maxNodePodNum">
            <el-select filterable style="width: 100%" v-model="form.maxNodePodNum" clearable>
              <el-option v-for="item of podMaxNumOptions" :key="item" :value="item">{{item}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('cluster.creation.max_cluster_service_num')" prop="maxClusterServiceNum">
            <el-select filterable style="width: 100%" v-model="form.maxClusterServiceNum" clearable>
              <el-option v-for="item of serviceMaxNumOptions" :key="item" :value="item">{{item}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('cluster.creation.proxy_mode')" prop="kubeProxyMode">
            <el-select style="width: 100%" v-model="form.kubeProxyMode" clearable>
              <el-option value="iptables" label="Iptables">Iptables</el-option>
              <el-option value="ipvs">ipvs</el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('cluster.creation.kubernetes_audit')" prop="kubernetesAudit">
            <el-select style="width: 100%" v-model="form.kubernetesAudit" clearable>
              <el-option value="yes" :label="$t('cluster.creation.enable')">{{$t('cluster.creation.enable')}}</el-option>
              <el-option value="no" :label="$t('cluster.creation.disable')">{{$t('cluster.creation.disable')}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <span style="color: green">{{$t ('cluster.creation.max_node_num_show', [maxNodesNum])}}</span>
          </el-form-item>
        </div>

        <div v-if="activeStep === 2">
          <el-form-item :label="$t ('cluster.creation.runtime_type')" prop="runtimeType">
            <el-select style="width: 100%" v-model="form.runtimeType" clearable>
              <el-option value="docker">docker</el-option>
              <el-option value="containerd">containerd</el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="form.runtimeType === 'docker'" :label="$t ('cluster.creation.docker_storage_dir')" prop="dockerStorageDir">
            <el-input v-model="form.dockerStorageDir" clearable></el-input>
          </el-form-item>
          <el-form-item v-if="form.runtimeType === 'containerd'" :label="$t ('cluster.creation.containe_storage_dir')" prop="containerdStorageDir">
            <el-input v-model="form.containerdStorageDir" clearable></el-input>
          </el-form-item>
          <el-form-item v-if="form.runtimeType === 'docker'" :label="$t ('cluster.creation.subnet')" prop="dockerSubnet">
            <el-input v-model="form.dockerSubnet" clearable></el-input>
          </el-form-item>
        </div>

        <div v-if="activeStep === 3">
          <el-form-item :label="$t ('cluster.creation.network_interface')" prop="networkInterface">
            <el-input v-model="form.networkInterface" clearable></el-input>
            <div><span class="input-help">{{$t('cluster.creation.network_interface_help')}}</span></div>
          </el-form-item>
          <el-form-item :label="$t ('cluster.creation.network_type')" prop="networkType">
            <el-select style="width: 100%" v-model="form.networkType" clearable>
              <el-option value="flannel">flannel</el-option>
              <el-option value="calico">calico</el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t ('cluster.creation.flannel_backend')" prop="flannelBackend">
            <el-select v-if="form.networkType === 'flannel'" style="width: 100%" v-model="form.flannelBackend" clearable>
              <el-option value="host-gw">host-gw</el-option>
              <el-option value="vxlan">vxlan</el-option>
            </el-select>
            <el-select v-if="form.networkType === 'calico'" style="width: 100%" v-model="form.calicoIpv4poolIpip" clearable>
              <el-option value="off" label="bgp">bgp</el-option>
              <el-option value="Always" label="ipip">ipip</el-option>
            </el-select>
            <div v-if="form.flannelBackend === 'host-gw' || form.flannelBackend === 'bgp'"><span class="input-help">{{$t('cluster.creation.flannel_backend_help_route')}}</span></div>
            <div v-if="form.flannelBackend === 'calico' || form.flannelBackend === 'ipip'"><span class="input-help">{{$t('cluster.creation.flannel_backend_help_channel')}}</span></div>
          </el-form-item>
        </div>

        <div v-if="activeStep === 4">
          <el-form-item label="helm:" prop="helmVersion">
            <el-select style="width: 100%" v-model="form.helmVersion" clearable>
              <el-option value="v3">v3</el-option>
              <el-option value="v2">v2</el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t ('cluster.creation.ingress_type')" prop="ingressControllerType">
            <el-select style="width: 100%" v-model="form.ingressControllerType" clearable>
              <el-option value="nginx">nginx</el-option>
              <el-option value="traefik">traefik</el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t ('cluster.creation.support_gpu')" prop="supportGpu">
            <el-select style="width: 100%" v-model="form.supportGpu" clearable>
              <el-option value="enable" :label="$t ('cluster.creation.enable')">{{$t ('cluster.creation.enable')}}</el-option>
              <el-option value="disable" :label="$t ('cluster.creation.disable')">{{$t ('cluster.creation.disable')}}</el-option>
            </el-select>
          </el-form-item>
        </div>

        <div v-if="activeStep === 5 && form.provider === 'bareMetal'">
          <el-form-item>
            <span>{{$t ('cluster.creation.node_help')}}</span>
          </el-form-item>
          <el-form-item label="Masters" prop="name">
            <el-select multiple filterable style="width: 100%" v-model="masters" clearable>
              <el-option value="enable">{{$t ('cluster.creation.enable')}}</el-option>
              <el-option value="disable">{{$t ('cluster.creation.disable')}}</el-option>
            </el-select>
            <div><span class="input-help">{{$t('cluster.creation.master_select_help')}}</span></div>
          </el-form-item>
          <el-form-item label="Workers" prop="name">
            <el-select multiple filterable style="width: 100%" v-model="workers" clearable>
              <el-option value="enable">{{$t ('cluster.creation.enable')}}</el-option>
              <el-option value="disable">{{$t ('cluster.creation.disable')}}</el-option>
            </el-select>
          </el-form-item>
        </div>

        <div v-if="activeStep === 5 && form.provider === 'plan'">
          <el-form-item :label="$t ('cluster.creation.step6_of_plan')" prop="name">
            <el-select multiple filterable style="width: 100%" v-model="masters" clearable>
              <el-option value="enable">{{$t ('cluster.creation.support_gpu_enable')}}</el-option>
              <el-option value="disable">{{$t ('cluster.creation.support_gpu_disable')}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t ('cluster.creation.worker_num')" prop="workerAmount">
            <el-input v-model="from.workerAmount" clearable></el-input>
          </el-form-item>
        </div>

        <div v-if="activeStep === 6">
          <el-form-item>
            <el-divider content-position="left">{{$t ('cluster.creation.base_setting')}}</el-divider>
            <div>
              <el-row type="flex" justify="center">
                <el-col :span="4">
                  <label class="preview">{{$t ('cluster.creation.name')}}</label>
                </el-col>
                <el-col :span="4">
                  <label class="preview">{{form.name}}</label>
                </el-col>
              </el-row>
              <el-row type="flex" justify="center">
                <el-col :span="4">
                  <label class="preview">{{$t ('cluster.creation.provider')}}</label>
                </el-col>
                <el-col :span="4">
                  <label class="preview">{{form.provider}}</label>
                </el-col>
              </el-row>
              <el-row type="flex" justify="center">
                <el-col :span="4">
                  <label class="preview">{{$t ('cluster.creation.version')}}</label>
                </el-col>
                <el-col :span="4">
                  <label class="preview">{{form.version}}</label>
                </el-col>
              </el-row>
              <el-row type="flex" justify="center">
                <el-col :span="4">
                  <label class="preview">{{$t ('cluster.creation.arch')}}</label>
                </el-col>
                <el-col :span="4">
                  <label class="preview">{{form.architectures}}</label>
                </el-col>
              </el-row>
              <el-row type="flex" justify="center">
                <el-col :span="4">
                  <label class="preview">{{$t ('cluster.creation.yum_repo')}}</label>
                </el-col>
                <el-col :span="4">
                  <label class="preview">{{form.yumOperate}}</label>
                </el-col>
              </el-row>
            </div>

            <el-divider content-position="left">{{$t ('cluster.creation.step2')}}</el-divider>
            <div>
              <el-row type="flex" justify="center">
                <el-col :span="4">
                  <label class="preview">{{$t ('cluster.creation.cluster_cidr')}}</label>
                </el-col>
                <el-col :span="4">
                  <label class="preview">{{form.clusterCidr}}</label>
                </el-col>
              </el-row>
              <el-row type="flex" justify="center">
                <el-col :span="4">
                  <label class="preview">{{$t ('cluster.creation.max_node_pod_num')}}</label>
                </el-col>
                <el-col :span="4">
                  <label class="preview">{{form.maxNodePodNum}}</label>
                </el-col>
              </el-row>
              <el-row type="flex" justify="center">
                <el-col :span="4">
                  <label class="preview">{{$t ('cluster.creation.max_cluster_service_num')}}</label>
                </el-col>
                <el-col :span="4">
                  <label class="preview">{{form.maxClusterServiceNum}}</label>
                </el-col>
              </el-row>
              <el-row type="flex" justify="center">
                <el-col :span="4">
                  <label class="preview">{{$t ('cluster.creation.proxy_mode')}}</label>
                </el-col>
                <el-col :span="4">
                  <label class="preview">{{form.kubeProxyMode}}</label>
                </el-col>
              </el-row>
            </div>

            <el-divider content-position="left">{{$t ('cluster.creation.step3')}}</el-divider>
            <div>
              <el-row type="flex" justify="center">
                <el-col :span="4">
                  <label class="preview">{{$t ('cluster.creation.runtime_type')}}</label>
                </el-col>
                <el-col :span="4">
                  <label class="preview">{{form.runtimeType}}</label>
                </el-col>
              </el-row>
              <div v-if="form.runtimeType === 'docker'">
                <el-row type="flex" justify="center">
                  <el-col :span="4">
                    <label class="preview">{{$t ('cluster.creation.docker_storage_dir')}}</label>
                  </el-col>
                  <el-col :span="4">
                    <label class="preview">{{form.dockerStorageDir}}</label>
                  </el-col>
                </el-row>
                <el-row type="flex" justify="center">
                  <el-col :span="4">
                    <label class="preview">{{$t ('cluster.creation.subnet')}}</label>
                  </el-col>
                  <el-col :span="4">
                    <label class="preview">{{form.dockerSubnet}}</label>
                  </el-col>
                </el-row>
              </div>
              <div v-if="form.runtimeType === 'containerd'">
                <el-row type="flex" justify="center">
                  <el-col :span="4">
                    <label class="preview">{{$t ('cluster.creation.containe_storage_dir')}}</label>
                  </el-col>
                  <el-col :span="4">
                    <label class="preview">{{form.containerdStorageDir}}</label>
                  </el-col>
                </el-row>
              </div>
            </div>

            <el-divider content-position="left">{{$t ('cluster.creation.step4')}}</el-divider>
            <div>
              <el-row type="flex" justify="center">
                <el-col :span="4">
                  <label class="preview">{{$t ('cluster.creation.network_interface')}}</label>
                </el-col>
                <el-col :span="4">
                  <label class="preview">{{form.networkInterface}}</label>
                </el-col>
              </el-row>
              <el-row type="flex" justify="center">
                <el-col :span="4">
                  <label class="preview">{{$t ('cluster.creation.network_type')}}</label>
                </el-col>
                <el-col :span="4">
                  <label class="preview">{{form.networkType}}</label>
                </el-col>
              </el-row>
              <el-row type="flex" justify="center">
                <el-col :span="4">
                  <label class="preview">{{$t ('cluster.creation.flannel_backend')}}</label>
                </el-col>
                <el-col :span="4">
                  <label class="preview">{{form.flannelBackend}}</label>
                </el-col>
              </el-row>
              
            </div>
            
            <el-divider content-position="left">{{$t ('cluster.creation.step5')}}</el-divider>
            <div>
              <el-row type="flex" justify="center">
                <el-col :span="4">
                  <label class="preview">helm</label>
                </el-col>
                <el-col :span="4">
                  <label class="preview">{{form.helmVersion}}</label>
                </el-col>
              </el-row>
              <el-row type="flex" justify="center">
                <el-col :span="4">
                  <label class="preview">{{$t ('cluster.creation.ingress_type')}}</label>
                </el-col>
                <el-col :span="4">
                  <label class="preview">{{form.ingressControllerType}}</label>
                </el-col>
              </el-row>
              <el-row type="flex" justify="center">
                <el-col :span="4">
                  <label class="preview">{{$t ('cluster.creation.support_gpu')}}</label>
                </el-col>
                <el-col :span="4">
                  <label class="preview">{{form.supportGpu}}</label>
                </el-col>
              </el-row>
            </div>

            <el-divider content-position="left">{{$t ('cluster.creation.step6_of_bare_metal')}}</el-divider>
            <div>
              <div v-if="form.provider === 'plan'">
                <el-row type="flex" justify="center">
                  <el-col :span="4">
                    <label class="preview">{{$t ('cluster.creation.step6_of_plan')}}</label>
                  </el-col>
                  <el-col :span="4">
                    <label class="preview">{{form.plan}}</label>
                  </el-col>
                </el-row>
                <el-row type="flex" justify="center">
                  <el-col :span="4">
                    <label class="preview">{{$t ('cluster.creation.worker_num')}}</label>
                  </el-col>
                  <el-col :span="4">
                    <label class="preview">{{form.workerNum}}</label>
                  </el-col>
                </el-row>
              </div>
              <div v-if="form.provider === 'bareMetal'">
                <el-row type="flex" justify="center">
                  <el-col :span="4">
                    <label class="preview">Masters</label>
                  </el-col>
                  <el-col :span="4">
                    <label class="preview">{{getHostName(masters)}}</label>
                  </el-col>
                </el-row>
                <el-row type="flex" justify="center">
                  <el-col :span="4">
                    <label class="preview">Workers</label>
                  </el-col>
                  <el-col :span="4">
                    <label class="preview">{{getHostName(workers)}}</label>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-form-item>
        </div>
      </div>
      <el-button type="primary" style="float: right" @click="nextStep">下一步</el-button>
      <el-button type="primary" style="float: right" @click="aheadStep">上一步</el-button>
    </el-form>
  </layout-content>
</template>

<script>
  import LayoutContent from "@/components/layout/LayoutContent";

  export default {
    name: "HostCreate",
    components: {LayoutContent},
    data() {
      return {
        form: {
          name: "",
          provider: "bareMetal",
          version: "",
          architectures: "amd64",
          yumOperate: "replace",
          plan: "",
          workerAmount: "1",
          networkType: "flannel",
          runtimeType: "docker",
          dockerStorageDir: "/var/lib/docker",
          containerdStorageDir: "/var/lib/containerd",
          flannelBackend: "vxlan",
          calicoIpv4PoolIpip: "Always",
          kubeProxyMode: "iptables",
          ingressControllerType: "nginx",
          kubernetesAudit: "no",
          dockerSubnet: "172.17.0.1/16",
          nodes: "",
          projectName: "kubeoperator",
          helmVersion: "v3",
          networkInterface: "",
          supportGpu: "disable",
          clusterCidr: "192.168.0.0/16",
          maxClusterServiceNum: "256",
          maxNodePodNum: "256"
        },
        rules: {
          name: [{ required: true, message: this.$t('commons.validate.cannot_be_empty'), trigger: "blur" }],
          version: [{ required: true, message: this.$t('commons.validate.cannot_be_empty'), trigger: "change" }],
          provider: [{ required: true, message: this.$t('commons.validate.cannot_be_empty'), trigger: "change" }],
          architectures: [{ required: true, message: this.$t('commons.validate.cannot_be_empty'), trigger: "change" }],
          yumOperate: [{ required: true, message: this.$t('commons.validate.cannot_be_empty'), trigger: "change" }],
          runtimeType: [{ required: true, message: this.$t('commons.validate.cannot_be_empty'), trigger: "change" }],
          maxNodePodNum: [{ required: true, message: this.$t('commons.validate.cannot_be_empty'), trigger: "change" }],
          maxClusterServiceNum: [{ required: true, message: this.$t('commons.validate.cannot_be_empty'), trigger: "change" }],
          kubeProxyMode: [{ required: true, message: this.$t('commons.validate.cannot_be_empty'), trigger: "change" }],
          kubernetesAudit: [{ required: true, message: this.$t('commons.validate.cannot_be_empty'), trigger: "change" }],
          networkType: [{ required: true, message: this.$t('commons.validate.cannot_be_empty'), trigger: "change" }],
          networkInterface: [{ required: true, message: this.$t('commons.validate.cannot_be_empty'), trigger: "change" }],
          flannelBackend: [{ required: true, message: this.$t('commons.validate.cannot_be_empty'), trigger: "change" }],
          calicoIpv4PoolIpip: [{ required: true, message: this.$t('commons.validate.cannot_be_empty'), trigger: "change" }],
          helmVersion: [{ required: true, message: this.$t('commons.validate.cannot_be_empty'), trigger: "change" }],
          ingressControllerType: [{ required: true, message: this.$t('commons.validate.cannot_be_empty'), trigger: "change" }],
          supportGpu: [{ required: true, message: this.$t('commons.validate.cannot_be_empty'), trigger: "change" }],
          plan: [{ required: true, message: this.$t('commons.validate.cannot_be_empty'), trigger: "change" }],
          workerAmount: [{ required: true, message: this.$t('commons.validate.cannot_be_empty'), trigger: "blur" }],
        },
        activeStep: 0,
        versions: ["1.18.16", "1.20.10"],
        isNameChecking: false,
        nameValid: true,
        archValid: true,
        helmVersions: ["v3", "v2"],
        part1Options: ["192", "172", "10"],
        part2Options: [],
        part3Options: [],
        parts: ["192", "168", "0", "0", "16"],
        podMaxNumOptions: [32, 64, 128, 256],
        serviceMaxNumOptions: [32, 64, 128, 256, 512, 1024, 2048, 4096],
        maskOptions: [],
        maxNodesNum: 255,
        masters: [],
        workers: [],
      }
    },
    methods: {
      onSubmit() {
        console.log("submit!")
      },
      onNameCheck() {

      },
      nextStep() {
        this.activeStep++
      },
      aheadStep() {
        this.activeStep--
      },
      onPart1Change() {
        this.part2Options = []
        switch (this.parts[0]) {
          case "192":
            this.part2Options = ["168"]
            this.maskOptions = [].concat(["16", "17", "18", "19"])
            this.parts[4] = this.maskOptions[0]
            break
          case "172":
            for (let i = 16; i < 32; i++) {
              if (i !== 17) {
                this.part2Options.push(i + "")
              }
            }
            this.parts[1] = this.part2Options[0]
            this.maskOptions = [].concat(["16", "17", "18", "19"])
            this.parts[4] = this.maskOptions[0]
            break
          case "10":
            this.parts[1] = this.part2Options[0]
            this.maskOptions = [].concat(["14", "15", "16", "17", "18", "19"])
            this.parts[4] = this.maskOptions[0]
            break
        }
        this.onMaskChange()
      },
      onMaskChange() {
        const mask = Number(this.parts[4])
        if (this.parts[0] === "192" || this.parts[0] === "172") {
          const a = Math.pow(2, (32 - mask - 8))
          const selects = []
          for (let i = 0; i < 256; i += a) {
            selects.push(i)
          }
          this.part3Options = selects
          this.parts[2] = this.part3Options[0]
        }
        if (this.parts[0] === "10") {
          if (mask < 16) {
            const a = Math.pow(2, (32 - mask - 16))
            const selects = []
            for (let i = 0; i < 256; i += a) {
                selects.push(i)
            }
            this.part2Options = selects
            this.parts[1] = this.part2Options[0]
          } else {
            const select1 = []
            for (let i = 0; i < 256; i++) {
              select1.push(i)
            }
            this.part2Options = select1
            this.parts[1] = this.part2Options[0]
            const a = Math.pow(2, (32 - mask - 8))
            const selects = []
            for (let i = 0; i < 256; i += a) {
              selects.push(i)
            }
            this.part3Options = selects
            this.parts[2] = this.part3Options[0]
          }
        }
        this.getNodeNum()
      },
      getNodeNum() {
        this.form.clusterCidr = this.releaseCidr()
        // tslint:disable-next-line:max-line-length
        this.maxNodesNum = Math.pow(2, 32 - Number(this.parts[4])) / this.form.maxNodePodNum - Math.ceil(this.form.maxClusterServiceNum / this.form.maxNodePodNum)
      },
      releaseCidr() {
        return this.parts[0] + "." + this.parts[1] + "." + this.parts[2] + "." + this.parts[3] + "/" + this.parts[4]
      },
      getHostName(hosts) {
        let hostName = ""
        for (const h of hosts) {
          hostName = h["text"] + "," + hostName
        }
        return hostName
      },
      onCancel() {
        this.$router.push({name: "HostList"})
      }
    }
  }
</script>

<style scoped>

.preview {
  font-size: 14px;
  margin-top: 1000px;
}

</style>
