<template>
  <el-dialog
    :title="$t('multi_cluster.relation_management')"
    :visible.sync="dialogVisible"
    width="40%">
    <el-row v-loading="loading">
      <el-transfer sty :titles="[$t('multi_cluster.cluster_list'),$t('multi_cluster.cluster_list')]" v-model="value"
                   :data="data"></el-transfer>
    </el-row>
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible=false">{{$t('commons.button.cancel')}}</el-button>
    <el-button type="primary" @click="onSubmit">{{$t('commons.button.submit')}}</el-button>
  </span>
  </el-dialog>
</template>


<script>
  import {listMultiClusterRepositoryRelations, updateMultiClusterRepositoryRelations} from "@/api/xpack/multi-cluster"
  import {allClusters} from "@/api/cluster"

  export default {
    name: "RelationsManagement",
    props: {
      visible: Boolean,
      name: String,
    },
    data() {
      return {
        loading: false,
        data: [],
        value: [],
      };
    },
    watch: {
      visible: function (n) {
        if (n) {
          this.generateData()
        }
      }
    },
    methods: {
      generateData() {
        this.loading = true
        this.data = []
        this.value = []
        allClusters().then((data) => {
          data.items.forEach((v) => {
            if (v.status === 'Running') {
              this.data.push({
                label: v.name,
                key: v.name
              })
            }
          })
          listMultiClusterRepositoryRelations(this.name).then((data) => {
            data.items.forEach((v) => {
              this.value.push(v.clusterName)
            })
            this.loading = false
          })
        })
      },
      onSubmit() {
        updateMultiClusterRepositoryRelations(this.name, {clusterNames: this.value}).then(() => {
          this.dialogVisible = false
        }).catch(() => {
          this.generateData()
        })
      }
    },
    computed: {
      dialogVisible: {
        get() {
          return this.visible
        },
        set(s) {
          this.$emit('update:visible', s);
        }
      }
    }, created() {
    }
  };
</script>
