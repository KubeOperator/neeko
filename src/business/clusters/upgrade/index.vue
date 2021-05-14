<template>
  <layout-content :header="$t('commons.button.upgrade')" :back-to="{ name: 'ClusterList' }">
    <el-row>
      <el-col :span="4"><br /></el-col>
      <el-col :span="10">
        <div class="grid-content bg-purple-light">
          <el-form :model="form" ref="form" :rules="rules" label-width="120px">
            <el-form-item :label="$t('cluster.version')" prop="version">
              <el-select style="width: 100%" @change="changeUpgradeVersions" v-model="form.version" clearable>
                <el-option v-for="item of upgradeVersions" :key="item" :value="item">{{ item }}</el-option>
              </el-select>
              <div v-if="upgradeVersions.length === 0"><span class="input-help">{{
              $t("cluster.upgrade.upgrade_help")
            }}</span></div>
            </el-form-item>
            <el-form-item>
              <div v-if="newManifest.coreVars.length !== 0 && oldManifest.coreVars !== 0">
                <table style="width: 100%;" class="myTable">
                  <tr>
                    <td style="width: 40%">{{ $t("commons.table.name") }}</td>
                    <td style="width: 30%">{{ $t("cluster.upgrade.current_version") }}</td>
                    <td style="width: 30%">{{ $t("cluster.upgrade.upgrade_version") }}</td>
                  </tr>
                  <tr>
                    <td style="width: 40%">Kubernetes</td>
                    <td style="width: 30%">{{ getVersion("kubernetes", oldManifest.coreVars) }}</td>
                    <td style="width: 30%">{{ getVersion("kubernetes", newManifest.coreVars) }}</td>
                  </tr>
                  <tr v-if="getVersion('etcd', oldManifest.coreVars)!==getVersion('etcd', newManifest.coreVars)">
                    <td style="width: 40%">ETCD</td>
                    <td style="width: 30%">{{ getVersion("etcd", oldManifest.coreVars) }}</td>
                    <td style="width: 30%">{{ getVersion("etcd", newManifest.coreVars) }}</td>
                  </tr>
                  <tr v-if="currentCluster.spec.runtimeType=='docker'&& getVersion('docker', oldManifest.coreVars)!==getVersion('docker', newManifest.coreVars)">
                    <td style="width: 40%">Docker</td>
                    <td style="width: 30%">{{ getVersion("docker", oldManifest.coreVars) }}</td>
                    <td style="width: 30%">{{ getVersion("docker", newManifest.coreVars) }}</td>
                  </tr>
                  <tr v-if="currentCluster.spec.runtimeType=='containerd'&& getVersion('containerd', oldManifest.coreVars)!==getVersion('containerd', newManifest.coreVars)">
                    <td style="width: 40%">Containerd</td>
                    <td style="width: 30%">{{ getVersion("containerd", oldManifest.coreVars) }}</td>
                    <td style="width: 30%">{{ getVersion("containerd", newManifest.coreVars) }}</td>
                  </tr>
                </table>
              </div>
            </el-form-item>
            <el-form-item style="float: right">
              <el-button @click="onCancel()">{{ $t("commons.button.cancel") }}</el-button>
              <el-button type="primary" v-loading="loadding" @click="onSubmit">{{ $t("commons.button.ok") }}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </layout-content>
</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent"
import { upgradeCluster, getClusterByName } from "@/api/cluster"
import { manifestGroup } from "@/api/manifest"
import Rule from "@/utils/rules"

export default {
  name: "ClusterUpgrade",
  props: ["name"],
  components: { LayoutContent },
  data() {
    return {
      loadding: false,
      form: {
        clusterName: "",
        version: "",
      },
      rules: {
        version: [Rule.RequiredRule],
      },
      oldManifest: {
        coreVars: [],
      },
      newManifest: {
        coreVars: [],
      },
      upgradeVersions: [],
      manifestList: [],
    }
  },
  methods: {
    onSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.loadding = true
          upgradeCluster(this.form.clusterName, this.form.version)
            .then(() => {
              this.loadding = false
              this.$message({ type: "success", message: this.$t("commons.msg.upgrade_start_success") })
              this.$router.push({ name: "ClusterList" })
            })
            .catch(() => {
              this.loadding = false
            })
        }
      })
    },
    loadInfo(clusterName) {
      getClusterByName(clusterName).then((data) => {
        this.currentCluster = data
        this.form.clusterName = data.name
        const currentVersion = data.spec.version
        const currentVersions = currentVersion.split(".")
        const version1 = currentVersions[0]
        const version2 = currentVersions[1]
        const versions = currentVersions[2].split("-ko")
        const version3 = Number(versions[0])
        const koVersion = Number(versions[1])
        this.upgradeVersions = []
        manifestGroup().then((res) => {
          for (const group of res) {
            group.clusterManifests.forEach((item) => {
              this.manifestList.push(item)
            })
          }
          for (const manifest of this.manifestList) {
            if (manifest.isActive) {
              const manifestKoVersions = manifest.name.split("-ko")
              const manifestVersions = manifestKoVersions[0].split(".")
              const manifestKoVersion = Number(manifestKoVersions[1])
              const manifestVersion1 = manifestVersions[0]
              const manifestVersion2 = manifestVersions[1]
              const manifestVersion3 = Number(manifestVersions[2])
              if (version1 === manifestVersion1 && version2 === manifestVersion2) {
                if (manifestVersion3 > version3) {
                  this.upgradeVersions.push(manifest.name)
                }
                if (manifestVersion3 === version3 && koVersion < manifestKoVersion) {
                  this.upgradeVersions.push(manifest.name)
                }
              }
            }
          }
        })
      })
    },
    changeUpgradeVersions() {
      for (const m of this.manifestList) {
        if (m.name.indexOf(this.currentCluster.spec.version) !== -1) {
          this.oldManifest = m
        }
        if (m.name === this.form.version) {
          this.newManifest = m
        }
      }
    },
    getVersion(component, ns) {
      for (const n of ns) {
        if (n.name === component) {
          return n.version
        }
      }
    },
    onCancel() {
      this.$router.push({ name: "ClusterList" })
    },
  },
  created() {
    this.loadInfo(this.$route.params.name)
  },
}
</script>

<style scoped>
</style>
