<template>
  <layout-content>
    <div>
      <el-form ref="form" label-width="150px">
        <el-form-item :label="$t('cluster.detail.f5.big_ip_addr')" style="width: 80%" required>
          <el-input v-model="form.url" placeholder="https://172.16.10.100" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('cluster.detail.f5.big_ip_user_name')" style="width: 80%" required>
          <el-input v-model="form.user" placeholder="admin" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('cluster.detail.f5.big_ip_password')" style="width: 80%" required>
          <el-input type="password" v-model="form.password" clearable></el-input>
        </el-form-item>
        <el-form-item label="Partition" style="width: 80%" required>
          <el-input v-model="form.partition" placeholder="Partition Name" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('cluster.detail.f5.big_ip_public')" style="width: 80%" required>
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
    }
  },
  methods: {
    search() {
      getF5(this.clusterName).then((data) => {
        this.form = data
      })
    },
    onSubmit() {
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
    },
    onUpdate() {
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
    },
  },
  created() {
    this.clusterName = this.$route.params.name
    this.search()
  },
}
</script>