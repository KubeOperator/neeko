<template>
  <div>
    <el-dialog :visible.sync="dialogDetailVisible" :title="$t('cluster.detail.storage.provisioner')" :before-close="onCancel" width="20%" :close-on-click-modal="false">
      <el-row style="margin-top: 20px">
        <el-col :span="4"><br /></el-col>
        <el-col :span="20">
          <el-form label-position='left' label-width="120px">
            <div v-if="provioner.type === 'nfs'">
              <el-form-item :label="$t('commons.table.name')">
                <span>{{provioner.name}}</span>
              </el-form-item>
              <el-form-item label="Version">
                <span>{{provioner.vars['storage_nfs_server_version']}}</span>
              </el-form-item>
              <el-form-item label="Server">
                <span>{{provioner.vars['storage_nfs_server']}}</span>
              </el-form-item>
              <el-form-item label="Path">
                <span>{{provioner.vars['storage_nfs_server_path']}}</span>
              </el-form-item>
            </div>
            <div v-if="provioner.type === 'rook-ceph'">
              <el-form-item :label="$t('commons.table.name')">
                <span>{{provioner.name}}</span>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.disk_name')">
                <span>{{provioner.vars['storage_rook_path']}}</span>
              </el-form-item>
            </div>

            <div v-if="provioner.type === 'cinder'">
              <el-form-item :label="$t('commons.table.name')">
                <span>{{provioner.name}}</span>
              </el-form-item>
              <el-form-item label="Identity">
                <span>{{provioner.vars['cinder_auth_url']}}</span>
              </el-form-item>
              <el-form-item label="UserName">
                <span>{{provioner.vars['cinder_username']}}</span>
              </el-form-item>
              <el-form-item label="Password">
                <span>{{provioner.vars['cinder_password']}}</span>
              </el-form-item>
              <el-form-item label="Region">
                <span>{{provioner.vars['cinder_region']}}</span>
              </el-form-item>
              <el-form-item label="Tenant Name">
                <span>{{provioner.vars['cinder_tenant_name']}}</span>
              </el-form-item>
              <el-form-item label="Domain Name">
                <span>{{provioner.vars['cinder_domain_name']}}</span>
              </el-form-item>
              <el-form-item label="Version">
                <span>{{provioner.vars['cinder_blockstorage_version']}}</span>
              </el-form-item>
              <el-form-item label="Attach Limit">
                <span>{{provioner.vars['node_volume_attach_limit']}}</span>
              </el-form-item>
            </div>

            <div v-if="provioner.type === 'vsphere'">
              <el-form-item>
                <div><span class="input-help">{{$t('cluster.detail.storage.vsphere_select_help')}}</span></div>
              </el-form-item>
              <el-form-item :label="$t('commons.table.name')">
                <span>{{provioner.name}}</span>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.vcenter_host')">
                <span>{{provioner.vars['vc_host']}}</span>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.vcenter_port')">
                <span>{{provioner.vars['vc_port']}}</span>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.vcenter_username')">
                <span>{{provioner.vars['vc_username']}}</span>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.vcenter_password')">
                <span>{{provioner.vars['vc_password']}}</span>
              </el-form-item>
              <el-form-item label="Datacenter">
                <span>{{provioner.vars['datacenter']}}</span>
              </el-form-item>
              <el-form-item label="Folder">
                <span>{{provioner.vars['folder']}}</span>
              </el-form-item>
            </div>

            <div v-if="provioner.type === 'oceanstor'">
              <el-form-item :label="$t('commons.table.name')">
                <span>{{provioner.name}}</span>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.deploy_mode')">
                <span>{{provioner.vars['oceanstor_controller_type']}}</span>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.multi_path_networking')">
                <span>{{provioner.vars['oceanstor_is_multipath']}}</span>
              </el-form-item>
              <el-form-item :label="$t('commons.table.type')">
                <span>{{provioner.vars['oceanstor_type']}}</span>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.product')">
                <span>{{provioner.vars['oceanstor_product']}}</span>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.manage_url')">
                <span>{{provioner.vars['oceanstor_urls']}}</span>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.user_name')">
                <span>{{provioner.vars['oceanstor_user']}}</span>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.password')">
                <span>{{provioner.vars['oceanstor_password']}}</span>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.storage_pool')">
                <span>{{provioner.vars['oceanstor_pools']}}</span>
              </el-form-item>
              <el-form-item v-if="provioner.vars['oceanstor_type'] === 'nfs'" :label="$t('cluster.detail.storage.logic_port')">
                <span>{{provioner.vars['oceanstor_portal']}}</span>
              </el-form-item>
              <el-form-item v-if="provioner.vars['oceanstor_type'] === 'iscsi'" :label="$t('cluster.detail.storage.business_ip')">
                <span>{{provioner.vars['oceanstor_portal']}}</span>
              </el-form-item>
            </div>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onCancel()">{{$t('commons.button.cancel')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ClusterStorageProvionerDetail",
  props: {
    visible: Boolean,
    provioner: Object,
  },
  data() {
    return {
      loading: false,
      dialogDetailVisible: false,
    }
  },
  methods: {
    onCancel() {
      this.dialogDetailVisible = false
      this.$emit("changeVisble", this.dialogDetailVisible)
    },
  },
  created() {
    this.dialogDetailVisible = true
  },
}
</script>

<style scoped>
</style>
