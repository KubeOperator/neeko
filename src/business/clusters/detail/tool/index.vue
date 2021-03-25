<template>
  <div>
    <el-row>
      <div v-for="tool in tools" :key="tool.name">
        <el-col :span="6">
          <el-card style="margin-left:10px; margin-top:10px; height: 180px" class="box-card">
            <el-row>
              <el-col :span="6">
                <img style="width: 60px; height: 60px" :src="require('@/assets/images/tools/'+ tool.logo)">
              </el-col>
              <el-col :span="18">
                <span>{{tool.name}} - {{tool.version}}</span>
              </el-col>
            </el-row>
            <el-divider></el-divider>
            <div v-if="tool.status === 'Waiting'">
              <el-button type="primary" size="small" @click="onEnable(tool)" style="float:right; margin: 5px">{{$t('commons.button.enable')}}</el-button>
            </div>
            <div v-if="tool.status === 'Failed'">
              <el-button type="danger" size="small" @click="onDisable(tool)" style="float:right; margin: 5px">{{$t('commons.button.disable')}}</el-button>
              <el-button type="primary" size="small" @click="onEnable(tool)" style="float:right; margin: 5px">{{$t('commons.button.enable')}}</el-button>
            </div>
            <div v-if="tool.status === 'Running'">
              <span v-if="!tool.frame" style="float:right; margin: 5px">{{$t('commons.status.Running')}}</span>
              <el-button v-if="tool.frame" size="small" @click="openFrame(tool)" style="float:right; margin: 5px">{{$t('commons.button.jump_to')}}</el-button>
              <el-button type="danger" size="small" @click="onDisable(tool)" style="float:right; margin: 5px">{{$t('commons.button.disable')}}</el-button>
            </div>
            <div v-if="tool.status === 'Initializing'">
              <span v-if="!tool.frame" style="float:right; margin: 5px">{{$t('commons.status.Initializing')}}</span>
            </div>
            <div v-if="tool.status === 'Upgrading'">
              <span v-if="!tool.frame" style="float:right; margin: 5px">{{$t('commons.status.Upgrading')}}</span>
            </div>
            <div v-if="tool.status === 'Terminating'">
              <span v-if="!tool.frame" style="float:right; margin: 5px">{{$t('commons.status.Terminating')}}</span>
            </div>
            <el-button v-if="tool.higher_version && tool.status === 'Running'" @click="onUpgrade(tool)" size="small" style="float:right; margin: 5px">{{$t('commons.button.upgrade')}}</el-button>
          </el-card>
        </el-col>
      </div>
    </el-row>

    <el-dialog title="启用工具" width="30%" :visible.sync="dialogEnableVisible">
      <el-form :model="enableFrom" label-width="120px">
        <el-form-item label="命名空间">
          <el-select style="width: 100%" filterable v-model="enableFrom.vars['namespace']" clearable>
            <el-option v-for="item of namespaces" :key="item" :value="item">{{item}}</el-option>
          </el-select>
        </el-form-item>

        <div v-if="enableFrom.name === 'chartmuseum'">
          <el-form-item label="启用存储">
            <el-switch style="width: 100%" v-model="enableFrom.vars['persistence.enabled']"></el-switch>
          </el-form-item>
          <div v-if="enableFrom.vars['persistence.enabled']">
            <el-form-item label="存储类">
              <el-select style="width: 100%" filterable v-model="enableFrom.vars['persistence.storageClass']" clearable>
                <el-option v-for="item of storages" :key="item" :value="item">{{item.metadata.name}}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="大小(Gi)">
              <el-input style="width: 100%" v-model="enableFrom.vars['persistence.size']" clearable></el-input>
            </el-form-item>
            <el-form-item label="节点">
              <el-select style="width: 100%" filterable v-model="enableFrom.vars['nodeSelector.kubernetes\\.io/hostname']" clearable>
                <el-option v-for="item of nodes" :key="item" :value="item">{{item}}</el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogEnableVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogEnableVisible = false">确 定</el-button>
        </div>
      </el-form>
    </el-dialog>

    <el-dialog title="错误信息" :visible.sync="dialogFaildVisible">
      <span>{{conditions}}</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFaildVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFaildVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { listTool, disableTool, upgradeTool } from "@/api/cluster/tool"

  export default {
    name: "Tool",
    data() {
      return {
        clusterName: "",
        currentCluster: {},
        tools: [],
        dialogEnableVisible: false,
        dialogFaildVisible: false,
        conditions: "",
        enableFrom: {
          name: "",
          version: "",
          describe: "",
          status: "",
          message: "",
          logo: "",
          url: "",
          frame: false,
          vars: {},
          higher_version: "",
          conditions: "",
        },
        namespaces: [],
        nodes: [],
        storages: [],
      }
    },
    methods: {
      search() {
        this.clusterName = this.$route.params.name
        listTool(this.clusterName).then(data => {
          this.tools = data
        })
      },
      onEnable(item) {
        switch (item.name) {
          case "logging":
            for (const tool of this.items) {
              if (tool.name === "loki") {
                this.conditions = (tool.status === "Waiting") ? "" : this.translateService.instant("APP_EFK_LOKI_CONDITION")
                break
              }
            }
            break
          case "loki":
            if (this.currentCluster.spec.architectures === "amd64") {
              for (const tool of this.items) {
                if (tool.name === "logging") {
                  this.conditions = (tool.status === "Waiting") ? "" : this.translateService.instant("APP_EFK_LOKI_CONDITION")
                  break
                }
              }
            } else {
              this.conditions = ""
            }
            break
          case "grafana":
            for (const tool of this.items) {
              if (tool.name === "prometheus") {
                this.conditions = (tool.status === "Running") ? "" : this.translateService.instant("APP_GRAFANA_CONDITION")
                break
              }
            }
            break
        }
        if (this.conditions === "") {
          console.log(this.conditions)
          this.dialogEnableVisible = true
          this.enableFrom = item
        } else {
          this.dialogFaildVisible = true
        }
      },
      onDisable(item) {
        this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.disable(item)
          this.$message({
            type: "success",
            message: "删除成功!"
          })
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          })        
        })
      },
      disable(item) {
        disableTool(this.clusterName, item).then(data => {
          console.log(data)
        })
      },
      onUpgrade(item) {
        upgradeTool(this.clusterName, item).then(data => {
          console.log(data)
        })
      },
    },
    created() {
      this.search()
    }
  }
</script>

<style scoped>

</style>
