<template>
  <el-card class="box-card" style="width: 50%;background: #FFFFFF" v-loading="loading" >
    <div slot="header" class="clearfix" >
      <span >{{$t('setting.table.license.title')}}</span>
    </div>
    <el-row :gutter="20">
      <el-col :span="18">
        <DetailCard :title="cardTitle" :items="detailItems" />
      </el-col>
    </el-row>
    <el-button type="primary" style="float: right;margin: 0 10px 8px " @click="dialogVisible = true">{{ $t('commons.button.import')}}</el-button>
    <el-dialog
      :title="$t('setting.option.addLicense')"
      :visible.sync="dialogVisible"
      @cancel="dialogLicenseImport = false"
      width="30%"
      @confirm="importLicense">
      <el-button type="text" @click="applyLicensee()">{{ $t('setting.apply_licensee') }}</el-button>
      <el-form>
        <el-form-item>
          <el-row type="flex" justify="center">
            <el-upload :on-change="onUploadChange" action="" :auto-upload="false" class="upload-demo" drag>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">{{$t('commons.form.file_upload_help')}}</div>
              <div class="el-upload__tip" slot="tip">
                <svg class="icon" aria-hidden="true"  >
                  <use  xlink:href="#icontishi11"></use>
                </svg>
                {{$t('cluster.detail.backup.local_recover_tips')}}</div>
            </el-upload>
          </el-row>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('commons.button.cancel') }}</el-button>
        <el-button type="primary" @click="importLicense()">{{ $t('commons.button.import') }}</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import {getLicense, importLicense} from "@/api/license"
import DetailCard from "@/components/detail-card/index";
export default {
  name: "License",
  components: {DetailCard},
  data() {
    return {
      loading: false,
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
        file: {}
      }
  },
  created() {
    this.loading = true
    getLicense().then( data => {
      this.loading = false
      this.form.license = data.license,
      this.form.status = data.status
    }).finally(() => {
      this.loading = false
    })
  },
  methods: {
    importLicense() {
      const formData = new FormData()
      formData.append('file', this.file.raw)
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
    onUploadChange(file) {
      this.file = file
    },
    applyLicensee() {
      window.open("https://jinshuju.net/f/qc6g44")
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
