<template>
  <div>
    <complex-table :header="$t('message.message')" @selection-change="handleSelectionChange"
                   :data="data" :columns="columns" :pagination-config="paginationConfig" @search="search">
      <template #header>
        <el-button-group>
          <el-button size="small" :disabled="Selection.length < 1"  @click="markAsRead()">
            {{ $t("message.mark_as_read") }}</el-button>
          <el-button size="small" :disabled="Selection.length < 1"  @click="remove()">
            {{ $t("commons.button.delete") }}</el-button>
        </el-button-group>
      </template>
      <el-table-column type="selection" fix></el-table-column>
      <el-table-column :label="$t('message.content')" min-width="100"  fix>
        <template v-slot:default="{row}">
          <font-awesome-icon v-if="row.readStatus === 'UNREAD'" :icon="['far','folder']" :style="{ color: '#0079b8' }" size="1x"/>
          <font-awesome-icon v-if="row.readStatus === 'READ'" :icon="['far','folder-open']" :style="{ color: '#969696' }" size="1x"/>
          <span @click="onDetail(row)" :style="{'color':row.readStatus === 'UNREAD'?'#0079b8':'#969696'}" > {{$t('message.title.'+row.message.title)}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('message.type')" min-width="100" prop="message.type" fix />
      <el-table-column :label="$t('message.level')" min-width="100" prop="message.level" />
      <el-table-column :label="$t('commons.table.status')" min-width="100" prop="readStatus">
        <template v-slot:default="{row}">
          {{$t('message.'+row.readStatus)}}
        </template>
      </el-table-column>
      <el-table-column :label="$t('commons.table.create_time')">
        <template v-slot:default="{ row }">
          {{ row.createdAt | datetimeFormat }}
        </template>
      </el-table-column>
      <fu-table-operations :buttons="buttons" :label="$t('commons.table.action')" fix/>
    </complex-table>

    <el-dialog
      :title="$t('message.detail.messageDetail')"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose">
      <span>{{ $t('message.detail.basicInformation') }}</span>
      <el-divider></el-divider>
      <div v-if="detail.message.title === 'CLUSTER_EVENT_WARNING'">
          <p>{{ $t('message.detail.clusterName') }}: {{detail.clusterName}} </p>
          <p>{{ $t('message.detail.host') }}: {{detail.msgContent.host}}</p>
          <p>{{ $t('message.detail.name') }}: {{detail.msgContent.name}}</p>
          <p>{{ $t('message.detail.type') }}: {{detail.msgContent.type}}</p>
          <p>{{ $t('message.detail.component') }}: {{detail.msgContent.component}}</p>
          <p>{{ $t('message.detail.Detail') }}: {{detail.msgContent.message}}</p>
          <p>{{ $t('message.detail.kind') }}: {{detail.msgContent.kind}}</p>
          <p>{{ $t('message.detail.cause') }}: {{detail.msgContent.reason}}</p>
          <p>{{ $t('message.detail.time') }}: {{detail.msgContent.createdAt | datetimeFormat }}</p>
      </div>
      <div v-if="detail.message.title !== 'CLUSTER_EVENT_WARNING'">
          <p>{{ $t('message.detail.clusterName') }}: {{detail.clusterName}} </p>
          <p>{{ $t('message.detail.Detail') }}: {{detail.msgContent.message}}</p>
          <p>{{ $t('message.detail.time') }}: {{detail.createdAt | datetimeFormat }}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import ComplexTable from "@/components/complex-table";
import {getMessagesByUser, updateMessageStatus} from "@/api/message";

export default {
  name: "MessageCenter",
  components: {
    ComplexTable
  },
  data() {
    return {
      paginationConfig: {
        currentPage: 1,
        pageSize: 8,
        total: 0,
      },
      Selection: [],
      data: [],
      buttons: [
         {
          label: this.$t('commons.button.delete'), icon: "el-icon-delete", type: "danger", click: (row) => {
            this.del(row.name)
          }
        },
      ],
      columns: [],
      dialogVisible: false,
      detail: {
        message: {},
        readStatus: '',
        msgContent: {
          createdAt: '',
          host: '',
          kind: '',
          component: '',
          message: '',
          reason: '',
        },
        clusterName: '',
      }
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.Selection = val
    },
    markAsRead() {},
    del() {},
    search() {
      const { currentPage, pageSize } = this.paginationConfig
      getMessagesByUser(currentPage, pageSize).then((data) => {
        this.data = data.items
        this.paginationConfig.total = data.total
      })
    },
    onDetail(data) {
      if (data.readStatus === "UNREAD"){
        data.readStatus = "READ"
        const readItems = [];
        readItems.push(data);
        updateMessageStatus({
          items: readItems,
          operation: "update"
        })
      }
      console.log(123,data)
      this.detail = data
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

</style>
