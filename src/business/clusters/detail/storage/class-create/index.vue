<template>
  <layout-content>
    <el-row style="margin-top: 20px">
      <el-col :span="4"><br /></el-col>
      <el-col :span="10">
        <div class="grid-content bg-purple-light">
          <el-form label-position='left' :model="form" ref="form" label-width="200px">
            <el-form-item :label="$t('commons.table.name')" prop="metadata.name" :rules="nameRules">
              <el-input size="small" v-model="form.metadata.name"></el-input>
              <div><span class="input-help">{{$t('commons.validate.common_name_help')}}</span></div>
            </el-form-item>
            <el-form-item :label="$t('cluster.detail.storage.provisioner_short')" required>
              <el-select style="width: 100%" size="small" @change="changeClassType()" v-model="provisioner" value-key="name" clearable>
                <el-option v-for="item of provisioners" :disabled="item.status !== 'Running'" :key="item.name" :label="'['+item.type+']'+item.name" :value="item">[{{item.type}}]{{item.name}}</el-option>
              </el-select>
            </el-form-item>

            <div v-if="createType === 'nfs'">
              <el-form-item :label="$t('cluster.detail.storage.provisioner_name')" required>
                <el-input v-model="form.provisioner" disabled></el-input>
              </el-form-item>
            </div>
            <div v-if="createType === 'external-ceph'">
              <el-form-item :label="$t('commons.table.name')" required>
                <el-input v-model="form.provisioner" disabled></el-input>
              </el-form-item>
              <el-form-item label="Monitor" prop="parameters.monitors" :rules="requiredRules">
                <el-input v-model="form.parameters['monitors']" placeholder=" 172.16.10.10:6389" clearable></el-input>
              </el-form-item>
              <el-form-item label="OSD Pool" prop="parameters.pool" :rules="requiredRules">
                <el-input v-model="form.parameters['pool']" placeholder=" kube" clearable></el-input>
              </el-form-item>
              <el-form-item label="Admin Id" prop="parameters.adminId" :rules="requiredRules">
                <el-input v-model="form.parameters['adminId']" placeholder=" secret" clearable></el-input>
              </el-form-item>
              <el-form-item label="Admin Secret Name" prop="parameters.adminSecretName" :rules="requiredRules">
                <el-input v-model="form.parameters['adminSecretName']" placeholder=" secret" clearable></el-input>
              </el-form-item>
              <el-form-item label="Admin Secret Namespace" prop="parameters.adminSecretName" :rules="requiredRules">
                <el-input v-model="form.parameters['adminSecretNamespace']" placeholder=" kube-system" clearable></el-input>
              </el-form-item>
              <el-form-item label="User Id" prop="parameters.userId" :rules="requiredRules">
                <el-input v-model="form.parameters['userId']" placeholder=" kube" clearable></el-input>
              </el-form-item>
              <el-form-item label="User Secret Name" prop="parameters.userSecretName" :rules="requiredRules">
                <el-input v-model="form.parameters['userSecretName']" placeholder=" secret" clearable></el-input>
              </el-form-item>
              <el-form-item label="FS Type" prop="parameters.fsType" :rules="requiredRules">
                <el-input v-model="form.parameters['fsType']" placeholder=" ext4" clearable></el-input>
              </el-form-item>
              <el-form-item label="ImageFormat" prop="parameters.imageFormat" :rules="requiredRules">
                <el-input v-model="form.parameters['imageFormat']" placeholder=" 2" clearable></el-input>
              </el-form-item>
            </div>
            <div v-if="createType === 'rook-ceph'">
              <el-form-item :label="$t('commons.table.name')" required>
                <el-input v-model="form.provisioner" disabled></el-input>
              </el-form-item>
            </div>
            <div v-if="createType === 'cinder'">
              <el-form-item :label="$t('commons.table.name')" required>
                <el-input v-model="form.provisioner" disabled></el-input>
              </el-form-item>
            </div>
            <div v-if="createType === 'vsphere'">
              <el-form-item :label="$t('commons.table.name')" required>
                <el-input v-model="form.provisioner" disabled></el-input>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.class.storage_policy_type')">
                <el-radio-group v-model="form.parameters['storagePolicyType']">
                  <el-radio label="BuiltIn">{{$t('cluster.detail.storage.class.build_in')}}</el-radio>
                  <el-radio label="Custom">{{$t('cluster.detail.storage.class.custom')}}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="form.parameters['storagePolicyType']==='BuiltIn'" :label="$t('cluster.detail.storage.class.storage_policy')" prop="parameters.storagePolicyName" :rules="requiredRules">
                <el-select style="width: 100%" v-model="form.parameters['storagePolicyName']">
                  <el-option value='vSAN Default Storage Policy' label='vSAN Default Storage Policy' />
                  <el-option value='Management Storage Policy - Large' label='Management Storage Policy - Large' />
                  <el-option value='Management Storage Policy - Single Node' label='Management Storage Policy - Single Node' />
                  <el-option value='Management Storage policy - Thin' label='Management Storage policy - Thin' />
                  <el-option value='Management Storage Policy - Stretched' label='Management Storage Policy - Stretched' />
                </el-select>
              </el-form-item>
              <el-form-item v-if="form.parameters['storagePolicyType']==='Custom'" :label="$t('cluster.detail.storage.class.storage_policy')" prop="parameters.storagePolicyName" :rules="requiredRules">
                <el-input style="width: 100%" v-model="form.parameters['storagePolicyName']" />
              </el-form-item>
            </div>
            <div v-if="createType === 'glusterfs'">
              <el-form-item :label="$t('commons.table.name')" required>
                <el-input v-model="form.provisioner" disabled></el-input>
              </el-form-item>
              <el-form-item label="resturl" prop="parameters.resturl" :rules="requiredRules">
                <el-input v-model="form.parameters['resturl']" placeholder=" 172.0.0.1:8081" clearable></el-input>
              </el-form-item>
              <el-form-item label="restuser" prop="parameters.restuser" :rules="requiredRules">
                <el-input v-model="form.parameters['restuser']" placeholder=" admin" clearable></el-input>
              </el-form-item>
              <el-form-item label="restpassword" prop="parameters.restuserkey" :rules="passwordRules">
                <el-input v-model="form.parameters['restuserkey']" type="password" name="restuserkey" clearable></el-input>
              </el-form-item>
              <el-form-item label="Namespace" prop="parameters.secretNamespace" :rules="requiredRules">
                <el-input v-model="form.parameters['secretNamespace']" placeholder=" kube-system" clearable></el-input>
              </el-form-item>
              <el-form-item label="secretName" prop="parameters.secretName" :rules="requiredRules">
                <el-input v-model="form.parameters['secretName']" placeholder=" heketi-secret" clearable></el-input>
              </el-form-item>
              <el-form-item label="clusterid" prop="parameters.clusterid" :rules="requiredRules">
                <el-input v-model="form.parameters['clusterid']" placeholder=" 8a4ff57af81910e8324368a23afe3bdc" clearable></el-input>
              </el-form-item>
              <el-form-item label="gidmin" prop="parameters.gidMin" :rules="requiredRules">
                <el-input v-model="form.parameters['gidMin']" placeholder=" 40000" clearable></el-input>
              </el-form-item>
              <el-form-item label="gidmax" prop="parameters.gidMax" :rules="requiredRules">
                <el-input v-model="form.parameters['gidMax']" placeholder=" 50000" clearable></el-input>
              </el-form-item>
              <el-form-item label="volumetype" prop="parameters.volumetype" :rules="requiredRules">
                <el-input v-model="form.parameters['volumetype']" placeholder=" replicate:3" clearable></el-input>
              </el-form-item>
            </div>
            <div v-if="createType === 'oceanstor'">
              <el-form-item :label="$t('commons.table.name')" required>
                <el-input v-model="form.provisioner" disabled></el-input>
              </el-form-item>
              <el-form-item label="volumeType" prop="parameters.volumeType" :rules="requiredRules">
                <el-select style="width: 100%" v-model="form.parameters['volumeType']">
                  <el-option value='lun' label='lun'>lun</el-option>
                  <el-option value='fs' label='fs'>fs</el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="form.parameters['volumeType'] === 'fs'" label="authClient" prop="parameters.authClient" :rules="requiredRules">
                <el-input v-model="form.parameters['authClient']" placeholder="demo1,demo2" />
              </el-form-item>
              <el-form-item label="allocType" prop="parameters.allocType" :rules="requiredRules">
                <el-select style="width: 100%" v-model="form.parameters['allocType']">
                  <el-option value='thin' label='thin'>thin</el-option>
                  <el-option value='thick' label='thick'>thick</el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="cloneFrom" prop="parameters.cloneFrom" :rules="requiredRules">
                <el-input v-model="form.parameters['cloneFrom']" clearable />
                <div><span class="input-help">{{$t('cluster.detail.storage.class.clone_form_help')}}</span></div>
              </el-form-item>
              <el-form-item label="cloneSpeed" prop="parameters.cloneSpeed" :rules="requiredRules">
                <el-input v-model="form.parameters['cloneSpeed']" placeholder="1-4" />
                <div><span class="input-help">{{$t('cluster.detail.storage.class.clone_speed_help')}}</span></div>
              </el-form-item>
              <el-form-item label="fsType" prop="parameters.fsType" :rules="requiredRules">
                <el-select style="width: 100%" v-model="form.parameters['fsType']">
                  <el-option value='ext2' label='ext2'>ext2</el-option>
                  <el-option value='ext3' label='ext3'>ext3</el-option>
                  <el-option value='ext4' label='ext4'>ext4</el-option>
                </el-select>
                <div><span class="input-help">{{$t('commons.validate.common_name_help')}}</span></div>
              </el-form-item>
            </div>
            <el-form-item>
              <div style="float: right">
                <el-button @click="onCancel()">{{$t('commons.button.cancel')}}</el-button>
                <el-button type="primary" :disabled="!(createType && form.metadata.name) || submitLoading" @click="onSubmit">{{$t('commons.button.submit')}}</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </layout-content>
</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent"
import { listProvisioner, createStorageClass, createSecret } from "@/api/cluster/storage"
import Rule from "@/utils/rules"

export default {
  name: "ClusterStorageClassCreate",
  components: { LayoutContent },
  data() {
    return {
      submitLoading: false,
      provisioners: [],
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
      nameRules: [Rule.CommonNameRule],
      requiredRules: [Rule.RequiredRule],
      passwordRules: [Rule.RequiredRule],
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
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.submitLoading = true
          if (this.provisioner.type === "glusterfs") {
            const mySecret = this.newV1Secrets()
            createSecret(this.clusterName, this.form.parameters["secretNamespace"], mySecret)
              .then(() => {
                if (this.form.parameters["restuserkey"]) {
                  delete this.form.parameters["restuserkey"]
                }
                this.addStorageClass()
              })
              .catch(() => {
                if (this.form.parameters["restuserkey"]) {
                  delete this.form.parameters["restuserkey"]
                }
                this.addStorageClass()
              })
          } else {
            this.addStorageClass()
          }
        } else {
          return false
        }
      })
    },
    addStorageClass() {
      if (this.form.parameters["storagePolicyType"]) {
        delete this.form.parameters["storagePolicyType"]
      }
      createStorageClass(this.clusterName, this.form)
        .then(() => {
          this.$message({ type: "success", message: this.$t("commons.msg.save_success") })
          this.submitLoading = false
          this.$router.push({ name: "ClusterStorage" })
        })
        .catch(() => {
          this.submitLoading = false
        })
    },
    onCancel() {
      this.$router.push({ name: "ClusterStorage" })
    },
    changeClassType() {
      this.createType = this.provisioner.type
      this.form.provisioner = this.provisioner.name
      switch (this.createType) {
        case "rook-ceph":
          this.form.parameters = {
            clusterID: "rook-ceph",
            pool: "replicapool",
            imageFormat: "2",
            imageFeatures: "layering",
            "csi.storage.k8s.io/provisioner-secret-name": "rook-csi-rbd-provisioner",
            "csi.storage.k8s.io/provisioner-secret-namespace": "rook-ceph",
            "csi.storage.k8s.io/controller-expand-secret-name": "rook-csi-rbd-provisioner",
            "csi.storage.k8s.io/controller-expand-secret-namespace": "rook-ceph",
            "csi.storage.k8s.io/node-stage-secret-name": "rook-csi-rbd-node",
            "csi.storage.k8s.io/node-stage-secret-namespace": "rook-ceph",
            "csi.storage.k8s.io/fstype": "ext4",
          }
          break
        case "vsphere":
          this.form.parameters = {
            datastore: this.provisioner.vars["datastore"],
            storagePolicyName: "vSAN Default Storage Policy",
            storagePolicyType: "BuiltIn",
          }
          break
        case "glusterfs":
          this.form.parameters = {
            secretNamespace: "kube-system",
            restauthenabled: "true",
            gidMin: "40000",
            gidMax: "50000",
            volumetype: "replicate:3",
          }
          break
        case "cinder":
          this.form = {
            allowVolumeExpansion: true,
          }
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
