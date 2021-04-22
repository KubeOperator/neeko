<template>
  <layout-content :header="$t('host.host')">
    <complex-table :data="data" :pagination-config="paginationConfig" @search="search" :selects.sync="hostSelections" v-loading="loading"
                   :search-config="searchConfig">
      <template #header>
        <el-button-group v-permission="['ADMIN']">
          <el-button size="small" @click="create()">{{ $t("commons.button.create") }}</el-button>
          <el-button :disabled="hostSelections.length<1" size="small" @click="sync()">{{ $t("commons.button.sync") }}
          </el-button>
          <el-button size="small" @click="dialogImportVisible = true">{{ $t("commons.button.batch_import") }}
          </el-button>
          <el-button :disabled="hostSelections.length<1" size="small" type="danger" @click="bactchDelete()">
            {{ $t("commons.button.delete") }}
          </el-button>
        </el-button-group>
      </template>
      <el-table-column type="selection" fix></el-table-column>
      <el-table-column :label="$t('commons.table.name')" min-width="200" fix>
        <template v-slot:default="{row}">
          <el-row>
            <el-col :span="6">
              <!--              <font-awesome-icon icon="server" size="3x" />-->
              <svg class="icon" aria-hidden="true" style="font-size: 28px">
                <use xlink:href="#iconzhuji1"></use>
              </svg>
            </el-col>
            <el-col :span="18">
              {{ row.name }}<br/>
              {{ row.ip }}
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="CPU" min-width="50" prop="cpuCore"/>
      <el-table-column label="GPU" min-width="50" prop="gpuNum"/>
      <el-table-column :label="$t('host.memory')" min-width="100" prop="memory"/>
      <el-table-column :label="$t('host.os')" min-width="100">
        <template v-slot:default="{row}">
          {{ row.os }} {{ row.osVersion }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('host.architecture')" min-width="100" prop="architecture"/>
      <el-table-column :label="$t('commons.table.status')" min-width="100">
        <template v-slot:default="{row}">
          <el-tag v-if="row.status === 'Running'" type="success" size="small">{{ $t("commons.status.running") }}
          </el-tag>
          <el-tag v-if="row.status === 'Failed'" type="danger" size="small">{{ $t("commons.status.failed") }}</el-tag>
          <el-tag v-if="row.status === 'Initializing'" type="info" size="small">{{ $t("commons.status.initializing") }}
            <font-awesome-icon icon="spinner" pulse/>
          </el-tag>
          <el-tag v-if="row.status === 'Synchronizing'" type="info" size="small">
            {{ $t("commons.status.synchronizing") }}
            <font-awesome-icon icon="spinner" pulse/>
          </el-tag>
          <el-tag v-if="row.status === 'Error'" type="danger" size="small">{{ $t("commons.status.error") }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('commons.table.create_time')">
        <template v-slot:default="{row}">
          {{ row.createdAt | datetimeFormat }}
        </template>
      </el-table-column>

      <fu-table-operations :buttons="buttons" :label="$t('commons.table.action')" fix/>
    </complex-table>

    <el-dialog :title="$t('commons.button.sync')" width="30%" :visible.sync="dialogSyncVisible">
      <span>{{ $t("host.ensure_host_sync") }}</span>
      <ul style="margin-left: 5%;" :key="host.name" v-for="host of hostSelections">
        <li>{{ host.name }} ({{ host.ip }})</li>
      </ul>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSyncVisible = false">{{ $t("commons.button.cancel") }}</el-button>
        <el-button type="primary" @click="submitSync()">{{ $t("commons.button.ok") }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('commons.button.batch_import')" width="30%" :visible.sync="dialogImportVisible">
      <el-form>
        <el-button type="text" @click="download()">{{ $t("host.template_download") }}</el-button>
        <el-form-item>
          <el-row type="flex" justify="center">
            <el-upload :on-change="onUploadChange" action="" :auto-upload="false" class="upload-demo" drag>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">{{$t('commons.form.file_upload_help')}}</div>
              <div class="el-upload__tip" slot="tip">
                <svg class="icon" aria-hidden="true" style="font-size: 28px">
                  <use xlink:href="#icontishi11"></use>
                </svg>
                {{ $t("cluster.detail.backup.local_recover_tips") }}
              </div>
            </el-upload>
          </el-row>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogImportVisible = false">{{ $t("commons.button.cancel") }}</el-button>
        <el-button type="primary" @click="onUploadFile()">{{ $t("commons.button.ok") }}</el-button>
      </div>
    </el-dialog>
  </layout-content>
</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent"
import {deleteHost, searchHosts, syncHosts, importHosts} from "@/api/hosts"
import ComplexTable from "@/components/complex-table"

export default {
  name: "HostList",
  components: { ComplexTable, LayoutContent },
  data () {
    return {
      buttons: [
        {
          label: this.$t("commons.button.delete"),
          icon: "el-icon-delete",
          type: "danger",
          click: (row) => {
            this.delete(row.name)
          },
        },
      ],
      paginationConfig: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      data: [],
      hostSelections: [],
      syncHostList: [],
      dialogSyncVisible: false,
      dialogImportVisible: false,
      file: {},
      searchConfig: {
        quickPlaceholder: this.$t("commons.search.quickSearch"),
        components: [
          { field: "name", label: this.$t("commons.table.name"), component: "FuComplexInput", defaultOperator: "eq" },
          { field: "ip", label: this.$t("host.ip"), component: "FuComplexInput", defaultOperator: "eq" },
          { field: "create_at", label: this.$t("commons.table.create_time"), component: "FuComplexDateTime" },
        ]
      },
      loading: false
    }
  },
  methods: {
    create () {
      this.$router.push({ name: "HostCreate" })
    },
    sync () {
      this.dialogSyncVisible = true
    },
    submitSync () {
      this.syncHostList = []
      this.hostSelections.forEach((item) => {
        this.syncHostList.push({
          hostName: item.name,
          hostStatus: item.status,
        })
      })
      syncHosts(this.syncHostList).then(() => {
        this.search()
        this.$message({ type: "success", message: this.$t("host.start_host_sync") })
        this.dialogSyncVisible = false
      })
    },
    onUploadChange (file) {
      this.file = file
    },
    download () {
      window.open(process.env.VUE_APP_BASE_API + "/hosts/template")
    },
    onUploadFile () {
      const startIndex = this.file.name.lastIndexOf(".")
      if (startIndex !== -1) {
        const fileType = this.file.name.substring(startIndex + 1, this.file.name.length).toLowerCase()
        if (fileType !== "xlsx") {
          this.$message({ type: "error", message: this.$t("host.not_support_format") })
          this.dialogImportVisible = false
          return
        }
      } else {
        this.$message({ type: "error", message: this.$t("host.not_support_format") })
        this.dialogImportVisible = false
        return
      }
      const formData = new FormData()
      formData.append("file", this.file.raw)
      importHosts(formData).then(
        () => {
          this.$message({ type: "success", message: this.$t("commons.msg.import_success") })
          this.dialogImportVisible = false
        },
        (error) => {
          this.$message({ type: "error", message: error })
          this.dialogImportVisible = false
        }
      )
    },
    delete (name) {
      this.$confirm(this.$t("commons.confirm_message.delete"), this.$t("commons.message_box.prompt"), {
        confirmButtonText: this.$t("commons.button.confirm"),
        cancelButtonText: this.$t("commons.button.cancel"),
        type: "warning",
      }).then(() => {
        if (name) {
          deleteHost(name).then(() => {
            this.search()
            this.$message({
              type: "success",
              message: `${name}${this.$t("commons.msg.delete_success")}!`,
            })
          })
        }
      })
    },
    bactchDelete () {
      const ps = []
      for (const item of this.hostSelections) {
        ps.push(deleteHost(item.name))
      }
      Promise.all(ps).then(() => {
        this.search()
        this.$message({
          type: "success",
          message: this.$t("commons.msg.delete_success"),
        })
      })
    },
    search (condition) {
      this.loading = true
      const { currentPage, pageSize } = this.paginationConfig
      searchHosts(currentPage, pageSize, condition).then((data) => {
        this.loading = false
        this.data = data.items
        this.paginationConfig.total = data.total
      }).finally(() =>{
        this.loading = false
      })
    },
    polling () {
      this.timer = setInterval(() => {
        let flag = false
        const needPolling = ["Initializing", "Terminating", "Synchronizing", "Waiting", "Creating"]
        for (const item of this.data) {
          if (needPolling.indexOf(item.status) !== -1) {
            flag = true
            break
          }
        }
        if (flag) {
          this.search()
        }
      }, 10000)
    },
  },
  created () {
    this.search()
    this.polling()
  },
  destroyed () {
    clearInterval(this.timer)
  },
}
</script>

<style scoped>
</style>
