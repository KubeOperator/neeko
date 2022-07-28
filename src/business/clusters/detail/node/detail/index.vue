<template>
  <div class="dialog">
    <el-scrollbar style="height:100%">
      <div style=" text-align: center;">
        <span>{{$t ('cluster.detail.node.base_infomation')}}</span>
        <div align="center" style="margin-top: 15px">
          <table style="width: 90%" class="myTable">
            <tbody>
              <tr>
                <td>Name</td>
                <td>{{DetaiInfo.metadata.name}}</td>
              </tr>
              <tr>
                <td>Kernel Version</td>
                <td>{{DetaiInfo.status.nodeInfo.kernelVersion}}</td>
              </tr>
              <tr>
                <td>OS Image</td>
                <td>{{DetaiInfo.status.nodeInfo.osImage}}</td>
              </tr>
              <tr>
                <td>Container Runtime Version</td>
                <td>{{DetaiInfo.status.nodeInfo.containerRuntimeVersion}}</td>
              </tr>
              <tr>
                <td>Kubelet Version</td>
                <td>{{DetaiInfo.status.nodeInfo.kubeletVersion}}</td>
              </tr>
              <tr>
                <td>KubeProxy Version</td>
                <td>{{DetaiInfo.status.nodeInfo.kubeProxyVersion}}</td>
              </tr>
              <tr>
                <td>Operating System</td>
                <td>{{DetaiInfo.status.nodeInfo.operatingSystem}}</td>
              </tr>
              <tr>
                <td>Architecture</td>
                <td>{{DetaiInfo.status.nodeInfo.architecture}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <br>

        <span style="margin-top: 30px">{{$t ('cluster.detail.node.label')}}</span>
        <div align="center" style="margin-top: 15px">
          <table style="width: 90%" class="myTable">
            <tbody>
              <tr v-for="(value, name) in DetaiInfo.metadata.labels" :key="name">
                <td>{{name}}</td>
                <td>{{value}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <br>

        <span style="margin-top: 30px">{{$t('cluster.detail.node.status')}}</span>
        <div align="center" style="margin-top: 15px">
          <el-table :data="DetaiInfo.status.conditions" border style="width: 90%">
            <el-table-column prop="type" min-width="80" show-overflow-tooltip label="Type" />
            <el-table-column prop="status" min-width="50" label="Status" />
            <el-table-column prop="lastTransitionTime" min-width="100" label="Time">
              <template v-slot:default="{row}">
                {{ row.lastTransitionTime | datetimeFormat }}
              </template>
            </el-table-column>
            <el-table-column prop="reason" show-overflow-tooltip min-width="100" label="Reason" />
            <el-table-column prop="message" show-overflow-tooltip min-width="100" label="Message" />
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDetailVisible = false">{{$t('commons.button.cancel')}}</el-button>
      </div>
    </el-scrollbar>
  </div>

</template>
      
<script>
export default {
  name: "NodeDetail",
  props: {
    DetaiInfo: Object,
  },
}
</script>
      
<style>
</style>