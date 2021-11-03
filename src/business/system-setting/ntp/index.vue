<template>
  <div>
    <complex-table :data="data" :pagination-config="paginationConfig" @search="search" :selects.sync="selections" v-loading="loading">
      <template #header>
        <el-button-group v-permission="['ADMIN']">
          <el-button size="small" @click="dialogCreateVisible = true">{{ $t("commons.button.create") }}</el-button>
          <el-button :disabled="selections.length===0" size="small" @click="onDelete()">
            {{ $t("commons.button.delete") }}
          </el-button>
        </el-button-group>
      </template>
      <el-table-column type="selection" fix></el-table-column>
      <el-table-column :label="$t('commons.table.name')" prop="name" fix />
      <el-table-column :label="$t('commons.table.name')" prop="address" fix />
      <el-table-column :label="$t('commons.table.name')" prop="status">
        <template v-slot:default="{row}">
          <div v-if="row.status ==='enable'">
            <span class="iconfont iconduihao" style="color: #32B350" />
            {{ $t('cluster.creation.enable') }}
          </div>
          <div v-if="row.status === 'disable'">
            <span class="iconfont iconerror" style="color: #FA4147" />
            {{ $t('cluster.creation.disable') }}
          </div>
        </template>
      </el-table-column>
      <el-table-column sortable :label="$t('commons.table.create_time')" prop="createdAt" :show="false" width="150px">
        <template v-slot:default="{row}">
          {{ row.createdAt | datetimeFormat }}
        </template>
      </el-table-column>

      <fu-table-operations fixed="right" :buttons="buttons" :label="$t('commons.table.action')" fix />
    </complex-table>

    <el-dialog :title="$t('commons.button.create')" :close-on-click-modal="false" width="30%" :visible.sync="dialogCreateVisible">
      <el-form label-position='left' ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item :label="$t('commons.table.name')" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('setting.address')" prop="address">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item :label="$t('commons.table.status')">
          <template>
            <el-switch v-model="form.status" active-value="enable" inactive-value="disable" :active-text="$t('cluster.creation.enable')" :inactive-text="$t('cluster.creation.disable')" />
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreateVisible = false">{{ $t("commons.button.cancel") }}</el-button>
        <el-button type="primary" @click="onSubmit()">{{ $t("commons.button.ok") }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('commons.button.create')" :close-on-click-modal="false" width="30%" :visible.sync="dialogEditVisible">
      <el-form label-position='left' ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item :label="$t('commons.table.name')" prop="name">
          <el-input v-model="form.name" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('setting.address')" prop="address">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item :label="$t('commons.table.status')">
          <template>
            <el-switch v-model="form.status" active-value="enable" inactive-value="disable" :active-text="$t('cluster.creation.enable')" :inactive-text="$t('cluster.creation.disable')" />
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false">{{ $t("commons.button.cancel") }}</el-button>
        <el-button type="primary" @click="onSubmitEdit()">{{ $t("commons.button.ok") }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { searchNtp, createNtp, deleteNtp, updateNtp } from "@/api/system-setting"
import ComplexTable from "@/components/complex-table"
import Rule from "@/utils/rules"

export default {
  name: "NTP",
  components: { ComplexTable },
  data() {
    return {
      buttons: [
        {
          label: this.$t("commons.button.edit"),
          icon: "el-icon-edit",
          click: (row) => {
            this.onEdit(row)
          },
        },
        {
          label: this.$t("commons.button.delete"),
          icon: "el-icon-delete",
          click: (row) => {
            this.onDelete(row.name)
          },
        },
      ],
      dialogCreateVisible: false,
      dialogEditVisible: false,
      form: {
        name: "",
        address: "",
        status: "enable",
      },
      rules: {
        name: [Rule.RequiredRule],
        address: [Rule.RequiredRule],
      },
      paginationConfig: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      selections: [],
      data: [],
      loading: false,
    }
  },
  methods: {
    onSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          createNtp(this.form).then(() => {
            this.$message({ type: "success", message: this.$t("commons.msg.create_success") })
            this.dialogCreateVisible = false
            this.resetForm("form")
            this.search()
          })
        } else {
          return false
        }
      })
    },
    onSubmitEdit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          updateNtp(this.form.name, this.form).then(() => {
            this.$message({ type: "success", message: this.$t("commons.msg.update_success") })
            this.dialogEditVisible = false
            this.resetForm("form")
            this.search()
          })
        } else {
          return false
        }
      })
    },
    search() {
      this.loading = true
      const { currentPage, pageSize } = this.paginationConfig
      searchNtp(currentPage, pageSize)
        .then((data) => {
          this.loading = false
          this.data = data.items
          this.paginationConfig.total = data.total
        })
        .catch(() => {
          this.loading = false
        })
    },
    onEdit(row) {
      this.form = row
      this.dialogEditVisible = true
    },
    onDelete(name) {
      this.$confirm(this.$t("commons.confirm_message.delete"), this.$t("commons.message_box.prompt"), {
        confirmButtonText: this.$t("commons.button.confirm"),
        cancelButtonText: this.$t("commons.button.cancel"),
        type: "warning",
      }).then(() => {
        const ps = []
        if (name) {
          ps.push(deleteNtp(name))
        } else {
          for (const item of this.selections) {
            ps.push(deleteNtp(item.name))
          }
        }
        Promise.all(ps)
          .then(() => {
            this.search()
            this.$message({
              type: "success",
              message: this.$t("commons.msg.delete_success"),
            })
            this.selections = []
          })
          .catch(() => {
            this.search()
            this.selections = []
          })
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
  },
  created() {
    this.search()
  },
}
</script>

<style scoped>
</style>
