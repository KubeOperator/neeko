<template>
  <div>
    <el-badge :value="count" :max="99" class="item" style="margin-top: 5px">
      <div style="font-size: 20px;margin-top: -5px;cursor : pointer;">
        <i class="el-icon-message" style="color: #FA5D50;" @click="openDrawer"></i>
      </div>
    </el-badge>

    <el-drawer :title="$t('message.message_in_station')" :visible.sync="drawer" direction="rtl" size="25%"
               :modal="false" v-loading="loading">
      <div class="notice-list">
        <div class="notice-item" v-for="(item, index) in messages" :key="index" @mouseover="hover = index"
             @mouseleave="hover = null">
          <div class="notice-title" @click="open(item)">
            <div class="text">
              <svg v-if="item.readStatus === 'READ'" class="icon svg-icon" aria-hidden="true"
                   :style="{ color: '#969696'}" size="5x">
                <use xlink:href="#iconyidu1"></use>
              </svg>
              <svg v-if="item.readStatus === 'UNREAD'" class="icon svg-icon" aria-hidden="true"
                   :style="{ color: '#0079b8' }">
                <use xlink:href="#iconweidu1"></use>
              </svg>
              {{ item.content.operator }}
            </div>
            <el-button class="read-button" type="text" v-if="hover === index" @click="markAsRead(item)">
              {{ $t("message.mark_as_read") }}
            </el-button>
            <div class="time" v-else>
              <span>{{ item.createdAt | datetimeFormat }}</span>
            </div>
          </div>
          <div class="notice-content">{{ item.content.title }}</div>
        </div>
      </div>
    </el-drawer>
    <el-dialog :visible.sync="openDetail" :title="item.content.title" width="30%">
      <div>
        <el-descriptions :title="$t('message.detail.detail')" :column="1" :size="''">
          <el-descriptions-item :label="$t('cluster.project')">{{ item.content.projectName }}</el-descriptions-item>
          <el-descriptions-item :label="$t('message.detail.clusterName')">{{ item.content.resourceName }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('commons.table.action')">{{ item.content.operator }}</el-descriptions-item>
          <el-descriptions-item :label="$t('commons.table.status')">{{ item.content.title }}</el-descriptions-item>
          <el-descriptions-item :label="$t('message.detail.time')">{{ item.content.createdAt | datetimeFormat }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="markAsRead(item)">{{ $t("message.mark_as_read") }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {listUserMessages, readUserMessage} from "@/api/user-message"

export default {
  name: "StationLetter",
  components: {},
  props: {},
  data () {
    return {
      count: 0,
      drawer: false,
      hover: null,
      paginationConfig: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      messages: [],
      loading: false,
      openDetail: false,
      item: {
        content: {}
      }
    }
  },
  methods: {
    openDrawer () {
      this.drawer = true
    },
    load () {
      this.loading = true
      listUserMessages(this.paginationConfig.currentPage, this.paginationConfig.pageSize).then(res => {
        this.messages = res.items
        this.count = res.unread
      }).finally(() => {
        this.loading = false
      })
    },
    markAsRead (item) {
      readUserMessage(item.id).finally(() => {
        this.count--
        item.readStatus = "READ"
        this.openDetail = false
      })
    },
    open (item) {
      this.openDetail = true
      this.item = item
    }
  },
  created () {
    this.load()
  }
}
</script>

<style scoped lang="scss">
  .el-divider--horizontal {
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
          margin-top: 10px;
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
