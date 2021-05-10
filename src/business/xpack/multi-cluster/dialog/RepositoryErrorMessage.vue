<template>
  <el-dialog
    :title="$t('commons.status.error')"
    :visible.sync="dialogVisible"
    width="40%">
    <el-row>
      {{message}}
    </el-row>
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible=false">{{$t('commons.button.cancel')}}</el-button>
  </span>
  </el-dialog>
</template>


<script>

  export default {
    name: "RepositoryErrorMessage",
    props: {
      visible: Boolean,
      message: String,
    },
    data() {
      return {
        loading: false,
      };
    },
    watch: {
    },
    methods: {},
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
