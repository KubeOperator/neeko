<template>
  <layout-content :header="$t('task.task_detail')">
    <el-row>
      <el-col :span="2"><br/></el-col>
      <el-col :span="10">
        <el-form ref="form" style="margin-left: 30px" label-position="left" :model="form" label-width="140px">
          <el-form-item :label="$t('task.name')" prop="type">
            <span>{{ $t(`task.${form.type}`)}}</span>
          </el-form-item>
          <el-form-item :label="$t('task.task_id')" prop="type">
            <el-link style="font-size: 12px" type="info" @click="openXterm()">{{ form.id }}</el-link>
          </el-form-item>
          <el-form-item :label="$t('commons.search.time_start')" prop="type">
            <span>{{ form.startTime | timeStampFormat  }}</span>
          </el-form-item>
          <el-form-item :label="$t('commons.search.time_end')" prop="type">
            <span>{{ form.endTime | timeStampFormat  }}</span>
          </el-form-item>
          <el-form-item :label="$t('commons.table.spend_time')" prop="type">
            <span>{{ loadTimeSpend(form.startTime, form.endTime) }}</span>
          </el-form-item>
          <el-form-item :label="$t('commons.table.status')" prop="type">
            <span>{{ $t(`commons.status.${form.phase}`)}}</span>
          </el-form-item>
          <el-form-item :label="$t('task.message')" prop="type">
            <el-card v-if="form.message">
              <div v-if="formatMsgs.failed" slot="header">
                <span>{{formatMsgs.name}}</span>
              </div>
              <div v-if="formatMsgs.type !== 'unFormat'">
                <el-collapse v-model="activeNames">
                  <el-collapse-item v-if="formatMsgs.info.msg" title="message" name="1">
                    <div style="margin-top: 10px"><span style="white-space: pre-wrap;">{{ formatMsgs.info.msg }}</span></div>
                  </el-collapse-item>
                  <el-collapse-item v-if="formatMsgs.info.stderr" title="stderr" name="2">
                    <div style="margin-top: 10px"><span style="white-space: pre-wrap;">{{formatMsgs.info.stderr }}</span></div>
                  </el-collapse-item>
                  <el-collapse-item v-if="formatMsgs.info.stdout" title="stdout" name="3">
                    <div style="margin-top: 10px"><span style="white-space: pre-wrap;">{{formatMsgs.info.stdout }}</span></div>
                  </el-collapse-item>
                </el-collapse>
              </div>
              <div v-else>
                <div><span style="font-weight: bold">info</span></div>
                <div><span style="white-space: pre-wrap;">{{formatMsgs.info | errorFormat }}</span></div>
              </div>
            </el-card>
          </el-form-item>
        </el-form>
        <el-button style="float: right" @click="onBack">{{ $t('commons.button.return') }}</el-button>
      </el-col>
      <el-col :span="10">
        <div class="block">
          <el-timeline>
            <el-timeline-item v-for="(activity, index) in activities" :key="index" :icon="activity.icon" :type="activity.type" :color="activity.color" :size="activity.size" :timestamp="activity.timestamp">
              {{activity.content}}
              <el-card style="margin-top: 5px" v-if="activity.status === 'FAILED'">
                <div v-if="activity.formatMsgs.failed" slot="header">
                  <span>{{activity.formatMsgs.name}}</span>
                </div>
                <div v-if="activity.formatMsgs.type !== 'unFormat'">
                  <el-collapse v-model="activeNames">
                    <el-collapse-item v-if="activity.formatMsgs.info.msg" title="message" name="1">
                      <div style="margin-top: 10px"><span style="white-space: pre-wrap;">{{ activity.formatMsgs.info.msg }}</span></div>
                    </el-collapse-item>
                    <el-collapse-item v-if="activity.formatMsgs.info.stderr" title="stderr" name="2">
                      <div style="margin-top: 10px"><span style="white-space: pre-wrap;">{{activity.formatMsgs.info.stderr }}</span></div>
                    </el-collapse-item>
                    <el-collapse-item v-if="activity.formatMsgs.info.stdout" title="stdout" name="3">
                      <div style="margin-top: 10px"><span style="white-space: pre-wrap;">{{activity.formatMsgs.info.stdout }}</span></div>
                    </el-collapse-item>
                  </el-collapse>
                </div>
                <div v-else>
                  <div><span style="font-weight: bold">info</span></div>
                  <div><span style="white-space: pre-wrap;">{{activity.formatMsgs.info | errorFormat }}</span></div>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-col>
      <el-col :span="2"><br/></el-col>
    </el-row>
  </layout-content>
</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent"
import { openLoggerWithID } from "@/api/cluster/tasks"
import { ansibleErrFormat } from "@/utils/format_ansible_err"
import { getDetailById } from "@/api/cluster/tasks"
import { formatDate } from "@/utils/format_date"

export default {
  name: "ClusterTaskDetail",
  props: ["id"],
  components: { LayoutContent },
  data() {
    return {
      form: {
        clusterID: "",
        id: "",
        type: "",
        startTime: "",
        endTime: "",
        phase: "",
        message: "",
        details: [],
      },
      formatMsgs: {
        name: "",
        info: {},
        failed: false,
      },
      activeNames: ["1", "2", "3"],
      activities: [],
    }
  },
  methods: {
    openXterm() {
      if (this.form.type.indexOf(" (enable)") !== -1) {
        openLoggerWithID(this.form.clusterID, this.form.id + " (enable)")
        return
      }
      openLoggerWithID(this.form.clusterID, this.form.id)
    },
    onBack() {
      this.$router.push({ name: "ClusterTask" })
    },
    search() {
      getDetailById(this.id).then((data) => {
        this.form = data.tasklogs
        if (this.form.message) {
          this.formatMsgs = ansibleErrFormat(this.form.message)[0]
        }
        for (const s of this.form.details) {
          let item = {
            type: "primary",
            size: "large",
            status: s.status,
            timestamp: formatDate(new Date(s.startTime * 1000), "yyyy-MM-dd hh:mm:ss"),
          }
          if (s.task !== "FAILED" && s.task !== "REDO") {
            let spendTime = this.loadTimeSpend(new Date(s.startTime), new Date(s.endTime))
            item.content = this.$t("task." + s.task) + "    (" + spendTime + ")"
          } else {
            item.content = this.$t("task." + s.task)
          }
          switch (s.status) {
            case "RUNNING":
              item.icon = "el-icon-loading"
              item.color = "#E6A23C"
              break
            case "FAILED":
              item.icon = "el-icon-close"
              item.color = "#F56C6C"
              item.formatMsgs = ansibleErrFormat(s.message)[0]
              break
            case "SUCCESS":
              item.icon = "el-icon-check"
              item.color = "#67C23A"
              break
          }
          this.activities.push(item)
        }
      })
    },
    loadTimeSpend(start, end) {
      if (end == 0) {
        return "-"
      }
      return end - start + " S"
    },
  },
  created() {
    this.search()
  },
}
</script>
<style scoped lang="scss">
</style>
