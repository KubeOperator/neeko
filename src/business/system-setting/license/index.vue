<template>
  <el-card class="box-card" style="width: 50%;background: #FFFFFF" >
    <div slot="header" class="clearfix" >
      <span >{{$t('setting.table.license.title')}}</span>
    </div>
    <el-row :gutter="20">
      <el-col :span="18">
        <DetailCard :title="cardTitle" :items="detailItems" />
      </el-col>
    </el-row>
    <el-button type="primary" style="float: right;margin: 0 10px 8px " @click="dialogVisible = true">导入</el-button>
    <el-dialog
      :title="$t('setting.option.addLicense')"
      top="30vh"
      :visible.sync="dialogVisible"
      @cancel="dialogLicenseImport = false"
      @confirm="importLicense">
      {{ this.$t('setting.table.license.licenseFile') }}
      <br>
      <input type="file" @change="fileChange">
      <span style="position: absolute;right: 20px">
        <el-button @click="dialogVisible = false">{{ $t('commons.button.cancel') }}</el-button>
        <el-button type="primary" @click="importLicense">{{ $t('commons.button.import') }}</el-button>
      </span>
    </el-dialog>

  </el-card>
</template>

<script>
import {getLicense,importLicense} from "@/api/license"
import DetailCard from "@/components/detailCard/index";
export default {
  name: "License",
  components: {DetailCard},
  data() {
    return {
        form: {
          message: '',
          status: '',
          license: {
            corporation: '',
            product: '',
            edition: '',
            count: '',
            expired: ''
          }
        },
        dialogVisible: false,
        licenseData: {},
        licenseFile: {},
      }
  },
  created() {
    getLicense().then( data => {
      this.form.license = data.license,
      this.form.status = data.status
    })
  },
  methods: {
    importLicense() {
      if (this.licenseFile['file'] === undefined) {
        return
      }
      const formData = new FormData()
      formData.append('file', this.licenseFile['file'])
      importLicense(formData).then(res => {
        if (res.status) {
          this.$message({
            type: 'success',
            message: this.$t('commons.msg.import_success')
          });
          setTimeout(() => location.reload(), 500)
        } else {
          this.$message.error(res.message)
        }
      })
    },
    fileChange(e) {
      this.licenseFile['file'] = e.target.files[0]
    }
  },
  computed: {
    cardTitle() {
      return ''
    },
    detailItems() {
      if (this.form.status == 'invalid') {
        return [
          {
            key: this.$t('setting.license'),
            value: this.$t('setting.table.license.communityEdition')
          }
        ]
      }
      return [
        {
          key: this.$t('setting.table.license.corporation'),
          value: this.form.license.corporation
        },
        {
          key: this.$t('setting.table.license.count'),
          value: this.form.license.count
        },
        {
          key: this.$t('setting.table.license.expiration'),
          value: this.form.license.expired
        },
        {
          key: this.$t('setting.table.license.edition'),
          value: this.form.license.edition
        },
        {
          key: this.$t('setting.table.license.status'),
          value: this.form.status
        }
      ]
    },

  }
}
</script>

<style scoped>
</style>
