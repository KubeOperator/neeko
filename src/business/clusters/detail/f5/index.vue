<template>
  <layout-content>
    <div>
      <el-form :model="form" ref="form" :rules="rules" label-width="150px">
        <el-form-item :label="$t('cluster.detail.f5.big_ip_addr')" style="width: 80%" prop="url">
          <el-input v-model="form.url" placeholder="https://172.16.10.100" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('cluster.detail.f5.big_ip_user_name')" style="width: 80%" prop="user">
          <el-input v-model="form.user" placeholder="admin" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('cluster.detail.f5.big_ip_password')" style="width: 80%" prop="password">
          <el-input type="password" v-model="form.password" clearable></el-input>
        </el-form-item>
        <el-form-item label="Partition" style="width: 80%" prop="partition">
          <el-input v-model="form.partition" placeholder="Partition Name" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('cluster.detail.f5.big_ip_public')" style="width: 80%" prop="publicIP">
          <el-input v-model="form.publicIP" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="onSubmit()" v-if="form.id === ''" type="primary">{{$t('commons.button.submit')}}</el-button>
          <el-button @click="onUpdate()" v-if="form.id !== ''" type="primary">{{$t('cluster.detail.update')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </layout-content>
</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent"
import { getF5, createF5, updateF5 } from "@/api/cluster/f5"

export default {
  name: "ClusterIstio",
  components: { LayoutContent },
  data() {
    return {
      clusterName: "",
      form: {
        id: "",
        clusterName: "",
        url: "",
        user: "",
        password: "",
        partition: "",
        publicIP: "",
        status: "",
      },
      rules: {
        url: [{ required: true, message: this.$t("commons.form.required_msg"), trigger: "blur" }],
        user: [{ required: true, message: this.$t("commons.form.required_msg"), trigger: "blur" }],
        password: [
          { required: true, message: this.$t("commons.form.required_msg"), trigger: "blur" },
          { type: "string", min: 6, message: this.$t("commons.form.password_min_length"), trigger: "blur" },
        ],
        partition: [{ required: true, message: this.$t("commons.form.required_msg"), trigger: "blur" }],
        publicIP: [{ required: true, message: this.$t("commons.form.required_msg"), trigger: "blur" }],
      },
    }
  },
  methods: {
    search() {
      getF5(this.clusterName).then((data) => {
        this.form = data
      })
    },
    onSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.clusterName = this.clusterName
          createF5(this.form).then(
            (data) => {
              if (data.status === "Running") {
                this.form = data
                this.$message({ type: "success", message: this.$t("commons.msg.create_success") })
              }
            },
            (error) => {
              this.$message({ type: "error", message: error })
            }
          )
        } else {
          return false
        }
      })
    },
    onUpdate() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.clusterName = this.clusterName
          updateF5(this.form).then(
            (data) => {
              if (data.status === "Running") {
                this.form = data
                this.$message({ type: "success", message: this.$t("commons.msg.update_success") })
              }
            },
            (error) => {
              this.$message({ type: "error", message: error })
            }
          )
        } else {
          return false
        }
      })
    },
  },
  created() {
    this.clusterName = this.$route.params.name
    this.search()
  },
}
</script>