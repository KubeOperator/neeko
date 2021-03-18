<template>
  <layout-content>
    <el-row>
      <el-col :span="4"><br/></el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple-light">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item :label="$t('commons.table.name')" required>
              <el-input v-model="form.name"></el-input>
            </el-form-item>

            <el-form-item :label="$t('commons.table.description')">
              <el-input type="textarea" v-model="form.description"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="onSubmit">{{$t('commons.button.save')}}</el-button>
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
  import {createProject} from "@/api/projects"


  export default {
    name: "ProjectEdit",
    components: {LayoutContent},
    props: ['name'],
    data() {
      return {
        form: {
          name: '',
          description: '',
        }
      }
    },
    methods: {
      onSubmit() {
        createProject(this.form).then(() => {
          this.$message({
            type: 'success',
            message: `创建成功`
          });
          this.$router.push({name: "ProjectList"})
        })
      },
      onCancel() {
        this.$router.push({name: "ProjectList"})
      }
    },
    created() {
      console.log(this.name)
    }

  }
</script>

<style scoped>
</style>
