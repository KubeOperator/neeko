<template>
  <layout-content>
    <div>
      <el-form ref="form" label-position='left' label-width="220px" :model="form" :rules="rules">
        <fu-steps ref="steps" footerAlign="right" finish-status="success" :beforeLeave="beforeLeave" @finish="onSubmit" @cancel="onCancel" :isLoading="loading" showCancel>
          <fu-step id="cluster-info" :title="$t('cluster.creation.step1')">
            <div class="example">
              <el-scrollbar style="height:100%;overflow-x: hidden">
                <el-card>
                  <el-row>
                    <el-col :span="20">
                      <el-form-item :label="$t('cluster.creation.name')" prop="name">
                        <el-input v-model="form.name" clearable></el-input>
                        <div v-if="!nameValid"><span class="input-error">{{$t('cluster.creation.name_invalid_err')}}</span></div>
                        <div><span class="input-help">{{$t('cluster.creation.name_help')}}</span></div>
                      </el-form-item>
                      <el-form-item :label="$t('project.project')" prop="projectName">
                        <el-select filterable style="width: 100%" @change="loadProjectResource" v-model.number="form.projectName" clearable>
                          <el-option v-for="item of projects" :key="item.name" :value="item.name">{{item.name}}</el-option>
                        </el-select>
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
                        <el-select style="width: 100%" @change="changeArch" v-model="form.architectures" clearable>
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
                    </el-col>
                    <el-col :span="4"><br /></el-col>
                  </el-row>
                </el-card>
              </el-scrollbar>
            </div>
          </fu-step>
          <fu-step id="cluster-setting" :title="$t('cluster.creation.step2')">
            <div class="example">
              <el-scrollbar style="height:100%">
                <el-card>
                  <el-form-item :label="$t ('cluster.creation.container_network')" prop="networkType">
                    <el-select filterable @change="onPart1Change()" style="width: 15%" v-model="parts[0]" clearable>
                      <el-option v-for="item of part1Options" :key="item" :value="item">{{item}}</el-option>
                    </el-select>
                    <span> . </span>
                    <el-select filterable :disabled="part2Options.length < 2" @change="getNodeNum()" style="width: 15%" v-model="parts[1]" clearable>
                      <el-option v-for="item of part2Options" :key="item" :value="item">{{item}}</el-option>
                    </el-select>
                    <span> . </span>
                    <el-select filterable :disabled="part3Options.length < 2" @change="getNodeNum()" style="width: 15%" v-model="parts[2]" clearable>
                      <el-option v-for="item of part3Options" :key="item" :value="item">{{item}}</el-option>
                    </el-select>
                    <span> . </span>
                    <el-select filterable style="width: 15%" disabled v-model="parts[3]" clearable>
                      <el-option value="0">0</el-option>
                    </el-select>
                    <span> / </span>
                    <el-select filterable @change="onMaskChange()" style="width: 15%" v-model="parts[4]" clearable>
                      <el-option v-for="item of maskOptions" :key="item" :value="item">{{item}}</el-option>
                    </el-select>
                    <div><span class="input-help">{{$t('cluster.creation.network_help')}}</span></div>
                  </el-form-item>
                  <el-form-item :label="$t('cluster.creation.max_node_pod_num')" prop="maxNodePodNum">
                    <el-select filterable style="width: 100%" @change="getNodeNum()" v-model.number="form.maxNodePodNum" clearable>
                      <el-option v-for="item of podMaxNumOptions" :key="item" :value="item">{{item}}</el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label="$t('cluster.creation.max_cluster_service_num')" prop="maxClusterServiceNum">
                    <el-select filterable style="width: 100%" @change="getNodeNum()" v-model.number="form.maxClusterServiceNum" clearable>
                      <el-option v-for="item of serviceMaxNumOptions" :key="item" :value="item">{{item}}</el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label="$t('cluster.creation.proxy_mode')" prop="kubeProxyMode">
                    <el-select style="width: 100%" v-model="form.kubeProxyMode" clearable>
                      <el-option value="iptables" label="Iptables">Iptables</el-option>
                      <el-option value="ipvs">ipvs</el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label="$t('cluster.creation.dns_cache')" prop="enableDnsCache">
                    <el-switch v-model="form.enableDnsCache" active-value="enable" inactive-value="disable" :active-text="$t('cluster.creation.enable')" :inactive-text="$t('cluster.creation.disable')" />
                  </el-form-item>
                  <el-form-item :label="$t('cluster.creation.kubernetes_audit')" prop="kubernetesAudit">
                    <el-switch v-model="form.kubernetesAudit" active-value="enable" inactive-value="disable" :active-text="$t('cluster.creation.enable')" :inactive-text="$t('cluster.creation.disable')" />
                  </el-form-item>
                  <el-form-item>
                    <span style="color: green">{{$t ('cluster.creation.max_node_num_show', [maxNodesNum])}}</span>
                  </el-form-item>
                </el-card>
              </el-scrollbar>
            </div>
          </fu-step>
          <fu-step id="runtime-setting" :title="$t('cluster.creation.step3')">
            <div class="example">
              <el-scrollbar style="height:100%">
                <el-card>
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
                </el-card>
              </el-scrollbar>
            </div>
          </fu-step>
          <fu-step id="container-net-setting" :title="$t('cluster.creation.step4')">
            <div class="example">
              <el-scrollbar style="height:100%">
                <el-card>
                  <el-form-item :label="$t ('cluster.creation.network_type')" prop="networkType">
                    <el-select @change="getDefaultFlannelBackend" style="width: 100%" v-model="form.networkType" clearable>
                      <el-option value="flannel">flannel</el-option>
                      <el-option value="calico">calico</el-option>
                      <el-option v-if="form.architectures === 'amd64'" value="cilium">cilium</el-option>
                    </el-select>
                    <div v-if="form.networkType==='cilium'"><span class="input-help">{{$t('cluster.creation.cilium_help')}}</span></div>
                  </el-form-item>

                  <div v-if="form.networkType === 'flannel'">
                    <el-form-item :label="$t('cluster.creation.flannel_backend')" prop="flannelBackend">
                      <el-select style="width: 100%" v-model="form.flannelBackend" clearable>
                        <el-option value="host-gw">host-gw</el-option>
                        <el-option value="vxlan">vxlan</el-option>
                      </el-select>
                      <div v-if="form.flannelBackend === 'host-gw'">
                        <div><span class="input-help">{{$t('cluster.creation.flannel_backend_help_route_base')}}</span></div>
                        <div><span class="input-help">{{$t('cluster.creation.flannel_backend_help_route_advantage')}}</span></div>
                        <div><span class="input-help">{{$t('cluster.creation.flannel_backend_help_route_inferiority')}}</span></div>
                      </div>
                      <div v-if="form.flannelBackend === 'vxlan'">
                        <div><span class="input-help">{{$t('cluster.creation.flannel_backend_help_channel_base')}}</span></div>
                        <div><span class="input-help">{{$t('cluster.creation.flannel_backend_help_channel_advantage')}}</span></div>
                        <div><span class="input-help">{{$t('cluster.creation.flannel_backend_help_channel_inferiority')}}</span></div>
                      </div>
                    </el-form-item>

                    <el-form-item :label="$t('cluster.creation.multi_network')" prop="multi_network">
                      <el-switch v-model="multi_network" active-value="enable" inactive-value="disable" :active-text="$t('cluster.creation.enable')" :inactive-text="$t('cluster.creation.disable')" />
                      <div><span class="input-help">{{$t('cluster.creation.network_interface_fannel_help')}}</span></div>
                    </el-form-item>

                    <el-form-item v-if="multi_network === 'enable'" :label="$t ('cluster.creation.network_interface')" prop="networkInterface">
                      <el-input v-model="form.networkInterface" clearable></el-input>
                    </el-form-item>
                  </div>

                  <div v-if="form.networkType === 'calico'">
                    <el-form-item :label="$t('cluster.creation.flannel_backend')" prop="calicoIpv4PoolIpip">
                      <el-select style="width: 100%" v-model="form.calicoIpv4PoolIpip" clearable>
                        <el-option value="off" label="bgp">bgp</el-option>
                        <el-option value="Always" label="ipip">ipip</el-option>
                      </el-select>
                      <div v-if="form.calicoIpv4PoolIpip === 'off'">
                        <div><span class="input-help">{{$t('cluster.creation.flannel_backend_help_route_base')}}</span></div>
                        <div><span class="input-help">{{$t('cluster.creation.flannel_backend_help_route_advantage')}}</span></div>
                        <div><span class="input-help">{{$t('cluster.creation.flannel_backend_help_route_inferiority')}}</span></div>
                      </div>
                      <div v-if="form.calicoIpv4PoolIpip === 'Always'">
                        <div><span class="input-help">{{$t('cluster.creation.flannel_backend_help_channel_base')}}</span></div>
                        <div><span class="input-help">{{$t('cluster.creation.flannel_backend_help_channel_advantage')}}</span></div>
                        <div><span class="input-help">{{$t('cluster.creation.flannel_backend_help_channel_inferiority')}}</span></div>
                      </div>
                    </el-form-item>
                    <el-form-item :label="$t('cluster.creation.multi_network')" prop="multi_network">
                      <el-select style="width: 100%" v-model="multi_network" clearable>
                        <el-option value="disable" :label="$t('cluster.creation.disable')">{{$t('cluster.creation.disable')}}</el-option>
                        <el-option value="name" :label="$t('cluster.creation.network_name')">{{$t('cluster.creation.network_name')}}</el-option>
                        <el-option value="cidr" :label="$t('cluster.creation.network_cidr')">{{$t('cluster.creation.network_cidr')}}</el-option>
                      </el-select>
                      <div><span class="input-help">{{$t('cluster.creation.network_interface_help')}}</span></div>
                    </el-form-item>

                    <el-form-item v-if="multi_network === 'name'" :label="$t ('cluster.creation.network_interface')" prop="networkInterface">
                      <el-input v-model="form.networkInterface" clearable></el-input>
                    </el-form-item>
                    <el-form-item v-if="multi_network === 'cidr'" :label="$t ('cluster.creation.network_cidr')" prop="networkCidr">
                      <el-input v-model="form.networkCidr" clearable placeholder="10.0.1.0/24,10.0.2.0/24"></el-input>
                      <div><span class="input-help">{{$t('cluster.creation.network_cidr_help')}}</span></div>
                    </el-form-item>
                  </div>

                  <div v-if="form.networkType === 'cilium'">
                    <el-form-item :label="$t('cluster.creation.flannel_backend')" prop="flannelBackend">
                      <el-select @change="getDefaultTunnelMode()" style="width: 100%" v-model="form.flannelBackend" clearable>
                        <el-option value="Overlay">Overlay</el-option>
                        <el-option value="Native Routing">Native Routing</el-option>
                      </el-select>
                      <div v-if="form.flannelBackend==='Overlay'"><span class="input-help">{{$t('cluster.creation.cilium_overlay_help')}}</span></div>
                      <div v-if="form.flannelBackend==='Overlay'"><span class="input-help">{{$t('cluster.creation.cilium_overlay_help_more')}}</span></div>
                      <div v-if="form.flannelBackend==='Native Routing'"><span class="input-help">{{$t('cluster.creation.cilium_native_help')}}</span></div>
                      <div v-if="form.flannelBackend==='Native Routing'"><span class="input-help">{{$t('cluster.creation.cilium_native_help_more')}}</span></div>
                    </el-form-item>
                    <el-form-item v-if="form.flannelBackend === 'Overlay'" :label="$t('cluster.creation.tunnel_name')" prop="ciliumTunnelMode">
                      <el-select style="width: 100%" v-model="form.ciliumTunnelMode" clearable>
                        <el-option value="vxlan" label="vxlan">vxlan</el-option>
                        <el-option value="geneve" label="geneve">geneve</el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item v-if="form.flannelBackend === 'Native Routing'" :label="$t('cluster.creation.native_routing')" prop="ciliumNativeRoutingCidr">
                      <el-input v-model="form.ciliumNativeRoutingCidr" clearable></el-input>
                    </el-form-item>

                  </div>
                </el-card>
              </el-scrollbar>
            </div>
          </fu-step>
          <fu-step id="component-setting" :title="$t('cluster.creation.step5')">
            <div class="example">
              <el-scrollbar style="height:100%">
                <el-card>
                  <el-form-item label="helm:" prop="helmVersion">
                    <el-select style="width: 100%" v-model="form.helmVersion" clearable>
                      <el-option value="v3">v3</el-option>
                      <el-option value="v2">v2</el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label="$t ('cluster.creation.ingress_type')" prop="ingressControllerType">
                    <el-select style="width: 100%" v-model="form.ingressControllerType" clearable>
                      <el-option value="nginx">nginx</el-option>
                      <el-option v-if="versionHigher206() || form.enableDnsCache === 'disable'" value="traefik">traefik</el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label="$t ('cluster.creation.support_gpu')" prop="supportGpu">
                    <el-switch v-model="form.supportGpu" active-value="enable" inactive-value="disable" :active-text="$t('cluster.creation.enable')" :inactive-text="$t('cluster.creation.disable')" />
                  </el-form-item>
                </el-card>
              </el-scrollbar>
            </div>
          </fu-step>
          <fu-step id="node-setting-bare" :title="$t('cluster.creation.step6_of_bare_metal')">
            <div class="example" v-if="form.provider === 'bareMetal'">
              <el-scrollbar style="height:100%">
                <el-card>
                  <el-form-item>
                    <span>{{$t ('cluster.creation.node_help')}}</span>
                  </el-form-item>
                  <el-form-item label="Masters" prop="masters">
                    <el-select multiple filterable style="width: 100%" @change="toggle('master')" v-model="form.masters" clearable>
                      <el-option v-for="item of hosts" :key="item" :value="item">{{item}}</el-option>
                    </el-select>
                    <div><span class="input-help">{{$t('cluster.creation.master_select_help')}}</span></div>
                  </el-form-item>
                  <el-form-item label="Workers" prop="workers">
                    <el-select multiple filterable style="width: 100%" @change="toggle('worker')" v-model="form.workers" clearable>
                      <el-option v-for="item of hosts" :key="item" :value="item">{{item}}</el-option>
                    </el-select>
                  </el-form-item>
                </el-card>
              </el-scrollbar>
            </div>
            <div class="example" v-if="form.provider === 'plan'">
              <el-scrollbar style="height:100%">
                <el-card>
                  <el-form-item :label="$t ('cluster.creation.step6_of_plan')" prop="plan">
                    <el-select filterable style="width: 100%" v-model="form.plan" clearable>
                      <el-option v-for="item of plans" :key="item.name" :value="item.name">{{item.name}}</el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label="$t ('cluster.creation.worker_num')" prop="workerAmount">
                    <el-input-number v-model.number="form.workerAmount" clearable></el-input-number>
                  </el-form-item>
                </el-card>
              </el-scrollbar>
            </div>
          </fu-step>
          <fu-step :title="$t('cluster.creation.step7')" id="overview">
            <div class="example">
              <el-scrollbar style="height:100%">
                <el-card>
                  <el-divider content-position="left">{{$t ('cluster.creation.base_setting')}}</el-divider>
                  <el-row type="flex" justify="center">
                    <el-col :span="6">
                      <ul>{{$t ('cluster.creation.name')}}</ul>
                      <ul>{{$t ('cluster.project')}}</ul>
                      <ul>{{$t ('cluster.creation.provider')}}</ul>
                      <ul>{{$t ('cluster.creation.version')}}</ul>
                      <ul>{{$t ('cluster.creation.arch')}}</ul>
                      <ul>{{$t ('cluster.creation.yum_repo')}}</ul>
                    </el-col>
                    <el-col :span="6">
                      <ul>{{form.name}}</ul>
                      <ul>{{form.projectName}}</ul>
                      <ul v-if="form.provider === 'plan'">{{$t ('cluster.creation.provide_plan')}}</ul>
                      <ul v-if="form.provider === 'bareMetal'">{{$t ('cluster.creation.provide_bare_metal')}}</ul>
                      <ul>{{form.version}}</ul>
                      <ul>{{form.architectures}}</ul>
                      <ul>{{form.yumOperate}}</ul>
                    </el-col>
                  </el-row>

                  <el-divider content-position="left">{{$t ('cluster.creation.step2')}}</el-divider>
                  <el-row type="flex" justify="center">
                    <el-col :span="6">
                      <ul>{{$t ('cluster.creation.cluster_cidr')}}</ul>
                      <ul>{{$t ('cluster.creation.max_node_pod_num')}}</ul>
                      <ul>{{$t ('cluster.creation.max_cluster_service_num')}}</ul>
                      <ul>{{$t ('cluster.creation.proxy_mode')}}</ul>
                      <ul>{{$t ('cluster.creation.dns_cache')}}</ul>
                      <ul>{{$t ('cluster.creation.kubernetes_audit')}}</ul>
                    </el-col>
                    <el-col :span="6">
                      <ul>{{form.clusterCidr}}</ul>
                      <ul>{{form.maxNodePodNum}}</ul>
                      <ul>{{form.maxClusterServiceNum}}</ul>
                      <ul>{{form.kubeProxyMode}}</ul>
                      <ul v-if="form.enableDnsCache === 'enable'">{{$t ('commons.button.enable')}}</ul>
                      <ul v-if="form.enableDnsCache === 'disable'">{{$t ('commons.button.disable')}}</ul>
                      <ul v-if="form.kubernetesAudit === 'enable'">{{$t ('commons.button.enable')}}</ul>
                      <ul v-if="form.kubernetesAudit === 'disable'">{{$t ('commons.button.disable')}}</ul>
                    </el-col>
                  </el-row>

                  <el-divider content-position="left">{{$t ('cluster.creation.step3')}}</el-divider>
                  <el-row type="flex" justify="center">
                    <el-col :span="6">
                      <ul>{{$t ('cluster.creation.runtime_type')}}</ul>
                      <ul v-if="form.runtimeType === 'docker'">{{$t ('cluster.creation.docker_storage_dir')}}</ul>
                      <ul v-if="form.runtimeType === 'docker'">{{$t ('cluster.creation.subnet')}}</ul>
                      <ul v-if="form.runtimeType === 'containerd'">{{$t ('cluster.creation.containe_storage_dir')}}</ul>
                    </el-col>
                    <el-col :span="6">
                      <ul>{{form.runtimeType}}</ul>
                      <ul v-if="form.runtimeType === 'docker'">{{form.dockerStorageDir}}</ul>
                      <ul v-if="form.runtimeType === 'docker'">{{form.dockerSubnet}}</ul>
                      <ul v-if="form.runtimeType === 'containerd'">{{form.containerdStorageDir}}</ul>
                    </el-col>
                  </el-row>

                  <el-divider content-position="left">{{$t ('cluster.creation.step4')}}</el-divider>
                  <el-row type="flex" justify="center">
                    <el-col :span="6">
                      <ul>{{$t ('cluster.creation.network_type')}}</ul>
                      <ul>{{$t ('cluster.creation.flannel_backend')}}</ul>
                      <ul v-if="form.networkType === 'calico' && multi_network === 'name'">{{$t ('cluster.creation.network_interface')}}</ul>
                      <ul v-if="form.networkType === 'calico' && multi_network === 'cidr'">{{$t ('cluster.creation.network_cidr')}}</ul>
                      <ul v-if="form.networkType === 'flannel' && multi_network === 'enable'">{{$t ('cluster.creation.network_interface')}}</ul>
                    </el-col>
                    <el-col :span="6">
                      <ul>{{form.networkType}}</ul>
                      <ul v-if="form.networkType !== 'calico'">{{form.flannelBackend}}</ul>
                      <ul v-if="form.networkType === 'calico' && form.calicoIpv4PoolIpip === 'off'">bgp</ul>
                      <ul v-if="form.networkType === 'calico' && form.calicoIpv4PoolIpip === 'Always'">ipip</ul>

                      <ul v-if="form.networkType === 'calico' && multi_network === 'name'">{{form.networkInterface}}</ul>
                      <ul v-if="form.networkType === 'calico' && multi_network === 'cidr'">{{form.networkCidr}}</ul>
                      <ul v-if="form.networkType === 'flannel' && multi_network === 'enable'">{{form.networkInterface}}</ul>
                    </el-col>
                  </el-row>

                  <el-divider content-position="left">{{$t ('cluster.creation.step5')}}</el-divider>
                  <el-row type="flex" justify="center">
                    <el-col :span="6">
                      <ul>helm</ul>
                      <ul>{{$t ('cluster.creation.ingress_type')}}</ul>
                      <ul>{{$t ('cluster.creation.support_gpu')}}</ul>
                    </el-col>
                    <el-col :span="6">
                      <ul>{{form.helmVersion}}</ul>
                      <ul>{{form.ingressControllerType}}</ul>
                      <ul v-if="form.supportGpu === 'enable'">{{$t ('commons.button.enable')}}</ul>
                      <ul v-if="form.supportGpu === 'disable'">{{$t ('commons.button.disable')}}</ul>
                    </el-col>
                  </el-row>

                  <el-divider content-position="left">{{$t ('cluster.creation.step6_of_bare_metal')}}</el-divider>
                  <el-row type="flex" justify="center" v-if="form.provider === 'plan'">
                    <el-col :span="6">
                      <ul>{{$t ('cluster.creation.step6_of_plan')}}</ul>
                      <ul>{{$t ('cluster.creation.worker_num')}}</ul>
                    </el-col>
                    <el-col :span="6">
                      <ul>{{form.plan}}</ul>
                      <ul>{{form.workerAmount}}</ul>
                    </el-col>
                  </el-row>
                  <el-row type="flex" justify="center" v-if="form.provider === 'bareMetal'">
                    <el-col :span="6">
                      <ul>Masters</ul>
                      <ul>Workers</ul>
                    </el-col>
                    <el-col :span="6">
                      <ul>{{getHostName(form.masters)}}</ul>
                      <ul>{{getHostName(form.workers)}}</ul>
                    </el-col>
                  </el-row>
                  <br>
                </el-card>
              </el-scrollbar>
            </div>
          </fu-step>
        </fu-steps>
      </el-form>
    </div>
  </layout-content>
</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent"
import { listActive } from "@/api/manifest"
import { listProjectResourcesAll } from "@/api/project-resource"
import { listRegistryAll } from "@/api/system-setting"
import { checkClusterNameExistence, createCluster } from "@/api/cluster"
import { allProjects } from "@/api/projects"
import Rule from "@/utils/rules"

export default {
  name: "ClusterCreate",
  components: { LayoutContent },
  data() {
    return {
      form: {
        projectName: "",
        name: "",
        provider: "bareMetal",
        version: "",
        architectures: "amd64",
        yumOperate: "replace",

        maxClusterServiceNum: 256,
        maxNodePodNum: 256,
        kubeProxyMode: "iptables",
        enableDnsCache: "disable",
        dnsCacheVersion: "1.17.0",
        kubernetesAudit: "disable",
        clusterCidr: "192.168.0.0/16",

        runtimeType: "docker",
        dockerStorageDir: "/var/lib/docker",
        containerdStorageDir: "/var/lib/containerd",
        dockerSubnet: "172.17.0.1/16",

        networkInterface: "",
        networkCidr: "",
        networkType: "flannel",
        flannelBackend: "vxlan",
        calicoIpv4PoolIpip: "Always",
        ciliumVersion: "v1.9.5",
        ciliumNativeRoutingCidr: "10.244.0.0/18",
        ciliumTunnelMode: "",

        helmVersion: "v3",
        supportGpu: "disable",
        ingressControllerType: "nginx",

        masters: [],
        workers: [],
        nodes: [],

        plan: "",
        workerAmount: 1,
      },
      rules: {
        name: [Rule.ClusterNameRule],
        version: [Rule.RequiredRule],
        projectName: [Rule.RequiredRule],
        provider: [Rule.RequiredRule],
        architectures: [Rule.RequiredRule],
        yumOperate: [Rule.RequiredRule],
        runtimeType: [Rule.RequiredRule],
        maxNodePodNum: [Rule.RequiredRule],
        maxClusterServiceNum: [Rule.RequiredRule],
        kubeProxyMode: [Rule.RequiredRule],
        enableDnsCache: [Rule.RequiredRule],
        kubernetesAudit: [Rule.RequiredRule],
        networkType: [Rule.RequiredRule],
        flannelBackend: [Rule.RequiredRule],
        calicoIpv4PoolIpip: [Rule.RequiredRule],
        ciliumTunnelMode: [Rule.RequiredRule],
        helmVersion: [Rule.RequiredRule],
        ingressControllerType: [Rule.RequiredRule],
        supportGpu: [Rule.RequiredRule],
        plan: [Rule.RequiredRule],
        workerAmount: [Rule.NumberRule],
        masters: [Rule.RequiredRule],
        workers: [Rule.RequiredRule],
      },
      versions: ["1.18.16", "1.20.10"],
      nameValid: true,
      archValid: true,
      nodes: "",
      plans: [],
      allHosts: [],
      hosts: [],
      projects: [],
      repoList: [],
      validateCluster: false,
      loading: false,
      helmVersions: ["v3", "v2"],
      part1Options: ["192", "172", "10"],
      part2Options: [],
      part3Options: [],
      parts: ["192", "168", "0", "0", "16"],
      podMaxNumOptions: [32, 64, 128, 256],
      serviceMaxNumOptions: [32, 64, 128, 256, 512, 1024, 2048, 4096],
      maskOptions: [],
      maxNodesNum: 255,
      multi_network: "disable",
      masters: [],
      workers: [],
    }
  },
  methods: {
    checkFormValidate() {
      let bool
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.masters) {
            const lenMaster = this.form.masters.length
            if (lenMaster !== 0) {
              if (lenMaster !== 1 && lenMaster !== 3) {
                return false
              }
            }
          }
          bool = true
        } else {
          bool = false
        }
      })
      return bool
    },
    loadRegistry() {
      listRegistryAll().then((data) => {
        this.repoList = data.items === null ? [] : data.items
      })
    },
    loadProject() {
      allProjects().then((data) => {
        this.projects = data.items
        if (data.items !== null && data.items.length > 0) {
          this.form.projectName = data.items[0].name
          this.loadProjectResource()
        }
      })
    },
    loadProjectResource() {
      this.loadHosts()
      this.loadPlan()
    },
    loadHosts() {
      listProjectResourcesAll(this.form.projectName, "HOST").then((data) => {
        this.allHosts = []
        if (data.items !== null) {
          for (const h of data.items) {
            if (h.status === "Running" && !h.clusterId) {
              this.allHosts.push({ name: h.name, architecture: h.architecture })
            }
          }
        }
        this.changeArch(this.form.architectures)
      })
    },
    loadPlan() {
      listProjectResourcesAll(this.form.projectName, "PLAN").then((data) => {
        this.plans = data.items
      })
    },
    loadVersion() {
      listActive().then((data) => {
        this.versions = []
        for (const m of data) {
          this.versions.push(m.name)
        }
        this.form.version = data[0].name
      })
    },
    beforeLeave(step, isNext) {
      if (!isNext) {
        return
      }
      if (this.checkFormValidate()) {
        if (this.validateCluster !== true) {
          if (step.index === 0) {
            setTimeout(() => {
              checkClusterNameExistence(this.form.name).then(
                (data) => {
                  if (!data.isExist && this.archValid) {
                    this.nameValid = true
                    this.loading = false
                    this.validateCluster = true
                    this.$refs.steps.next()
                    return true
                  } else {
                    this.nameValid = !data.isExist
                    this.loading = false
                    return false
                  }
                },
                () => {
                  this.nameValid = true
                  this.loading = false
                  this.validateCluster = true
                  this.$refs.steps.next()
                  return true
                }
              )
            }, 1000)
            this.loading = true
            return false
          } else {
            this.validateCluster = true
            this.$refs.steps.next()
            return false
          }
        } else {
          return true
        }
      } else {
        return false
      }
    },
    onPart1Change() {
      this.part2Options = []
      switch (this.parts[0]) {
        case "192":
          this.part2Options = ["168"]
          this.parts[1] = this.part2Options[0]
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
      this.part3Options = []
      const mask = Number(this.parts[4])
      if (this.parts[0] === "192" || this.parts[0] === "172") {
        const a = Math.pow(2, 32 - mask - 8)
        const selects = []
        for (let i = 0; i < 256; i += a) {
          selects.push(i)
        }
        this.part3Options = selects
        this.parts[2] = this.part3Options[0]
      }
      if (this.parts[0] === "10") {
        if (mask < 16) {
          const a = Math.pow(2, 32 - mask - 16)
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
          const a = Math.pow(2, 32 - mask - 8)
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
    getDefaultTunnelMode() {
      if (this.form.flannelBackend === "Overlay") {
        this.form.ciliumTunnelMode = "vxlan"
      } else {
        this.form.ciliumTunnelMode = "disable"
      }
    },
    getDefaultFlannelBackend() {
      if (this.form.networkType === "cilium") {
        this.form.flannelBackend = "Overlay"
        this.form.ciliumTunnelMode = "vxlan"
      } else {
        this.form.flannelBackend = "vxlan"
        this.multi_network = "disable"
      }
    },
    versionHigher206() {
      const currentVersion = this.form.version
      const currentVersions = currentVersion.split(".")
      const version1 = currentVersions[0]
      if (version1 !== "v1") {
        return true
      }
      const version2 = currentVersions[1]
      if (Number(version2) > 20) {
        return true
      } else if (Number(version2) < 20) {
        return false
      }
      const versions = currentVersions[2].split("-ko")
      const version3 = Number(versions[0])
      if (Number(version3) >= 6) {
        return true
      } else if (Number(version3) < 6) {
        return false
      }
      return false
    },
    onSubmit() {
      if (this.form.ciliumTunnelMode === "flannelBackend") {
        this.form.ciliumTunnelMode = "disable"
      }
      delete this.form.masters
      delete this.form.workers
      createCluster(this.form).then(() => {
        this.$router.push({ name: "ClusterList" })
      })
    },
    getNodeNum() {
      this.form.clusterCidr = this.releaseCidr()
      this.maxNodesNum = Math.pow(2, 32 - Number(this.parts[4])) / this.form.maxNodePodNum - Math.ceil(this.form.maxClusterServiceNum / this.form.maxNodePodNum)
    },
    changeArch(type) {
      this.hosts = []
      this.archValid = true
      let isAmdExit = false
      let isArmExit = false
      switch (type) {
        case "amd64":
          for (const h of this.allHosts) {
            if (h.architecture === "x86_64") {
              this.hosts.push(h.name)
            }
          }
          for (const repo of this.repoList) {
            if (repo.architecture === "x86_64") {
              isAmdExit = true
              break
            }
          }
          this.archValid = isAmdExit
          break
        case "arm64":
          for (const h of this.allHosts) {
            if (h.architecture === "aarch64") {
              this.hosts.push(h.name)
            }
          }
          for (const repo of this.repoList) {
            if (repo.architecture === "aarch64") {
              isArmExit = true
              break
            }
          }
          this.archValid = isArmExit
          break
        case "all":
          for (const h of this.allHosts) {
            this.hosts.push(h.name)
          }
          for (const repo of this.repoList) {
            if (repo.architecture === "x86_64") {
              isAmdExit = true
              continue
            }
            if (repo.architecture === "aarch64") {
              isArmExit = true
              continue
            }
          }
          this.archValid = isAmdExit && isArmExit
          break
      }
      if (type !== "amd64") {
        this.form.helmVersion = "v3"
        this.helmVersions = ["v3"]
      } else {
        this.helmVersions = ["v3", "v2"]
      }
    },
    toggle(role) {
      this.form.nodes = []
      switch (role) {
        case "worker": {
          let delw = []
          this.form.masters.forEach((m) => {
            this.form.workers.forEach((w) => {
              if (m === w) {
                delw.push(w)
              }
            })
          })
          let cw = [].concat(this.form.workers)
          delw.forEach((d) => {
            cw.splice(cw.indexOf(d), 1)
            this.form.workers = cw
          })
          break
        }
        case "master": {
          let delm = []
          this.form.workers.forEach((m) => {
            this.form.masters.forEach((w) => {
              if (m === w) {
                delm.push(w)
              }
            })
          })
          let cm = [].concat(this.form.masters)
          delm.forEach((d) => {
            cm.splice(cm.indexOf(d), 1)
            this.form.masters = cm
          })
          break
        }
      }
      this.form.masters.forEach((n) => {
        this.form.nodes.push({ hostName: n, role: "master" })
      })
      this.form.workers.forEach((n) => {
        this.form.nodes.push({ hostName: n, role: "worker" })
      })
    },
    releaseCidr() {
      return this.parts[0] + "." + this.parts[1] + "." + this.parts[2] + "." + this.parts[3] + "/" + this.parts[4]
    },
    getHostName(hosts) {
      return hosts.join(",")
    },
    onCancel() {
      this.$router.push({ name: "ClusterList" })
    },
  },
  created() {
    this.loadProject()
    this.loadVersion()
    this.loadRegistry()
    this.onPart1Change()
  },
}
</script>
<style lang="scss" scoped>
.example {
  height: 450px;
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