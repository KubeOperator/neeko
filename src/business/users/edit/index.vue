<template>
  <layout-content :header="$t('commons.button.edit')" :back-to="{ name: 'UserList' }">
    <el-row>
      <el-col :span="4"><br/></el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple-light">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item :label="$t('commons.table.name')">
              <el-input v-model="form.name" disabled></el-input>
            </el-form-item>
            <el-form-item :label="$t('user.email')">
              <el-input v-model="form.email"></el-input>
            </el-form-item>
            <el-form-item :label="$t('user.role')">
              <el-radio-group v-model="form.role">
                <el-radio label="admin">{{$t('commons.role.admin')}}</el-radio>
                <el-radio label="user">{{$t('commons.role.user')}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">{{$t('commons.button.save')}}</el-button>
              <el-button @click="onCancel()">{{$t('commons.button.cancel')}}</el-button>
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
  import {updateUser, getUser} from "@/api/user"

  export default {
    name: "UserEdit",
    props: ['name'],
    components: {LayoutContent},
    data() {
      return {
        form: {
          name: '',
          email: '',
          role: 'user',
        }
      }
    },
    methods: {
      onSubmit() {
        updateUser(this.name, {
          email: this.form.email,
          role: this.form.role,
        }).then(() => {
          this.$message({
            type: 'success',
            message: this.$t("commons.msg.create_success")
          });
          this.$router.push({name: "UserList"})
        })
      },
      onCancel() {
        this.$router.push({name: "UserList"})
      },

    },
    created() {
      getUser(this.name).then(data => {
        this.form.name = data.name
        this.form.email = data.email
        this.form.role = data.role
      })
    }
  }
</script>

<style scoped>
</style>
