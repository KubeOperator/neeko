<template>
  <layout-content :header="$t('route.manifest')">
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
                <div style="float: right">
                  <el-link  style="color: #F2F2F2" @click="onDetail(versionMini)" > {{$t('manifest.detail')}}</el-link>
                </div>
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

              <div class="bottom">
                <el-switch  :active-text="$t('manifest.enable')"
                            style="margin-left: 100px "
                            @change="changeEnable(versionMini)"
                            v-model="versionMini.isActive"
                            v-permission="['ADMIN']">
                </el-switch>
              </div>
            </el-card>
          </el-col>
        </div>
        </div>
      </div>
    </div>

    <el-scrollbar style="height:100%;">
    <el-dialog
      :title="$t('manifest.detail')"
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
            :label="$t('manifest.component')">
          </el-table-column>
          <el-table-column
            prop="version"
            :label="$t('manifest.version')">
          </el-table-column>
        </el-table>
          <p>Network</p>
        <el-table
          :data="manifestDetail.networkVars"
          border
          style="width: 90%">
          <el-table-column
            prop="name"
            :label="$t('manifest.component')">
          </el-table-column>
          <el-table-column
            prop="version"
            :label="$t('manifest.version')">
          </el-table-column>
        </el-table>
        <p>Tool</p>
        <el-table
          :data="manifestDetail.toolVars"
          border
          style="width: 90%">
          <el-table-column
            prop="name"
            :label="$t('manifest.component')">
          </el-table-column>
          <el-table-column
            prop="version"
            :label="$t('manifest.version')">
          </el-table-column>
        </el-table>
        <p>Storage</p>
        <el-table
        :data="manifestDetail.storageVars"
        border
        style="width: 90%;">
        <el-table-column
          prop="name"
          :label="$t('manifest.component')">
        </el-table-column>
        <el-table-column
          prop="version"
          :label="$t('manifest.version')">
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
          :label="$t('manifest.component')">
        </el-table-column>
        <el-table-column
          prop="version"
          :label="$t('manifest.version')">
        </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
、    <el-button type="primary" @click="dialogVisible = false">{{$t('commons.button.ok')}}</el-button>
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

  .bottom {
      float: right;
      margin-bottom: 10px;
  }

</style>
