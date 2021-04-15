<template>
  <layout-content :header="$t('route.manifest')">
<!--    如果大版本数量很多，可以使用select选择过滤-->
<!--    <el-select v-model="currentVersion" filterable placeholder="请选择">-->
<!--      <el-option-->
<!--        v-for="item in activeNames"-->
<!--        :key="item"-->
<!--        :label="item"-->
<!--        :value="item">-->
<!--      </el-option>-->
<!--    </el-select>-->
    <el-tabs v-model="currentVersion"  @tab-click="handleClick">
        <el-tab-pane v-for="item in activeNames" :key="item" :label="item" :name="item"/>
    </el-tabs>

    <div v-for="version in versionList" :key="version.largeVersion">
      <div>
        <div v-if="version.largeVersion == currentVersion">
        <div v-for="versionMini in version.clusterManifests"  :key="versionMini.name">
          <el-col :span="6">
            <el-card id="card_header" style="margin-left:10px; margin-top:20px"  class="box-card">
              <div slot="header"   class="clearfix">
                <b>{{versionMini.name}}</b>
<!--                <el-button style="float:right; padding: 3px;color: #F2F2F2" type="text">{{$t('manifest.detail')}}</el-button>-->
              </div>

              <el-col :span="4">
                <img style="width: 50px; height: 50px" src="@/assets/images/tools/kubernetes.png" alt="">
              </el-col>
              <el-col :span="20">
                <div v-for="vars in versionMini.coreVars" :key="vars.name">
                  <ul>
                    <span>{{vars.name}} : {{vars.version}}</span>
                  </ul>
                </div>
              </el-col>
              <el-button style="float:left;margin-bottom: 10px;position: relative" @click="onDetail(versionMini)"  type="text">{{$t('manifest.detail')}}</el-button>
              <el-switch style="margin-bottom: 10px; float: right;position: relative" :active-text="$t('manifest.enable')"
                         @change="changeEnable(versionMini)"
                         v-model="versionMini.isActive"
                         v-permission="['ADMIN']"></el-switch>
            </el-card>
          </el-col>
        </div>
        </div>
      </div>
    </div>

    <el-scrollbar style="height:100%;">
    <el-dialog
      title="版本管理详情"
      :visible.sync="dialogVisible"
      class="abow_dialog"
      width="50%">
      <div style="height: 500px">
        <el-scrollbar style="height: 500px">
      <p>{{manifestDetail.name}}</p>
      <el-divider/>
        <el-table
          :data="manifestDetail.coreVars"
          border
          style="width: 90%;">
          <el-table-column
            prop="name"
            label="组件">
          </el-table-column>
          <el-table-column
            prop="version"
            label="版本">
          </el-table-column>
        </el-table>
<!--          <el-divider/>-->
          <p>Network</p>
        <el-table
          :data="manifestDetail.networkVars"
          border
          style="width: 90%">
          <el-table-column
            prop="name"
            label="组件">
          </el-table-column>
          <el-table-column
            prop="version"
            label="版本">
          </el-table-column>
        </el-table>
        <p>Tool</p>
<!--        <el-divider/>-->
        <el-table
          :data="manifestDetail.toolVars"
          border
          style="width: 90%">
          <el-table-column
            prop="name"
            label="组件">
          </el-table-column>
          <el-table-column
            prop="version"
            label="版本">
          </el-table-column>
        </el-table>
        <p>Storage</p>
<!--        <el-divider/>-->
        <el-table
        :data="manifestDetail.storageVars"
        border
        style="width: 90%;">
        <el-table-column
          prop="name"
          label="组件">
        </el-table-column>
        <el-table-column
          prop="version"
          label="版本">
        </el-table-column>
      </el-table>
      <p>Other</p>
<!--      <el-divider/>-->
      <el-table
        :data="manifestDetail.otherVars"
        border
        style="width: 90%">
        <el-table-column
          prop="name"
          label="组件">
        </el-table-column>
        <el-table-column
          prop="version"
          label="版本">
        </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
、    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
        </el-scrollbar>
      </div>
    </el-dialog>
    </el-scrollbar>

  </layout-content>
</template>

<script>
import { manifestGroup, changeStatus } from "@/api/manifest"
import LayoutContent from "@/components/layout/LayoutContent"

export default {
  name: "Manifest",
  components: { LayoutContent },
  data() {
    return {
      versionList: [],
      activeNames: [],
      currentVersion: '',
      dialogVisible: false,
      manifestDetail: {}
    }
  },
  methods: {
    search() {
      manifestGroup().then((data) => {
        this.versionList = data
        this.activeNames = []
        this.versionList.forEach((item) => {
          this.activeNames.push(item.largeVersion)
          this.currentVersion = this.activeNames[0]
        })
      })
    },
    getLatestManifest(){
      manifestGroup().then((data) => {
        this.versionList = data
      })
    },
    changeEnable(version) {
      changeStatus(version.name, version).then((data) => {
        this.$message({ message: this.$t("manifest.message", [data.name]), type: "success" })
        this.getLatestManifest()
      })
    },
    handleClick(tab) {
      this.currentVersion = tab.name;
    },
    onDetail(detail) {
      console.log("onDetail:",detail)
      this.manifestDetail = detail
      this.dialogVisible = true
    }
  },
  mounted() {
    this.search()
  },
}
</script>
<style>
  #card_header .el-card__header{
      background-color: #447DF7 !important;
      color: #F2F2F2 !important;
  }

  .el-divider--horizontal {
    margin: 5px 0 20px 0;
  }
</style>
