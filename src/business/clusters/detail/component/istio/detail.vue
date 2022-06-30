<template>
  <div>
    <el-divider content-position="left">Istio-Pilot</el-divider>
    <el-form label-width="200px">
      <el-row type="flex" justify="center">
        <el-col :span="10">
          <el-form-item :label="$t('cluster.detail.istio.cpu_request')">
            <span>{{ istio.pilot_requests_cpu }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('cluster.detail.istio.memory_request')">
            <span>{{ istio.pilot_requests_memory }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :span="10">
          <el-form-item :label="$t('cluster.detail.istio.cpu_limit')">
            <span>{{ istio.pilot_limit_cpu }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('cluster.detail.istio.memory_limit')">
            <span>{{ istio.pilot_limit_memory }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :span="10">
          <el-form-item :label="$t('cluster.detail.istio.trace')">
            <span>{{ istio.pilot_trace_sampling }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10"><br /></el-col>
      </el-row>
    </el-form>

    <div v-if="istio.enable_istio_ingress === 'enable'">
      <el-divider content-position="left">Istio-Ingress</el-divider>
      <el-form label-width="200px">
        <el-row type="flex" justify="center">
          <el-col :span="10">
            <el-form-item :label="$t('cluster.detail.istio.cpu_request')">
              <span>{{ istio.ingress_requests_cpu }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t('cluster.detail.istio.memory_request')">
              <span>{{ istio.ingress_requests_memory }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :span="10">
            <el-form-item :label="$t('cluster.detail.istio.cpu_limit')">
              <span>{{ istio.ingress_limit_cpu }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t('cluster.detail.istio.memory_limit')">
              <span>{{ istio.ingress_limit_memory }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-col :span="10">
          <el-form-item :label="$t('cluster.detail.istio.gateways_type')">
            <span>{{ istio.ingress_type }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10"><br /></el-col>
      </el-form>
    </div>

    <div v-if="istio.enable_istio_egress === 'enable'">
      <el-divider content-position="left">Istio-Egress</el-divider>
      <el-form label-width="200px">
        <el-row type="flex" justify="center">
          <el-col :span="10">
            <el-form-item :label="$t('cluster.detail.istio.cpu_limit')">
              <span>{{ istio.egress_requests_cpu }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t('cluster.detail.istio.memory_request')">
              <span>{{ istio.egress_requests_memory }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :span="10">
            <el-form-item :label="$t('cluster.detail.istio.cpu_limit')">
              <span>{{ istio.egress_limit_cpu }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t('cluster.detail.istio.memory_request')">
              <span>{{ istio.egress_limit_memory }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import { isJson } from "@/utils/validate"

export default {
  name: "IstioDetail",
  props: {
    istioVars: String,
  },
  data() {
    return {
      istio: {},
    }
  },
  mounted() {
    if (isJson(this.istioVars)) {
      this.istio = JSON.parse(this.istioVars)
    }
  },
}
</script>
