<template>
  <layout-content :header="$t('commons.button.create')" :back-to="{ name: 'MultiClusterRepositoriesList'}">
    <el-row>
      <el-col :span="4"><br/></el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple-light">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px" label-position="left">


            <el-form-item :label="$t('commons.table.name')" prop="name" required>
              <el-input v-model="form.name"></el-input>
            </el-form-item>


            <el-form-item :label="$t('multi_cluster.address')" required>
              <el-input v-model="form.source"></el-input>
            </el-form-item>
            <el-form-item :label="$t('multi_cluster.branch')" required>
              <el-input v-model="form.branch"></el-input>
            </el-form-item>
            <el-form-item :label="$t('multi_cluster.auth')">
              <el-switch v-model="requireAuth" @change="onRequireAuthChange"></el-switch>
            </el-form-item>

            <el-form-item v-if="requireAuth" :label="$t('multi_cluster.username')" required>
              <el-input v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item v-if="requireAuth" :label="$t('multi_cluster.password')" required>
              <el-input type="password" v-model="form.password"></el-input>
            </el-form-item>
            <el-form-item :label="$t('multi_cluster.sync_interval')">
              <el-input-number :min=1 v-model="form.syncInterval"></el-input-number>
            </el-form-item>
            <el-form-item :label="$t('multi_cluster.pull_timeout')">
              <el-input-number :min=1 v-model="form.gitTimeout"></el-input-number>
            </el-form-item>
            <el-form-item>
              <el-button @click="onCancel()">{{$t('commons.button.cancel')}}</el-button>
              <el-button type="primary" @click="onSubmit">{{$t('commons.button.submit')}}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="4"><br/></el-col>
    </el-row>
  </layout-content>
</template>

<script>
  import LayoutContent from "@/components/layout/LayoutContent";
  import {createMultiClusterRepository} from "@/api/xpack/multi-cluster"
  import Rule from "@/utils/rules"


  export default {
    name: "MultiClusterRepositoryCreate",
    components: {LayoutContent},
    data() {
      return {
        requireAuth: false,
        form: {
          name: '',
          source: '',
          branch: 'master',
          username: '',
          password: '',
          gitTimeout: 5,
          syncInterval: 30,
        },
        rules: {
          name: [Rule.ClusterNameRule],
        },
      }
    },
    methods: {
      onRequireAuthChange() {
        this.form.username = ""
        this.form.password = ""
      },
      onSubmit() {
        createMultiClusterRepository(this.form).then(() => {
          this.$message({
            type: 'success',
            message: `创建成功`
          });
          this.$router.push({name: "MultiClusterRepositoriesList"})
        })
      },
      onCancel() {
        this.$router.push({name: "MultiClusterRepositoriesList"})
      }
    }
  }
</script>

<style scoped>
</style>
