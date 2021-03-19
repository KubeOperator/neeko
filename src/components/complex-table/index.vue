<template>
  <layout-content class="complex-table">
    <template #header v-if="$slots.header || header">
      <slot name="header">{{ header }}</slot>
    </template>
    <template #toolbar v-if="$slots.toolbar || searchConfig">
      <div class="complex-table__toolbar">
        <slot name="toolbar">

        </slot>
      </div>
      <div class="complex-table__search">
        <fu-search-bar v-bind="searchConfig" @exec="search" v-if="searchConfig">
          <template #complex>
            <slot name="complex"></slot>
          </template>
          <slot name="buttons"></slot>
          <fu-table-column-select :columns="columns"/>
        </fu-search-bar>
      </div>
    </template>

    <fu-table v-on="$listeners" v-bind="$attrs" :columns="columns" :local-key="localKey">
      <slot></slot>
    </fu-table>

    <div class="complex-table__pagination" v-if="$slots.pagination || paginationConfig">
      <slot name="pagination">
        <fu-table-pagination :current-page.sync="paginationConfig.currentPage"
                             :page-size.sync="paginationConfig.pageSize"
                             v-bind="paginationConfig"
                             @change="search"/>
      </slot>
    </div>
  </layout-content>
</template>

<script>

  import LayoutContent from "@/components/layout/LayoutContent";

  export default {
    name: "ComplexTable",
    components: {LayoutContent},
    props: {
      columns: {
        type: Array,
        default: () => []
      },
      localKey: String, // 如果需要记住选择的列，则这里添加一个唯一的Key
      header: String,
      searchConfig: Object,
      paginationConfig: Object,
    },
    data() {
      return {
        condition: {}
      }
    },
    methods: {
      search(condition, e) {
        if (condition) {
          this.condition = condition
        }
        this.$emit("search", this.condition, e)
      }
    },
  }
</script>

<style lang="scss">
  @import "~@/styles/common/mixins.scss";
  @import "~@/styles/common/variables.scss";

  .complex-table {
    .complex-table__toolbar {
      @include flex-row(flex-start);
    }

    .complex-table__search {
      @include flex-row(flex-end);

      .fu-search-bar {
        width: auto;
      }
    }

    .complex-table__pagination {
      margin-top: 20px;
      @include flex-row(flex-end);
    }
  }

</style>
