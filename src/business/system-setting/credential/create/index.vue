<template>
  <layout-content :header="$t('commons.button.create')" :back-to="{ name: 'Credential'}">
    <el-row>
      <el-col :span="4"><br/></el-col>
      <el-col :span="10">
        <div class="grid-content bg-purple-light">
          <el-form ref="form" :model="form" label-position="left"  label-width="100px">
            <el-form-item :label="$t('credential.name')" required>
              <el-input v-model="form.name"></el-input>
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
              <el-input :placeholder="$t('setting.helpInfo.inputPassword')" v-model="form.password" show-password></el-input>
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
import {createCredentials} from "@/api/credentials";
export default {
  name: "CredentialCreate",
  components: {LayoutContent},
  data() {
    return {
      form: {
        name: '',
        username: '',
        type: '',
        password: '',
        privateKey: ''
      },
      formLabelWidth: '120px'
    }
  },
  methods: {
    onSubmit() {
      createCredentials({
        name: this.form.name,
        username: this.form.username,
        type: this.form.type,
        password: this.form.password,
        privateKey: this.form.privateKey
      }).then(() => {
        this.$message({
          type: 'success',
          message: `创建成功`
        });
        this.$router.push({name: "Credential"})
      })
    },
    onCancel() {
      this.$router.push({name: "Credential"})
    }
  },
  created() {
      this.form.type = 'password';
  }
}
</script>

<style scoped>

</style>
