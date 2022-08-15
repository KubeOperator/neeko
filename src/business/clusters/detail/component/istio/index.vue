<template>
  <div>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="Istio-Pilot" name="1">
        <el-form :model="istioVars" ref="istioVars" label-width="200px">
          <el-row type="flex">
            <el-form-item :label="$t('cluster.detail.istio.cpu_request')" prop="pilot_requests_cpu" :rules="numberRules">
              <el-input-number style="width: 100%" :step="1" step-strictly v-model="istioVars.pilot_requests_cpu"></el-input-number>
            </el-form-item>
            <el-form-item :label="$t('cluster.detail.istio.memory_request')" prop="pilot_requests_memory" :rules="numberRules">
              <el-input-number style="width: 100%" :step="1" step-strictly v-model="istioVars.pilot_requests_memory"></el-input-number>
            </el-form-item>
          </el-row>
          <el-row type="flex">
            <el-form-item :label="$t('cluster.detail.istio.cpu_limit')" prop="pilot_limit_cpu" :rules="numberRules">
              <el-input-number style="width: 100%" :step="1" step-strictly v-model.number="istioVars.pilot_limit_cpu"></el-input-number>
            </el-form-item>
            <el-form-item :label="$t('cluster.detail.istio.memory_limit')" prop="pilot_limit_memory" :rules="numberRules">
              <el-input-number style="width: 100%" :step="1" step-strictly v-model="istioVars.pilot_limit_memory"></el-input-number>
            </el-form-item>
          </el-row>
          <el-row type="flex">
            <el-form-item :label="$t('cluster.detail.istio.trace')" prop="pilot_trace_sampling" :rules="numberRules">
              <el-input-number style="width: 100%" :step="1" step-strictly v-model="istioVars.pilot_trace_sampling"></el-input-number>
            </el-form-item>
          </el-row>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="Istio-Ingress" name="2">
        <el-switch v-model="istioVars.enable_istio_ingress" active-value="enable" inactive-value="disable"></el-switch>
        <div v-if="istioVars.enable_istio_ingress === 'enable'">
          <el-form label-width="200px">
            <el-row type="flex">
              <el-form-item :label="$t('cluster.detail.istio.cpu_request')" prop="ingress_requests_cpu" :rules="numberRules">
                <el-input-number style="width: 100%" :step="1" step-strictly v-model="istioVars.ingress_requests_cpu"></el-input-number>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.istio.memory_request')" prop="ingress_requests_memory" :rules="numberRules">
                <el-input-number style="width: 100%" :step="1" step-strictly v-model="istioVars.ingress_requests_memory"></el-input-number>
              </el-form-item>
            </el-row>
            <el-row type="flex">
              <el-form-item :label="$t('cluster.detail.istio.cpu_limit')" prop="ingress_limit_cpu" :rules="numberRules">
                <el-input-number style="width: 100%" :step="1" step-strictly v-model="istioVars.ingress_limit_cpu"></el-input-number>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.istio.memory_limit')" prop="ingress_limit_memory" :rules="numberRules">
                <el-input-number style="width: 100%" :step="1" step-strictly v-model="istioVars.ingress_limit_memory"></el-input-number>
              </el-form-item>
            </el-row>
            <el-form-item :label="$t('cluster.detail.istio.gateways_type')" prop="ingress_type" :rules="requiredRules">
              <el-select style="width: 206px" v-model="istioVars.ingress_type" clearable>
                <el-option value="NodePort">NodePort</el-option>
                <el-option value="LoadBalancer">LoadBalancer</el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item title="Istio-Egress" name="3">
        <el-switch v-model="istioVars.enable_istio_egress" active-value="enable" inactive-value="disable"></el-switch>
        <div v-if="istioVars.enable_istio_egress === 'enable'">
          <el-form label-width="200px">
            <el-row type="flex">
              <el-form-item :label="$t('cluster.detail.istio.cpu_limit')" prop="egress_requests_cpu" :rules="numberRules">
                <el-input-number style="width: 100%" :step="1" step-strictly v-model="istioVars.egress_requests_cpu"></el-input-number>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.istio.memory_request')" prop="egress_requests_memory" :rules="numberRules">
                <el-input-number style="width: 100%" :step="1" step-strictly v-model="istioVars.egress_requests_memory"></el-input-number>
              </el-form-item>
            </el-row>
            <el-row type="flex">
              <el-form-item :label="$t('cluster.detail.istio.cpu_limit')" prop="egress_limit_cpu" :rules="numberRules">
                <el-input-number style="width: 100%" :step="1" step-strictly v-model="istioVars.egress_limit_cpu"></el-input-number>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.istio.memory_request')" prop="egress_limits_memory" :rules="numberRules">
                <el-input-number style="width: 100%" :step="1" step-strictly v-model="istioVars.egress_limit_memory"></el-input-number>
              </el-form-item>
            </el-row>
          </el-form>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import Rule from "@/utils/rules"
import { isJson } from "@/utils/validate"

export default {
  name: "IstioComponent",
  data() {
    return {
      submitLoading: false,
      clusterName: "",
      activeNames: ["1", "2", "3"],
      istioVars: {
        pilot_limit_cpu: 500,
        pilot_limit_memory: 2048,
        pilot_requests_cpu: 500,
        pilot_requests_memory: 2048,
        pilot_trace_sampling: 1,

        enable_istio_ingress: "disable",
        ingress_requests_cpu: 100,
        ingress_requests_memory: 128,
        ingress_limit_cpu: 2000,
        ingress_limit_memory: 1024,
        ingress_type: "NodePort",

        enable_istio_egress: "disable",
        egress_requests_cpu: 100,
        egress_requests_memory: 128,
        egress_limit_cpu: 2000,
        egress_limit_memory: 1024,
      },
      numberRules: [Rule.NumberRule],
      requiredRules: [Rule.RequiredRule],
    }
  },
  methods: {
    gatherVars(vars) {
      let isValid = false
      this.$refs["istioVars"].validate((valid) => {
        isValid = valid
      })
      if (!isValid) {
        return null
      }
      let itemVars = {}
      if (isJson(vars)) {
        itemVars = JSON.parse(vars)
      } else {
        itemVars = vars
      }
      for (const key in this.istioVars) {
        if (key.indexOf("cpu") !== -1) {
          itemVars[key] = this.istioVars[key] + "m"
        } else if (key.indexOf("memory") !== -1) {
          itemVars[key] = this.istioVars[key] + "Mi"
        } else {
          itemVars[key] = this.istioVars[key] + ""
        }
      }
      return itemVars
    },
  },
}
</script>
