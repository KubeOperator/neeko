<template>
  <layout-content>
    <div>
      <el-form ref="form" label-width="200px">
        <el-collapse v-model="activeNames">
          <el-collapse-item title="istio-pilot" name="1">
            <el-form-item :label="$t('cluster.detail.istio.cpu_limit')" style="width: 80%" required>
              <el-input type="number" v-model="pilotCfg.vars['pilot.resources.limits.cpu']"></el-input>
            </el-form-item>
            <el-form-item :label="$t('cluster.detail.istio.memory_limit')" style="width: 80%" required>
              <el-input type="number" v-model="pilotCfg.vars['pilot.resources.limits.memory']"></el-input>
            </el-form-item>
            <el-form-item :label="$t('cluster.detail.istio.cpu_request')" style="width: 80%" required>
              <el-input type="number" v-model="pilotCfg.vars['pilot.resources.requests.cpu']"></el-input>
            </el-form-item>
            <el-form-item :label="$t('cluster.detail.istio.memory_request')" style="width: 80%" required>
              <el-input type="number" v-model="pilotCfg.vars['pilot.resources.requests.memory']"></el-input>
            </el-form-item>
            <el-form-item :label="$t('cluster.detail.istio.trace')" style="width: 80%" required>
              <el-input type="number" v-model="pilotCfg.vars['pilot.traceSampling']"></el-input>
            </el-form-item>
          </el-collapse-item>
          <el-collapse-item title="istio-ingress" name="2">
            <el-switch v-model="ingressCfg.enable"></el-switch>
            <div v-if="ingressCfg.enable">
              <el-form-item :label="$t('cluster.detail.istio.cpu_limit')" style="width: 80%" required>
                <el-input type="number" v-model="ingressCfg.vars['gateways.istio-ingressgateway.resources.limits.cpu']"></el-input>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.istio.memory_limit')" style="width: 80%" required>
                <el-input type="number" v-model="ingressCfg.vars['gateways.istio-ingressgateway.resources.limits.memory']"></el-input>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.istio.cpu_request')" style="width: 80%" required>
                <el-input type="number" v-model="ingressCfg.vars['gateways.istio-ingressgateway.resources.requests.cpu']"></el-input>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.istio.memory_request')" style="width: 80%" required>
                <el-input type="number" v-model="ingressCfg.vars['gateways.istio-ingressgateway.resources.requests.memory']"></el-input>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.istio.gateways_type')" style="width: 80%" required>
                <el-select style="width: 100%" v-model="ingressCfg.vars['gateways.istio-ingressgateway.type']" clearable>
                  <el-option value="NodePort">NodePort</el-option>
                  <el-option value="LoadBalancer">LoadBalancer</el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-collapse-item>
          <el-collapse-item title="istio-egress" name="3">
            <el-switch v-model="egressCfg.enable"></el-switch>
            <div v-if="egressCfg.enable">
              <el-form-item :label="$t('cluster.detail.istio.cpu_limit')" style="width: 80%" required>
                <el-input type="number" v-model="egressCfg.vars['gateways.istio-egressgateway.resources.limits.cpu']"></el-input>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.istio.memory_request')" style="width: 80%" required>
                <el-input type="number" v-model="egressCfg.vars['gateways.istio-egressgateway.resources.limits.memory']"></el-input>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.istio.cpu_limit')" style="width: 80%" required>
                <el-input type="number" v-model="egressCfg.vars['gateways.istio-egressgateway.resources.requests.cpu']"></el-input>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.istio.memory_request')" style="width: 80%" required>
                <el-input type="number" v-model="egressCfg.vars['gateways.istio-egressgateway.resources.requests.memory']"></el-input>
              </el-form-item>
            </div>
          </el-collapse-item>
        </el-collapse>
        <div v-if="baseCfg.cluster_istio.status === 'Waiting'">
          <el-button @click="onSubmit('start')" :disabled="btnStartDisable" type="primary" size="mini">{{$t('cluster.detail.istio.enable_istio')}}</el-button>
        </div>
        <div v-if="baseCfg.cluster_istio.status === 'Running'">
          <el-button @click="onSubmit('restart')" :disabled="btnStartDisable" type="primary" size="mini">{{$t('cluster.detail.istio.resave')}}</el-button>
          <el-button @click="onDisable()" type="danger" size="mini">{{$t('cluster.detail.istio.disable_istio')}}</el-button>
        </div>
      </el-form>
      <el-dialog :title="$t('cluster.detail.istio.disable_istio')" width="30%" :visible.sync="dialogShutupVisible">
        <span>{{$t('cluster.detail.istio.ensure_disable_istio')}}</span>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogShutupVisible = false">{{$t('commons.button.cancel')}}</el-button>
          <el-button type="primary" @click="submitDisable()">{{$t('commons.button.ok')}}</el-button>
        </div>
      </el-dialog>
    </div>
  </layout-content>
</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent"
import { listIstio, enableIstio, disableIstio } from "@/api/cluster/istio"

export default {
  name: "Manifest",
  components: { LayoutContent },
  data() {
    return {
      clusterName: "",
      activeNames: ["1", "2", "3"],
      accordionLoading: false,
      btnStartDisable: false,
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
      dialogShutupVisible: false,
    }
  },
  methods: {
    search() {
      listIstio(this.clusterName).then((data) => {
        for (const item of data) {
          switch (item.cluster_istio.name) {
            case "base":
              if (item.cluster_istio.status !== "Waiting") {
                this.baseCfg.vars = JSON.parse(item.cluster_istio.vars)
              } else {
                this.setDefaultBaseCfg()
              }
              this.baseCfg.enable = item.cluster_istio.status !== "Waiting"
              this.baseCfg.cluster_istio = item.cluster_istio
              break
            case "pilot":
              if (item.cluster_istio.status !== "Waiting") {
                this.pilotCfg.vars = JSON.parse(item.cluster_istio.vars)
              } else {
                this.setDefaultPilotCfg()
              }
              this.pilotCfg.enable = item.cluster_istio.status !== "Waiting"
              this.pilotCfg.cluster_istio = item.cluster_istio
              break
            case "ingress":
              if (item.cluster_istio.status !== "Waiting") {
                this.ingressCfg.vars = JSON.parse(item.cluster_istio.vars)
              } else {
                this.setDefaultIngressCfg()
              }
              this.ingressCfg.enable = item.cluster_istio.status !== "Waiting" && item.cluster_istio.status !== "Terminated"
              this.ingressCfg.cluster_istio = item.cluster_istio
              break
            case "egress":
              if (item.cluster_istio.status !== "Waiting") {
                this.egressCfg.vars = JSON.parse(item.cluster_istio.vars)
              } else {
                this.setDefaultEgressCfg()
              }
              this.egressCfg.enable = item.cluster_istio.status !== "Waiting" && item.cluster_istio.status !== "Terminated"
              this.egressCfg.cluster_istio = item.cluster_istio
              break
          }
        }
      })
    },
    onSubmit(operation) {
      this.btnStartDisable = true
      var items = []
      if (operation === "start") {
        this.baseCfg.enable = true
        this.getOperation(items, this.baseCfg)
      }
      this.pilotCfg.enable = true
      this.getOperation(items, this.pilotCfg)
      this.getOperation(items, this.ingressCfg)
      this.getOperation(items, this.egressCfg)
      enableIstio(this.clusterName, items).then(
        (data) => {
          console.log(data)
          if (operation === "start") {
            this.$message({ type: "success", message: this.$t("cluster.detail.istio.enable_istio") })
          } else {
            this.$message({ type: "success", message: this.$t("cluster.detail.istio.re_enable_success") })
          }
          this.btnStartDisable = false
          this.search()
        },
        (error) => {
          console.log(error)
          this.btnStartDisable = false
        }
      )
    },
    onDisable() {
      this.dialogShutupVisible = true
    },
    submitDisable() {
      this.isSubmitGoing = true
      var items = []
      this.disAble(items, this.baseCfg)
      this.disAble(items, this.pilotCfg)
      this.disAble(items, this.ingressCfg)
      this.disAble(items, this.egressCfg)
      disableIstio(this.clusterName, items).then(
        (data) => {
          console.log(data)
          this.$message({ type: "success", message: this.$t("cluster.detail.istio.disable_istio") })
          this.isSubmitGoing = false
          this.dialogShutupVisible = false
          this.search()
        },
        (error) => {
          this.$message({ type: "error", message: error })
          this.isSubmitGoing = false
        }
      )
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
        "pilot.resources.requests.cpu": 500,
        "pilot.resources.requests.memory": 2048,
        "pilot.resources.limits.cpu": 500,
        "pilot.resources.limits.memory": 2048,
        "pilot.traceSampling": 1,
      }
    },
    setDefaultIngressCfg() {
      this.ingressCfg.vars = {
        "gateways.istio-ingressgateway.type": "NodePort",
        "gateways.istio-ingressgateway.resources.requests.cpu": 100,
        "gateways.istio-ingressgateway.resources.requests.memory": 128,
        "gateways.istio-ingressgateway.resources.limits.cpu": 2000,
        "gateways.istio-ingressgateway.resources.limits.memory": 1024,
      }
    },
    setDefaultEgressCfg() {
      this.egressCfg.vars = {
        "gateways.istio-egressgateway.resources.requests.cpu": 100,
        "gateways.istio-egressgateway.resources.requests.memory": 128,
        "gateways.istio-egressgateway.resources.limits.cpu": 2000,
        "gateways.istio-egressgateway.resources.limits.memory": 1024,
      }
    },
  },
  created() {
    this.clusterName = this.$route.params.name
    this.search()
  },
}
</script>