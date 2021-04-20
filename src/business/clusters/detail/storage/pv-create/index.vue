<template>
  <layout-content>
    <el-row style="margin-top: 20px">
      <el-col :span="3"><br /></el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple-light">
          <el-form :model="form" ref="form" label-width="200px">
            <el-form-item :label="$t('cluster.detail.storage.type')" prop="pvType" :rules="emptyRulesChange">
              <el-select style="width: 100%" @change="changePvType()" size="small" v-model="form.pvType">
                <el-option value="Host Path" label="Host Path">Host Path</el-option>
                <el-option value="Local Volume" label="Local Volume">Local Volume</el-option>
              </el-select>
            </el-form-item>

            <div v-if="form.pvType === 'Host Path'">
              <el-form-item :label="$t('commons.table.name')" prop="submitForm.metadata.name" :rules="emptyRulesInput">
                <el-input v-model="form.submitForm.metadata.name" clearable></el-input>
                <div><span class="input-help">{{$t('cluster.detail.storage.provisioner_name_helper')}}</span></div>
              </el-form-item>
              <el-form-item label="Size (Gib)" prop="submitForm.spec.capacity.storage" :rules="emptyRulesInput">
                <el-input type="number" v-model="form.submitForm.spec.capacity.storage" clearable></el-input>
              </el-form-item>
              <el-form-item label="Access Mode" prop="accessMode" :rules="emptyRulesChange">
                <el-select style="width: 100%" size="small" v-model="form.accessMode">
                  <el-option value="ReadWriteOnce" label="ReadWriteOnce">ReadWriteOnce</el-option>
                  <el-option value="ReadWriteMany" label="ReadWriteMany">ReadWriteMany</el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Host Path" prop="submitForm.spec.hostPath.path" :rules="emptyRulesInput">
                <el-input v-model="form.submitForm.spec.hostPath.path" clearable></el-input>
              </el-form-item>
              <el-form-item label="Node Selector" prop="selectorKey" :rules="emptyRulesInput">
                <el-col :span="12">
                  <el-input v-model="form.selectorKey" placeholder="e.g. kubernetes.io/hostname" clearable></el-input>
                </el-col>
                <el-col :span="12">
                  <el-select style="width: 100%" size="small" v-model="form.selectorOperation">
                    <el-option value="In" label="In">In</el-option>
                    <el-option value="NotIn" label="NotIn">NotIn</el-option>
                    <el-option value="Exists" label="Exists">Exists</el-option>
                    <el-option value="DoesNotExist" label="DoesNotExist">DoesNotExist</el-option>
                  </el-select>
                </el-col>
              </el-form-item>
              <el-form-item v-if="form.selectorOperation === 'In' || form.selectorOperation === 'NotIn'" label="Node Selector" prop="selectorValue" :rules="emptyRulesInput">
                <el-input v-model="form.selectorValue" placeholder="node1,node2" clearable></el-input>
              </el-form-item>
            </div>
            <div v-if="form.pvType === 'Local Volume'">
              <el-form-item :label="$t('commons.table.name')" prop="submitForm.metadata.name" :rules="emptyRulesInput">
                <el-input v-model="form.submitForm.metadata.name" clearable></el-input>
                <div><span class="input-help">{{$t('cluster.detail.storage.provisioner_name_helper')}}</span></div>
              </el-form-item>
              <el-form-item label="Size (Gib)" prop="submitForm.spec.capacity.storage" :rules="emptyRulesInput">
                <el-input v-model="form.submitForm.spec.capacity.storage" clearable></el-input>
              </el-form-item>
              <el-form-item label="Access Mode" prop="accessMode" :rules="emptyRulesChange">
                <el-select style="width: 100%" size="small" v-model="form.accessMode">
                  <el-option value="ReadWriteOnce" label="ReadWriteOnce">ReadWriteOnce</el-option>
                  <el-option value="ReadWriteMany" label="ReadWriteMany">ReadWriteMany</el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Path" prop="submitForm.spec.local.path" :rules="emptyRulesChange">
                <el-input v-model="form.submitForm.spec.local.path" clearable></el-input>
              </el-form-item>
              <el-form-item label="StorageClass" prop="storageClassName" :rules="emptyRulesInput">
                <el-select style="width: 100%" size="small" v-model="form.storageClassName">
                  <option v-for="sc in storageClassList" :key="sc.metadata.name" [value]="sc.metadata.name">{{sc.metadata.name}}</option>
                </el-select>
              </el-form-item>
              <el-form-item label="Node Selector" prop="selectorKey" :rules="emptyRulesInput">
                <el-col :span="12">
                  <el-input v-model="form.selectorKey" placeholder="e.g. kubernetes.io/hostname" clearable></el-input>
                </el-col>
                <el-col :span="12" prop="metadata.name" :rules="emptyRulesChange">
                  <el-select style="width: 100%" size="small" v-model="form.selectorOperation">
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
              <el-button type="primary" :disabled="!form.pvType" @click="onSubmit">{{$t('commons.button.submit')}}</el-button>
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
  name: "ClusterStoragePvCreate",
  components: { LayoutContent },
  data() {
    return {
      storageClassList: [],
      form: {
        selectorOperation: "In",
        selectorValue: "",
        storageClassName: "",
        accessMode: "ReadWriteOnce",
        pvType: "",
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
      emptyRulesInput: [{ required: true, message: this.$t("commons.validate.cannot_be_empty"), trigger: "blur" }],
      emptyRulesChange: [{ required: true, message: this.$t("commons.validate.cannot_be_empty"), trigger: "change" }],
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
      if (this.form.pvType === "Local Volume") {
        this.getClassList()
      }
    },
    onSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.pvType === "Local Volume") {
            delete this.form.submitForm.spec["hostPath"]
          } else {
            delete this.form.submitForm.spec["form.storageClassName"]
            delete this.form.submitForm.spec["local"]
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
          createPersistentVolume(this.clusterName, this.form.submitForm).then(() => {
            this.$message({ type: "success", message: this.$t("commons.msg.create_success") })
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
  },
}
</script>

<style scoped>
</style>
