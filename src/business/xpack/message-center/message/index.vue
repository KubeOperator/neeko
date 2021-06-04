<template>
  <div>
    <complex-table :header="$t('message.message')" :selects.sync="selects" :fit="true" :default-sort = "{prop: 'create_time', order: 'descending'}"
                   v-loading="loading" :data="data" :columns="columns" @search="search" :pagination-config="paginationConfig" :search-config="searchConfig" >
      <template #header>
        <el-button-group>
          <el-button size="small" :disabled="selects.length < 1"  @click="markAsRead()">
            {{ $t("message.mark_as_read") }}
          </el-button>
          <el-button size="small" :disabled="selects.length < 1"  @click="del()">
            {{ $t("commons.button.delete") }}
          </el-button>
        </el-button-group>
      </template>
      <el-table-column type="selection" fix></el-table-column>
      <el-table-column :label="$t('message.content')" min-width="100"  fix>
        <template v-slot:default="{row}">
          <svg v-if="row.readStatus === 'READ'" class="icon svg-icon" aria-hidden="true" :style="{ color: '#969696'}" size="5x">
            <use xlink:href="#iconyidu1"></use>
          </svg>
          <svg v-if="row.readStatus === 'UNREAD'" class="icon svg-icon" aria-hidden="true" :style="{ color: '#0079b8' }">
            <use xlink:href="#iconweidu1"></use>
          </svg>
          <span class="message-link" @click="onDetail(row)" :style="{'color':row.readStatus === 'UNREAD'?'#0079b8':'#969696'}" > {{$t('message.title.'+row.message.title)}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('message.type')" min-width="100" prop="message.type" fix />
      <el-table-column :label="$t('message.level')" min-width="100" prop="message.level" />
      <el-table-column :label="$t('commons.table.status')" min-width="100" prop="readStatus">
        <template v-slot:default="{row}">
          <svg v-if="row.readStatus === 'READ'" class="icon svg-icon" aria-hidden="true">
            <use xlink:href="#iconyidu3"></use>
          </svg>
          <svg v-if="row.readStatus === 'UNREAD'" class="icon svg-icon" aria-hidden="true">
            <use xlink:href="#iconinform-weidu"></use>
          </svg>
          {{$t('message.'+row.readStatus)}}
        </template>
      </el-table-column>
      <el-table-column sortable sort-by="createdAt" :label="$t('commons.table.create_time')" >
        <template v-slot:default="{ row }">
          {{ row.createdAt | datetimeFormat }}
        </template>
      </el-table-column>
      <fu-table-operations :buttons="buttons" :label="$t('commons.table.action')" fix/>
    </complex-table>

    <el-dialog
      :title="$t('message.detail.message_detail')"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose">
      <span>{{ $t('message.detail.basicInformation') }}</span>
      <el-divider></el-divider>
      <div v-if="detail.message.title === 'cluster_event_warning'">
          <p>{{ $t('message.detail.clusterName') }}: {{detail.clusterName}} </p>
          <p>{{ $t('message.detail.host') }}: {{detail.msgContent['host']}}</p>
          <p>{{ $t('message.detail.name') }}: {{detail.msgContent['name']}}</p>
          <p>{{ $t('message.detail.type') }}: {{detail.msgContent['type']}}</p>
          <p>{{ $t('message.detail.component') }}: {{detail.msgContent['component']}}</p>
          <p>{{ $t('message.detail.detail') }}: {{detail.msgContent['message']}}</p>
          <p>{{ $t('message.detail.kind') }}: {{detail.msgContent['kind']}}</p>
          <p>{{ $t('message.detail.cause') }}: {{detail.msgContent['reason']}}</p>
          <p>{{ $t('message.detail.time') }}: {{detail.msgContent['createdAt'] | datetimeFormat }}</p>
      </div>
      <div v-if="detail.message.title !== 'cluster_event_warning'">
          <p>{{ $t('message.detail.clusterName') }}: {{detail.clusterName}} </p>
          <p>{{ $t('message.detail.detail') }}: {{detail.msgContent['message']}}</p>
          <p>{{ $t('message.detail.time') }}: {{detail['createdAt'] | datetimeFormat }}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">{{$t('commons.button.ok')}}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import ComplexTable from "@/components/complex-table";
import {deleteMessagesBy, searchMessages, updateMessageStatus} from "@/api/xpack/message";

export default {
  name: "MessageCenter",
  components: {
    ComplexTable
  },
  data() {
    return {
      paginationConfig: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      selects: [],
      loading: false,
      data: [],
      buttons: [
         {
          label: this.$t('commons.button.delete'), icon: "el-icon-delete",  click: (row) => {
            this.del(row.id)
          }
        },
      ],
      columns: [],
      dialogVisible: false,
      searchConfig: {
        quickPlaceholder: this.$t("commons.search.quickSearch"),
        components: [
          { field: "type", label: this.$t('message.type'), component: "FuComplexInput", defaultOperator: "eq" },
          {
            field: "level",
            label: this.$t('message.level'),
            component: "FuComplexSelect",
            options: [
              { label: "Warning", value: 'Warning' },
              { label: "Info", value: 'Info' },
            ],
            multiple: true
          },
          {
            field: "table.status",
            label: this.$t('commons.table.status'),
            component: "FuComplexSelect",
            options: [
              { label: this.$t("message.READ"), value: "READ" },
              { label: this.$t("message.UNREAD"), value: "UNREAD" },
            ],
            multiple: true
          },
          { field: "created_at", label: this.$t("commons.table.create_time"), component: "FuComplexDateTime", valueFormat: "yyyy-MM-dd HH:mm:ss" },
        ]
      },
      detail: {
        message: {},
        readStatus: '',
        msgContent: {},
        clusterName: '',
      }
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.selects = val
    },
    markAsRead() {
      const ps = []
      const items = []
      for (const item of this.selects) {
        items.push(item)
        ps.push(updateMessageStatus({
          items: items,
          operation: "update"
        }))
      }
      Promise.all(ps).then(() => {
        this.search()
        this.$message({
          type: 'success',
          message: this.$t('commons.msg.op_success'),
        });
      })
    },
    del(messageID) {
      this.$confirm(this.$t('commons.confirm_message.delete'), this.$t('commons.message_box.prompt'), {
        confirmButtonText: this.$t('commons.button.confirm'),
        cancelButtonText: this.$t('commons.button.cancel'),
        type: 'warning'
      }).then(() => {
        if (messageID) {
          deleteMessagesBy(messageID).then(() => {
            this.search()
            this.$message({
              type: 'success',
              message: `${this.$t('message.message')}+${this.$t('commons.msg.delete_success')}!`
            });
          })
        } else {
          const ps = []
          for (const item of this.selects) {
            ps.push(deleteMessagesBy(item.id))
          }
          Promise.all(ps).then(() => {
            this.search()
            this.$message({
              type: 'success',
              message: this.$t('commons.msg.delete_success'),
            });
          })
        }
      })
    },
    search(condition) {
      this.loading = true
      const { currentPage, pageSize } = this.paginationConfig
      searchMessages(currentPage, pageSize,condition).then((data) => {
        this.loading = false
        this.data = data.items
        console.log(123,data)
        this.paginationConfig.total = data.total
      })
    },
    onDetail(row) {
      if (row.readStatus === "UNREAD"){
        row.readStatus = "READ"
        const readItems = [];
        readItems.push(row);
        updateMessageStatus({
          items: readItems,
          operation: "update"
        })
      }
      this.detail = row
      this.dialogVisible = true
    },
    handleClose(done) {
      done();
    }
  },
  created() {
    this.search()
  },
}
</script>

<style scoped>
.message-link {
  cursor: pointer;
}
</style>
