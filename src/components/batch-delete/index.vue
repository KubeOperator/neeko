<template>
  <el-form ref="delForm" :model="delForm" :rules="rules">
    <div style="font-weight: 500;"><span>{{ $t('commons.confirm_message.operator') }}</span></div>
    <div style="margin-top: 5px;"><span>{{ delInfo }}</span></div>
    <div style="margin-top: 20px;">
      <el-checkbox v-model="isForce">{{ $t('cluster.delete.is_force') }}</el-checkbox>
      <div style="margin-top: 5px"><span class="input-help">{{ $t('cluster.delete.force_delete') }}</span></div>
    </div>
    <div style="margin-top: 20px;font-weight: 500;"><span>{{ $t('commons.confirm_message.delete_help') }}</span></div>
    <el-form-item style="margin-top: 5px" prop="inputName">
      <el-input v-model="delForm.inputName" :placeholder="$t('cluster.delete.submit_delete_input', ['DELETE'])" clearable></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import Rule from "@/utils/rules"

export default {
  name: "BatchDelete",
  props: {
    deleteLists: Array,
  },
  data() {
    return {
      loading: false,
      delInfo: "",
      delForm: {
        inputName: "",
      },
      rules: {
        inputName: [Rule.RequiredRule],
      },
      isForce: false,
    }
  },
  methods: {
    submitDelete() {
      if (this.delForm.inputName !== "DELETE") {
        this.$message({
          type: "info",
          message: this.$t("commons.validate.input_error"),
        })
        return
      }
      this.$refs["delForm"].validate((valid) => {
        if (valid) {
          this.$emit("submitDelete", this.deleteLists, this.isForce)
        }
      })
    },
  },
  created() {
    this.delInfo = this.deleteLists.join(" , ")
  },
}
</script>