<template>
  <layout-content>
    <el-row>
      <el-col :span="4"><br/></el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple-light">
          <el-form ref="form" :model="form" label-width="120px">
            <el-form-item :label="$t('message.dingding_phone')">
              <el-input v-model="form.name"></el-input>
              <div><span class="input-help">{{$t('message.dingding_phone_help')}}</span></div>
            </el-form-item>
            <el-form-item :label="$t('message.dingding_wechart_id')">
              <el-input v-model="form.name"></el-input>
              <div><span class="input-help">{{$t('message.dingding_wechart_id_help')}}</span></div>
            </el-form-item>
            <el-form-item :label="$t('message.email')">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">{{$t('common.button.create')}}</el-button>
              <el-button @click="onCancel()">{{$t('common.button.cancel')}}</el-button>
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

  export default {
    name: "HostCreate",
    components: {LayoutContent},
    data() {
      return {
        form: {
          name: ''
        }
      }
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      },
      onCancel() {
        this.$router.push({name: "Messages"})
      }
    }
  }
</script>

<style scoped>
</style>