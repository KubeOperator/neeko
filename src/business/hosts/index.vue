<template>
  <layout-content :header="$t('host.host')">
    <complex-table :data="data" :hiddenColums="true" ref="hostData" :row-key="getRowKeys" @selection-change="selectChange" :pagination-config="paginationConfig" @search="search" :selects.sync="hostSelections" v-loading="loading" :search-config="searchConfig">
      <template #header>
        <div>
          <el-button-group v-permission="['ADMIN']">
            <el-button size="small" @click="create()">{{ $t("commons.button.create") }}</el-button>
            <el-button size="small" @click="onImport()">{{ $t("commons.button.import") }}</el-button>
            <el-button size="small" @click="onGrant()">{{ $t("commons.button.authorize") }}</el-button>
            <el-button :disabled="isDeleteButtonDisable" size="small" @click="sync()">{{ $t("commons.button.sync") }}</el-button>
            <el-button :disabled="isDeleteButtonDisable" size="small" @click="onDelete()">
              {{ $t("commons.button.delete") }}
            </el-button>
          </el-button-group>
          <el-dropdown @command="handleCommand">
            <el-button size="small">
              {{ $t("host.batch") }}<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item style="width: 60px" command="port">{{ $t("host.port") }}</el-dropdown-item>
              <el-dropdown-item style="width: 60px" command="credential">{{ $t("host.credential") }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </template>
      <el-table-column type="selection" :reserve-selection="true" fix></el-table-column>
      <el-table-column sortable :label="$t('commons.table.name')" prop="name" show-overflow-tooltip min-width="120" fix>
        <template v-slot:default="{row}">
          <el-link v-if="row.status === 'Running'" style="font-size: 12px" type="info" @click="getDetailInfo(row)">{{ row.name }}</el-link>
          <span v-if="row.status !== 'Running'">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column sortable :label="$t('project.project')" v-if="isAdmin" show-overflow-tooltip min-width="120" prop="projectName" />
      <el-table-column sortable :label="$t('route.cluster')" show-overflow-tooltip min-width="100" prop="clusterName" />
      <el-table-column sortable :label="$t('host.ip')" min-width="120px" prop="ip">
        <template v-slot:default="{row}">
          <div v-if="row.flexIp === ''">
            <span>{{ row.ip }}</span>
          </div>
          <div v-else>
            <div><span>{{ row.ip }} {{ $t('host.private' )}}</span></div>
            <div><span>{{ row.flexIp }} {{ $t('host.public' )}}</span></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column sortable :label="$t('host.credential_name')" show-overflow-tooltip :show="false" min-width="100" prop="credentialName" />
      <el-table-column sortable :label="$t('host.config')" width="95px" prop="cpuCore">
        <template v-slot:default="{row}">
          <div>{{ row.cpuCore }} Core</div>
          <div>{{ row.memory }} {{ $t('host.mb') }}</div>
          <div v-if="row.gpuNum !== 0">GPU: {{ row.gpuNum }}</div>
        </template>
      </el-table-column>
      <el-table-column sortable prop="os" :label="$t('host.os')" show-overflow-tooltip min-width="120px">
        <template v-slot:default="{row}">
          <div style="margin-left: 20px">{{ row.architecture }}</div>
          <svg v-if="row.os === 'CentOS'" class="icon" aria-hidden="true">
            <use xlink:href="#iconziyuan"></use>
          </svg>
          <svg v-if="row.os === 'EulerOS'" class="icon" aria-hidden="true">
            <use xlink:href="#iconEulerOS"></use>
          </svg>
          <svg v-if="row.os === 'RedHat'" class="icon" aria-hidden="true">
            <use xlink:href="#iconred-hat"></use>
          </svg>
          <svg v-if="row.os === 'Ubuntu'" class="icon" aria-hidden="true">
            <use xlink:href="#iconubuntu"></use>
          </svg>
          <svg v-if="row.os === 'Kylin' || row.os === 'Kylin Linux Advanced Server'" class="icon" aria-hidden="true">
            <use xlink:href="#iconqilin"></use>
          </svg>
          <span> {{ row.os }} {{ row['osVersion'] }}</span>
        </template>
      </el-table-column>
      <el-table-column sortable prop="status" :label="$t('commons.table.status')" min-width="90px">
        <template v-slot:default="{row}">
          <ko-status :status="row.status" other="host" @detail="getErrorInfo(row)"></ko-status>
        </template>
      </el-table-column>
      <el-table-column sortable :label="$t('commons.table.create_time')" prop="createdAt" :show="false" width="150px">
        <template v-slot:default="{row}">
          {{ row.createdAt | datetimeFormat }}
        </template>
      </el-table-column>

      <fu-table-operations v-if="isAdmin" fixed="right" :buttons="buttons" :label="$t('commons.table.action')" fix />
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

    <el-dialog :title="$t('host.batch_' + operation + '_operation')" width="30%" :visible.sync="dialogBatchVisible">
      <ul :key="host.name" v-for="host of hostSelections">
        <li>{{ host.name }} ({{ host.ip }})</li>
      </ul>
      <el-input-number style="margin-left: 5%; width: 60%;" :max="65536" :min="0" v-if="operation === 'port'" v-model="port" clearable />
      <el-select style="margin-left: 5%; width: 60%;" v-else v-model="credentialID" clearable filterable>
        <el-option v-for="cre in credentialList" :key="cre.id" :value="cre.id" :label="cre.name" />
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogBatchVisible = false">{{ $t("commons.button.cancel") }}</el-button>
        <el-button type="primary" @click="submitBatchOperation()">{{ $t("commons.button.ok") }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('host.detail')" width="50%" :visible.sync="dialogDetailVisible">
      <div style="text-align: center;">
        <span>{{$t ('host.base_info')}}</span>
        <div align="center" style="margin-top: 15px">
          <table style="width: 90%" class="myTable">
            <tr>
              <td>IP</td>
              <td>{{currentHost.ip}}</td>
            </tr>
            <tr>
              <td>{{$t ('host.cpu')}}</td>
              <td>{{currentHost.cpuCore}}</td>
            </tr>
            <tr>
              <td>{{$t ('host.gpu')}}</td>
              <td>{{currentHost.gpuNum}}</td>
            </tr>
            <tr>
              <td>{{$t ('host.memory')}}</td>
              <td>{{currentHost.memory}}</td>
            </tr>
            <tr>
              <td>{{$t ('host.os')}}</td>
              <td>{{currentHost.os}}</td>
            </tr>
            <tr>
              <td>{{$t ('host.architecture')}}</td>
              <td>{{currentHost.architecture}}</td>
            </tr>
            <tr>
              <td>{{$t ('commons.table.create_time')}}</td>
              <td>{{ currentHost.createdAt | datetimeFormat}}</td>
            </tr>
          </table>
        </div>
        <br>
        <span>{{$t ('host.disk_size')}}</span>
        <div align="center" style="margin-top: 15px">
          <el-table :data="currentHost.volumes" border style="width: 90%">
            <el-table-column prop="name" :label="$t('commons.table.name')" />
            <el-table-column prop="size" :label="$t('host.disk_size')" />
          </el-table>
        </div>
        <div v-if="currentHost.hasGpu">
          <span>{{$t ('host.disk_size')}}</span>
          <div align="center" style="margin-top: 15px">
            <el-table :data="currentHost.hasGpu" border style="width: 90%">
              <el-table-column prop="gpuInfo" :label="$t('commons.table.name')" />
            </el-table>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDetailVisible = false">{{ $t("commons.button.cancel") }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('host.err_title')" width="30%" :visible.sync="dialogErrorVisible">
      <span>{{ errMsg | errorFormat }}</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogErrorVisible = false">{{ $t("commons.button.cancel") }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('commons.button.batch_import')" width="30%" :visible.sync="dialogImportVisible">
      <el-form>
        <el-button type="text" @click="download()">{{ $t("host.template_download") }}</el-button>
        <el-form-item>
          <el-row type="flex" justify="center">
            <el-upload ref="my-upload" :on-change="onUploadChange" action="" :auto-upload="false" class="upload-demo" drag>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">{{$t('commons.form.file_upload_help')}}</div>
              <div class="el-upload__tip" slot="tip">
                <svg class="icon" aria-hidden="true">
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
        <el-button type="primary" :disabled="isUploadDisable" @click="onUploadFile()">{{ $t("commons.button.ok") }}</el-button>
      </div>
    </el-dialog>
  </layout-content>
</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent"
import { deleteHost, searchHosts, syncHosts, importHosts, batchHosts } from "@/api/hosts"
import ComplexTable from "@/components/complex-table"
import KoStatus from "@/components/ko-status"
import { listRegistryAll } from "@/api/system-setting"
import { checkPermission } from "@/utils/permisstion"
import { listCredentialAll } from "@/api/credentials"
import { mapGetters } from "vuex";

export default {
  name: "HostList",
  components: { KoStatus, ComplexTable, LayoutContent },
  computed: {
    ...mapGetters(["language"]),
  },
  watch: {
    language(value) {
      if (value) {
        localStorage.removeItem("FU-T-host_columns" );
        window.location.reload()
      }
    },
  },
  data() {
    return {
      buttons: [
        {
          label: this.$t("commons.button.edit"),
          icon: "el-icon-edit",
          click: (row) => {
            this.$router.push({ name: "HostEdit", params: { name: row.name } })
          },
        },
        {
          label: this.$t("commons.button.sync"),
          icon: "el-icon-refresh",
          click: (row) => {
            this.hostSelections = [row]
            this.sync()
          },
          disabled: this.isDeleteButtonDisable,
        },
        {
          label: this.$t("commons.button.delete"),
          icon: "el-icon-delete",
          click: (row) => {
            this.onDelete(row.name)
          },
          disabled: (row) => {
            return row.status !== "Running" && row.status !== "Failed"
          },
        },
      ],
      paginationConfig: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      data: [],
      dialogErrorVisible: false,
      dialogDetailVisible: false,
      errMsg: "",
      currentHost: {},
      hostSelections: [],
      syncHostList: [],
      dialogSyncVisible: false,
      dialogImportVisible: false,
      isUploadDisable: true,
      isDeleteButtonDisable: true,
      file: {},
      searchConfig: {
        quickPlaceholder: this.$t("commons.search.quickSearch"),
        components: [
          { field: "name", label: this.$t("commons.table.name"), component: "FuComplexInput", defaultOperator: "eq" },
          { field: "ip", label: this.$t("host.ip"), component: "FuComplexInput", defaultOperator: "eq" },
          { field: "created_at", label: this.$t("commons.table.create_time"), component: "FuComplexDate", valueFormat: "yyyy-MM-dd" },
        ],
      },
      loading: false,
      isAdmin: checkPermission("ADMIN"),
      timer: null,
      dialogBatchVisible: false,
      operation: "port",
      port: 22,
      credentialID: "",
      credentialList: [],
    }
  },
  methods: {
    getRowKeys(row) {
      return row.name
    },
    create() {
      listRegistryAll().then((data) => {
        if (data.items !== null) {
          this.$router.push({ name: "HostCreate" })
        } else {
          this.$message({ type: "info", message: this.$t("cluster.creation.repo_err") })
        }
      })
    },
    sync() {
      this.dialogSyncVisible = true
    },
    submitSync() {
      this.syncHostList = []
      this.hostSelections.forEach((item) => {
        this.syncHostList.push({
          hostName: item.name,
          hostStatus: item.status,
        })
      })
      syncHosts(this.syncHostList)
        .then(() => {
          this.search()
          this.$message({ type: "success", message: this.$t("host.start_host_sync") })
          this.dialogSyncVisible = false
          this.hostSelections = []
        })
        .catch(() => {
          this.hostSelections = []
        })
    },
    onUploadChange(file) {
      this.isUploadDisable = false
      this.file = file
    },
    onImport() {
      listRegistryAll().then((data) => {
        if (data.items !== null) {
          this.dialogImportVisible = true
          this.isUploadDisable = true
          if (this.$refs["my-upload"]) {
            this.$refs["my-upload"].clearFiles()
          }
        } else {
          this.$message({ type: "info", message: this.$t("cluster.creation.repo_err") })
        }
      })
    },
    download() {
      window.open("/api/v1/hosts/template")
    },
    getErrorInfo(row) {
      this.dialogErrorVisible = true
      this.errMsg = row.message
    },
    getDetailInfo(row) {
      this.dialogDetailVisible = true
      this.currentHost = row
    },
    handleCommand(operation) {
      this.operation = operation
      if (this.hostSelections.length === 0) {
        this.$message({ type: "error", message: this.$t("host.batch_length_error") })
        return
      }
      this.dialogBatchVisible = true
    },
    submitBatchOperation() {
      if (this.operation === "port") {
        for (const host of this.hostSelections) {
          host.port = Number(this.port)
        }
      } else {
        for (const credential of this.hostSelections) {
          credential.credentialId = this.credentialID
        }
      }
      let data = {
        operation: this.operation,
        items: this.hostSelections,
      }
      batchHosts(data).then(() => {
        this.$message({ type: "success", message: this.$t("commons.msg.save_success") })
        this.search()
        this.dialogBatchVisible = false
      })
    },
    onUploadFile() {
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
          this.search()
          this.dialogImportVisible = false
        },
        () => {
          this.search()
          this.dialogImportVisible = false
        }
      )
    },
    selectChange() {
      let isOk = true
      if (this.hostSelections.length === 0) {
        this.isDeleteButtonDisable = true
        return
      }
      for (const item of this.hostSelections) {
        if (item.status !== "Running" && item.status !== "Failed") {
          isOk = false
          break
        }
      }
      this.isDeleteButtonDisable = !isOk
    },
    onDelete(name) {
      this.$confirm(this.$t("commons.confirm_message.delete"), this.$t("commons.message_box.prompt"), {
        confirmButtonText: this.$t("commons.button.confirm"),
        cancelButtonText: this.$t("commons.button.cancel"),
        type: "warning",
      }).then(() => {
        const ps = []
        if (name) {
          ps.push(deleteHost(name))
        } else {
          for (const item of this.hostSelections) {
            ps.push(deleteHost(item.name))
          }
        }
        Promise.all(ps)
          .then(() => {
            this.search()
            this.$message({
              type: "success",
              message: this.$t("commons.msg.delete_success"),
            })
            this.hostSelections = []
          })
          .catch(() => {
            this.search()
            this.hostSelections = []
          })
      })
    },
    loadCredentials() {
      listCredentialAll().then((data) => {
        this.credentialList = data.items
      })
    },
    onGrant() {
      this.$router.push({ name: "ProjectAuthorizationList" })
    },
    search(condition) {
      this.loading = true
      this.$refs.hostData?.clearSelection()
      const { currentPage, pageSize } = this.paginationConfig
      searchHosts(currentPage, pageSize, condition)
        .then((data) => {
          this.loading = false
          this.data = data.items || []
          this.paginationConfig.total = data.total
        })
        .catch(() => {
          this.loading = false
        })
    },
    polling() {
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
          const { currentPage, pageSize } = this.paginationConfig
          searchHosts(currentPage, pageSize).then((data) => {
            this.data = data.items || []
            this.paginationConfig.total = data.total
          })
        }
      }, 10000)
    },
  },
  mounted() {
    this.search()
    this.polling()
    this.loadCredentials()
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  },
}
</script>

<style scoped>
.hDivider {
  margin: 8px 0;
}
</style>
