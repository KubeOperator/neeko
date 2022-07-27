<template>
  <div>
    <div>
      <el-badge :value="count" :max="99" style="margin-top: 8px;" size="mini">
        <div style="margin-top: -12px;margin-right: 8px;cursor : pointer;">
          <i class="el-icon-message" style="color: #FA5D50;margin-right: 3px"></i>
          <el-button style="color: #606266;font-size: 14px;" type="text" @click="openDrawer">
            {{ $t("message.message_in_station") }}
          </el-button>
        </div>
      </el-badge>
    </div>

    <el-drawer :title="$t('message.message_in_station')" :visible.sync="drawer" direction="rtl" size="25%"
               :modal="false">
      <div slot="title">
        <span style="font-size: 18px">{{ $t("message.message_in_station") }}</span>
        <el-button class="read-button" type="text" @click.stop="markAsAllRead()" style="float: right;margin-top: 10px" v-if="messages.length > 0">
          {{ $t("message.allRead") }}
        </el-button>
      </div>
      <div class="notice-list" v-infinite-scroll="next" v-loading="letterLoading">
        <div class="notice-item" v-for="(item, index) in messages" :key="index" @mouseover="hover = index"
             @mouseleave="hover = null" @click="open(item)">
          <div class="notice-title">
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
            <el-button class="read-button" type="text" v-if="hover === index" @click.stop="markAsRead(item)">
              {{ $t("message.mark_as_read") }}
            </el-button>
            <div class="time" v-else>
              <span>{{ item.createdAt | datetimeFormat }}</span>
            </div>
          </div>
          <div class="notice-content">{{ item.content.title }}</div>
          <p v-if="letterLoading">{{ $t("message.loading") }}</p>
        </div>
        <div style="text-align: center">
          <span v-if="messages.length === 0 ">{{ $t("message.no_letter") }}</span>
        </div>
      </div>
    </el-drawer>
    <el-dialog :visible.sync="openDetail" :title="item.content.title" width="30%">

      <div v-if="item.msg.name === 'LICENSE_EXPIRE'">
        <el-descriptions :column="1" :size="''">
          <el-descriptions-item :label="$t('commons.table.status')">{{ item.content.message }}</el-descriptions-item>
          <el-descriptions-item :label="$t('message.detail.time')">{{ item.createdAt | datetimeFormat }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <div v-else>
        <el-descriptions :column="1" :size="''">
          <el-descriptions-item :label="$t('cluster.project')">{{ item.content.projectName }}</el-descriptions-item>
          <el-descriptions-item :label="$t('message.detail.clusterName')">{{ item.content.resourceName }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('commons.table.action')">{{ item.content.operator }}</el-descriptions-item>
          <el-descriptions-item :label="$t('commons.table.name')" v-if="item.content.detailName">{{ item.content.detailName }}</el-descriptions-item>
          <el-descriptions-item :label="$t('message.detail.time')">{{ item.createdAt | datetimeFormat  }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('message.detail.detail')" v-if="item.content.errMsg">
            <div v-if="item.itemMsg[0].type === 'unFormat'">
              <div><span style="white-space: pre-wrap;">{{ item.itemMsg[0].info | errorFormat }}</span></div>
            </div>
            <div v-else>
              <div v-for="(msg, index) in item.itemMsg" :key="index">
                <el-card :header="msg.name">
                  <div v-if="msg.info.cmd">
                    <div style="margin-top: 2px"><span style="font-weight: bold">cmd</span></div>
                    <div><span style="white-space: pre-wrap;">{{ msg.info.cmd }}</span></div>
                  </div>
                  <div v-if="msg.info.msg">
                    <div style="margin-top: 2px"><span style="font-weight: bold">message</span></div>
                    <div><span style="white-space: pre-wrap;">{{ msg.info.msg }}</span></div>
                  </div>
                  <div v-if="msg.info.stderr">
                    <div style="margin-top: 2px"><span style="font-weight: bold">stderr</span></div>
                    <div><span style="white-space: pre-wrap;">{{ msg.info.stderr }}</span></div>
                  </div>
                  <div v-if="msg.info.stdout">
                    <div style="margin-top: 2px"><span style="font-weight: bold">stdout</span></div>
                    <div><span style="white-space: pre-wrap;">{{ msg.info.stdout }}</span></div>
                  </div>
                </el-card>
              </div>
            </div>
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
import {listUserMessages, markAllRead, readUserMessage} from "@/api/user-message"
import {ansibleErrFormat} from "@/utils/format_ansible_err"

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
        pageSize: 8,
        total: 0,
      },
      messages: [],
      letterLoading: false,
      openDetail: false,
      item: {
        content: {},
        msg: {},
      },
      timer: {},
      activeCollapse: 0,
    }
  },
  methods: {
    openDrawer () {
      this.drawer = true
    },
    load () {
      this.letterLoading = true
      listUserMessages(this.paginationConfig.currentPage, this.paginationConfig.pageSize)
        .then((res) => {
          this.messages = res.items
          this.count = res.total
          this.paginationConfig.total = res.total
        })
        .finally(() => {
          this.letterLoading = false
        })
    },
    loadWithOutLoading () {
      listUserMessages(this.paginationConfig.currentPage, this.paginationConfig.pageSize).then((res) => {
        this.messages = res.items
        this.count = res.total
        this.paginationConfig.total = res.total
      })
    },
    markAsRead (item) {
      readUserMessage(item.id).finally(() => {
        this.load()
        this.openDetail = false
      })
    },
    markAsAllRead () {
      this.$confirm(this.$t("commons.confirm_message.markAsRead"), this.$t("commons.message_box.prompt"), {
        confirmButtonText: this.$t("commons.button.confirm"),
        cancelButtonText: this.$t("commons.button.cancel"),
        type: "warning"
      }).then(()=> {
        markAllRead().finally(() => {
          this.load()
        })
      })
    },
    open (item) {
      this.openDetail = true
      this.item = item
      this.item.itemMsg = ansibleErrFormat(item.content.errMsg)
    },
    next () {
      if (this.paginationConfig.pageSize >= this.paginationConfig.total) {
        return
      }
      this.paginationConfig.pageSize = this.paginationConfig.pageSize + 8
      this.load()
    },
  },
  created () {
    this.load()
    this.timer = setInterval(this.loadWithOutLoading, 60000)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
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
