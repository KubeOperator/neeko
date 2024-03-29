<template>
  <layout-content :header="header" :back-to="{name:'TemplateList'}">
    <el-row>
      <el-col :span="4"><br/></el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple-light">
          <el-form ref="form" :model="form" :rules="rules" label-width="200px" label-position="left">
            <el-form-item :label="$t('commons.table.name')" prop="name">
              <el-input v-model="form.name" :disabled="mode === 'edit'"></el-input>
              <div><span class="input-help">{{ $t("commons.validate.name_help") }}</span></div>
            </el-form-item>
            <el-form-item :label="$t('commons.table.type')" prop="type">
              <el-select v-model="form.type" :disabled="mode === 'edit'">
                <el-option
                        v-for="(item,index) in types"
                        :key="index"
                        :label="item.name"
                        :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('automatic.template_config.template_name')" prop="config.name">
              <el-input v-model="form.config.name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('automatic.template_config.qcow2_path')" prop="config.qcow2_path"
                          v-if="form.type === 'OpenStack'">
              <el-input v-model="form.config.qcow2_path"></el-input>
            </el-form-item>
            <el-form-item :label="$t('automatic.template_config.vmdk_path')" prop="config.vmdk_path"
                          v-if="form.type === 'vSphere'">
              <el-input v-model="form.config.vmdk_path"></el-input>
            </el-form-item>
            <el-form-item :label="$t('automatic.template_config.ovf_path')" prop="config.ovf_path"
                          v-if="form.type === 'vSphere'">
              <el-input v-model="form.config.ovf_path"></el-input>
            </el-form-item>
            <el-form-item>
              <div style="float: right">
                <el-button @click="onCancel()">{{ $t("commons.button.cancel") }}</el-button>
                <el-button type="primary" @click="onSubmit('form')" v-preventReClick>
                  {{ $t("commons.button.submit") }}
                </el-button>
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
import {createTemplate, getTemplate, updateTemplate} from "@/api/template-config"

export default {
  name: "TemplateOperate",
  components: { LayoutContent },
  props: {
    name: String
  },
  data () {
    return {
      mode: "",
      types: [
        {
          name: "OpenStack",
          value: "OpenStack",
        },
        {
          name: "vSphere",
          value: "vSphere",
        }
      ],
      form: {
        config: {}
      },
      rules: {
        name: [Rule.LengthRule, Rule.NameRule],
        type: [Rule.RequiredRule],
        config: {
          name: [Rule.RequiredRule],
          qcow2_path: [Rule.RequiredRule],
          vmdk_path: [Rule.RequiredRule],
          ovf_path: [Rule.RequiredRule],
        }
      },
      header: this.$t("commons.button.create")
    }
  },
  methods: {
    onCancel () {
      this.$router.push({ path: "/automatic/templates" })
    },
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }
        this.loading = true
        if (this.mode === "edit") {
          updateTemplate(this.name, this.form).then(() => {
            this.$message({
              type: "success",
              message: this.$t("commons.msg.update_success")
            })
            this.$router.push({ name: "TemplateList" })
          }).finally(() => {
            this.loading = false
          })
        } else {
          createTemplate(this.form).then(() => {
            this.$message({
              type: "success",
              message: this.$t("commons.msg.create_success")
            })
            this.$router.push({ name: "TemplateList" })
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    getDetail () {
      this.loading = true
      getTemplate(this.name).then(res => {
        this.form = res
      }).finally(() => {
        this.loading = false
      })
    }
  },
  created () {
    this.mode = this.$route.query.mode
    if (this.mode === "edit") {
      this.getDetail()
      this.header = this.$t("commons.button.edit")
    }
  }
}
</script>

<style scoped>

</style>
