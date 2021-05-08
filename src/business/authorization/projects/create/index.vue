<template>
  <layout-content :header="$t('commons.button.create')" :back-to="{name:'ProjectAuthorizationList'}"
                  v-loading="loading">
    <el-row>
      <el-col :span="4"><br/></el-col>
      <el-col :span="10">
        <div class="grid-content bg-purple-light">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item :label="$t('commons.table.name')" prop="name">
              <el-input v-model="form.name"></el-input>
              <div><span class="input-help">{{$t('commons.validate.name_help')}}</span></div>
            </el-form-item>
            <el-form-item :label="$t('project.description')" prop="description">
              <el-input v-model="form.description"></el-input>
            </el-form-item>
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
import LayoutContent from "@/components/layout/LayoutContent"
import Rule from "@/utils/rules"
import {createProject} from "@/api/projects"

export default {
  name: "ProjectCreate",
  components: { LayoutContent },
  data () {
    return {
      form: {
        name: "",
        description: ""
      },
      rules: {
        name: [Rule.LengthRule,Rule.NameRule],
        description: [Rule.LengthRule]
      },
      loading: false
    }
  },
  methods: {
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }
        this.loading = true
        createProject({
          name: this.form.name,
          description: this.form.description,
        }).then(() => {
          this.loading = false
          this.$message(
            {
              type: "success",
              message: this.$t("commons.msg.create_success")
            }
          )
          this.$router.push({
            name: "ProjectAuthorizationList",
            params: { expendType: "PROJECT", expendName: this.form.name }
          })
        }).finally(() => {
          this.loading = false
        })
      })
    },
    onCancel () {
      this.$router.push({ name: "ProjectAuthorizationList" })
    }
  }
}
</script>

<style scoped>

</style>
