<template>
  <layout-content :header="$t('commons.button.edit')" :back-to="{name:'ProjectAuthorizationList'}">
    <el-row>
      <el-col :span="4"><br/></el-col>
      <el-col :span="10">
        <div class="grid-content bg-purple-light">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item :label="$t('commons.table.name')">
              <el-input v-model="form.name" disabled></el-input>
            </el-form-item>
            <el-form-item :label="$t('project.description')" prop="description">
              <el-input v-model="form.description"></el-input>
            </el-form-item>
            <el-form-item>
              <div style="float: right">
                <el-button @click="onCancel()">{{ $t("commons.button.cancel") }}</el-button>
                <el-button type="primary" @click="onSubmit()">{{ $t("commons.button.submit") }}</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="4"></el-col>
    </el-row>
  </layout-content>
</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent"
import {updateProject, getProject} from "@/api/projects"
import Rule from "@/utils/rules"

export default {
  name: "ProjectEdit",
  components: { LayoutContent },
  props: ["name"],
  data () {
    return {
      form: {
        name: "",
        description: ""
      },
      rules: {
        description: [Rule.LengthRule]
      }
    }
  },
  methods: {
    onCancel () {
      this.$router.push({ name: "ProjectAuthorizationList" })
    },
    onSubmit () {
      updateProject(this.name, {
        description: this.form.description
      }).then(() => {
          this.$message({
            type: "success",
            message: this.$t("commons.msg.save_success")
          })
          this.$router.push({ name: "ProjectAuthorizationList" })
        }
      )
    }
  },
  created () {
    getProject(this.name).then(data => {
      this.form.name = data.name
      this.form.description = data.description
    })
  }
}
</script>

<style scoped>

</style>
