<template>
  <layout-content>
    <el-row style="margin-top: 20px">
      <el-col :span="3"><br /></el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple-light">
          <el-form :model="form" label-width="200px">
            <el-form-item :label="$t('commons.table.name')">
              <el-input size="small" v-model="form.metadata.name"></el-input>
              <div><span class="input-help">{{$t('cluster.detail.storage.provisioner_name_helper')}}</span></div>
            </el-form-item>
            <el-form-item :label="$t('cluster.detail.storage.provisioner_short')">
              <el-select style="width: 100%" size="small" @change="changeClassType()" v-model="provisioner" value-key="name">
                <el-option v-for="item of provisioners" :key="item.name" :label="'['+item.type+']'+item.name" :value="item">[{{item.type}}]{{item.name}}</el-option>
              </el-select>
            </el-form-item>

            <div v-if="createType === 'nfs'">
              <el-form-item :label="$t('commons.table.name')">
                <el-input v-model="form.provisioner" disabled></el-input>
              </el-form-item>
            </div>
            <div v-if="createType === 'external-ceph'">
              <el-form-item :label="$t('commons.table.name')">
                <el-input v-model="form.provisioner" disabled></el-input>
              </el-form-item>
              <el-form-item label="Monitor">
                <el-input v-model="form.parameters['monitors']" placeholder="eg: 172.16.10.10:6389" clearable></el-input>
              </el-form-item>
              <el-form-item label="OSD Pool">
                <el-input v-model="form.parameters['pool']" placeholder="eg: kube" clearable></el-input>
              </el-form-item>
              <el-form-item label="Admin Id">
                <el-input v-model="form.parameters['adminId']" placeholder="eg: secret" clearable></el-input>
              </el-form-item>
              <el-form-item label="Admin Secret Name">
                <el-input v-model="form.parameters['adminSecretName']" placeholder="eg: secret" clearable></el-input>
              </el-form-item>
              <el-form-item label="Admin Secret Namespace">
                <el-input v-model="form.parameters['adminSecretNamespace']" placeholder="eg: kube-system" clearable></el-input>
              </el-form-item>
              <el-form-item label="User Id">
                <el-input v-model="form.parameters['userId']" placeholder="eg: kube" clearable></el-input>
              </el-form-item>
              <el-form-item label="User Secret Name">
                <el-input v-model="form.parameters['userSecretName']" placeholder="eg: secret" clearable></el-input>
              </el-form-item>
              <el-form-item label="FS Type">
                <el-input v-model="form.parameters['fsType']" placeholder="eg: ext4" clearable></el-input>
              </el-form-item>
              <el-form-item label="ImageFormat">
                <el-input v-model="form.parameters['imageFormat']" placeholder="eg: 2" clearable></el-input>
              </el-form-item>
            </div>
            <div v-if="createType === 'rook-ceph'">
              <el-form-item :label="$t('commons.table.name')">
                <el-input v-model="form.provisioner" disabled></el-input>
              </el-form-item>
            </div>
            <div v-if="createType === 'cinder'">
              <el-form-item :label="$t('commons.table.name')">
                <el-input v-model="form.provisioner" disabled></el-input>
              </el-form-item>
            </div>
            <div v-if="createType === 'vsphere'">
              <el-form-item :label="$t('commons.table.name')">
                <el-input v-model="form.provisioner" disabled></el-input>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.class.storage_policy_type')">
                <el-radio-group v-model="form.parameters['storagePolicyType']">
                  <el-radio label="BuiltIn">{{$t('cluster.detail.storage.class.build_in')}}</el-radio>
                  <el-radio label="Custom">{{$t('cluster.detail.storage.class.custom')}}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="form.parameters['storagePolicyType']==='BuiltIn'" :label="$t('cluster.detail.storage.class.storage_policy')">
                <el-select style="width: 100%" v-model="form.parameters['storagePolicyName']">
                  <el-option value='vSAN Default Storage Policy' label='vSAN Default Storage Policy' />
                  <el-option value='Management Storage Policy - Large' label='Management Storage Policy - Large' />
                  <el-option value='Management Storage Policy - Single Node' label='Management Storage Policy - Single Node' />
                  <el-option value='Management Storage policy - Thin' label='Management Storage policy - Thin' />
                  <el-option value='Management Storage Policy - Stretched' label='Management Storage Policy - Stretched' />
                </el-select>
              </el-form-item>
              <el-form-item v-if="form.parameters['storagePolicyType']==='Custom'" :label="$t('cluster.detail.storage.class.storage_policy')">
                <el-input style="width: 100%" v-model="form.parameters['storagePolicyName']" />
              </el-form-item>
            </div>
            <div v-if="createType === 'glusterfs'">
              <el-form-item :label="$t('commons.table.name')">
                <el-input v-model="form.provisioner" disabled></el-input>
              </el-form-item>
              <el-form-item label="REST URL">
                <el-input v-model="form.parameters['resturl']" placeholder="eg: 172.0.0.1:8081" clearable></el-input>
              </el-form-item>
              <el-form-item label="REST USER">
                <el-input v-model="form.parameters['restuser']" placeholder="eg: admin" clearable></el-input>
              </el-form-item>
              <el-form-item label="REST PASSWORD">
                <el-input v-model="form.parameters['restuserkey']" type="password" name="restuserkey" clearable></el-input>
              </el-form-item>
              <el-form-item label="Namespace">
                <el-input @change="checkSecrets()" v-model="form.parameters['secretNamespace']" placeholder="eg: kube-system" clearable></el-input>
              </el-form-item>
              <el-form-item label="Secret Name">
                <el-input @change="checkSecrets()" v-model="form.parameters['secretName']" placeholder="eg: heketi-secret" clearable></el-input>
                <div><span v-if="isSecretsExit" class="input-err">{{$t('cluster.detail.storage.provisioner_name_helper')}}</span></div>
              </el-form-item>
              <el-form-item label="CLUSTER ID">
                <el-input v-model="form.parameters['clusterid']" placeholder="eg: 8a4ff57af81910e8324368a23afe3bdc" clearable></el-input>
              </el-form-item>
              <el-form-item label="GID MIN">
                <el-input v-model="form.parameters['gidMin']" placeholder="eg: 40000" clearable></el-input>
              </el-form-item>
              <el-form-item label="GID MAX">
                <el-input v-model="form.parameters['gidMax']" placeholder="eg: 50000" clearable></el-input>
              </el-form-item>
              <el-form-item label="VOLUME TYPE">
                <el-input v-model="form.parameters['volumetype']" placeholder="eg: replicate:3" clearable></el-input>
              </el-form-item>
            </div>
            <div v-if="createType === 'oceanstor'">
              <el-form-item :label="$t('commons.table.name')">
                <el-input v-model="form.provisioner" disabled></el-input>
              </el-form-item>
              <el-form-item label="volumeType">
                <el-select style="width: 100%" v-model="form.parameters['volumeType']">
                  <el-option value='lun' label='lun'>lun</el-option>
                  <el-option value='fs' label='fs'>fs</el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="form.parameters['volumeType'] === 'fs'" label="authClient">
                <el-input v-model="form.parameters['authClient']" placeholder="demo1,demo2" />
              </el-form-item>
              <el-form-item label="allocType">
                <el-select style="width: 100%" v-model="form.parameters['allocType']">
                  <el-option value='thin' label='thin'>thin</el-option>
                  <el-option value='thick' label='thick'>thick</el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="cloneFrom">
                <el-input v-model="form.parameters['cloneFrom']" clearable />
                <div><span class="input-help">{{$t('cluster.detail.storage.class.clone_form_helper')}}</span></div>
              </el-form-item>
              <el-form-item label="cloneSpeed">
                <el-input v-model="form.parameters['cloneSpeed']" placeholder="1-4" />
                <div><span class="input-help">{{$t('cluster.detail.storage.class.clone_speed_helper')}}</span></div>
              </el-form-item>
              <el-form-item label="fsType">
                <el-select style="width: 100%" v-model="form.parameters['fsType']">
                  <el-option value='ext2' label='ext2'>ext2</el-option>
                  <el-option value='ext3' label='ext3'>ext3</el-option>
                  <el-option value='ext4' label='ext4'>ext4</el-option>
                </el-select>
                <div><span class="input-help">{{$t('cluster.detail.storage.provisioner_name_helper')}}</span></div>
              </el-form-item>
            </div>
            <el-form-item>
              <el-button @click="onCancel()">{{$t('commons.button.cancel')}}</el-button>
              <el-button type="primary" :disabled="!(createType || form.metadata.name)" @click="onSubmit">{{$t('commons.button.submit')}}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="4"><br /></el-col>
    </el-row>
  </layout-content>
</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent"
import { listProvisioner, createStorageClass, createSecret, getSecretByName } from "@/api/cluster/storage"

export default {
  name: "ProvisionerCreate",
  components: { LayoutContent },
  data() {
    return {
      provisioners: [],
      isSecretsExit: false,
      createType: "",
      createName: "",
      provisioner: {},
      form: {
        apiVersion: "storage.k8s.io/v1",
        kind: "StorageClass",
        metadata: {
          name: "",
        },
        provisioner: "",
        parameters: {
          storagePolicyType: "",
        },
      },
    }
  },
  methods: {
    getProvisioner() {
      listProvisioner(this.clusterName).then((data) => {
        this.provisioners = data
        this.provisioners.push({
          name: "kubernetes.io/no-provisioner",
          type: "local-storage",
          parameters: {},
          status: "Running",
        })
        this.dialogClassVisible = true
      })
    },
    onSubmit() {
      if (this.provisioner.type === "glusterfs") {
        const mySecret = this.newV1Secrets()
        createSecret(this.clusterName, this.form.parameters["secretNamespace"], mySecret).then((data) => {
          console.log(data)
          if (this.item.parameters["restuserkey"]) {
            delete this.item.parameters["restuserkey"]
          }
          this.addStorageClass()
        })
      } else {
        this.addStorageClass()
      }
    },
    addStorageClass() {
      if (this.form.parameters["storagePolicyType"]) {
        delete this.form.parameters["storagePolicyType"]
      }
      createStorageClass(this.clusterName, this.form).then(
        (data) => {
          this.$message({ type: "success", message: this.$t("commons.msg.save_success") })
          this.$router.push({ name: "ClusterStorage" })
          console.log(data)
        },
        (error) => {
          this.$message({ type: "error", message: error.error })
        }
      )
    },
    onCancel() {
      this.$router.push({ name: "ClusterStorage" })
    },
    checkSecrets() {
      console.log("zouiosadqwdq")
      getSecretByName(this.clusterName, this.form.parameters["secretName"], this.form.parameters["secretNamespace"]).then(
        (data) => {
          console.log(data)
          this.isSecretsExit = true
        },
        (error) => {
          console.log(error)
          this.isSecretsExit = false
          return
        }
      )
    },
    changeClassType() {
      this.createType = this.provisioner.type
      this.form.provisioner = this.provisioner.name
      switch (this.createType) {
        case "rook-ceph":
          this.form.parameters["clusterID"] = "rook-ceph"
          this.form.parameters["pool"] = "replicapool"
          this.form.parameters["imageFormat"] = "2"
          this.form.parameters["imageFeatures"] = "layering"
          this.form.parameters["csi.storage.k8s.io/provisioner-secret-name"] = "rook-csi-rbd-provisioner"
          this.form.parameters["csi.storage.k8s.io/provisioner-secret-namespace"] = "rook-ceph"
          this.form.parameters["csi.storage.k8s.io/controller-expand-secret-name"] = "rook-csi-rbd-provisioner"
          this.form.parameters["csi.storage.k8s.io/controller-expand-secret-namespace"] = "rook-ceph"
          this.form.parameters["csi.storage.k8s.io/node-stage-secret-name"] = "rook-csi-rbd-node"
          this.form.parameters["csi.storage.k8s.io/node-stage-secret-namespace"] = "rook-ceph"
          this.form.parameters["csi.storage.k8s.io/fstype"] = "ext4"
          break
        case "vsphere":
          this.form.parameters["datastore"] = this.provisioner.vars["datastore"]
          this.form.parameters["storagePolicyName"] = "vSAN Default Storage Policy"
          this.form.parameters["storagePolicyType"] = "BuiltIn"
          break
        case "glusterfs":
          this.form.parameters["secretNamespace"] = "kube-system"
          this.form.parameters["restauthenabled"] = "true"
          this.form.parameters["gidMin"] = "40000"
          this.form.parameters["gidMax"] = "50000"
          this.form.parameters["volumetype"] = "replicate:3"
          break
        case "cinder":
          this.form.allowVolumeExpansion = true
          break
      }
    },
    newV1Secrets() {
      return {
        apiVersion: "v1",
        kind: "Secret",
        metadata: {
          name: this.form.parameters["secretName"],
          namespace: this.form.parameters["secretNamespace"],
        },
        stringData: {
          key: this.form.parameters["restuserkey"],
        },
        type: "kubernetes.io/glusterfs",
      }
    },
  },
  created() {
    this.clusterName = this.$route.params.name
    this.getProvisioner()
  },
}
</script>

<style scoped>
</style>
