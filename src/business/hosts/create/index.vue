<template>
  <layout-content>
    <el-row>
      <el-col :span="4"><br/></el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple-light">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item :label="$t('commons.table.name')">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="IP">
              <el-input v-model="form.ip"></el-input>
            </el-form-item>
            <el-form-item :label="$t('host.port')">
              <el-input type="number" min="0" max="65535" placeholder="22" v-model="form.port"></el-input>
            </el-form-item>

            <el-form-item label="凭据">
              <el-radio-group v-model="form.credentialType">
                <el-radio label="exists">已存在的凭据</el-radio>
                <el-radio label="new">新建凭据</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="form.credentialType==='exists'">
              <el-select v-model="form.region" placeholder="请选择凭据">
                <el-option label="凭据1" value="shanghai"></el-option>
                <el-option label="凭据2" value="beijing"></el-option>
              </el-select>
            </el-form-item>

            <span v-if="form.credentialType==='new'">
               <el-form-item label="凭据名称">
                 <el-input v-model="form.credential.name"></el-input>
               </el-form-item>
               <el-form-item label="用户名">
                 <el-input v-model="form.credential.username"></el-input>
               </el-form-item>
               <el-form-item label="密码">
                 <el-input type="password" v-model="form.credential.password"></el-input>
               </el-form-item>
            </span>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">立即创建</el-button>
              <el-button @click="onCancel()">取消</el-button>
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

  export default {
    name: "HostCreate",
    components: {LayoutContent},
    data() {
      return {
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: '',
          credentialType: "exists",
          credential: {
            username: "",
            password: "",
            name: ""
          }
        }
      }
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      },
      onCancel() {
        this.$router.push({name: "HostList"})
      }
    }
  }
</script>

<style scoped>
</style>
