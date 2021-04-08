<template>
  <layout-content>
    <el-row style="margin-top: 20px">
      <el-col :span="3"><br /></el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple-light">
          <el-form :model="form" label-width="200px">
            <el-form-item :label="$t('cluster.detail.storage.type')">
              <el-select style="width: 100%" @change="changePvType()" size="small" v-model="pvType">
                <el-option value="Host Path" label="Host Path">Host Path</el-option>
                <el-option value="Local Volume" label="Local Volume">Local Volume</el-option>
              </el-select>
            </el-form-item>

            <div v-if="pvType === 'Host Path'">
              <el-form-item :label="$t('commons.table.name')">
                <el-input v-model="form.metadata.name" clearable></el-input>
                <div><span class="input-help">{{$t('cluster.detail.storage.provisioner_name_helper')}}</span></div>
              </el-form-item>
              <el-form-item label="Size (Gib)">
                <el-input type="number" v-model="form.spec.capacity['storage']" clearable></el-input>
              </el-form-item>
              <el-form-item label="Access Mode">
                <el-select style="width: 100%" size="small" v-model="accessMode">
                  <el-option value="ReadWriteOnce" label="ReadWriteOnce">ReadWriteOnce</el-option>
                  <el-option value="ReadWriteMany" label="ReadWriteMany">ReadWriteMany</el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Host Path">
                <el-input v-model="form.spec.hostPath.path" clearable></el-input>
              </el-form-item>
              <el-form-item label="Node Selector">
                <el-col :span="12">
                  <el-input v-model="selectorKey" placeholder="e.g. kubernetes.io/hostname" clearable></el-input>
                </el-col>
                <el-col :span="12">
                  <el-select style="width: 100%" size="small" v-model="selectorOperation">
                    <el-option value="In" label="In">In</el-option>
                    <el-option value="NotIn" label="NotIn">NotIn</el-option>
                    <el-option value="Exists" label="Exists">Exists</el-option>
                    <el-option value="DoesNotExist" label="DoesNotExist">DoesNotExist</el-option>
                  </el-select>
                </el-col>
              </el-form-item>
              <el-form-item v-if="selectorOperation === 'In' || selectorOperation === 'NotIn'" label="Node Selector">
                <el-input v-model="selectorValue" placeholder="node1,node2" clearable></el-input>
              </el-form-item>
            </div>
            <div v-if="pvType === 'Local Volume'">
              <el-form-item :label="$t('commons.table.name')">
                <el-input v-model="form.metadata.name" clearable></el-input>
                <div><span class="input-help">{{$t('cluster.detail.storage.provisioner_name_helper')}}</span></div>
              </el-form-item>
              <el-form-item label="Size (Gib)">
                <el-input v-model="form.spec.capacity['storage']" clearable></el-input>
              </el-form-item>
              <el-form-item label="Access Mode">
                <el-select style="width: 100%" size="small" v-model="accessMode">
                  <el-option value="ReadWriteOnce" label="ReadWriteOnce">ReadWriteOnce</el-option>
                  <el-option value="ReadWriteMany" label="ReadWriteMany">ReadWriteMany</el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Path">
                <el-input v-model="form.spec.local.path" clearable></el-input>
              </el-form-item>
              <el-form-item label="StorageClass">
                <el-select style="width: 100%" size="small" v-model="storageClassName">
                  <option v-for="sc in storageClassList" :key="sc.metadata.name" [value]="sc.metadata.name">{{sc.metadata.name}}</option>
                </el-select>
              </el-form-item>
              <el-form-item label="Node Selector">
                <el-col :span="12">
                  <el-input v-model="selectorKey" placeholder="e.g. kubernetes.io/hostname" clearable></el-input>
                </el-col>
                <el-col :span="12">
                  <el-select style="width: 100%" size="small" v-model="selectorOperation">
                    <el-option value="In" label="In">In</el-option>
                    <el-option value="NotIn" label="NotIn">NotIn</el-option>
                    <el-option value="Exists" label="Exists">Exists</el-option>
                    <el-option value="DoesNotExist" label="DoesNotExist">DoesNotExist</el-option>
                  </el-select>
                </el-col>
              </el-form-item>
            </div>
            <el-form-item>
              <el-button @click="onCancel()">{{$t('commons.button.cancel')}}</el-button>
              <el-button type="primary" :disabled="!pvType" @click="onSubmit">{{$t('commons.button.submit')}}</el-button>
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
import { listStorageClass, createPersistentVolume } from "@/api/cluster/storage"

export default {
  name: "ProvisionerCreate",
  components: { LayoutContent },
  data() {
    return {
      pvType: "",
      accessMode: "ReadWriteOnce",
      selectorKey: "",
      selectorValue: "",
      selectorOperation: "In",
      storageClassName: "",
      storageClassList: [],
      form: {
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
    }
  },
  methods: {
    getClassList() {
      listStorageClass(this.clusterName, null, true).then((data) => {
        this.storageClassList = data.items.filter((sc) => {
          return sc.provisioner === "kubernetes.io/no-provisioner"
        })
      })
    },
    changePvType() {
      if (this.pvType === "Local Volume") {
        this.getClassList()
      }
    },
    onSubmit() {
      if (this.pvType === "Local Volume") {
        delete this.form.spec["hostPath"]
      } else {
        delete this.form.spec["storageClassName"]
        delete this.form.spec["local"]
      }
      this.form.spec.accessModes.push(this.accessMode)
      if (this.selectorOperation && this.selectorKey) {
        if (["Exists", "DoesNotExist"].includes(this.selectorOperation)) {
          this.form.spec.nodeAffinity.required.nodeSelectorTerms[0].matchExpressions[0] = {
            key: this.selectorKey,
            operator: this.selectorOperation,
          }
        }
        if (["In", "NotIn"].includes(this.selectorOperation)) {
          this.form.spec.nodeAffinity.required.nodeSelectorTerms[0].matchExpressions[0] = {
            key: this.selectorKey,
            operator: this.selectorOperation,
          }
          if (this.selectorValue) {
            this.form.spec.nodeAffinity.required.nodeSelectorTerms[0].matchExpressions[0].values = this.selectorValue.split(",")
          }
        }
      } else {
        delete this.form.spec["nodeAffinity"]
      }
      this.form.spec.capacity["storage"] += "Gi"
      createPersistentVolume(this.clusterName, this.form).then(() => {
        this.$message({ type: "success", message: this.$t("commons.msg.create_success") })
      })
    },
    onCancel() {
      this.$router.push({ name: "ClusterStorage" })
    },
  },
  created() {
    this.clusterName = this.$route.params.name
  },
}
</script>

<style scoped>
</style>
