<template>
  <layout-content>
    <el-row style="margin-top: 20px">
      <el-col :span="4"><br /></el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple-light">
          <el-form :model="form" label-width="120px">
            <el-form-item :label="$t('commons.table.type')" required>
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
              <el-form-item :label="$t('commons.table.name')">
                <el-input v-model="form.name" required></el-input>
                <div><span class="input-help">{{$t('cluster.detail.storage.provisioner_name_helper')}}</span></div>
              </el-form-item>
              <el-form-item label="Version">
                <el-select style="width: 100%" v-model="form.vars['storage_nfs_server_version']" clearable>
                  <el-option value='3' label='3'>3</el-option>
                  <el-option value='4' label='4'>4</el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Server">
                <el-input v-model="form.vars['storage_nfs_server']" clearable></el-input>
              </el-form-item>
              <el-form-item label="Path">
                <el-input v-model="form.vars['storage_nfs_server_path']" clearable></el-input>
              </el-form-item>
            </div>
            <div v-if="createType === 'external-ceph'">
              <el-form-item :label="$t('commons.table.name')">
                <el-input v-model="form.name" disabled></el-input>
                <div><span class="input-help">{{$t('cluster.detail.storage.provisioner_name_helper')}}</span></div>
              </el-form-item>
            </div>
            <div v-if="createType === 'rook-ceph'">
              <el-form-item :label="$t('commons.table.name')">
                <el-input v-model="form.name" disabled></el-input>
                <div><span class="input-help">{{$t('cluster.detail.storage.provisioner_name_helper')}}</span></div>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.disk_name')">
                <el-input v-model="form.vars['storage_rook_path']" clearable></el-input>
                <div><span class="input-help">{{$t('cluster.detail.storage.disk_name_helper')}}</span></div>
              </el-form-item>
            </div>
            <div v-if="createType === 'cinder'">
              <el-form-item :label="$t('commons.table.name')">
                <el-input v-model="form.name" disabled></el-input>
                <div><span class="input-help">{{$t('cluster.detail.storage.provisioner_name_helper')}}</span></div>
              </el-form-item>
              <el-form-item label="Identity">
                <el-input v-model="form.vars['cinder_auth_url']" placeholder="eg: http://128.110.154.166/identity" clearable></el-input>
              </el-form-item>
              <el-form-item label="UserName">
                <el-input v-model="form.vars['cinder_username']" placeholder="eg: admin" clearable></el-input>
              </el-form-item>
              <el-form-item label="Password">
                <el-input type="password" v-model="form.vars['cinder_password']" clearable></el-input>
              </el-form-item>
              <el-form-item label="Region">
                <el-input v-model="form.vars['cinder_region']" placeholder="eg: RegionOne" clearable></el-input>
              </el-form-item>
              <el-form-item label="Tenant Name">
                <el-input v-model="form.vars['cinder_tenant_name']" placeholder="eg: admin" clearable></el-input>
              </el-form-item>
              <el-form-item label="Domain Name">
                <el-input v-model="form.vars['cinder_domain_name']" placeholder="eg: Default" clearable></el-input>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.tool.enable_storage')">
                <el-switch style="width: 80%" v-model="form.vars['enable_blockstorage']"></el-switch>
              </el-form-item>
              <div v-if="form.vars['enable_blockstorage']">
                <el-form-item label="Version">
                  <el-select style="width: 100%" @change="changeBlockEnable()" v-model="form.vars['cinder_blockstorage_version']">
                    <el-option value='V3' label='V3'>V3</el-option>
                  </el-select>
                  <div><span class="input-help">{{$t('cluster.detail.storage.cinder_version_helper')}}</span></div>
                </el-form-item>
                <el-form-item label="Attach Limit">
                  <el-input v-model="form.vars['node_volume_attach_limit']" placeholder="eg: 256" clearable></el-input>
                </el-form-item>
              </div>
            </div>
            <div v-if="createType === 'vsphere'">
              <el-form-item>
                <div><span class="input-help">{{$t('cluster.detail.storage.vsphere_select_helper')}}</span></div>
              </el-form-item>
              <el-form-item :label="$t('commons.table.name')">
                <el-input v-model="form.name" disabled></el-input>
                <div><span class="input-help">{{$t('cluster.detail.storage.provisioner_name_helper')}}</span></div>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.vcenter_host')">
                <el-input v-model="form.vars['vc_host']" clearable></el-input>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.vcenter_port')">
                <el-input v-model="form.vars['vc_port']" clearable></el-input>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.vcenter_username')">
                <el-input v-model="form.vars['vc_username']" clearable></el-input>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.vcenter_password')">
                <el-input v-model="form.vars['vc_password']" clearable></el-input>
              </el-form-item>
              <el-form-item label="Datacenter">
                <el-input v-model="form.vars['datacenter']" clearable></el-input>
              </el-form-item>
              <el-form-item label="Folder">
                <el-input v-model="form.vars['folder']" clearable></el-input>
              </el-form-item>
            </div>
            <div v-if="createType === 'glusterfs'">
              <el-form-item :label="$t('commons.table.name')">
                <el-input v-model="form.name" disabled></el-input>
                <div><span class="input-help">{{$t('cluster.detail.storage.provisioner_name_helper')}}</span></div>
              </el-form-item>
            </div>
            <div v-if="createType === 'oceanstor'">
              <el-form-item :label="$t('commons.table.name')">
                <el-input v-model="form.name" disabled></el-input>
                <div><span class="input-help">{{$t('cluster.detail.storage.provisioner_name_helper')}}</span></div>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.deploy_mode')">
                <el-select style="width: 100%" v-model="form.vars['oceanstor_controller_type']">
                  <el-option value='single' label='single'>single</el-option>
                  <el-option value='multi' label='single'>multi</el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.multi_path_networking')">
                <el-select style="width: 100%" v-model="form.vars['oceanstor_is_multipath']">
                  <el-option value="yes" :label="$t('commons.form.yes')">{{$t('commons.form.yes')}}</el-option>
                  <el-option value="no" :label="$t('commons.form.no')">{{$t('commons.form.no')}}</el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('commons.table.type')">
                <el-select style="width: 100%" v-model="form.vars['oceanstor_type']">
                  <el-option value='nfs' label='nfs'>nfs</el-option>
                  <el-option value='iscsi' label='iscsi'>iscsi</el-option>
                  <el-option value='fc' label='fc'>fc</el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.product')">
                <el-select style="width: 100%" v-model="form.vars['oceanstor_product']">
                  <el-option value='V3' label='V3'>V3</el-option>
                  <el-option value='V5' label='V5'>V5</el-option>
                  <el-option value='Dorado' label='Dorado'>Dorado</el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.manage_url')">
                <el-input v-model="form.vars['oceanstor_urls']" placeholder="10.1.1.1,10.1.1.2" clearable></el-input>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.user_name')">
                <el-input v-model="form.vars['oceanstor_user']" clearable></el-input>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.password')">
                <el-input type="password" v-model="form.vars['oceanstor_password']" clearable></el-input>
              </el-form-item>
              <el-form-item :label="$t('cluster.detail.storage.storage_pool')">
                <el-input v-model="form.vars['oceanstor_pools']" placeholder="pool1,pool2" clearable></el-input>
              </el-form-item>
              <el-form-item v-if="form.vars['oceanstor_type'] === 'nfs'" :label="$t('cluster.detail.storage.logic_port')">
                <el-input v-model="form.vars['oceanstor_portal']" placeholder="test1,test2" clearable></el-input>
                <div><span class="input-help">{{$t('cluster.detail.storage.logic_port_helper')}}</span></div>
              </el-form-item>
              <el-form-item v-if="form.vars['oceanstor_type'] === 'iscsi'" :label="$t('cluster.detail.storage.business_ip')">
                <el-input v-model="form.vars['oceanstor_portal']" placeholder="10.1.1.1,10.1.1.2" clearable></el-input>
                <div><span class="input-help">{{$t('cluster.detail.storage.business_ip_helper')}}</span></div>
              </el-form-item>
            </div>
            <el-form-item>
              <el-button @click="onCancel()">取消</el-button>
              <el-button type="primary" @click="onSubmit">创建</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="4"><br /></el-col>
    </el-row>
  </layout-content>
</template>

<script>
import LayoutContent from "@/components/layout/LayoutContent"
import { createProvisioner } from "@/api/cluster/storage"

export default {
  name: "ProvisionerCreate",
  components: { LayoutContent },
  data() {
    return {
      createType: "",
      form: {
        name: "",
        type: "",
        vars: {},
      },
    }
  },
  methods: {
    onSubmit() {
      this.form.type = this.createType
      createProvisioner(this.clusterName, this.form).then((data) => {
        console.log(data)
        this.$message({ type: "success", message: this.$t("commons.msg.save_success") })
        this.$router.push({ name: "ClusterStorage" })
      })
    },
    onCancel() {
      this.$router.push({ name: "ClusterStorage" })
    },
    changeSelection() {
      switch (this.createType) {
        case "external-ceph":
          this.form.name = "external-ceph"
          break
        case "rook-ceph":
          this.form.name = "rook-ceph.rbd.csi.ceph.com"
          break
        case "cinder":
          this.form.name = "cinder.csi.openstack.org"
          this.form.vars["enable_blockstorage"] = "disable"
          break
        case "glusterfs":
          this.form.name = "kubernetes.io/glusterfs"
          break
        case "oceanstor":
          this.form.name = "csi.huawei.com"
          this.form.vars["oceanstor_controller_type"] = "single"
          this.form.vars["oceanstor_is_multipath"] = "no"
          break
      }
    },
    changeBlockEnable() {
      if (this.form.vars["enable_blockstorage"] === "disable") {
        this.form.vars["cinder_blockstorage_version"] = ""
        this.form.vars["node_volume_attach_limit"] = ""
      } else {
        this.form.vars["cinder_blockstorage_version"] = "V3"
        this.form.vars["node_volume_attach_limit"] = "256"
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
