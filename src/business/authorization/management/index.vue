<template>
  <el-row>
    <el-tabs v-model="active" @tab-click="changeItem" type="border-card">
      <el-tab-pane :label="$t('project.member')" name="member">
        <member-list :auth-obj="authObj"></member-list>
      </el-tab-pane>
      <el-tab-pane :label="$t('project.resource')" name="resource">
        <resource-list :auth-obj="authObj"></resource-list>
      </el-tab-pane>
      <el-tab-pane label="kubepi" name="kubepi">
        <kubepi :auth-obj="authObj"></kubepi>
      </el-tab-pane>
    </el-tabs>
  </el-row>
</template>

<script>
import MemberList from "@/business/authorization/management/members"
import ResourceList from "@/business/authorization/management/resources"
import Kubepi from "@/business/authorization/management/kubepi"

export default {
  name: "Management",
  components: { ResourceList, MemberList, Kubepi },
  props: ["authObj"],
  data() {
    return {
      active: "member",
      loading: false,
    }
  },
  methods: {
    changeItem(tab) {
      this.active = tab.name
    },
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.focus()
      },
    },
  },
}
</script>

<style scoped>
</style>