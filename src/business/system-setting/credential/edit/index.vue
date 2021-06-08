<template>
  <layout-content :header="$t('commons.button.edit')" :back-to="{ name: 'Credential'}">
    <el-row>
      <el-col :span="4"><br/></el-col>
      <el-col :span="10">
        <div class="grid-content bg-purple-light">
          <el-form ref="form" v-loading="loading" label-position="left" :model="form" label-width="80px">
            <el-form-item :label="$t('credential.name')" required>
              <el-input v-model="form.name" disabled></el-input>
              <span></span>
            </el-form-item>
            <el-form-item :label="$t('credential.username')" required>
              <el-input v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item :label="$t('credential.type')" required>
              <el-radio-group v-model="form.type">
                <el-radio label="password">{{$t('credential.password')}}</el-radio>
                <el-radio label="privateKey">{{$t('credential.privateKey')}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="form.type==='password'" :label="$t('credential.password')" required>
              <el-input type="password" :placeholder="$t('setting.helpInfo.inputPassword')" v-model="form.password"></el-input>
            </el-form-item>
            <el-form-item v-if="form.type==='privateKey'" :label="$t('credential.privateKey')" required>
              <el-input type="textarea" v-model="form.privateKey"></el-input>
            </el-form-item>
            <div style="float: right">
              <el-form-item>
                <el-button @click="onCancel()">{{$t('commons.button.cancel')}}</el-button>
                <el-button type="primary" @click="onSubmit">{{$t('commons.button.submit')}}</el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </el-col>
      <el-col :span="4"><br/></el-col>
    </el-row>
  </layout-content>
</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent";
import {updateCredentials} from "@/api/credentials";
export default {
  components: {
    LayoutContent
  },
  name: "CredentialEdit",
  props: ["data"],
  data() {
    return {
      form: {
        name: '',
        username: '',
        type: '',
        password: '',
        privateKey: ''
      },
      formLabelWidth: '120px',
      loading: false
    }
  },
  methods: {
    onSubmit() {
      this.loading = true
      updateCredentials(this.form.name, {
        id: this.form.id,
        name: this.form.name,
        username: this.form.username,
        password: this.form.password,
        privateKey: this.form.privateKey,
        type: this.form.type,
      }).then( () => {
        this.loading = false
        this.$message({
          type: 'success',
          message: `创建成功`
        });
        this.$router.push({name: "Credential"})
      }).finally(() => {
        this.loading = false
      })
    },
    onCancel() {
      this.$router.push({name: "Credential"})
    },
  },
  created() {
      this.form.name = this.data.name,
      this.form.username = this.data.username,
      this.form.type = this.data.type,
      this.form.id = this.data.id
  }
}
</script>

<style scoped>

</style>
