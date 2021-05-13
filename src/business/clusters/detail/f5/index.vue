<template>
  <layout-content v-loading="loading">
    <el-col :span="4"><br /></el-col>
    <el-col :span="10">
      <div class="grid-content bg-purple-light">
        <el-form :model="form" label-position="left" ref="form" :rules="rules" label-width="130px">
          <el-form-item :label="$t('cluster.detail.f5.big_ip_addr')" prop="url">
            <el-input v-model="form.url" placeholder="https://172.16.10.100" clearable></el-input>
          </el-form-item>
          <el-form-item :label="$t('cluster.detail.f5.big_ip_user_name')" prop="user">
            <el-input v-model="form.user" placeholder="admin" clearable></el-input>
          </el-form-item>
          <el-form-item :label="$t('cluster.detail.f5.big_ip_password')" prop="password">
            <el-input type="password" v-model="form.password" clearable></el-input>
          </el-form-item>
          <el-form-item label="Partition" prop="partition">
            <el-input v-model="form.partition" placeholder="Partition Name" clearable></el-input>
          </el-form-item>
          <el-form-item :label="$t('cluster.detail.f5.big_ip_public')" >
            <el-input v-model="form.publicIP" clearable></el-input>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button type="primary" :disabled="submitLoading" @click="onSubmit()" v-if="form.id === ''">{{$t('commons.button.submit')}}</el-button>
            <el-button type="primary" :disabled="submitLoading" @click="onUpdate()" v-if="form.id !== ''">{{$t('commons.button.update')}}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-col>
  </layout-content>
</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent"
import { getF5, createF5, updateF5 } from "@/api/cluster/f5"
import Rule from "@/utils/rules"

export default {
  name: "ClusterF5",
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
        url: [Rule.RequiredRule],
        user: [Rule.RequiredRule],
        password: [Rule.RequiredRule],
        partition: [Rule.RequiredRule],
      },
      loading: false,
      submitLoading: false,
    }
  },
  methods: {
    search() {
      this.loading = true
      getF5(this.clusterName)
        .then((data) => {
          this.form = data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    onSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.submitLoading = true
          this.form.clusterName = this.clusterName
          createF5(this.form)
            .then((data) => {
              if (data.status === "Running") {
                this.submitLoading = false
                this.form = data
                this.$message({ type: "success", message: this.$t("commons.msg.create_success") })
              }
            })
            .catch(() => {
              this.submitLoading = false
            })
        } else {
          return false
        }
      })
    },
    onUpdate() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.submitLoading = true
          this.form.clusterName = this.clusterName
          updateF5(this.form)
            .then((data) => {
              if (data.status === "Running") {
                this.submitLoading = false
                this.form = data
                this.$message({ type: "success", message: this.$t("commons.msg.update_success") })
              }
            })
            .catch(() => {
              this.submitLoading = false
            })
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
