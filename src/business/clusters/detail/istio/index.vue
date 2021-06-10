<template>
  <layout-content>
    <div>
      <el-collapse v-model="activeNames">
        <el-collapse-item title="Istio-Pilot" name="1">
          <el-form :model="pilotCfg" ref="pilotCfg" label-width="200px">
            <el-form-item v-if="pilotCfg.cluster_istio.message">
              <el-tooltip class="item" effect="light" :content="pilotCfg.cluster_istio.message" placement="right-end">
                <el-button icon="el-icon-error" type="text" style="color:red">{{$t('cluster.detail.istio.err_title')}}</el-button>
              </el-tooltip>
            </el-form-item>
            <el-row type="flex">
              <el-form-item :label="$t('cluster.detail.istio.cpu_request')" prop="vars.pilot_resources_requests_cpu" :rules="numberRules">
                <el-input-number style="width: 100%" :step="1" step-strictly v-model="pilotCfg.vars['pilot_resources_requests_cpu']"></el-input-number>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.istio.memory_request')" prop="vars.pilot_resources_requests_memory" :rules="numberRules">
                <el-input-number style="width: 100%" :step="1" step-strictly v-model="pilotCfg.vars['pilot_resources_requests_memory']"></el-input-number>
              </el-form-item>
            </el-row>
            <el-row type="flex">
              <el-form-item :label="$t('cluster.detail.istio.cpu_limit')" prop="vars.pilot_resources_limits_cpu" :rules="numberRules">
                <el-input-number style="width: 100%" :step="1" step-strictly v-model.number="pilotCfg.vars.pilot_resources_limits_cpu"></el-input-number>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.istio.memory_limit')" prop="vars.pilot_resources_limits_memory" :rules="numberRules">
                <el-input-number style="width: 100%" :step="1" step-strictly v-model="pilotCfg.vars['pilot_resources_limits_memory']"></el-input-number>
              </el-form-item>
            </el-row>
            <el-row type="flex">
              <el-form-item :label="$t('cluster.detail.istio.trace')" prop="vars.pilot_traceSampling" :rules="numberRules">
                <el-input-number style="width: 100%" :step="1" step-strictly v-model="pilotCfg.vars['pilot_traceSampling']"></el-input-number>
              </el-form-item>
            </el-row>
          </el-form>
        </el-collapse-item>
        <el-collapse-item title="Istio-Ingress" name="2">
          <el-switch v-model="ingressCfg.enable"></el-switch>
          <div v-if="ingressCfg.enable">
            <el-form :model="ingressCfg" ref="ingressCfg" label-width="200px">
              <el-form-item v-if="ingressCfg.cluster_istio.message">
                <el-tooltip class="item" effect="light" :content="ingressCfg.cluster_istio.message" placement="right-end">
                  <el-button icon="el-icon-error" type="text" style="color:red">{{$t('cluster.detail.istio.err_title')}}</el-button>
                </el-tooltip>
              </el-form-item>
              <el-row type="flex">
                <el-form-item :label="$t('cluster.detail.istio.cpu_request')" prop="vars.gateways_istio__ingressgateway_resources_requests_cpu" :rules="numberRules">
                  <el-input-number style="width: 100%" :step="1" step-strictly v-model="ingressCfg.vars['gateways_istio__ingressgateway_resources_requests_cpu']"></el-input-number>
                </el-form-item>
                <el-form-item :label="$t('cluster.detail.istio.memory_request')" prop="vars.gateways_istio__ingressgateway_resources_requests_memory" :rules="numberRules">
                  <el-input-number style="width: 100%" :step="1" step-strictly v-model="ingressCfg.vars['gateways_istio__ingressgateway_resources_requests_memory']"></el-input-number>
                </el-form-item>
              </el-row>
              <el-row type="flex">
                <el-form-item :label="$t('cluster.detail.istio.cpu_limit')" prop="vars.gateways_istio__ingressgateway_resources_limits_cpu" :rules="numberRules">
                  <el-input-number style="width: 100%" :step="1" step-strictly v-model="ingressCfg.vars['gateways_istio__ingressgateway_resources_limits_cpu']"></el-input-number>
                </el-form-item>
                <el-form-item :label="$t('cluster.detail.istio.memory_limit')" prop="vars.gateways_istio__ingressgateway_resources_limits_memory" :rules="numberRules">
                  <el-input-number style="width: 100%" :step="1" step-strictly v-model="ingressCfg.vars['gateways_istio__ingressgateway_resources_limits_memory']"></el-input-number>
                </el-form-item>
              </el-row>
              <el-form-item :label="$t('cluster.detail.istio.gateways_type')" prop="vars.gateways_istio__ingressgateway_type" :rules="requiredRules">
                <el-select style="width: 206px" v-model="ingressCfg.vars['gateways_istio__ingressgateway_type']" clearable>
                  <el-option value="NodePort">NodePort</el-option>
                  <el-option value="LoadBalancer">LoadBalancer</el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </el-collapse-item>
        <el-collapse-item title="Istio-Egress" name="3">
          <el-switch v-model="egressCfg.enable"></el-switch>
          <div v-if="egressCfg.enable">
            <el-form :model="egressCfg" ref="egressCfg" label-width="200px">
              <el-form-item v-if="egressCfg.cluster_istio.message">
                <el-tooltip class="item" effect="light" :content="egressCfg.cluster_istio.message" placement="right-end">
                  <el-button icon="el-icon-error" type="text" style="color:red">{{$t('cluster.detail.istio.err_title')}}</el-button>
                </el-tooltip>
              </el-form-item>
              <el-row type="flex">
                <el-form-item :label="$t('cluster.detail.istio.cpu_limit')" prop="vars.gateways_istio__egressgateway_resources_requests_cpu" :rules="numberRules">
                  <el-input-number style="width: 100%" :step="1" step-strictly v-model="egressCfg.vars['gateways_istio__egressgateway_resources_requests_cpu']"></el-input-number>
                </el-form-item>
                <el-form-item :label="$t('cluster.detail.istio.memory_request')" prop="vars.gateways_istio__egressgateway_resources_requests_memory" :rules="numberRules">
                  <el-input-number style="width: 100%" :step="1" step-strictly v-model="egressCfg.vars['gateways_istio__egressgateway_resources_requests_memory']"></el-input-number>
                </el-form-item>
              </el-row>
              <el-row type="flex">
                <el-form-item :label="$t('cluster.detail.istio.cpu_limit')" prop="vars.gateways_istio__egressgateway_resources_limits_cpu" :rules="numberRules">
                  <el-input-number style="width: 100%" :step="1" step-strictly v-model="egressCfg.vars['gateways_istio__egressgateway_resources_limits_cpu']"></el-input-number>
                </el-form-item>
                <el-form-item :label="$t('cluster.detail.istio.memory_request')" prop="vars.gateways_istio__egressgateway_resources_limits_memory" :rules="numberRules">
                  <el-input-number style="width: 100%" :step="1" step-strictly v-model="egressCfg.vars['gateways_istio__egressgateway_resources_limits_memory']"></el-input-number>
                </el-form-item>
              </el-row>
            </el-form>
          </div>
        </el-collapse-item>
      </el-collapse>
      <div v-if="baseCfg.cluster_istio.status !== 'Running'">
        <el-button @click="onSubmit('start')" :disabled="submitLoading" size="mini">{{$t('commons.button.enable')}}</el-button>
      </div>
      <div v-if="baseCfg.cluster_istio.status === 'Running'">
        <el-button @click="onSubmit('restart')" :disabled="submitLoading" size="mini">{{$t('cluster.detail.istio.resave')}}</el-button>
        <el-button @click="onDisable()" size="mini">{{$t('commons.button.disable')}}</el-button>
      </div>
      <el-dialog :title="$t('cluster.detail.istio.disable_istio')" width="30%" :visible.sync="dialogShutupVisible">
        <span>{{$t('cluster.detail.istio.ensure_disable_istio')}}</span>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogShutupVisible = false">{{$t('commons.button.cancel')}}</el-button>
          <el-button :disabled="submitLoading" @click="submitDisable()">{{$t('commons.button.ok')}}</el-button>
        </div>
      </el-dialog>
    </div>
  </layout-content>
</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent"
import { listIstio, enableIstio, disableIstio } from "@/api/cluster/istio"
import { changeUnderLineToPoint, changePointToUnderLine } from "@/utils/format_conversion"
import Rule from "@/utils/rules"

export default {
  name: "ClusterIstio",
  components: { LayoutContent },
  data() {
    return {
      submitLoading: false,
      clusterName: "",
      activeNames: ["1", "2", "3"],
      accordionLoading: false,
      baseCfg: {
        cluster_istio: {},
        enable: false,
        operation: "",
        vars: {},
      },
      pilotCfg: {
        cluster_istio: {},
        enable: false,
        operation: "",
        vars: {},
      },
      ingressCfg: {
        cluster_istio: {},
        enable: false,
        operation: "",
        vars: {},
      },
      egressCfg: {
        cluster_istio: {},
        enable: false,
        operation: "",
        vars: {},
      },
      numberRules: [Rule.NumberRule],
      requiredRules: [Rule.RequiredRule],
      dialogShutupVisible: false,
    }
  },
  methods: {
    search() {
      this.loading = true
      listIstio(this.clusterName).then((data) => {
        for (const item of data) {
          switch (item.cluster_istio.name) {
            case "base":
              if (item.cluster_istio.status !== "Waiting") {
                this.baseCfg.vars = changePointToUnderLine(JSON.parse(item.cluster_istio.vars))
              } else {
                this.setDefaultBaseCfg()
              }
              this.baseCfg.enable = item.cluster_istio.status !== "Waiting"
              this.baseCfg.cluster_istio = item.cluster_istio
              break
            case "pilot":
              if (item.cluster_istio.status !== "Waiting") {
                this.pilotCfg.vars = changePointToUnderLine(JSON.parse(item.cluster_istio.vars))
              } else {
                this.setDefaultPilotCfg()
              }
              this.pilotCfg.enable = item.cluster_istio.status !== "Waiting"
              this.pilotCfg.cluster_istio = item.cluster_istio
              break
            case "ingress":
              if (item.cluster_istio.status !== "Waiting") {
                this.ingressCfg.vars = changePointToUnderLine(JSON.parse(item.cluster_istio.vars))
              } else {
                this.setDefaultIngressCfg()
              }
              this.ingressCfg.enable = item.cluster_istio.status !== "Waiting" && item.cluster_istio.status !== "Terminated"
              this.ingressCfg.cluster_istio = item.cluster_istio
              break
            case "egress":
              if (item.cluster_istio.status !== "Waiting") {
                this.egressCfg.vars = changePointToUnderLine(JSON.parse(item.cluster_istio.vars))
              } else {
                this.setDefaultEgressCfg()
              }
              this.egressCfg.enable = item.cluster_istio.status !== "Waiting" && item.cluster_istio.status !== "Terminated"
              this.egressCfg.cluster_istio = item.cluster_istio
              break
          }
          this.loading = false
        }
      })
    },
    onSubmit(operation) {
      this.submitLoading = true
      changeUnderLineToPoint(this.pilotCfg.vars)
      changeUnderLineToPoint(this.ingressCfg.vars)
      changeUnderLineToPoint(this.egressCfg.vars)
      var items = []
      if (operation === "start") {
        this.baseCfg.enable = true
        this.getOperation(items, this.baseCfg)
      }
      this.pilotCfg.enable = true
      this.getOperation(items, this.pilotCfg)
      this.getOperation(items, this.ingressCfg)
      this.getOperation(items, this.egressCfg)
      enableIstio(this.clusterName, items)
        .then(() => {
          if (operation === "start") {
            this.$message({ type: "success", message: this.$t("commons.msg.enable_success") })
          } else {
            this.$message({ type: "success", message: this.$t("commons.msg.re_enable_success") })
          }
          this.search()
          this.submitLoading = false
        })
        .catch(() => {
          this.submitLoading = false
        })
    },
    onDisable() {
      this.dialogShutupVisible = true
    },
    submitDisable() {
      this.submitLoading = true
      var items = []
      this.disAble(items, this.baseCfg)
      this.disAble(items, this.pilotCfg)
      this.disAble(items, this.ingressCfg)
      this.disAble(items, this.egressCfg)
      disableIstio(this.clusterName, items)
        .then(() => {
          this.$message({ type: "success", message: this.$t("commons.msg.disable_success") })
          this.submitLoading = false
          this.dialogShutupVisible = false
          this.search()
        })
        .catch(() => {
          this.submitLoading = false
        })
    },
    disAble(items, istio) {
      if (istio.cluster_istio.status !== "Waiting") {
        istio.operation = "disable"
        istio.enable = false
        items.push(istio)
      }
    },
    getOperation(items, istio) {
      if (istio.enable) {
        istio.operation = "enable"
        items.push(istio)
      } else if (!istio.enable && istio.cluster_istio.status !== "Waiting") {
        istio.operation = "disable"
        items.push(istio)
      }
    },
    setDefaultBaseCfg() {
      this.baseCfg.vars = {
        "global.istiod.enableAnalysis": true,
      }
    },
    setDefaultPilotCfg() {
      this.pilotCfg.vars = {
        pilot_resources_requests_cpu: 500,
        pilot_resources_requests_memory: 2048,
        pilot_resources_limits_cpu: 500,
        pilot_resources_limits_memory: 2048,
        pilot_traceSampling: 1,
      }
    },
    setDefaultIngressCfg() {
      this.ingressCfg.vars = {
        gateways_istio__ingressgateway_type: "NodePort",
        gateways_istio__ingressgateway_resources_requests_cpu: 100,
        gateways_istio__ingressgateway_resources_requests_memory: 128,
        gateways_istio__ingressgateway_resources_limits_cpu: 2000,
        gateways_istio__ingressgateway_resources_limits_memory: 1024,
      }
    },
    setDefaultEgressCfg() {
      this.egressCfg.vars = {
        gateways_istio__egressgateway_resources_requests_cpu: 100,
        gateways_istio__egressgateway_resources_requests_memory: 128,
        gateways_istio__egressgateway_resources_limits_cpu: 2000,
        gateways_istio__egressgateway_resources_limits_memory: 1024,
      }
    },
  },
  created() {
    this.clusterName = this.$route.params.name
    this.search()
  },
}
</script>
