<template>
  <el-dialog :title="$t('commons.dialog.delete')" width="30%" :before-close="onCancel"  :visible.sync="dialogDeleteVisible">
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
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">{{$t('commons.button.cancel')}}</el-button>
      <el-button :disabled="delForm.inputName !== 'DELETE'" type="primary" @click="onSubmitDelete">{{$t('commons.button.submit')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Rule from "@/utils/rules"

export default {
  name: "BatchDelete",
  props: {
    deleteLists: Array,
    visible: Boolean,
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
      dialogDeleteVisible: false,
      isForce: false,
    }
  },
  methods: {
    onSubmitDelete() {
      this.$refs["delForm"].validate((valid) => {
        if (valid) {
          this.$emit("submitDelete", this.deleteLists, this.isForce)
        }
      })
    },
    onCancel() {
      this.dialogDeleteVisible = false
      this.$emit("changeVisble", this.dialogDeleteVisible)
    },
  },
  created() {
    this.dialogDeleteVisible = true
    this.delInfo = this.deleteLists.join(" , ")
  },
}
</script>