<template>
  <div>
    <el-badge :value="12" :max="99" class="item" style="margin-top: 5px">
      <div style="font-size: 20px;margin-top: -5px;cursor : pointer;">
        <i class="el-icon-message" style="color: #FA5D50;" @click="openDrawer"></i>
      </div>
    </el-badge>

    <el-drawer :title="$t('message.message_in_station')" :visible.sync="drawer" direction="rtl" size="25%" :modal="false">
      <div class="notice-list">
        <div class="notice-item" v-for="(item, index) in list" :key="index" @mouseover="hover = index"
             @mouseleave="hover = null">
          <div class="notice-title">
            <div class="text"><i class="el-icon-message"></i> {{ item.title }}</div>
            <el-button class="read-button" type="text" v-if="hover === index">标记已读</el-button>
            <div class="time" v-else>
              <span>{{ item.time | datetimeFormat }}</span>
            </div>
          </div>
          <div class="notice-content">{{ item.content }}</div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "StationLetter",
  components: {  },
  props: {},
  data () {
    return {
      drawer: false,
      hover: null,
      list: [
        {
          title: "您的工单已被处理",
          content: "您的工单已被处理, 处理人- Administrator（admin）",
          time: "1小时前"
        },
        {
          title: "您的工单已被处理，登录资产复核",
          content: "您的工单已被处理, 处理人- Administrator（admin）",
          time: "1天前"
        }
      ]
    }
  },
  methods: {
    openDrawer () {
      this.drawer = true
    },
    load () {

    }
  },
  created () {
  }
}
</script>

<style scoped lang="scss">
    .el-divider--horizontal{
        margin: 1px 0;
    }
    .notice-list {
        overflow: auto;
        height: 100%;
        padding: 0 5px;

    .notice-item {

        padding: 12px 15px 8px;
        border-bottom: 1px solid #f0f0f0;
        cursor: pointer;

    &:hover {
         background: #f5f7fa;
     }

    .notice-title {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        color: #666666;

    .text {
        flex: 1;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .read-button {
        padding: 0;
    }


    }

    .notice-content {
        line-height: 25px;
        padding: 5px 0;
        font-weight: bold;
    }


    }

    }
</style>
