<template>
  <layout-content>
    <el-collapse v-for="version in versionList" v-model="activeNames" :key="version.largeVersion" >
      <el-collapse-item style="margin-top: 20px;" :title="version.largeVersion" :name="version.largeVersion">
        <div v-for="versionMini in version.clusterManifests" :key="versionMini.name">
          <el-col :span="6">
            <el-card style="margin-left:10px; margin-top:10px" class="box-card">
              <div slot="header" class="clearfix">
                <el-button style="float:right; padding: 3px;" type="text">{{$t('manifest.detail')}}</el-button>
              </div>
              <span>{{versionMini.name}}</span>
              <el-col :span="4">
                <img style="width: 40px; height: 40px" src="../../assets/tools/kubernetes.png" alt="">
              </el-col>
              <el-col :span="20">
                <div v-for="vars in versionMini.coreVars" :key="vars.name">
                  <ul>
                    <span>{{vars.name}} : {{vars.version}}</span>
                  </ul>
                </div>
                <el-switch style="margin-bottom: 10px; float: right" :active-text="$t('manifest.enable')" @change="changeEnable(versionMini)" v-model="versionMini.isActive"></el-switch>
              </el-col>
            </el-card>
          </el-col>
        </div>
      </el-collapse-item>
    </el-collapse>
  </layout-content>
</template>

<script>
import {manifestGroup, changeStatus} from "@/api/manifest"
import LayoutContent from "@/components/layout/LayoutContent"

export default {
  name: "Manifest",
  components: {LayoutContent},
  data() {
    return {
      versionList: [],
      activeNames: []
    };
  },
  methods: {
    search() {
      manifestGroup().then(data => {
          this.versionList = data
          this.versionList.forEach(item => {
            this.activeNames.push(item.largeVersion)
          })
      })
    },
    changeEnable(version) {
      changeStatus(version.name, version).then(data => {
        this.$message({message: this.$t('manifest.message', [data.name]), type: "success"})
        this.search()
      })
    }
  },
  mounted() {
    this.search()
  }
}
</script>