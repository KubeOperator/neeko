<template>
    <div>
        <el-dialog width="30%" :visible.sync="dialogMetallbVisible">
            <template slot="title">
                <div>Metallb</div>
            </template>
            <el-form :model="metallbVars" ref="metallbVars" label-width="80px">
            <el-form-item label="cidr" prop="metallb_cidrs">
                <el-input type="textarea" :autosize="{ minRows: 2}" :placeholder="$t('cluster.detail.component.cidrHelper')" v-model="metallbVars.metallb_cidrs" />
            </el-form-item>
            <el-form-item :label="'IP ' + $t('cluster.creation.port_range')" prop="metallb_ip_ranges">
                <table style="width: 100%" class="tab-table">
                    <tr v-for="(row, index) in metallbVars.metallb_ip_ranges" :key="index">
                        <td width="49%">
                            <el-input placeholder="172.16.10.100" v-model="row.ipStart"></el-input>
                        </td>
                        <td width="5px">
                            -
                        </td>
                        <td width="49%">
                            <el-input placeholder="172.16.10.200" v-model="row.ipEnd"></el-input>
                        </td>
                        <td>
                            <el-button type="text" style="font-size: 10px" @click="handleDelete(index)">
                                {{ $t('commons.button.delete') }}
                            </el-button>
                        </td>
                    </tr>
                    <tr>
                        <td align="left">
                            <el-button @click="handleAdd()">{{ $t('commons.button.create') }}</el-button>
                        </td>
                    </tr>
                </table>
            </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogMetallbVisible = false">{{ $t("commons.button.cancel") }}</el-button>
                <el-button type="primary" @click="submitMetallb()">{{ $t("commons.button.ok") }}</el-button>
            </div>
        </el-dialog>
    </div>
  </template>
  
<script>
import i18n from "@/i18n"
import { createComponent } from "@/api/cluster"
  
  export default {
    name: "MetallbComponent",
    data() {
      return {
        type: "both",
        submitLoading: false,
        dialogMetallbVisible: false,
        clusterName: "",
        metallbVars: {
            clusterName: "",
            name: "",
            metallb_cidrs: "",
            type: "",
            version: "",
            metallb_ip_ranges: [],
        },
      }
    },
    methods: {
        handleAdd() {
            let item = {
            ipStart: "",
            ipEnd: "",
            };
            this.metallbVars.metallb_ip_ranges.push(item);
        },
        handleDelete(index){
            this.metallbVars.metallb_ip_ranges.splice(index, 1);
        },
        submitMetallb() {
            let itemVars = {}
            if (this.metallbVars.metallb_cidrs) {
                let regexp = /^(?:(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\/([1-9]|[1-2]\d|3[0-2])$/
                let cidrs = this.metallbVars.metallb_cidrs.split("\n")
                for (const item of cidrs) {
                    if (regexp.test(item) == false) {
                        this.$message({ type: "error", message: i18n.t("commons.validate.cidr_error") })
                        return
                    }
                }
                itemVars.metallb_cidrs = this.metallbVars.metallb_cidrs.replace("\n", ",")
            } else if (this.metallbVars.metallb_ip_ranges.length !== 0) {
                let regexp = /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/
                let ips = []
                for (const item of this.metallbVars.metallb_ip_ranges) {
                    ips.push(item.ipStart)
                    ips.push(item.ipEnd)
                }
                if (ips.length) {
                    for (let i = 0; i < ips.length; i++) {
                        if (regexp.test(ips[i]) == false) {
                            this.$message({ type: "error", message: i18n.t("commons.validate.ip_range_error") })
                            return
                        }
                    }
                }
                let iprange = []
                for (const item of this.metallbVars.metallb_ip_ranges) {
                    iprange.push(item.ipStart+"-"+item.ipEnd)
                }
                itemVars.metallb_ip_ranges = iprange.join(",")
            } else {
                this.$message({ type: "error", message: i18n.t("cluster.detail.component.metallb_param_error") })
                return
            }
            let data = {
                clusterName: this.metallbVars.clusterName,
                name: this.metallbVars.name,
                type: this.metallbVars.type,
                version: this.metallbVars.version,
                vars: itemVars,
            }
            createComponent(data).then(() => {
                this.dialogMetallbVisible = false
                this.$emit('search');
            })
        },
        acceptParam(row) {
            this.dialogMetallbVisible = true
            this.metallbVars.clusterName = row.clusterName
            this.metallbVars.name = row.name
            this.metallbVars.type = row.type
            this.metallbVars.version = row.version
        }
    },
  }
  </script>
  