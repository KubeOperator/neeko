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

                      <el-form-item :label="$t('cluster.creation.provider')" prop="provider">
                        <el-select style="width: 100%" v-model="form.provider" @change="changeProvide" clearable>
                          <el-option value="bareMetal" :label="$t('cluster.creation.provide_bare_metal')">{{$t('cluster.creation.provide_bare_metal')}}</el-option>
                          <el-option value="plan" :label="$t('cluster.creation.provide_plan')">{{$t('cluster.creation.provide_plan')}}</el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item :label="$t('cluster.creation.name_type')" prop="nodeNameRule">
                        <el-radio-group v-model="form.nodeNameRule">
                          <el-radio label="default">default</el-radio>
                          <el-radio label="ip">ip</el-radio>
                          <el-radio v-if="form.provider === 'bareMetal'" label="hostname">hostname</el-radio>
                        </el-radio-group>
                        <div v-if="form.nodeNameRule === 'default'"><span class="input-help">{{$t('cluster.creation.name_type_default_help')}}</span></div>
                        <div v-if="form.nodeNameRule === 'ip'"><span class="input-help">{{$t('cluster.creation.name_type_ip_help')}}</span></div>
                        <div v-if="form.nodeNameRule === 'hostname'"><span class="input-help">{{$t('cluster.creation.name_type_host_help')}}</span></div>
                      </el-form-item>
                      <el-form-item :label="$t('project.project')" prop="projectName">
                        <el-select filterable style="width: 100%" v-model.number="form.projectName" clearable>
                          <el-option v-for="item of projects" :key="item.name" :value="item.name">{{item.name}}</el-option>
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
                  <el-row>
                    <el-col :span="20">
                      <el-form-item :label="$t('cluster.creation.node_ip_num')" prop="maxNodePodNum">
                        <el-select filterable style="width: 100%" @change="getCidr('pod')" v-model.number="form.maxNodePodNum">
                          <el-option v-for="item of podIPNumOptions" :key="item" :label="item" :value="item">{{item}}</el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item :label="$t ('cluster.creation.pod_cidr')" prop="kubePodSubnet">
                        <el-select filterable @change="onPart1Change('pod')" style="width: 15%" v-model="podParts[0]">
                          <el-option v-for="item of podPart1Options" :key="item" :value="item">{{item}}</el-option>
                        </el-select>
                        <span> . </span>
                        <el-select filterable :disabled="podPart2Options.length < 2" @change="getCidr('pod')" style="width: 15%" v-model="podParts[1]">
                          <el-option v-for="item of podPart2Options" :key="item" :value="item">{{item}}</el-option>
                        </el-select>
                        <span> . </span>
                        <el-select filterable :disabled="podPart3Options.length < 2" @change="getCidr('pod')" style="width: 15%" v-model="podParts[2]">
                          <el-option v-for="item of podPart3Options" :key="item" :value="item">{{item}}</el-option>
                        </el-select>
                        <span> . </span>
                        <el-select filterable style="width: 15%" disabled v-model="podParts[3]">
                          <el-option value="0">0</el-option>
                        </el-select>
                        <span> / </span>
                        <el-select filterable @change="onMaskChange('pod')" style="width: 15%" v-model="podParts[4]">
                          <el-option v-for="item of podMaskOptions" :key="item" :value="item">{{item}}</el-option>
                        </el-select>
                        <div>
                          <span class="input-help" style="display:inline">{{$t('cluster.creation.pod_cidr_help1')}}</span>
                          <span class="input-help" style="color: green;display:inline;font-weight: bold;">{{form.maxNodeNum}}</span>
                          <span class="input-help" style="display:inline">{{$t('cluster.creation.pod_cidr_help2')}}</span>
                          <span class="input-help" style="color: green;display:inline;font-weight: bold;">{{form.maxNodePodNum}}</span>
                          <span class="input-help" style="display:inline">{{$t('cluster.creation.pod_cidr_help3')}}</span>
                        </div>
                      </el-form-item>
                      <el-form-item :label="$t ('cluster.creation.service_cidr')" prop="kubeServiceSubnet">
                        <el-select filterable @change="onPart1Change('service')" style="width: 15%" v-model="serviceParts[0]">
                          <el-option v-for="item of servicePart1Options" :key="item" :value="item">{{item}}</el-option>
                        </el-select>
                        <span> . </span>
                        <el-select filterable :disabled="servicePart2Options.length < 2" @change="getCidr('service')" style="width: 15%" v-model="serviceParts[1]">
                          <el-option v-for="item of servicePart2Options" :key="item" :value="item">{{item}}</el-option>
                        </el-select>
                        <span> . </span>
                        <el-select filterable :disabled="servicePart3Options.length < 2" @change="getCidr('service')" style="width: 15%" v-model="serviceParts[2]">
                          <el-option v-for="item of servicePart3Options" :key="item" :value="item">{{item}}</el-option>
                        </el-select>
                        <span> . </span>
                        <el-select filterable style="width: 15%" disabled v-model="serviceParts[3]">
                          <el-option value="0">0</el-option>
                        </el-select>
                        <span> / </span>
                        <el-select filterable @change="onMaskChange('service')" style="width: 15%" v-model="serviceParts[4]">
                          <el-option v-for="item of serviceMaskOptions" :key="item" :value="item">{{item}}</el-option>
                        </el-select>
                        <div><span class="input-help">{{$t('cluster.creation.service_cidr_help')}}</span></div>
                      </el-form-item>
                      <el-form-item :label="$t('cluster.creation.proxy_mode')" prop="kubeProxyMode">
                        <el-select style="width: 100%" v-model="form.kubeProxyMode">
                          <el-option value="iptables" label="Iptables">Iptables</el-option>
                          <el-option value="ipvs">ipvs</el-option>
                        </el-select>
                      </el-form-item>

                      <div>
                        <el-collapse accordion>
                          <el-collapse-item>
                            <template slot="title">
                              {{$t('multi_cluster.senior_setting')}}
                            </template>
                            <div>
                              <el-form-item label="DnsDomain" prop="kubeDnsDomain">
                                <el-input placeholder="cluster.local" v-model="form.kubeDnsDomain" clearable></el-input>
                              </el-form-item>
                              <el-form-item label="CgroupDriver" prop="cgroupDriver">
                                <el-select style="width: 100%" v-model="form.cgroupDriver">
                                  <el-option value="systemd">systemd</el-option>
                                  <el-option value="cgroupfs">cgroupfs</el-option>
                                </el-select>
                              </el-form-item>
                              <el-form-item :label="$t('cluster.creation.kubernetes_audit')" prop="kubernetesAudit">
                                <el-switch v-model="form.kubernetesAudit" active-value="yes" inactive-value="no" :active-text="$t('cluster.creation.enable')" :inactive-text="$t('cluster.creation.disable')" />
                              </el-form-item>
                              <el-form-item :label="'NodePort ' + $t ('cluster.creation.port_range')">
                                <el-input-number :min="0" :max="65536" v-model.number="form.kubeServiceNodePortRange1"></el-input-number>
                                <span style="margin-left: 10px">-</span>
                                <el-input-number :min="0" :max="65536" style="margin-left: 10px" v-model.number="form.kubeServiceNodePortRange2"></el-input-number>
                                <div><span v-if="form.kubeServiceNodePortRange1 > form.kubeServiceNodePortRange2" class="input-error">{{$t('cluster.creation.range_err')}}</span></div>
                              </el-form-item>
                              <el-form-item :label="'NodePort ' + $t ('cluster.creation.address')" prop="nodeportAddress">
                                <el-input placeholder="192.168.10.0/24,192.168.60.0/24" v-model="form.nodeportAddress" clearable></el-input>
                                <div><span class="input-help">{{$t('cluster.creation.address_help')}}</span></div>
                              </el-form-item>
                            </div>
                          </el-collapse-item>
                        </el-collapse>
                      </div>
                    </el-col>
                  </el-row>
                </el-card>
              </el-scrollbar>
            </div>
          </fu-step>
          <fu-step id="runtime-setting" :title="$t('cluster.creation.step3')">
            <div class="example">
              <el-scrollbar style="height:100%">
                <el-card>
                  <el-row>
                    <el-col :span="20">
                      <el-form-item :label="$t ('cluster.creation.runtime_type')" prop="runtimeType">
                        <el-select style="width: 100%" v-model="form.runtimeType" clearable>
                          <el-option value="docker">docker</el-option>
                          <el-option value="containerd">containerd</el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item v-if="form.runtimeType === 'docker'" :label="$t('cluster.creation.docker_mirror_registry')" prop="dockerMirrorRegistry">
                        <el-switch v-model="form.dockerMirrorRegistry" active-value="enable" inactive-value="disable" :active-text="$t('cluster.creation.enable')" :inactive-text="$t('cluster.creation.disable')" />
                      </el-form-item>
                      <el-form-item v-if="form.runtimeType === 'docker'" :label="$t('cluster.creation.docker_remote_api')" prop="dockerRemoteApi">
                        <el-switch v-model="form.dockerRemoteApi" active-value="enable" inactive-value="disable" :active-text="$t('cluster.creation.enable')" :inactive-text="$t('cluster.creation.disable')" />
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
                    </el-col>
                    <el-col :span="4"><br /></el-col>
                  </el-row>
                </el-card>
              </el-scrollbar>
            </div>
          </fu-step>
          <fu-step id="container-net-setting" :title="$t('cluster.creation.step4')">
            <div class="example">
              <el-scrollbar style="height:100%">
                <el-card>
                  <el-row>
                    <el-col :span="20">
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
                    </el-col>
                    <el-col :span="4"><br /></el-col>
                  </el-row>
                </el-card>
              </el-scrollbar>
            </div>
          </fu-step>
          <fu-step id="component-setting" :title="$t('cluster.creation.step5')">
            <div class="example">
              <el-scrollbar style="height:100%">
                <el-card>
                  <el-row>
                    <el-col :span="20">
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
                      <el-form-item :label="$t('cluster.creation.dns_cache')" prop="enableDnsCache">
                        <el-switch v-model="form.enableDnsCache" active-value="enable" inactive-value="disable" :active-text="$t('cluster.creation.enable')" :inactive-text="$t('cluster.creation.disable')" />
                      </el-form-item>
                      <el-form-item :label="$t ('cluster.creation.support_gpu')" prop="supportGpu">
                        <el-switch v-model="form.supportGpu" active-value="enable" inactive-value="disable" :active-text="$t('cluster.creation.enable')" :inactive-text="$t('cluster.creation.disable')" />
                      </el-form-item>
                      <div>
                        <el-collapse accordion>
                          <el-collapse-item>
                            <template slot="title">
                              ETCD {{$t('multi_cluster.senior_setting')}}
                            </template>
                            <div>
                              <el-form-item :label="$t('cluster.creation.etcd_data_dir')" prop="etcdDataDir">
                                <el-input v-model="form.etcdDataDir" clearable></el-input>
                              </el-form-item>
                              <el-form-item :label="$t('cluster.creation.etcd_snapshot_count')" prop="etcdSnapshotCount">
                                <el-input-number :min="0" v-model.number="form.etcdSnapshotCount"></el-input-number>
                                <span class="input-help">{{$t('cluster.creation.etcd_snapshot_count_help')}}</span>
                              </el-form-item>
                              <el-form-item :label="$t('cluster.creation.etcd_compaction_retention')" prop="etcdCompactionRetention">
                                <el-input-number :min="0" v-model.number="form.etcdCompactionRetention"></el-input-number>
                                <span class="input-help">{{$t('cluster.creation.etcd_compaction_retention_help')}}</span>
                              </el-form-item>
                              <el-form-item :label="$t('cluster.creation.etcd_max_request')" prop="etcdMaxRequest">
                                <el-input-number :min="0" v-model.number="form.etcdMaxRequest"></el-input-number>
                                <span class="input-help">{{$t('cluster.creation.etcd_max_request_help')}}</span>
                              </el-form-item>
                              <el-form-item :label="$t('cluster.creation.etcd_quota_backend')" prop="etcdQuotaBackend">
                                <el-input-number :min="0" v-model.number="form.etcdQuotaBackend"></el-input-number>
                              </el-form-item>
                            </div>
                          </el-collapse-item>
                        </el-collapse>
                      </div>
                    </el-col>
                    <el-col :span="4"><br /></el-col>
                  </el-row>
                </el-card>
              </el-scrollbar>
            </div>
          </fu-step>
          <fu-step id="node-setting-bare" :title="$t('cluster.creation.step6_of_bare_metal')">
            <div class="example">
              <el-scrollbar style="height:100%">
                <el-card>
                  <el-row>
                    <el-col :span="20">
                      <el-form-item :label="$t ('cluster.creation.master_schedule_type')" prop="masterScheduleType">
                        <el-switch v-model="form.masterScheduleType" :disabled="scheduleType" active-value="enable" inactive-value="disable" :active-text="$t('cluster.creation.enable')" :inactive-text="$t('cluster.creation.disable')" />
                      </el-form-item>
                      <div v-if="form.provider === 'bareMetal'">
                        <el-form-item>
                          <span>{{$t ('cluster.creation.node_help')}}</span>
                        </el-form-item>
                        <el-form-item label="Masters" prop="masters">
                          <el-select multiple filterable style="width: 100%" @change="toggle('master')" v-model="form.masters" clearable>
                            <el-option v-for="item of hosts" :key="item.label" :label="item.label" :value="item.value"></el-option>
                          </el-select>
                          <div><span class="input-help">{{$t('cluster.creation.master_select_help')}}</span></div>
                        </el-form-item>
                        <el-form-item label="Workers" prop="workers">
                          <el-select multiple filterable style="width: 100%" @change="toggle('worker')" v-model="form.workers" clearable>
                            <el-option v-for="item of hosts" :key="item.label" :label="item.label" :value="item.value"></el-option>
                          </el-select>
                          <div v-if="isNodeNumExceed()">
                            <span class="input-error">{{$t('cluster.creation.node_number_help', [form.maxNodeNum])}}</span>
                          </div>
                        </el-form-item>
                        <div v-if="isMultiMaster()">
                          <el-form-item :label="$t ('cluster.creation.cluster_high_availability')" prop="lbMode">
                            <el-radio-group v-model="form.lbMode">
                              <el-radio label="internal">{{$t('cluster.creation.default')}}</el-radio>
                              <el-radio label="external">VIP</el-radio>
                            </el-radio-group>
                            <div v-if="form.lbMode === 'internal'">
                              <span class="input-help">{{$t('cluster.creation.default_help')}}</span>
                            </div>
                            <div v-if="form.lbMode === 'external'">
                              <span class="input-help">{{$t('cluster.creation.vip_help')}}</span>
                            </div>
                          </el-form-item>
                          <el-form-item v-if="form.lbMode === 'external'" label="VIP" prop="lbKubeApiserverIp">
                            <el-input v-model="form.lbKubeApiserverIp" clearable></el-input>
                          </el-form-item>
                          <el-form-item :label="$t('cluster.creation.port')" prop="kubeApiServerPort">
                            <el-input-number @change="isPortAvailable()" v-model.number="form.kubeApiServerPort" clearable></el-input-number>
                          </el-form-item>
                        </div>
                      </div>
                      <div v-if="form.provider === 'plan'">
                        <el-form-item :label="$t ('cluster.creation.step6_of_plan')" prop="plan">
                          <el-select filterable style="width: 100%" v-model="form.plan" clearable>
                            <el-option v-for="item of plans" :key="item.name" :value="item.name">{{item.name}}</el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item :label="$t ('cluster.creation.worker_num')" prop="workerAmount">
                          <el-input-number :min="0" :max="form.maxNodeNum" @change="changeWorkNum" v-model.number="form.workerAmount" clearable></el-input-number>
                        </el-form-item>
                        <div v-if="isMultiMaster()">
                          <el-form-item :label="$t ('cluster.creation.cluster_high_availability')" prop="lbMode">
                            <el-radio-group v-model="form.lbMode">
                              <el-radio label="internal">{{$t('cluster.creation.default')}}</el-radio>
                              <el-radio label="external">VIP</el-radio>
                            </el-radio-group>
                            <div v-if="form.lbMode === 'internal'">
                              <span class="input-help">{{$t('cluster.creation.default_help')}}</span>
                            </div>
                            <div v-if="form.lbMode === 'external'">
                              <span class="input-help">{{$t('cluster.creation.vip_help')}}</span>
                            </div>
                          </el-form-item>
                          <el-form-item v-if="form.lbMode === 'external'" label="VIP" prop="lbKubeApiserverIp">
                            <el-input v-model="form.lbKubeApiserverIp" clearable></el-input>
                          </el-form-item>
                          <el-form-item :label="$t('cluster.creation.port')" prop="kubeApiServerPort">
                            <el-input-number @change="isPortAvailable()" v-model="form.kubeApiServerPort" clearable></el-input-number>
                          </el-form-item>
                        </div>
                      </div>
                    </el-col>
                    <el-col :span="4"><br /></el-col>
                  </el-row>
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
                      <ul>{{$t ('cluster.creation.node_ip_num')}}</ul>
                      <ul>{{$t ('cluster.creation.pod_cidr')}}</ul>
                      <ul>{{$t ('cluster.creation.service_cidr')}}</ul>
                      <ul>{{$t ('cluster.creation.proxy_mode')}}</ul>
                      <ul>{{$t ('cluster.creation.dns_cache')}}</ul>
                      <ul>DnsDomain</ul>
                      <ul>CgroupDriver</ul>
                      <ul>{{$t ('cluster.creation.kubernetes_audit')}}</ul>
                      <ul>NodePort {{$t ('cluster.creation.port_range')}}</ul>
                      <ul>NodePort {{$t ('cluster.creation.address')}}</ul>
                    </el-col>
                    <el-col :span="6">
                      <ul>{{form.maxNodePodNum}}</ul>
                      <ul>{{form.kubePodSubnet}}</ul>
                      <ul>{{form.kubeServiceSubnet}}</ul>
                      <ul>{{form.kubeProxyMode}}</ul>
                      <ul v-if="form.enableDnsCache === 'enable'">{{$t ('commons.button.enable')}}</ul>
                      <ul v-if="form.enableDnsCache === 'disable'">{{$t ('commons.button.disable')}}</ul>
                      <ul>{{form.kubeDnsDomain}}</ul>
                      <ul>{{form.cgroupDriver}}</ul>
                      <ul v-if="form.kubernetesAudit === 'yes'">{{$t ('commons.button.enable')}}</ul>
                      <ul v-if="form.kubernetesAudit === 'no'">{{$t ('commons.button.disable')}}</ul>
                      <ul>{{form.kubeServiceNodePortRange1}} - {{form.kubeServiceNodePortRange2}}</ul>
                      <ul>{{form.nodeportAddress}}</ul>
                    </el-col>
                  </el-row>

                  <el-divider content-position="left">{{$t ('cluster.creation.step3')}}</el-divider>
                  <el-row type="flex" justify="center">
                    <el-col :span="6">
                      <ul>{{$t ('cluster.creation.runtime_type')}}</ul>
                      <ul v-if="form.runtimeType === 'docker'">{{$t ('cluster.creation.docker_mirror_registry')}}</ul>
                      <ul v-if="form.runtimeType === 'docker'">{{$t ('cluster.creation.docker_remote_api')}}</ul>
                      <ul v-if="form.runtimeType === 'docker'">{{$t ('cluster.creation.docker_storage_dir')}}</ul>
                      <ul v-if="form.runtimeType === 'docker'">{{$t ('cluster.creation.subnet')}}</ul>
                      <ul v-if="form.runtimeType === 'containerd'">{{$t ('cluster.creation.containe_storage_dir')}}</ul>
                    </el-col>
                    <el-col :span="6">
                      <ul>{{form.runtimeType}}</ul>
                      <ul v-if="form.runtimeType === 'docker' && form.dockerMirrorRegistry === 'enable'">{{$t ('commons.button.enable')}}</ul>
                      <ul v-if="form.runtimeType === 'docker' && form.dockerMirrorRegistry === 'disable'">{{$t ('commons.button.disable')}}</ul>
                      <ul v-if="form.runtimeType === 'docker' && form.dockerRemoteApi === 'enable'">{{$t ('commons.button.enable')}}</ul>
                      <ul v-if="form.runtimeType === 'docker' && form.dockerRemoteApi === 'disable'">{{$t ('commons.button.disable')}}</ul>
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
                      <ul>ETCD {{$t ('cluster.creation.etcd_data_dir')}}</ul>
                      <ul>ETCD {{$t ('cluster.creation.etcd_snapshot_count')}}</ul>
                      <ul>ETCD {{$t ('cluster.creation.etcd_compaction_retention')}}</ul>
                      <ul>ETCD {{$t ('cluster.creation.etcd_max_request')}}</ul>
                      <ul>ETCD {{$t ('cluster.creation.etcd_quota_backend')}}</ul>
                    </el-col>
                    <el-col :span="6">
                      <ul>{{form.helmVersion}}</ul>
                      <ul>{{form.ingressControllerType}}</ul>
                      <ul v-if="form.supportGpu === 'enable'">{{$t ('commons.button.enable')}}</ul>
                      <ul v-if="form.supportGpu === 'disable'">{{$t ('commons.button.disable')}}</ul>
                      <ul>{{form.etcdDataDir}}</ul>
                      <ul>{{form.etcdSnapshotCount}}</ul>
                      <ul>{{form.etcdCompactionRetention}} {{$t ('cluster.detail.monitor.hour')}}</ul>
                      <ul>{{form.etcdMaxRequest}} MiB</ul>
                      <ul>{{form.etcdQuotaBackend}} GB</ul>
                    </el-col>
                  </el-row>

                  <el-divider content-position="left">{{$t ('cluster.creation.step6_of_bare_metal')}}</el-divider>
                  <el-row type="flex" justify="center" v-if="form.provider === 'plan'">
                    <el-col :span="6">
                      <ul>{{$t ('cluster.creation.step6_of_plan')}}</ul>
                      <ul>{{$t ('cluster.creation.worker_num')}}</ul>
                      <ul>{{$t ('cluster.creation.cluster_high_availability')}}</ul>
                      <ul v-if="isMultiMaster && form.lbMode === 'external'">VIP</ul>
                      <ul v-if="isMultiMaster">{{$t('cluster.creation.port')}}</ul>
                    </el-col>
                    <el-col :span="6">
                      <ul>{{form.plan}}</ul>
                      <ul>{{form.workerAmount}}</ul>
                      <ul>{{form.lbMode}}</ul>
                      <ul v-if="isMultiMaster && form.lbMode === 'external'">{{form.lbKubeApiserverIp}}</ul>
                      <ul v-if="isMultiMaster">{{form.kubeApiServerPort}}</ul>
                    </el-col>
                  </el-row>
                  <el-row type="flex" justify="center" v-if="form.provider === 'bareMetal'">
                    <el-col :span="6">
                      <ul>Masters</ul>
                      <ul>Workers</ul>
                      <ul>{{$t ('cluster.creation.cluster_high_availability')}}</ul>
                      <ul v-if="isMultiMaster && form.lbMode === 'external'">VIP</ul>
                      <ul>{{$t('cluster.creation.port')}}</ul>
                    </el-col>
                    <el-col :span="6">
                      <el-tooltip :content="getHostName(form.masters)" placement="top">
                        <ul>{{getHostName(form.masters).length > 30 ? getHostName(form.masters).substring(0, 30) + '...' : getHostName(form.masters)}}</ul>
                      </el-tooltip>
                      <el-tooltip :content="getHostName(form.workers)" placement="top">
                        <ul>{{getHostName(form.workers).length > 30 ? getHostName(form.workers).substring(0, 30) + '...' : getHostName(form.workers)}}</ul>
                      </el-tooltip>
                      <ul>{{form.lbMode}}</ul>
                      <ul v-if="isMultiMaster && form.lbMode === 'external'">{{form.lbKubeApiserverIp}}</ul>
                      <ul v-if="isMultiMaster">{{form.kubeApiServerPort}}</ul>
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
        nodeNameRule: "default",
        provider: "bareMetal",
        version: "",
        architectures: "amd64",
        yumOperate: "replace",

        maxNodePodNum: 256,
        maxNodeNum: 256,
        kubeProxyMode: "iptables",
        nodeportAddress: "",
        kubeServiceNodePortRange: "",
        kubeServiceNodePortRange1: 30000,
        kubeServiceNodePortRange2: 32767,
        kubeDnsDomain: "cluster.local",
        cgroupDriver: "systemd",
        kubernetesAudit: "no",
        kubePodSubnet: "10.10.0.0/16",
        kubeServiceSubnet: "192.168.0.0/24",

        runtimeType: "docker",
        dockerMirrorRegistry: "enable",
        dockerRemoteApi: "disable",
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
        ingressControllerType: "nginx",
        enableDnsCache: "disable",
        dnsCacheVersion: "1.17.0",
        supportGpu: "disable",
        etcdDataDir: "/var/lib/etcd",
        etcdSnapshotCount: 50000,
        etcdCompactionRetention: 1,
        etcdMaxRequest: 10,
        etcdQuotaBackend: 8,

        masterScheduleType: "enable",
        masters: [],
        workers: [],
        nodes: [],
        lbMode: "internal",
        lbKubeApiserverIp: "",
        kubeApiServerPort: 8443,

        plan: "",
        workerAmount: 0,
      },
      rules: {
        name: [Rule.ClusterNameRule],
        version: [Rule.SelectRequiredRule],
        projectName: [Rule.SelectRequiredRule],
        provider: [Rule.SelectRequiredRule],
        architectures: [Rule.SelectRequiredRule],
        yumOperate: [Rule.SelectRequiredRule],
        runtimeType: [Rule.SelectRequiredRule],
        dockerMirrorRegistry: [Rule.RequiredRule],
        dockerRemoteApi: [Rule.RequiredRule],
        dockerStorageDir: [Rule.RequiredRule],
        containerdStorageDir: [Rule.RequiredRule],
        dockerSubnet: [Rule.RequiredRule],
        maxNodePodNum: [Rule.RequiredRule],
        kubePodSubnet: [Rule.RequiredRule],
        kubeServiceSubnet: [Rule.RequiredRule],
        kubeDnsDomain: [Rule.RequiredRule],
        cgroupDriver: [Rule.SelectRequiredRule],
        kubeProxyMode: [Rule.SelectRequiredRule],
        kubeServiceNodePortRange1: [Rule.NumberRule],
        kubeServiceNodePortRange2: [Rule.NumberRule],
        networkType: [Rule.SelectRequiredRule],
        flannelBackend: [Rule.SelectRequiredRule],
        calicoIpv4PoolIpip: [Rule.RequiredRule],
        ciliumTunnelMode: [Rule.RequiredRule],
        helmVersion: [Rule.SelectRequiredRule],
        ingressControllerType: [Rule.SelectRequiredRule],
        plan: [Rule.SelectRequiredRule],
        masters: [Rule.SelectRequiredRule],
        lbMode: [Rule.RequiredRule],
        lbKubeApiserverIp: [Rule.IpRule],
        kubeApiServerPort: [Rule.NumberRule],
        etcdDataDir: [Rule.RequiredRule],
        etcdSnapshotCount: [Rule.NumberRule],
        etcdCompactionRetention: [Rule.NumberRule],
        etcdMaxRequest: [Rule.NumberRule],
        etcdQuotaBackend: [Rule.NumberRule],
      },
      versions: ["1.18.16", "1.20.10"],
      nameValid: true,
      archValid: true,
      nodes: "",
      plans: [],
      allHosts: [],
      hosts: [],
      scheduleType: true,
      projects: [],
      repoList: [],
      validateCluster: false,
      loading: false,
      helmVersions: ["v3", "v2"],

      podIPNumOptions: [256, 128, 64, 32, 16],
      podPart1Options: ["192", "172", "10"],
      podPart2Options: [],
      podPart3Options: [],
      podParts: ["10", "0", "0", "0", "14"],
      servicePart1Options: ["192", "172", "10"],
      servicePart2Options: [],
      servicePart3Options: [],
      podMaskOptions: [],
      serviceParts: ["192", "168", "0", "0", "16"],
      serviceMaskOptions: [],

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
          console.log(valid)
          if (this.form.masters) {
            const lenMaster = this.form.masters.length
            if (lenMaster !== 0) {
              if (lenMaster !== 1 && lenMaster !== 3) {
                this.$message({ type: "info", message: this.$t("cluster.creation.master_select_help") })
                return false
              }
            }
            if (this.isNodeNumExceed()) {
              return false
            }
          }
          if (this.form.kubeServiceNodePortRange1 > this.form.kubeServiceNodePortRange2) {
            return false
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
              this.allHosts.push({ name: h.name, architecture: h.architecture, ip: h.ip })
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
      if (step.id === "component-setting") {
        this.loadProjectResource()
      }
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
    isNodeNumExceed() {
      return this.form.workers.length + this.form.masters.length > this.form.maxNodeNum
    },
    onSubmit() {
      if (this.form.ciliumTunnelMode === "flannelBackend") {
        this.form.ciliumTunnelMode = "disable"
      }
      this.form.kubeServiceNodePortRange = this.form.kubeServiceNodePortRange1 + "-" + this.form.kubeServiceNodePortRange2
      delete this.form.masters
      delete this.form.workers
      delete this.form.kubeServiceNodePortRange1
      delete this.form.kubeServiceNodePortRange2
      createCluster(this.form).then(() => {
        this.$router.push({ name: "ClusterList" })
      })
    },

    onPart1Change(type) {
      let itemPart = type === "pod" ? this.podParts : this.serviceParts
      let maskOptions = []
      let part2Options = []
      switch (itemPart[0]) {
        case "192":
          part2Options = ["168"]
          itemPart[1] = "168"
          maskOptions = type === "pod" ? ["16", "17", "18", "19"] : ["16", "17", "18", "19", "20", "21", "22", "23", "24"]
          itemPart[4] = "16"
          this.handleUpdate(type, "192", "16")
          break
        case "172":
          maskOptions = type === "pod" ? ["16", "17", "18", "19"] : ["16", "17", "18", "19", "20", "21", "22", "23", "24"]
          itemPart[4] = "16"
          this.handleUpdate(type, "172", "16")
          break
        case "10":
          maskOptions = type === "pod" ? ["14", "15", "16", "17", "18", "19"] : ["14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24"]
          itemPart[4] = "14"
          this.handleUpdate(type, "10", "14")
          break
      }
      if (type === "pod") {
        this.podParts = itemPart
        this.podPart2Options = part2Options
        this.podMaskOptions = maskOptions
      } else {
        this.serviceParts = itemPart
        this.servicePart2Options = part2Options
        this.serviceMaskOptions = maskOptions
      }
    },
    onMaskChange(type) {
      let part0 = type === "pod" ? this.podParts[0] : this.serviceParts[0]
      let part4 = type === "pod" ? this.podParts[4] : this.serviceParts[4]
      this.handleUpdate(type, part0, part4)
    },
    handleUpdate(type, period, mask) {
      let order = Math.ceil(parseInt(mask) / 8),
        digit = parseInt(mask) % 8,
        field2 = "",
        field2Range = [],
        field3 = 0,
        field3Range = []
      if (digit === 0) {
        digit = 8
      }
      let parts = []
      if (period === "192") {
        if (order >= 3) {
          field2 = parts[1] || "168"
          field2Range = ["168"]
          field3Range = this.computerRange(digit, 0, 256)
          field3 = parts[2] || field3Range[0]
        } else {
          field2 = parts[1] || "168"
          field2Range = ["168"]
          field3 = parts[2] || "0"
          field3Range = ["0"]
        }
      } else if (period === "172") {
        if (order >= 3) {
          field2Range = this.computerRange(8, 16, 16)
          //去除172.17网段
          let cIndex = field2Range.indexOf("17")
          if (cIndex > -1) {
            field2Range.splice(cIndex, 1)
          }
          field2 = parts[1] || field2Range[0]
          field3Range = this.computerRange(digit, 0, 256)
          field3 = parts[2] || field3Range[0]
        } else {
          field2Range = this.computerRange(digit, 16, 16)
          //去除172.17网段
          let cIndex = field2Range.indexOf("17")
          if (cIndex > -1) {
            field2Range.splice(cIndex, 1)
          }
          field2 = parts[1] || field2Range[0]
          field3 = parts[2] || "0"
          field3Range = ["0"]
        }
      } else if (period === "10") {
        if (order >= 3) {
          field2Range = this.computerRange(8, 0, 256)
          field2 = parts[1] || field2Range[0]
          field3Range = this.computerRange(digit, 0, 256)
          field3 = parts[2] || field3Range[0]
        } else {
          field2Range = this.computerRange(digit, 0, 256)
          field2 = parts[1] || field2Range[0]
          field3 = parts[2] || "0"
          field3Range = ["0"]
        }
      }
      if (type === "pod") {
        this.podParts[1] = field2
        this.podPart2Options = field2Range
        this.podParts[2] = field3
        this.podPart3Options = field3Range
      } else {
        this.serviceParts[1] = field2
        this.servicePart2Options = field2Range
        this.serviceParts[2] = field3
        this.servicePart3Options = field3Range
      }
      this.getCidr(type)
    },
    computerRange(digit, min, max) {
      let base = Math.pow(2, 8 - digit),
        range = []
      for (let i = 0; i < max >> (8 - digit); i++) {
        range.push(min + i * base + "")
      }
      return range
    },
    getCidr(type) {
      if (type === "pod") {
        this.form.kubePodSubnet = this.podParts[0] + "." + this.podParts[1] + "." + this.podParts[2] + "." + this.podParts[3] + "/" + this.podParts[4]
        this.form.maxNodeNum = Math.pow(2, 32 - Number(this.podParts[4])) / this.form.maxNodePodNum
      } else {
        this.form.kubeServiceSubnet = this.serviceParts[0] + "." + this.serviceParts[1] + "." + this.serviceParts[2] + "." + this.serviceParts[3] + "/" + this.serviceParts[4]
      }
    },
    changeProvide() {
      this.form.nodeNameRule = "default"
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
              this.hosts.push({ label: h.name + "(" + h.ip + ")", value: h.name })
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
              this.hosts.push({ label: h.name + "(" + h.ip + ")", value: h.name })
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
            this.hosts.push({ label: h.name + "(" + h.ip + ")", value: h.name })
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
          if (this.form.workers.length === 0) {
            this.scheduleType = true
            this.form.masterScheduleType = "enable"
          } else {
            this.scheduleType = false
          }
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
    changeWorkNum() {
      if (this.form.workerAmount === 0) {
        this.scheduleType = true
        this.form.masterScheduleType = "enable"
      } else {
        this.scheduleType = false
      }
    },
    getHostName(hosts) {
      return hosts.join(",")
    },
    isMultiMaster() {
      if (this.form.provider === "plan") {
        if (this.form.plan === "") {
          return false
        }
        for (const p of this.plans) {
          if (p.name === this.form.plan) {
            return p.deployTemplate !== "SINGLE"
          }
        }
      } else {
        return this.form.masters.length === 3
      }
    },
    isPortAvailable() {
      this.form.kubeApiServerPort = this.form.kubeApiServerPort === 6443 ? 8443 : this.form.kubeApiServerPort
    },
    onCancel() {
      this.$router.push({ name: "ClusterList" })
    },
  },
  created() {
    this.loadProject()
    this.loadVersion()
    this.loadRegistry()
    this.onPart1Change("pod")
    this.onPart1Change("service")
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
  ::v-deep .el-scrollbar__wrap {
    height: 100%;
    overflow-x: hidden;
  }
}
</style>
