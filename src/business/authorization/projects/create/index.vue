<template>
  <layout-content :header="$t('commons.button.create')" :back-to="{name:'ProjectAuthorizationList'}">
    <el-row>
      <el-col :span="4"><br/></el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple-light">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item :label="$t('commons.table.name')" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('project.description')" prop="description">
              <el-input v-model="form.description"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="onCancel()">{{ $t("commons.button.cancel") }}</el-button>
              <el-button type="primary" @click="onSubmit('form')">{{ $t("commons.button.save") }}</el-button>
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
        name: [Rule.NameRule]
      }
    }
  },
  methods: {
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }
        createProject({
          name: this.form.name,
          description: this.form.description,
        }).then(() => {
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