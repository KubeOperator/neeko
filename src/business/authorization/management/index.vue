<template>
  <el-row>
    <el-tabs v-model="active" @tab-click="changeItem" type="border-card">
      <el-tab-pane :label="$t('project.member')" name="member">
        <member-list :auth-obj="authObj"></member-list>
      </el-tab-pane>
      <el-tab-pane :label="$t('project.resource')" name="resource">
        <resource-list :auth-obj="authObj"></resource-list>
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
  props: ["authObj"],
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