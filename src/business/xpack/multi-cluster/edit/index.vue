<template>
  <layout-content>
    <el-row>
      <el-col :span="4"><br/></el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple-light">
          <el-form ref="form" :model="form" label-width="80px" label-position="left">
            <el-form-item :label="$t('commons.table.name')" required>
              <el-input v-model="form.name" disabled></el-input>
            </el-form-item>
            <el-form-item :label="$t('multi_cluster.sync_interval')">
              <el-input-number v-model="form.syncInterval"></el-input-number>
            </el-form-item>
            <el-form-item :label="$t('multi_cluster.pull_timeout')">
              <el-input-number v-model="form.gitTimeout"></el-input-number>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="onSubmit">{{$t('commons.button.submit')}}</el-button>
              <el-button @click="onCancel()">{{$t('commons.button.cancel')}}</el-button>
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
  import {getMultiClusterRepository, updateMultiClusterRepository} from "@/api/xpack/multi-cluster"

  export default {
    name: "MultiClusterRepositoryEdit",
    props: ['name'],
    components: {LayoutContent},
    data() {
      return {
        requireAuth: false,
        form: {
          name: '',
          gitTimeout: 5,
          syncInterval: 30,
        }
      }
    },
    methods: {
      onSubmit() {
        updateMultiClusterRepository(this.name, {
          gitTimeout: this.form.gitTimeout,
          syncInterval: this.form.syncInterval
        }).then(() => {
          this.$message({
            type: 'success',
            message: `修改成功`
          });
          this.$router.push({name: "MultiClusterRepositoriesList"})
        })
      },
      onCancel() {
        this.$router.push({name: "MultiClusterRepositoriesList"})
      }
    },
    created() {
      getMultiClusterRepository(this.name).then(data => {
        this.form = data
      })
    }
  }
</script>

<style scoped>
</style>
