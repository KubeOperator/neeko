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
            <el-form-item label="IP" required>
              <el-input v-model="form.ip"></el-input>
            </el-form-item>
            <el-form-item :label="$t('host.port')" required>
              <el-input type="number" min="0" max="65535" placeholder="22" v-model="form.port"></el-input>
            </el-form-item>

            <el-form-item :label="$t('credential.credential')" required>
              <el-radio-group v-model="credentialType">
                <el-radio label="exists">{{$t('host.exists_credential')}}</el-radio>
                <el-radio label="new">{{$t('host.new_credential')}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="credentialType==='exists'" :label="$t('host.credential_name')" required>
              <el-select v-model="form.credentialName" placeholder="请选择凭据">
              </el-select>
            </el-form-item>

            <span v-if="credentialType==='new'">
               <el-form-item :label="$t('credential.name')" required>
                 <el-input v-model="form.credential.name"></el-input>
               </el-form-item>
               <el-form-item :label="$t('credential.username')" required>
                 <el-input v-model="form.credential.username"></el-input>
               </el-form-item>
              <el-form-item :label="$t('credential.credential')" required>
              <el-radio-group v-model="form.credential.type">
                <el-radio label="password">{{$t('credential.password')}}</el-radio>
                <el-radio label="privateKey">{{$t('credential.privateKey')}}</el-radio>
              </el-radio-group>
              </el-form-item>
               <el-form-item v-if="form.credential.type==='password'" :label="$t('credential.password')" required>
                 <el-input type="password" v-model="form.credential.password"></el-input>
               </el-form-item>
               <el-form-item v-if="form.credential.type==='privateKey'" :label="$t('credential.privateKey')" required>
                 <el-input type="textarea" v-model="form.credential.privateKey"></el-input>
               </el-form-item>
            </span>
            <el-form-item>
              <el-button @click="onCancel()">取消</el-button>
              <el-button type="primary" @click="onSubmit">创建</el-button>
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
  import {createHost} from "@/api/hosts"


  export default {
    name: "HostCreate",
    components: {LayoutContent},
    data() {
      return {
        credentialType: "exists",
        form: {
          name: "",
          ip: "",
          port: 22,
          credentialName: "",
          credential: {
            username: "",
            password: "",
            name: "",
            type: "password",
            privateKey: ""
          }
        }
      }
    },
    methods: {
      onSubmit() {
        createHost(this.form).then(() => {
          this.$message({
            type: 'success',
            message: `创建成功`
          });
          this.$router.push({name: "HostList"})
        })
      },
      onCancel() {
        this.$router.push({name: "HostList"})
      }
    }
  }
</script>

<style scoped>
</style>
