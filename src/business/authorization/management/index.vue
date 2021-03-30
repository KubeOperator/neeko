<template>
  <el-row>
    {{this.name}}
    {{this.type}}
    <el-tabs v-model="active" @tab-click="changeItem" type="border-card">
      <el-tab-pane label="成员管理" name="member">
        <member-list :name="name" :type="type"></member-list>
      </el-tab-pane>
      <el-tab-pane label="资源管理" name="resource">
        <resource-list :name="name" :type="type"></resource-list>
      </el-tab-pane>
    </el-tabs>
  </el-row>
</template>

<script>
import MemberList from "@/business/authorization/management/members"
import ResourceList from "@/business/authorization/management/resources"

export default {
  name: "Management",
  components: { ResourceList, MemberList},
  props: ["name", "type"],
  data () {
    return {
      active: "member",
    }
  },
  methods: {
    changeItem (tab) {
      this.active = tab.name
    }
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.focus()
      }
    }
  }
}
</script>

<style scoped>

</style>