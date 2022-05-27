<template>
  <div>
    <template>
      <el-button-group>
        <el-button size="small" :disabled="submitLoading" @click="dialogCreateVisible=true">
          {{ $t('commons.button.create') }}
        </el-button>
      </el-button-group>
    </template>
    <complex-table style="margin-top: 20px" v-loading="loading" :data="data" @search="search"
                   :pagination-config="paginationConfig">
      <el-table-column label="ID" min-width="150" prop="id" fix>
        <template v-slot:default="{row}">
          <el-link :disabled="!(row.status==='Success')" type="info" @click="cisDetail(row.id)">{{ row.id }}</el-link>
        </template>
      </el-table-column>

      <el-table-column label="PASS" min-width="36" prop="totalPass" fix>
        <template v-slot:default="{row}">
          <el-tag style="cursor: pointer" effect="plain" type="success" @click="cisDetail(row.id,'PASS')">
            {{ row.totalPass }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="INFO" min-width="36" prop="totalInfo" fix>

        <template v-slot:default="{row}">
          <el-tag style="cursor: pointer" effect="plain" type="info" @click="cisDetail(row.id,'INFO')">{{
              row.totalInfo
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="WARN" min-width="36" prop="totalWarn" fix>

        <template v-slot:default="{row}">
          <el-tag style="cursor: pointer" effect="plain" type="warning" @click="cisDetail(row.id,'WARN')">
            {{ row.totalWarn }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="FAIL" min-width="36" prop="totalFail" fix>

        <template v-slot:default="{row}">
          <el-tag style="cursor: pointer" effect="plain" type="danger" @click="cisDetail(row.id,'FAIL')">
            {{ row.totalFail }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('cluster.detail.security.start_time')" min-width="100" prop="startTime" fix>
        <template v-slot:default="{row}">
          {{ row.startTime | datetimeFormat }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('cluster.detail.security.end_time')" min-width="100" prop="endTime" fix>
        <template v-slot:default="{row}">
          <span v-if="row.status !=='Running'">{{ row.endTime | datetimeFormat }}</span>
          <span v-if="row.status ==='Running'">-</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('commons.table.status')" min-width="100" prop="status" fix>
        <template v-slot:default="{row}">
          <span style="margin: 12px">{{ row.status }}
            <i v-if="row.status === 'Running'" class="el-icon-loading"/>
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('commons.table.create_time')" prop="createdAt">

        <template v-slot:default="{row}">
          {{ row.createdAt | datetimeFormat }}
        </template>
      </el-table-column>

      <fu-table-operations :buttons="buttons" :label="$t('commons.table.action')" fix/>
    </complex-table>

    <el-dialog :title="$t('cluster.detail.security.create_task')" width="30%" :visible.sync="dialogCreateVisible">
      <el-form label-position='left' :model="createForm" ref="createForm" label-width="110px">
        <el-form-item :label="$t('cluster.scan_policy')">
          <el-select style="width: 80%" v-model="createForm.policy" :placeholder="$t('commons.validate.select')">
            <el-option
              v-for="item in policyOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="dialogCreateVisible = false">{{ $t('commons.button.cancel') }}</el-button>
      <el-button type="primary" @click="cisCreate">{{ $t('commons.button.submit') }}</el-button>
      </span>
    </el-dialog>


    <el-dialog :title="$t('cluster.detail.security.cis_result')" width="85%" :visible.sync="dialogDetailVisible">
      <el-row style="height: 500px">

        <el-col :span="8" style="padding: 1% 2%;bottom: 0">
          <table style="border-collapse:separate; border-spacing:0px 10px;margin-left: 8px;margin-bottom: 20px">
            <tr>
              <th>{{ $t('cluster.cluster') + $t('cluster.creation.name') }}:</th>
              <td style="padding-left: 20px">{{ taskInfo.clusterName }}</td>
            </tr>
            <tr>
              <th>{{ $t('cluster.cluster') + $t('cluster.creation.version') }}:</th>
              <td style="padding-left: 20px">{{ taskInfo.clusterVersion }}</td>
            </tr>
            <tr>
              <th>{{ $t('cluster.scan_policy') }}:</th>
              <td style="padding-left: 20px">{{ taskInfo.policy }}</td>
            </tr>
            <tr>
              <th>{{ $t('commons.table.create_time') }}:</th>
              <td style="padding-left: 20px">{{ taskInfo.createdAt | datetimeFormat }}</td>
            </tr>
          </table>
          <div id="chart" :style="{width: '280px', height: '280px'}"></div>
        </el-col>
        <el-col :span=16 style="height: 100%">
          <el-select @change="onFilterChange" v-model="levelFilter" multiple placeholder="Search" style="width: 93%">
            <el-option
              v-for="item in filterOptions"
              :key="item.value"
              :label="item.key"
              :value="item.value">
            </el-option>
          </el-select>
          &nbsp;
          <el-button type="primary" size="small" @click="onDownloadReport(taskInfo.id)"><i
            class="el-icon-download"></i>
          </el-button>

          <el-scrollbar style="height:100%">
            <div v-for="(node,index) in nodeList" :key="index">
              <div v-if="!hiddenNode(node)">
                <h3>{{ node.text }}</h3>
                <div v-for="(test,index) in node.tests" :key="index">
                  <div v-if="test.results.length>0">
                    <h4>{{ " " + test.section + " " + test.desc }}</h4>
                    <el-table
                      :data="test.results"
                      style="width: 100%">
                      <el-table-column type="expand">
                        <template slot-scope="props">
                          <table style="border-collapse:separate; border-spacing:0px 10px;">
                            <tr>
                              <th>number:</th>
                              <th style="padding-left: 20px">{{ props.row.test_number }}</th>
                            </tr>
                            <tr>
                              <th>status:</th>
                              <th style="padding-left: 20px">{{ props.row.status }}</th>
                            </tr>
                            <tr>
                              <th>description:</th>
                              <th style="padding-left: 20px">{{ props.row.test_desc }}</th>
                            </tr>
                            <tr>
                              <th>remediation:</th>
                              <th style="padding-left: 20px">{{ props.row.remediation }}</th>
                            </tr>
                          </table>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="status"
                        prop="status" fix>
                        <template v-slot:default="{row}">
                          <el-tag effect="plain" :type="getTagTypeByStatus(row.status)">{{ row.status }}</el-tag>
                        </template>
                      </el-table-column>

                      <el-table-column
                        label="number"
                        prop="test_number">
                      </el-table-column>
                      <el-table-column
                        label="desc"
                        prop="test_desc">
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </div>
            </div>

          </el-scrollbar>
        </el-col>
      </el-row>

    </el-dialog>
  </div>
</template>

<script>
import ComplexTable from "@/components/complex-table"
import {listCisByPage, cisCreate, cisDelete, getCisDetail, getCisReport} from "@/api/cluster/security"

let echarts = require("echarts/lib/echarts")


export default {
  name: "ClusterSecurity",
  components: {ComplexTable},
  data() {
    return {
      loading: false,
      submitLoading: false,
      buttons: [
        {
          label: this.$t("commons.button.delete"),
          icon: "el-icon-delete",
          click: (row) => {
            this.onDelete(row)
          },
        },
      ],
      paginationConfig: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      data: [],
      results: [],
      clusterName: "",
      passPercent: 0,
      dialogDetailVisible: false,
      dialogCreateVisible: false,
      nodeList: [],
      oNodeList: [],
      createForm: {
        policy: "auto",
      },
      policyOptions: [
        {label: this.$t('cluster.detail.security.auto'), value: "auto"},
        {label: "cis-1.5", value: "cis-1.5"},
        {label: "cis-1.6", value: "cis-1.6"},
        {label: "cis-1.20", value: "cis-1.20"},
      ],
      taskInfo: {
        clusterName: "",
        clusterVersion: "",
        createdAt: "",
        policy: "",
        id: ""
      },
      levelFilter: [],
      filterOptions: [
        {key: "PASS", value: "PASS"},
        {key: "INFO", value: "INFO"},
        {key: "WARN", value: "WARN"},
        {key: "FAIL", value: "FAIL"},
      ],
      option: {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        color: ["#87cb16", "#99adff", "#ffdbae", "#fb404b"],
        series: [
          {
            type: 'pie',
            radius: ['30%', '60%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '20',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
          }
        ]
      }
    }
  },
  methods: {
    search() {
      this.loading = true
      const {currentPage, pageSize} = this.paginationConfig
      listCisByPage(this.clusterName, currentPage, pageSize).then((data) => {
        this.loading = false
        this.data = data.items
        this.paginationConfig.total = data.total
      }).catch(() => {
        this.loading = false
      })
    },
    onCreate() {
      this.createForm = {
        policy: "auto"
      }
      this.dialogCreateVisible = true
    },
    cisCreate() {
      this.submitLoading = true
      cisCreate(this.clusterName, {policy: this.createForm.policy})
        .then(() => {
          this.$message({type: "success", message: this.$t("commons.msg.save_success")})
          this.search()
        }).finally(() => {
        this.submitLoading = false
        this.dialogCreateVisible = false
      })
    },
    onDelete(row) {
      this.$confirm(this.$t("commons.confirm_message.delete"), this.$t("commons.button.delete"), {
        confirmButtonText: this.$t("commons.button.ok"),
        cancelButtonText: this.$t("commons.button.cancel"),
        type: "warning",
      }).then(() => {
        cisDelete(this.clusterName, row.id).then(() => {
          this.$message({type: "success", message: this.$t("commons.msg.delete_success")})
          this.search()
        })
      })
    },
    getTagTypeByStatus(status) {
      switch (status) {
        case "PASS":
          return "success"
        case  "INFO":
          return "info"
        case "WARN":
          return "warning"
        case "FAIL":
          return "danger"
      }
    },
    onDownloadReport(id) {
      getCisReport(this.clusterName, id, "yaml").then()
    },

    hiddenNode(node) {
      if (node.tests) {
        for (const test of node.tests) {
          if (test.results.length > 0) {
            return false
          }
        }
      }
      return true
    },
    onFilterChange() {
      const temp = this.deepCopy(this.oNodeList)
      if (this.levelFilter.length !== 0) {
        for (const node of temp) {
          for (const test of node.tests) {
            test.results = test.results.filter((r) => {
              return this.levelFilter.indexOf(r.status) !== -1
            })
          }
        }
      }
      this.nodeList = this.deepCopy(temp)
    },
    cisDetail(taskId, level) {
      this.dialogDetailVisible = true
      getCisDetail(this.clusterName, taskId).then((data) => {
        let chart = echarts.init(document.getElementById('chart'))      // let passCount = 0
        this.option.series[0].data = [
          {name: "PASS", value: data.totalPass},
          {name: "INFO", value: data.totalInfo},
          {name: "WARN", value: data.totalWarn},
          {name: "FAIL", value: data.totalFail}
        ]
        chart.setOption(this.option)
        chart.on('click', (p) => {
          if (this.levelFilter.indexOf(p.data.name) === -1) {
            this.levelFilter.push(p.data.name)
            this.onFilterChange()
          }
        })

        this.oNodeList = this.deepCopy(data.cisReport.Controls)
        this.nodeList = this.deepCopy(data.cisReport.Controls)
        let {clusterName, clusterVersion, createdAt, policy, id} = data
        this.taskInfo.clusterName = clusterName
        this.taskInfo.clusterVersion = clusterVersion
        this.taskInfo.createdAt = createdAt
        this.taskInfo.policy = policy
        this.taskInfo.id = id

        if (level != null) {
          this.levelFilter = [level]
        } else {
          this.levelFilter = []
        }
        this.onFilterChange()
      })
    },

    deepCopy(obj) {
      return JSON.parse(JSON.stringify(obj))
    },
    polling() {
      this.timer = setInterval(() => {
        let flag = false
        for (const item of this.data) {
          if (item.status === "Running") {
            flag = true
          }
        }
        if (flag) {
          const {currentPage, pageSize} = this.paginationConfig
          listCisByPage(this.clusterName, currentPage, pageSize).then((data) => {
            this.data = data.items
            this.paginationConfig.total = data.total
          })
        }
      }, 10000)
    },
  },
  created() {
    this.clusterName = this.$route.params.name
    this.search()
    this.polling()
  },
  destroyed() {
    clearInterval(this.timer)
  },
}
</script>

<style lang="scss" scoped>
.dialog {
  height: 450px;

  /deep/ .el-scrollbar__wrap {
    height: 100%;
    overflow-x: hidden;
  }
}
</style>
