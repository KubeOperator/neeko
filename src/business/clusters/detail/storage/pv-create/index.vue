<template>
  <layout-content>
    <el-row style="margin-top: 20px">
      <el-col :span="4"><br /></el-col>
      <el-col :span="10">
        <div class="grid-content bg-purple-light">
          <el-form label-position='left' :model="form" ref="form" label-width="200px">
            <el-form-item :label="$t('cluster.detail.storage.type')" :rules="requiredRules">
              <el-select style="width: 100%" @change="changePvType()" size="small" v-model="pvType">
                <el-option value="Host Path" label="Host Path">Host Path</el-option>
                <el-option value="Local Volume" label="Local Volume">Local Volume</el-option>
                <el-option value="NFS Share" label="NFS Share">NFS Share</el-option>
              </el-select>
            </el-form-item>

            <div v-if="pvType === 'Host Path'">
              <el-form-item :label="$t('commons.table.name')" prop="submitForm.metadata.name" :rules="nameRules">
                <el-input v-model="form.submitForm.metadata.name" clearable></el-input>
                <div><span class="input-help">{{$t('commons.validate.common_name_help')}}</span></div>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.pv_create.size')" prop="submitForm.spec.capacity.storage" :rules="numberRules">
                <el-input-number v-model="form.submitForm.spec.capacity.storage"></el-input-number>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.pv_create.access_mode')" prop="accessMode">
                <el-select style="width: 100%" size="small" v-model="form.accessMode">
                  <el-option value="ReadWriteOnce" :label="$t('cluster.detail.storage.pv_create.read_write_once')">{{$t('cluster.detail.storage.pv_create.read_write_once')}}</el-option>
                  <el-option value="ReadWriteMany" :label="$t('cluster.detail.storage.pv_create.read_write_many')">{{$t('cluster.detail.storage.pv_create.read_write_many')}}</el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.pv_create.host_path')" prop="submitForm.spec.hostPath.path" :rules="requiredRules">
                <el-input v-model="form.submitForm.spec.hostPath.path" clearable></el-input>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.pv_create.node_selector')" prop="selectorKey">
                <el-col :span="12">
                  <el-input v-model="form.selectorKey" placeholder="e.g. kubernetes.io/hostname" clearable></el-input>
                </el-col>
                <el-col :span="12">
                  <el-select style="width: 100%" size="small" v-model="form.selectorOperation">
                    <el-option value="Exists" :label="$t('cluster.detail.storage.pv_create.exists')">{{$t('cluster.detail.storage.pv_create.exists')}}</el-option>
                    <el-option value="DoesNotExist" :label="$t('cluster.detail.storage.pv_create.does_not_exist')">{{$t('cluster.detail.storage.pv_create.does_not_exist')}}</el-option>
                    <el-option value="In" :label="$t('cluster.detail.storage.pv_create.in')">{{$t('cluster.detail.storage.pv_create.in')}}</el-option>
                    <el-option value="NotIn" :label="$t('cluster.detail.storage.pv_create.not_in')">{{$t('cluster.detail.storage.pv_create.not_in')}}</el-option>
                  </el-select>
                </el-col>
              </el-form-item>
              <el-form-item v-if="form.selectorOperation === 'In' || form.selectorOperation === 'NotIn'" label="" prop="selectorValue">
                <el-input v-model="form.selectorValue" placeholder="node1,node2" clearable></el-input>
              </el-form-item>
            </div>

            <div v-if="pvType === 'Local Volume'">
              <el-form-item :label="$t('commons.table.name')" prop="submitForm.metadata.name" :rules="requiredRules">
                <el-input v-model="form.submitForm.metadata.name" clearable></el-input>
                <div><span class="input-help">{{$t('commons.validate.common_name_help')}}</span></div>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.pv_create.size')" prop="submitForm.spec.capacity.storage" :rules="requiredRules">
                <el-input-number v-model="form.submitForm.spec.capacity.storage"></el-input-number>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.pv_create.access_mode')" prop="accessMode">
                <el-select style="width: 100%" size="small" v-model="form.accessMode">
                  <el-option value="ReadWriteOnce" :label="$t('cluster.detail.storage.pv_create.read_write_once')">{{$t('cluster.detail.storage.pv_create.read_write_once')}}</el-option>
                  <el-option value="ReadWriteMany" :label="$t('cluster.detail.storage.pv_create.read_write_many')">{{$t('cluster.detail.storage.pv_create.read_write_many')}}</el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.pv_create.path')" prop="submitForm.spec.local.path" :rules="requiredRules">
                <el-input v-model="form.submitForm.spec.local.path" clearable></el-input>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.pv_create.storage_class')" prop="submitForm.spec.storageClassName">
                <el-select style="width: 100%" size="small" v-model="form.submitForm.spec.storageClassName">
                  <el-option v-for="sc in storageClassList" :key="sc.metadata.name" :value="sc.metadata.name">{{sc.metadata.name}}</el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.pv_create.node_selector')" prop="selectorKey">
                <el-col :span="12">
                  <el-input v-model="form.selectorKey" placeholder="e.g. kubernetes.io/hostname" clearable></el-input>
                </el-col>
                <el-col :span="12">
                  <el-select style="width: 100%" size="small" v-model="form.selectorOperation">
                    <el-option value="Exists" :label="$t('cluster.detail.storage.pv_create.exists')">{{$t('cluster.detail.storage.pv_create.exists')}}</el-option>
                    <el-option value="DoesNotExist" :label="$t('cluster.detail.storage.pv_create.does_not_exist')">{{$t('cluster.detail.storage.pv_create.does_not_exist')}}</el-option>
                    <el-option value="In" :label="$t('cluster.detail.storage.pv_create.in')">{{$t('cluster.detail.storage.pv_create.in')}}</el-option>
                    <el-option value="NotIn" :label="$t('cluster.detail.storage.pv_create.not_in')">{{$t('cluster.detail.storage.pv_create.not_in')}}</el-option>
                  </el-select>
                </el-col>
              </el-form-item>
              <el-form-item v-if="form.selectorOperation === 'In' || form.selectorOperation === 'NotIn'" label="" prop="selectorValue">
                <el-input v-model="form.selectorValue" placeholder="node1,node2" clearable></el-input>
              </el-form-item>
            </div>

            <div v-if="pvType === 'NFS Share'">
              <el-form-item :label="$t('commons.table.name')" prop="submitForm.metadata.name" :rules="requiredRules">
                <el-input v-model="form.submitForm.metadata.name" clearable></el-input>
                <div><span class="input-help">{{$t('commons.validate.common_name_help')}}</span></div>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.pv_create.size')" prop="submitForm.spec.capacity.storage" :rules="requiredRules">
                <el-input-number v-model="form.submitForm.spec.capacity.storage"></el-input-number>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.pv_create.access_mode')" prop="accessMode">
                <el-select style="width: 100%" size="small" v-model="form.accessMode">
                  <el-option value="ReadWriteOnce" :label="$t('cluster.detail.storage.pv_create.read_write_once')">{{$t('cluster.detail.storage.pv_create.read_write_once')}}</el-option>
                  <el-option value="ReadWriteMany" :label="$t('cluster.detail.storage.pv_create.read_write_many')">{{$t('cluster.detail.storage.pv_create.read_write_many')}}</el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.pv_create.path')" prop="submitForm.spec.nfs.path" :rules="requiredRules">
                <el-input v-model="form.submitForm.spec.nfs.path" clearable></el-input>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.pv_create.server')" prop="submitForm.spec.nfs.server" :rules="requiredRules">
                <el-input v-model="form.submitForm.spec.nfs.server" clearable></el-input>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.pv_create.read_only')" prop="submitForm.spec.nfs.readOnly" :rules="requiredRules">
                <el-switch v-model="form.submitForm.spec.nfs.readOnly" active-value=true inactive-value=false />
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.pv_create.storage_class')" prop="submitForm.spec.storageClassName">
                <el-select style="width: 100%" size="small" v-model="form.submitForm.spec.storageClassName">
                  <el-option v-for="sc in storageClassAllList" :key="sc.metadata.name" :value="sc.metadata.name">{{sc.metadata.name}}</el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.pv_create.node_selector')" prop="selectorKey">
                <el-col :span="12">
                  <el-input v-model="form.selectorKey" placeholder="e.g. kubernetes.io/hostname" clearable></el-input>
                </el-col>
                <el-col :span="12" prop="metadata.name">
                  <el-select style="width: 100%" size="small" v-model="form.selectorOperation">
                    <el-option value="Exists" :label="$t('cluster.detail.storage.pv_create.exists')">{{$t('cluster.detail.storage.pv_create.exists')}}</el-option>
                    <el-option value="DoesNotExist" :label="$t('cluster.detail.storage.pv_create.does_not_exist')">{{$t('cluster.detail.storage.pv_create.does_not_exist')}}</el-option>
                    <el-option value="In" :label="$t('cluster.detail.storage.pv_create.in')">{{$t('cluster.detail.storage.pv_create.in')}}</el-option>
                    <el-option value="NotIn" :label="$t('cluster.detail.storage.pv_create.not_in')">{{$t('cluster.detail.storage.pv_create.not_in')}}</el-option>
                  </el-select>
                </el-col>
              </el-form-item>
              <el-form-item v-if="form.selectorOperation === 'In' || form.selectorOperation === 'NotIn'" label="" prop="selectorValue">
                <el-input v-model="form.selectorValue" placeholder="node1,node2" clearable></el-input>
              </el-form-item>
            </div>
            <el-form-item>
              <div style="float: right">
                <el-button @click="onCancel()">{{$t('commons.button.cancel')}}</el-button>
                <el-button type="primary" :disabled="!pvType || submitLoading" @click="onSubmit">{{$t('commons.button.submit')}}</el-button>
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
import { listStorageClass, createPersistentVolume } from "@/api/cluster/storage"
import Rule from "@/utils/rules"

export default {
  name: "ClusterStoragePvCreate",
  components: { LayoutContent },
  data() {
    return {
      submitLoading: false,
      storageClassList: [],
      storageClassAllList: [],
      pvType: "",
      form: {
        selectorOperation: "In",
        selectorValue: "",
        accessMode: "ReadWriteOnce",
        selectorKey: "",
        submitForm: {
          apiVersion: "v1",
          kind: "PersistentVolume",
          metadata: {
            name: "",
          },
          spec: {
            capacity: {},
            accessModes: [],
            hostPath: {
              path: "",
            },
            storageClassName: "",
            local: {
              path: "",
            },
            nfs: {
              path: "",
              readOnly: "",
              server: "",
            },
            nodeAffinity: {
              required: {
                nodeSelectorTerms: [
                  {
                    matchExpressions: [
                      {
                        key: "",
                        operator: "",
                        values: [],
                      },
                    ],
                  },
                ],
              },
            },
          },
        },
      },
      nameRules: [Rule.CommonNameRule],
      numberRules: [Rule.NumberRule],
      requiredRules: [Rule.RequiredRule],
    }
  },
  methods: {
    loadClassList() {
      listStorageClass(this.clusterName, null, true).then((data) => {
        this.storageClassList = data.items.filter((sc) => {
          return sc.provisioner === "kubernetes.io/no-provisioner"
        })
        this.storageClassAllList = data.items
      })
    },
    changePvType() {
      if (this.$refs["form"] !== undefined) {
        this.$refs["form"].resetFields()
      }
    },
    onSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.submitLoading = true
          switch (this.pvType) {
            case "Local Volume":
              delete this.form.submitForm.spec["hostPath"]
              delete this.form.submitForm.spec["nfs"]
              break
            case "Host Path":
              delete this.form.submitForm.spec["local"]
              delete this.form.submitForm.spec["nfs"]
              delete this.form.submitForm.spec["storageClassName"]
              break
            case "NFS Share":
              delete this.form.submitForm.spec["hostPath"]
              delete this.form.submitForm.spec["local"]
              if (this.form.submitForm.spec.nfs.readOnly) {
                delete this.form.submitForm.spec.nfs["readOnly"]
              }
              break
          }
          this.form.submitForm.spec.accessModes.push(this.form.accessMode)
          if (this.form.selectorOperation && this.form.selectorKey) {
            if (["Exists", "DoesNotExist"].includes(this.form.selectorOperation)) {
              this.form.submitForm.spec.nodeAffinity.required.nodeSelectorTerms[0].matchExpressions[0] = {
                key: this.form.selectorKey,
                operator: this.form.selectorOperation,
              }
            }
            if (["In", "NotIn"].includes(this.form.selectorOperation)) {
              this.form.submitForm.spec.nodeAffinity.required.nodeSelectorTerms[0].matchExpressions[0] = {
                key: this.form.selectorKey,
                operator: this.form.selectorOperation,
              }
              if (this.form.selectorValue) {
                this.form.submitForm.spec.nodeAffinity.required.nodeSelectorTerms[0].matchExpressions[0].values = this.form.selectorValue.split(",")
              }
            }
          } else {
            delete this.form.submitForm.spec["nodeAffinity"]
          }
          this.form.submitForm.spec.capacity["storage"] += "Gi"
          createPersistentVolume(this.clusterName, this.form.submitForm)
            .then(() => {
              this.$message({ type: "success", message: this.$t("commons.msg.create_success") })
              this.$router.push({ name: "ClusterStorage" })
              this.submitLoading = false
            })
            .catch(() => {
              this.submitLoading = false
            })
        } else {
          return false
        }
      })
    },
    onCancel() {
      this.$router.push({ name: "ClusterStorage" })
    },
  },
  created() {
    this.clusterName = this.$route.params.name
    this.loadClassList()
  },
}
</script>

<style scoped>
</style>
