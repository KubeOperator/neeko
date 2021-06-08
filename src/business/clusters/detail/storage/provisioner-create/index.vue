<template>
  <layout-content>
    <el-row style="margin-top: 20px">
      <el-col :span="4"><br /></el-col>
      <el-col :span="10">
        <div class="grid-content bg-purple-light">
          <el-form label-position='left' :model="form" ref="form" label-width="120px">
            <el-form-item :label="$t('commons.table.type')">
              <el-select style="width: 100%" size="small" @change="changeSelection()" v-model="createType">
                <el-option value="nfs" label="nfs">nfs</el-option>
                <el-option value="external-ceph" label="external-ceph">external-ceph</el-option>
                <el-option value="rook-ceph" label="rook-ceph">rook-ceph</el-option>
                <el-option value="cinder" label="cinder">cinder</el-option>
                <el-option value="vsphere" label="vsphere">vsphere</el-option>
                <el-option value="glusterfs" label="glusterfs">glusterfs</el-option>
                <el-option value="oceanstor" label="oceanstor">oceanstor</el-option>
              </el-select>
            </el-form-item>

            <div v-if="createType === 'nfs'">
              <el-form-item :label="$t('commons.table.name')" prop="name" :rules="nameRules">
                <el-input v-model="form.name" :placeholder="$t('commons.validate.common_name_help')"></el-input>
              </el-form-item>
              <el-form-item label="Version" prop="vars.storage_nfs_server_version" :rules="requiredRules">
                <el-select style="width: 100%" v-model="form.vars['storage_nfs_server_version']" clearable>
                  <el-option value='3' label='3'>3</el-option>
                  <el-option value='4' label='4'>4</el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Server" prop="vars.storage_nfs_server" :rules="requiredRules">
                <el-input v-model="form.vars['storage_nfs_server']" clearable></el-input>
              </el-form-item>
              <el-form-item label="Path" prop="vars.storage_nfs_server_path" :rules="requiredRules">
                <el-input v-model="form.vars['storage_nfs_server_path']" clearable></el-input>
              </el-form-item>
            </div>
            <div v-if="createType === 'external-ceph'">
              <el-form-item :label="$t('commons.table.name')">
                <el-input v-model="form.name" disabled></el-input>
              </el-form-item>
            </div>
            <div v-if="createType === 'rook-ceph'">
              <el-form-item :label="$t('commons.table.name')">
                <el-input v-model="form.name" disabled></el-input>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.disk_name')" prop="vars.storage_rook_path" :rules="requiredRules">
                <el-input v-model="form.vars['storage_rook_path']" clearable></el-input>
                <div><span class="input-help">{{$t('cluster.detail.storage.disk_name_help')}}</span></div>
              </el-form-item>
            </div>
            <div v-if="createType === 'cinder'">
              <el-form-item :label="$t('commons.table.name')">
                <el-input v-model="form.name" disabled></el-input>
              </el-form-item>
              <el-form-item label="Identity" prop="vars.cinder_auth_url" :rules="requiredRules">
                <el-input v-model="form.vars['cinder_auth_url']" placeholder=" http://128.110.154.166/identity" clearable></el-input>
              </el-form-item>
              <el-form-item label="UserName" prop="vars.cinder_username" :rules="requiredRules">
                <el-input v-model="form.vars['cinder_username']" placeholder=" admin" clearable></el-input>
              </el-form-item>
              <el-form-item label="Password" prop="vars.cinder_password" :rules="passwordRules">
                <el-input type="password" v-model="form.vars['cinder_password']" clearable></el-input>
              </el-form-item>
              <el-form-item label="Region" prop="vars.cinder_region" :rules="requiredRules">
                <el-input v-model="form.vars['cinder_region']" placeholder=" RegionOne" clearable></el-input>
              </el-form-item>
              <el-form-item label="Tenant Name" prop="vars.cinder_tenant_name" :rules="requiredRules">
                <el-input v-model="form.vars['cinder_tenant_name']" placeholder=" admin" clearable></el-input>
              </el-form-item>
              <el-form-item label="Domain Name" prop="vars.cinder_domain_name" :rules="requiredRules">
                <el-input v-model="form.vars['cinder_domain_name']" placeholder=" Default" clearable></el-input>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.tool.enable_storage')">
                <el-switch style="width: 80%" active-value="enable" inactive-value="disable" v-model="enableBlockStorage" />
              </el-form-item>
              <div v-if="enableBlockStorage === 'enable'">
                <el-form-item label="Version" prop="vars.cinder_blockstorage_version" :rules="requiredRules">
                  <el-select style="width: 100%" v-model="form.vars['cinder_blockstorage_version']">
                    <el-option value='V3' label='V3'>V3</el-option>
                  </el-select>
                  <div><span class="input-help">{{$t('cluster.detail.storage.cinder_version_help')}}</span></div>
                </el-form-item>
                <el-form-item label="Attach Limit" prop="vars.node_volume_attach_limit" :rules="requiredRules">
                  <el-input v-model="form.vars['node_volume_attach_limit']" placeholder=" 256" clearable></el-input>
                </el-form-item>
              </div>
            </div>
            <div v-if="createType === 'vsphere'">
              <el-form-item>
                <div><span class="input-help">{{$t('cluster.detail.storage.vsphere_select_help')}}</span></div>
              </el-form-item>
              <el-form-item :label="$t('commons.table.name')">
                <el-input v-model="form.name" disabled></el-input>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.vcenter_host')" prop="vars.vc_host" :rules="requiredRules">
                <el-input v-model="form.vars['vc_host']" clearable></el-input>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.vcenter_port')" prop="vars.vc_port" :rules="requiredRules">
                <el-input v-model="form.vars['vc_port']" clearable></el-input>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.vcenter_username')" prop="vars.vc_username" :rules="requiredRules">
                <el-input v-model="form.vars['vc_username']" clearable></el-input>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.vcenter_password')" prop="vars.vc_password" :rules="requiredRules">
                <el-input v-model="form.vars['vc_password']" type="password" clearable></el-input>
              </el-form-item>
              <el-form-item label="Datacenter" prop="vars.datacenter" :rules="requiredRules">
                <el-input v-model="form.vars['datacenter']" clearable></el-input>
              </el-form-item>
              <el-form-item label="Folder" prop="vars.folder" :rules="requiredRules">
                <el-input v-model="form.vars['folder']" clearable></el-input>
              </el-form-item>
            </div>
            <div v-if="createType === 'glusterfs'">
              <el-form-item :label="$t('commons.table.name')">
                <el-input v-model="form.name" disabled></el-input>
              </el-form-item>
            </div>
            <div v-if="createType === 'oceanstor'">
              <el-form-item :label="$t('commons.table.name')">
                <el-input v-model="form.name" disabled></el-input>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.deploy_mode')" prop="vars.oceanstor_controller_type" :rules="requiredRules">
                <el-select style="width: 100%" v-model="form.vars['oceanstor_controller_type']">
                  <el-option value='single' label='single'>single</el-option>
                  <el-option value='multi' label='single'>multi</el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.multi_path_networking')" prop="vars.oceanstor_is_multipath" :rules="requiredRules">
                <el-switch style="width: 80%" active-value="yes" inactive-value="no" v-model="form.vars['oceanstor_is_multipath']" />
              </el-form-item>
              <el-form-item :label="$t('commons.table.type')" prop="vars.oceanstor_type" :rules="requiredRules">
                <el-select style="width: 100%" v-model="form.vars['oceanstor_type']">
                  <el-option value='nfs' label='nfs'>nfs</el-option>
                  <el-option value='iscsi' label='iscsi'>iscsi</el-option>
                  <el-option value='fc' label='fc'>fc</el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.product')" prop="vars.oceanstor_product" :rules="requiredRules">
                <el-select style="width: 100%" v-model="form.vars['oceanstor_product']">
                  <el-option value='V3' label='V3'>V3</el-option>
                  <el-option value='V5' label='V5'>V5</el-option>
                  <el-option value='Dorado' label='Dorado'>Dorado</el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.manage_url')" prop="vars.oceanstor_urls" :rules="requiredRules">
                <el-input v-model="form.vars['oceanstor_urls']" placeholder="10.1.1.1,10.1.1.2" clearable></el-input>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.user_name')" prop="vars.oceanstor_user" :rules="requiredRules">
                <el-input v-model="form.vars['oceanstor_user']" clearable></el-input>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.password')" prop="vars.oceanstor_password" :rules="passwordRules">
                <el-input type="password" v-model="form.vars['oceanstor_password']" clearable></el-input>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.storage_pool')" prop="vars.oceanstor_pools" :rules="requiredRules">
                <el-input v-model="form.vars['oceanstor_pools']" placeholder="pool1,pool2" clearable></el-input>
              </el-form-item>
              <el-form-item v-if="form.vars['oceanstor_type'] === 'nfs'" :label="$t('cluster.detail.storage.logic_port')" prop="vars.oceanstor_portal" :rules="requiredRules">
                <el-input v-model="form.vars['oceanstor_portal']" placeholder="test1,test2" clearable></el-input>
                <div><span class="input-help">{{$t('cluster.detail.storage.logic_port_help')}}</span></div>
              </el-form-item>
              <el-form-item v-if="form.vars['oceanstor_type'] === 'iscsi'" :label="$t('cluster.detail.storage.business_ip')" prop="vars.oceanstor_portal" :rules="requiredRules">
                <el-input v-model="form.vars['oceanstor_portal']" placeholder="10.1.1.1,10.1.1.2" clearable></el-input>
                <div><span class="input-help">{{$t('cluster.detail.storage.business_ip_help')}}</span></div>
              </el-form-item>
            </div>
            <el-form-item>
              <div style="float: right">
                <el-button @click="onCancel()">{{$t('commons.button.cancel')}}</el-button>
                <el-button type="primary" :disabled="!createType || submitLoading" @click="onSubmit">{{$t('commons.button.create')}}</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </layout-content>
</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent"
import { createProvisioner } from "@/api/cluster/storage"
import Rule from "@/utils/rules"

export default {
  name: "ClusterStorageProvionerCreate",
  components: { LayoutContent },
  data() {
    return {
      submitLoading: false,
      createType: "",
      form: {
        name: "",
        type: "",
        vars: {},
      },
      nameRules: [Rule.CommonNameRule],
      requiredRules: [Rule.RequiredRule],
      passwordRules: [Rule.PasswordRule],
      enableBlockStorage: "disable",
    }
  },
  methods: {
    onSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.submitLoading = true
          this.form.type = this.createType
          if (this.form.type === "conder") {
            this.form.vars["enable_blockstorage"] = this.enableBlockStorage
          }
          createProvisioner(this.clusterName, this.form)
            .then(() => {
              this.$message({ type: "success", message: this.$t("commons.msg.save_success") })
              this.$router.push({ name: "ClusterStorage" })
              this.submitLoading = true
            })
            .catch(() => {
              this.submitLoading = false
            })
        } else {
          return false
        }
      })
    },
    onCancel() {
      this.$router.push({ name: "ClusterStorage" })
    },
    changeSelection() {
      this.$refs["form"].clearValidate()
      this.form.vars = {}
      this.form.name = ""
      switch (this.createType) {
        case "external-ceph":
          this.form.name = "external-ceph"
          break
        case "rook-ceph":
          this.form.name = "rook-ceph.rbd.csi.ceph.com"
          break
        case "cinder":
          this.form.name = "cinder.csi.openstack.org"
          this.enableBlockStorage = "disable"
          break
        case "glusterfs":
          this.form.name = "kubernetes.io/glusterfs"
          break
        case "oceanstor":
          this.form.name = "csi.huawei.com"
          this.form.vars = {
            oceanstor_controller_type: "single",
            oceanstor_is_multipath: "no",
          }
          break
        case "vsphere":
          this.form.name = "csi.vsphere.vmware.com"
          break
      }
    },
  },
  created() {
    this.clusterName = this.$route.params.name
  },
}
</script>

<style scoped>
</style>
