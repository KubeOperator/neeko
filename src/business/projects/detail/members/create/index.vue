<template>
  <el-row>
    <el-col :span="4"><br/></el-col>
    <el-col :span="16">
      <div class="grid-content bg-purple-light">
        <el-form ref="form">
          <el-form-item :label="$t('user.user')" required>
            <el-select
              v-model="form.users"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="请选择用户" @change="userChange()">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

<!--          <el-form-item :label="$t('user.role')">-->
<!--            <el-transfer-->
<!--              v-model="form.admins"-->
<!--              :data="form.users"-->
<!--              :titles="['集群管理员', '项目管理员']"-->
<!--            >-->
<!--            </el-transfer>-->
<!--          </el-form-item>-->

        </el-form>


      </div>
    </el-col>
    <el-col :span="4"><br/></el-col>
  </el-row>
</template>

<script>
  import {createProject} from "@/api/projects"
  import {listUsers} from "@/api/user"

  export default {
    name: "ProjectMemberCreate",
    components: {},
    data() {
      return {
        form: {
          users: [],
          admins: [],
        },
        options: [{
          value: 'zhangsan',
          label: 'zhangsan'
        }, {
          value: 'lisi',
          label: 'lisi'
        }, {
          value: 'wangwu',
          label: 'wangwu'
        }],
        value: [],
      }
    },
    methods: {
      userChange() {
        console.log(this.form.users)
      },
      onSubmit() {
        createProject(this.form).then(() => {
          this.$message({
            type: 'success',
            message: `创建成功`
          });
          this.$router.push({name: "ProjectList"})
        })
      },
      onCancel() {
        this.$router.push({name: "ProjectMembersList"})
      }
    }, created() {
      listUsers(data => {
        this.users = data.items;
      })
    }

  }
</script>

<style scoped>
</style>
