<template>
  <layout-content>
    <el-row>
      <el-col :span="4"><br/></el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple-light">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item :label="$t('commons.table.name')" required>
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('user.email')" required>
              <el-input v-model="form.email"></el-input>
            </el-form-item>
            <el-form-item :label="$t('user.password')" required>
              <el-input type="password" v-model="form.password"></el-input>
            </el-form-item>
            <el-form-item :label="$t('user.confirm_password')" required>
              <el-input type="password" v-model="form.confirmPassword"></el-input>
            </el-form-item>

            <el-form-item :label="$t('user.role')" required>
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
  import {createUser} from "@/api/user"

  export default {
    name: "UserCreate",
    components: {LayoutContent},
    data() {
      return {
        form: {
          name: '',
          password: '',
          confirmPassword: '',
          role: 'user',
        }
      }
    },
    methods: {
      onSubmit() {
        createUser({
          name: this.form.name,
          password: this.form.password,
          email: this.form.email,
          role: 'user',
        })
      },
      onCancel() {
        this.$router.push({name: "UserList"})
      }
    }
  }
</script>

<style scoped>
</style>
