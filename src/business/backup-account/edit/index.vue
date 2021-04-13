<template>
  <layout-content :header="$t('backup_account.edit_backup_account')" :back-to="{ name: 'BackupAccount'}">
    <el-row>
      <el-col :span="4"><br/></el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple-light">
          <el-form ref="form" :model="form" label-width="90px">
            <el-form-item :label="$t('backup_account.table.name')" aria-readonly="true" required>
              <span>{{ form.name}}</span>
<!--              <el-input v-model="form.name" readonly></el-input>-->
            </el-form-item>
            <el-form-item :label="$t('backup_account.table.type')" aria-readonly="true" required>
              <span>{{ form.type}}</span>
<!--              <el-input v-model="form.type" readonly></el-input>-->
            </el-form-item>
            <el-form-item v-if="form.type === 'OSS' || form.type === 'S3'" label="AccessKey" required>
              <el-input v-model="form.credentialVars['accessKey']"></el-input>
            </el-form-item>
            <el-form-item v-if="form.type === 'OSS' || form.type === 'S3'" label="SecretKey" required>
              <el-input v-model="form.credentialVars['secretKey']"></el-input>
            </el-form-item>
            <el-form-item v-if="form.type === 'AZURE'" :label="$t('backup_account.table.accountName')" required>
              <el-input v-model="form.credentialVars['accountName']"></el-input>
            </el-form-item>
            <el-form-item v-if="form.type === 'AZURE'" :label="$t('backup_account.table.accountKey')" required>
              <el-input v-model="form.credentialVars['accountKey']"></el-input>
            </el-form-item>
            <el-form-item v-if="form.type === 'S3'" :label="$t('backup_account.table.region')" required>
              <el-input v-model="form.credentialVars['region']"></el-input>
            </el-form-item>
            <el-form-item v-if="form.type !== 'SFTP'" :label="$t('backup_account.table.endpoint')" required>
              <el-input v-model="form.credentialVars['endpoint']"></el-input>
            </el-form-item>
            <el-form-item v-if="form.type !== 'SFTP'" :label="$t('backup_account.table.bucket')" required>
              <el-select style="width: 100%" v-model="form.bucket" :placeholder="$t('backup_account.select_placeholder')">
                <el-option
                  v-for="item in buckets"
                  :key="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- SFTP Option start-->
            <div v-if="form.type === 'SFTP'">
              <el-form-item  :label="$t('backup_account.table.address')" required>
                <el-input v-model="form.credentialVars['address']"></el-input>
              </el-form-item>
              <el-form-item  :label="$t('backup_account.table.port')" required>
                <el-input-number v-model="form.credentialVars['port']"  :min="0" :max="65535" label="描述文字"></el-input-number>
              </el-form-item>
              <el-form-item  :label="$t('backup_account.table.username')" required>
                <el-input v-model="form.credentialVars['username']"></el-input>
              </el-form-item>
              <el-form-item  :label="$t('backup_account.table.password')" required>
                <el-input type="password" show-password v-model="form.credentialVars['password']"></el-input>
              </el-form-item>
              <el-form-item :label="$t('backup_account.table.path')" required>
                <el-input v-model="form.bucket"></el-input>
              </el-form-item>
            </div>
            <!-- SFTP Option end-->

            <el-form-item>
              <el-button v-if="form.type !== 'SFTP'" type="success" plain @click="getBuckets">{{$t('commons.button.getBucket')}}</el-button>
              <el-button type="primary" @click="update()">{{$t('commons.button.save')}}</el-button>
              <el-button type="info" @click="onCancel()">{{$t('commons.button.cancel')}}</el-button>
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
import {listBuckets, updateBackupAccounts} from "@/api/backup-account";
export default {
  components: {
    LayoutContent,
  },
  props: ["data"],
  name: "BackupAccountEdit",
  data() {
    return{
      form: {
        name: '',
        type: '',
        bucket: '',
        credentialVars: {}
      },
      buckets: []
    }
  },
  methods: {
    update() {
      updateBackupAccounts( this.form.name,{
        bucket: this.form.bucket,
        credentialVars: this.form.credentialVars,
        name: this.form.name,
        type: this.form.type
      }).then(() => {
        this.$message({
          type: 'success',
          message: `更新成功`
        });
        this.$router.push({name: "BackupAccount"})
      })
    },
    onCancel() {
      this.$router.push({name: "BackupAccount"})
    },
    getBuckets() {
      listBuckets( {
        name: this.form.name,
        type: this.form.type,
        credentialVars: this.form.credentialVars,
      }).then( data => {
        this.buckets = data
      })
    }
  },
  created() {
    console.log(222, this.data)
    this.form.name = this.data.name
    this.form.type = this.data.type
    this.form.bucket = this.data.bucket
    this.form.credentialVars = this.data.credentialVars
    console.log('edit',this.form)
  }
}
</script>

<style scoped>

</style>
