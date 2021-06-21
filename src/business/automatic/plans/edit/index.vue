<template>
  <layout-content :header="$t('commons.button.edit')" :back-to="{ name: 'PlanList' }">
    <el-row>
      <el-col :span="4"><br/></el-col>
      <el-col :span="10">
        <div class="grid-content bg-purple-light">
          <el-form ref="form" label-width="200px" :model="form" :rules="rules" v-loading="loading"
                   label-position="left">
            <el-form-item :label="$t('commons.table.name')" prop="name">
              <el-input v-model="form.name" disabled></el-input>
            </el-form-item>
            <el-form-item :label="$t('automatic.plan.master_model')" prop="planVars.masterModel">
              <el-select v-model="form.planVars.masterModel"
                         filterable style="width:100%"
                         reserve-keyword>
                <el-option
                        v-for="(item,index) in vmConfigs"
                        :key="index"
                        :label="item.name"
                        :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('automatic.plan.worker_model')" prop="planVars.workerModel">
              <el-select v-model="form.planVars.workerModel"
                         filterable style="width:100%"
                         reserve-keyword>
                <el-option
                        v-for="(item,index) in vmConfigs"
                        :key="index"
                        :label="item.name"
                        :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
            <div>
              <h3>{{ $t("automatic.plan.config") }}</h3>
              <el-table
                      :data="vmConfigs"
                      style="width: 100%">
                <el-table-column
                        prop="name"
                        :label="$t('commons.table.name')">
                </el-table-column>
                <el-table-column
                        prop="config.cpu"
                        :label="$t('automatic.vm_config.cpu')">
                </el-table-column>
                <el-table-column
                        prop="config.memory"
                        :label="$t('automatic.vm_config.memory')">
                </el-table-column>
                <el-table-column
                        prop="config.disk"
                        :label="$t('automatic.vm_config.disk')"
                        v-if="form.provider==='OpenStack'">
                </el-table-column>
              </el-table>
            </div>
            <br>
            <el-form-item>
              <div style="float: right">
                <el-button @click="onCancel()">{{ $t("commons.button.cancel") }}</el-button>
                <el-button type="primary" @click="onSubmit('form')">{{ $t("commons.button.submit") }}</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </layout-content>
</template>

<script>
import {getPlanBy, listVmConfigs, updatePlanBy} from "@/api/plan"
import LayoutContent from "@/components/layout/LayoutContent"
import Rule from "@/utils/rules"

export default {
  name: "PlanEdit",
  components: { LayoutContent },
  props: ["name"],
  data () {
    return {
      form: {
        planVars: {
          masterModel: "",
          workerModel: ""
        },
      },
      rules: {
        planVars: {
          masterModel: [Rule.RequiredRule],
          workerModel: [Rule.RequiredRule]
        }
      },
      loading: false,
      vmConfigs: []
    }
  },
  methods: {
    onCancel () {
      this.$router.push({ name: "PlanList" })
    },
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }
        updatePlanBy(this.name, this.form).then(() => {
          this.$message({
            type: "success",
            message: this.$t("commons.msg.update_success")
          })
          this.$router.push({ name: "PlanList" })
        })
      })
    }
  },
  created () {
    this.loading = true
    getPlanBy(this.name).then((res) => {
      this.form = res
      listVmConfigs(this.form.region).then(res => {
        this.loading = false
        this.vmConfigs = res
      })
    }).finally(() => {
      this.loading = false
    })
  }
}
</script>

<style scoped>

</style>