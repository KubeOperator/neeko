<template>
  <el-dialog
    :title="$t('multi_cluster.sync_detail')"
    :visible.sync="dialogVisible"
    width="40%">
    <el-row>
      <div style="text-align: center;">
        <div v-for="log of logs" :key="log.clusterName">
          <span>{{log.clusterName}}</span>
          <div align="center" style="margin-top: 15px">
            <table style="width: 90%" >
              <tr v-for="item of log.multiClusterSyncClusterResourceLogs" :key="item.resourceName">
                <td>{{item.resourceName}}</td>
                <td>{{item.sourceFile}}</td>
                <td>{{item.status}}</td>
                <td>{{item.message}}</td>
              </tr>
            </table>
          </div>
        </div>
        <br>
      </div>
    </el-row>
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible=false">{{$t('commons.button.cancel')}}</el-button>
  </span>
  </el-dialog>
</template>


<script>

  import {getMultiClusterSyncLogsDetail} from "@/api/xpack/multi-cluster"

  export default {
    name: "SyncLogDetail",
    props: {
      visible: Boolean,
      name: String,
      logId: String,
    },
    data() {
      return {
        loading: false,
        logs: []
      };
    },
    watch: {
      visible: function (n) {
        if (n) {
          getMultiClusterSyncLogsDetail(this.name, this.logId).then(data => {
            this.logs = data.multiClusterSyncClusterLogs;
          })
        }
      }
    },
    methods: {},
    computed: {
      dialogVisible: {
        get() {
          return this.visible
        },
        set(s) {
          this.$emit('update:visible', s);
        }
      }
    }, created() {
    }
  };
</script>
