<template>
  <el-dialog
    title="关联集群"
    :visible.sync="dialogVisible"
    width="30%">
    <el-row v-loading="loading">
      <el-col :span="4"><br/></el-col>
      <el-col :span="18">
        <el-transfer :titles="['options','targets']" v-model="value" :data="data"></el-transfer>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible=false">取 消</el-button>
    <el-button type="primary" @click="onSubmit">确 定</el-button>
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
            this.data.push({
              label: v.name,
              key: v.name
            })
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
