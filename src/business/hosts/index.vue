<template>
  <layout-content :header="$t('host.host')">
    <complex-table :data="data" :pagination-config="paginationConfig" @search="search" :selects.sync="hostSelections" v-loading="loading" :search-config="searchConfig">
      <template #header>
        <el-button-group v-permission="['ADMIN']">
          <el-button size="small" @click="create()">{{ $t("commons.button.create") }}</el-button>
          <el-button :disabled="hostSelections.length<1" size="small" @click="sync()">{{ $t("commons.button.sync") }}</el-button>
          <el-button size="small" @click="dialogImportVisible = true">{{ $t("commons.button.batch_import") }}</el-button>
          <el-button :disabled="hostSelections.length<1" size="small" type="danger" @click="onDelete()">
            {{ $t("commons.button.delete") }}
          </el-button>
        </el-button-group>
      </template>
      <el-table-column type="selection" fix></el-table-column>
      <el-table-column :label="$t('commons.table.name')" show-overflow-tooltip min-width="120" fix>
        <template v-slot:default="{row}">
          <el-button v-if="row.status === 'Running'" type="text" @click="getDetailInfo(row)">{{ row.name }}</el-button>
          <span v-if="row.status !== 'Running'">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('route.project')" show-overflow-tooltip min-width="120" prop="projectName" />
      <el-table-column :label="$t('route.cluster')" show-overflow-tooltip min-width="120" prop="clusterName" />
      <el-table-column label="IP" width="120px" prop="ip" />
      <el-table-column :label="$t('host.cpu')" width="70px" prop="cpuCore" />
      <el-table-column :label="$t('host.gpu')" :show="false" width="70px" prop="gpuNum" />
      <el-table-column :label="$t('host.memory')" width="80px" prop="memory" />
      <el-table-column :label="$t('host.os')" min-width="120">
        <template v-slot:default="{row}">
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
          {{ row.os }} {{ row['osVersion'] }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('host.architecture')" width="80px" prop="architecture" />
      <el-table-column :label="$t('commons.table.status')" min-width="80">
        <template v-slot:default="{row}">
          <el-button v-if="row.status === 'Failed'" size="mini" round @click="getErrorInfo(row)" plain type="danger">
            {{ $t("commons.status.failed") }}
          </el-button>

          <el-tag v-if="row.status === 'Running'" type="success">{{ $t("commons.status.running") }}</el-tag>

          <span v-if="row.status === 'Terminating'">
            <i class="el-icon-loading" />{{ $t("commons.status.terminating") }}
          </span>
          <span v-if="row.status === 'Initializing'">
            <i class="el-icon-loading" />{{ $t("commons.status.initializing") }}
          </span>
          <span v-if="row.status === 'Synchronizing'">
            <i class="el-icon-loading" />{{ $t("commons.status.synchronizing") }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('commons.table.create_time')" :show="false" width="150px">
        <template v-slot:default="{row}">
          {{ row.createdAt | datetimeFormat }}
        </template>
      </el-table-column>

      <fu-table-operations fixed="right" :buttons="buttons" :label="$t('commons.table.action')" fix />
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

    <el-dialog :title="$t('host.detail')" width="50%" :visible.sync="dialogDetailVisible">
      <div style="margin: 10px 0">{{$t ('host.base_info')}}</div>
      <el-divider content-position="left" class="hDivider" />
      <el-row type="flex" justify="left">
        <el-col :span="8">
          <ul>{{$t ('host.cpu')}}</ul>
          <ul>{{$t ('host.memory')}}</ul>
          <ul>{{$t ('host.os')}}</ul>
        </el-col>
        <el-col :span="8">
          <ul>{{currentHost['cpuCore']}}</ul>
          <ul>{{currentHost['memory']}}</ul>
          <ul>
            <svg v-if="currentHost['os'] === 'CentOS'" class="icon" aria-hidden="true">
              <use xlink:href="#iconziyuan"></use>
            </svg>
            <svg v-if="currentHost['os'] === 'EulerOS'" class="icon" aria-hidden="true">
              <use xlink:href="#iconEulerOS"></use>
            </svg>
            <svg v-if="currentHost['os'] === 'RedHat'" class="icon" aria-hidden="true">
              <use xlink:href="#iconred-hat"></use>
            </svg>
            <svg v-if="currentHost['os'] === 'Ubuntu'" class="icon" aria-hidden="true">
              <use xlink:href="#iconubuntu"></use>
            </svg>
            <!--            <svg class="icon" aria-hidden="true" >-->
            <!--              <use xlink:href="#iconziyuan"></use>-->
            <!--            </svg>-->
            {{currentHost['os']}} {{currentHost['osVersion']}}
          </ul>
        </el-col>
      </el-row>
      <div style="margin: 10px 0">{{$t ('host.disk_size')}}</div>
      <el-divider content-position="left" class="hDivider" />
      <table style="width: 90%" class="myTable">
        <thead>
          <tr>
            <th>{{$t('commons.table.name')}}</th>
            <th>{{$t('host.disk_size')}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="vo in currentHost.volumes" :key="vo.name">
            <td>{{vo.name}}</td>
            <td>{{vo.size}}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="currentHost.hasGpu">
        <el-divider content-position="left">{{$t ('host.gpu_info')}}</el-divider>
        <table style="width: 90%" class="myTable">
          <thead>
            <tr>
              <th>{{$t('commons.table.name')}}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{host.gpuInfo}}</td>
            </tr>
          </tbody>
        </table>
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
            <el-upload :on-change="onUploadChange" action="" :auto-upload="false" class="upload-demo" drag>
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
        <el-button type="primary" @click="onUploadFile()">{{ $t("commons.button.ok") }}</el-button>
      </div>
    </el-dialog>
  </layout-content>
</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent"
import { deleteHost, searchHosts, syncHosts, importHosts } from "@/api/hosts"
import ComplexTable from "@/components/complex-table"

export default {
  name: "HostList",
  components: { ComplexTable, LayoutContent },
  data() {
    return {
      buttons: [
        {
          label: this.$t("commons.button.delete"),
          icon: "el-icon-delete",
          type: "danger",
          click: (row) => {
            this.onDelete(row)
          },
          disabled: (row) => {
            return row.status !== "Running" && row.status.status !== "Failed"
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
      file: {},
      searchConfig: {
        quickPlaceholder: this.$t("commons.search.quickSearch"),
        components: [
          { field: "name", label: this.$t("commons.table.name"), component: "FuComplexInput", defaultOperator: "eq" },
          { field: "ip", label: this.$t("host.ip"), component: "FuComplexInput", defaultOperator: "eq" },
          { field: "create_at", label: this.$t("commons.table.create_time"), component: "FuComplexDateTime" },
        ],
      },
      loading: false,
    }
  },
  methods: {
    create() {
      this.$router.push({ name: "HostCreate" })
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
      syncHosts(this.syncHostList).then(() => {
        this.search()
        this.$message({ type: "success", message: this.$t("host.start_host_sync") })
        this.dialogSyncVisible = false
      })
    },
    onUploadChange(file) {
      this.file = file
    },
    download() {
      window.open(process.env.VUE_APP_BASE_API + "/hosts/template")
    },
    getErrorInfo(row) {
      this.dialogErrorVisible = true
      this.errMsg = row.message
    },
    getDetailInfo(row) {
      this.dialogDetailVisible = true
      this.currentHost = row
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
          this.dialogImportVisible = false
        },
        (error) => {
          this.$message({ type: "error", message: error })
          this.dialogImportVisible = false
        }
      )
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
          })
          .catch(() => {
            this.search()
          })
      })
    },
    search(condition) {
      this.loading = true
      const { currentPage, pageSize } = this.paginationConfig
      searchHosts(currentPage, pageSize, condition)
        .then((data) => {
          this.loading = false
          this.data = data.items
          this.paginationConfig.total = data.total
        })
        .finally(() => {
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
          this.search()
        }
      }, 10000)
    },
  },
  created() {
    this.search()
    this.polling()
  },
  destroyed() {
    clearInterval(this.timer)
  },
}
</script>

<style scoped>
.hDivider {
  margin: 8px 0;
}
</style>
