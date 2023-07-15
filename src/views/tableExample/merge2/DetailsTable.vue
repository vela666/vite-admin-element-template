<template>
  <el-table
    :data="tableRowLists"
    :span-method="mergeHanlder"
    border
    style="width: 100%">
    <el-table-column align="center" label="广告计划" min-width="300">
      <el-table-column align="center" label="选择" min-width="70" prop="all">
        <template #default="{ row: { campaignIndex, unitIndex, customIndex } }">
          <el-checkbox
            @change="
              parentChange($event, campaignIndex, unitIndex, customIndex)
            "
            :indeterminate="
              tableData.campaign_list[campaignIndex]?.indeterminate
            "
            v-model="tableData.campaign_list[campaignIndex].checked"
            :disabled="tableData.campaign_list[campaignIndex].disabled" />
        </template>
      </el-table-column>
      <el-table-column label="广告系列信息" prop="adInfo" min-width="220">
        <template #default="{ row: { campaignIndex } }">
          <div class="campaign-name">
            <div class="strong-text">计划名称：</div>
            <div v-auto-tooltip class="editor-name">
              {{ tableData.campaign_list[campaignIndex].campaign_name }}
            </div>
          </div>
          <div class="campaign-name">
            <div class="strong-text">营销目标：</div>
            <div>
              {{ tableData.campaign_list[campaignIndex].ft_marketing }}
            </div>
          </div>
          <div class="campaign-name">
            <div>
              预算：{{ tableData.campaign_list[campaignIndex].budget }}美元
            </div>
            <div v-if="tableData.campaign_list[campaignIndex].target_cpa">
              出价：{{ tableData.campaign_list[campaignIndex].target_cpa }}美元
            </div>
            <div v-if="tableData.campaign_list[campaignIndex].target_roas">
              回报率：{{ tableData.campaign_list[campaignIndex].target_roas }}%
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table-column>
    <el-table-column align="center" label="状态与操作">
      <el-table-column align="center" label="选择" min-width="60">
        <template #default="{ row: { campaignIndex, unitIndex, customIndex } }">
          <el-checkbox
            @change="childrenChange(campaignIndex, unitIndex, customIndex)"
            v-model="
              tableData.campaign_list[campaignIndex].adset_list[unitIndex]
                .ad_list[customIndex].checked
            "
            :disabled="
              tableData.campaign_list[campaignIndex].adset_list[unitIndex]
                .ad_list[customIndex].disabled
            " />
        </template>
      </el-table-column>
      <el-table-column label="提交状态" min-width="126">
        <template #default="{ row: { campaignIndex, unitIndex, customIndex } }">
          <template
            v-if="
              tableData.campaign_list[campaignIndex].adset_list[unitIndex]
                .ad_list[customIndex].submit_status === '定时提交'
            ">
            <span class="warning-text"
              >{{ tableData.task_submit_time }}<br />定时提交</span
            >
          </template>
          <template
            v-else-if="
              tableData.campaign_list[campaignIndex].adset_list[unitIndex]
                .ad_list[customIndex].submit_status === '待提交'
            ">
            <span>待提交</span>
          </template>
          <template
            v-else-if="
              tableData.campaign_list[campaignIndex].adset_list[unitIndex]
                .ad_list[customIndex].submit_status === '已提交'
            ">
            <span class="primary-text">已提交</span>
          </template>
          <template
            v-else-if="
              tableData.campaign_list[campaignIndex].adset_list[unitIndex]
                .ad_list[customIndex].submit_status === '成功'
            ">
            <span class="success-text">成功</span>
          </template>
          <template v-else>
            <span
              v-tooltip="{
                txt: tableData.campaign_list[campaignIndex].adset_list[
                  unitIndex
                ].ad_list[customIndex].fail_reason,
                place: 'right',
              }"
              class="error-text"
              >{{
                tableData.campaign_list[campaignIndex].adset_list[unitIndex]
                  .ad_list[customIndex].submit_status
              }}</span
            >
          </template>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="80">
        <template #default="{ row: { campaignIndex, unitIndex, customIndex } }">
          <template
            v-if="
              tableData.campaign_list[campaignIndex].adset_list[unitIndex]
                .ad_list[customIndex].submit_status === '定时提交'
            ">
            <el-button
              @click="cancelTimer(campaignIndex, unitIndex, customIndex)"
              v-tooltip="'取消提交后不能再恢复定时任务'"
              type="text">
              <span>取消定时</span>
            </el-button>
          </template>
          <template
            v-else-if="
              tableData.campaign_list[campaignIndex].adset_list[unitIndex]
                .ad_list[customIndex].submit_status === '待提交'
            ">
            <el-button
              @click="delTask(campaignIndex, unitIndex, customIndex)"
              type="text">
              <span>删除</span>
            </el-button>
          </template>
          <template v-else>
            <el-button disabled type="text">删除</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table-column>

    <el-table-column align="center" label="广告组">
      <el-table-column prop="adset_name" label="广告组名称" min-width="240">
        <template #default="{ row: { campaignIndex, unitIndex } }">
          <div v-auto-tooltip class="editor-name">
            {{
              tableData.campaign_list[campaignIndex].adset_list[unitIndex]
                .adset_name
            }}
          </div>
        </template>
      </el-table-column>
    </el-table-column>

    <el-table-column align="center" label="广告内容">
      <el-table-column label="创意素材" min-width="150" prop="materials">
        <template #header>
          创意素材
          <template v-if="tableData.ft_group_by === 'materials'">
            （<span class="primary-text">按创意素材分组</span>）
          </template>
        </template>
        <template #default="{ row: { campaignIndex, unitIndex, customIndex } }">
          <div class="creative-preview">
            <span v-auto-tooltip class="editor-name">
              {{
                tableData.campaign_list[campaignIndex].adset_list[unitIndex]
                  .ad_list[customIndex].ft_materials.groupName
              }}</span
            >
            <el-button
              type="text"
              @click="showMaterial(campaignIndex, unitIndex, customIndex)"
              >查看
            </el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="标题包" min-width="210" prop="titles">
        <template #header>
          标题包
          <template v-if="tableData.ft_group_by === 'titles'">
            （<span class="primary-text">按标题包分组</span>）
          </template>
        </template>
        <template #default="{ row: { campaignIndex, unitIndex, customIndex } }">
          <div class="creative-preview">
            <span v-auto-tooltip class="editor-name">{{
              tableData.campaign_list[campaignIndex].adset_list[unitIndex]
                .ad_list[customIndex].ft_titles.groupName
            }}</span>
            <el-popover
              placement="top-end"
              :title="
                tableData.campaign_list[campaignIndex].adset_list[unitIndex]
                  .ad_list[customIndex].ft_titles.groupName
              "
              :width="300"
              trigger="hover"
              popper-class="n-gg-ads-detail-popper">
              <template #default>
                <el-scrollbar max-height="200px">
                  <div class="detail-list">
                    <div
                      v-for="item of tableData.campaign_list[campaignIndex]
                        .adset_list[unitIndex].ad_list[customIndex].ft_titles
                        .list"
                      :key="item.copy_writing_id"
                      class="detail-item">
                      {{ item.copy_writing }}
                    </div>
                  </div>
                </el-scrollbar>
              </template>
              <template #reference>
                <el-button type="text">查看</el-button>
              </template>
            </el-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="内容描述" min-width="210" prop="descriptions">
        <template #header>
          内容描述
          <template v-if="tableData.ft_group_by === 'descriptions'">
            （<span class="primary-text">按内容描述分组</span>）
          </template>
        </template>
        <template #default="{ row: { campaignIndex, unitIndex, customIndex } }">
          <div class="creative-preview">
            <span v-auto-tooltip class="editor-name">{{
              tableData.campaign_list[campaignIndex].adset_list[unitIndex]
                .ad_list[customIndex].ft_descriptions.groupName
            }}</span>
            <el-popover
              placement="top-end"
              :title="
                tableData.campaign_list[campaignIndex].adset_list[unitIndex]
                  .ad_list[customIndex].ft_descriptions.groupName
              "
              :width="300"
              trigger="hover"
              popper-class="n-gg-ads-detail-popper">
              <template #default>
                <el-scrollbar max-height="200px">
                  <div class="detail-list">
                    <div
                      v-for="item of tableData.campaign_list[campaignIndex]
                        .adset_list[unitIndex].ad_list[customIndex]
                        .ft_descriptions.list"
                      :key="item.copy_writing_id"
                      class="detail-item">
                      {{ item.copy_writing }}
                    </div>
                  </div>
                </el-scrollbar>
              </template>
              <template #reference>
                <el-button type="text">查看</el-button>
              </template>
            </el-popover>
          </div>
        </template>
      </el-table-column>
    </el-table-column>
  </el-table>
  <!-- 创意素材预览 -->
  <PreviewMaterial ref="previewMaterialRef" />
</template>

<script setup>
import { computed, ref } from 'vue'
// 创意素材预览组件
import PreviewMaterial from './PreviewMaterial.vue'
import { debounce } from 'lodash-es'
const props = defineProps({
  rowDataLists: {
    type: Array,
    default: [],
  },
  data: {
    type: Object,
    default: {},
  },
})
const emit = defineEmits(['rowMerge', 'batchCancelHandler', 'delTask'])

const previewMaterialRef = ref(null)
const tableData = computed(() => props.data)
const tableRowLists = computed(() => props.rowDataLists)
const mergeHanlder = ({ row, column, rowIndex, columnIndex }) => {
  return tableRowLists.value[rowIndex][columnIndex] || [1, 1]
}
const showMaterial = (campaignIndex, unitIndex, customIndex) => {
  let data =
    tableData.value.campaign_list[campaignIndex].adset_list[unitIndex].ad_list[
      customIndex
    ].ft_materials
  previewMaterialRef.value.open([...data.images, ...data.videos])
}
const parentChange = (bool, campaignIndex, unitIndex, customIndex) => {
  let data = tableData.value.campaign_list[campaignIndex].adset_list
  data.forEach((item) => {
    item.ad_list.forEach((ad) => {
      if (!ad.disabled) ad.checked = bool
    })
  })
  let checked = data.reduce((p, c) => {
    p += c.ad_list.filter((item) => item.checked).length
    return p
  }, 0)
  let total = data.reduce((p, c) => {
    p += c.ad_list.length
    return p
  }, 0)
  //半选状态
  tableData.value.campaign_list[campaignIndex].indeterminate =
    !!checked && checked < total
}
const childrenChange = (campaignIndex, unitIndex, customIndex) => {
  let data = tableData.value.campaign_list[campaignIndex].adset_list
  let checked = data.reduce((p, c) => {
    p += c.ad_list.filter((item) => item.checked).length
    return p
  }, 0)
  let disabled = data.reduce((p, c) => {
    p += c.ad_list.filter((item) => !item.disabled).length
    return p
  }, 0)
  let total = data.reduce((p, c) => {
    p += c.ad_list.length
    return p
  }, 0)
  //半选状态
  tableData.value.campaign_list[campaignIndex].indeterminate =
    !!checked && checked < total
  tableData.value.campaign_list[campaignIndex].checked = checked === disabled
  // tableData.value.campaign_list[campaignIndex].checked = tableData.value.campaign_list[campaignIndex].adset_list.every(item => item.checked)
}
const cancelTimer = (campaignIndex, unitIndex, customIndex) => {
  let campaign_list = tableData.value.campaign_list[campaignIndex]
  let adsetList = campaign_list.adset_list[unitIndex]
  let adList = campaign_list.adset_list[unitIndex].ad_list[customIndex]
  let params = [
    {
      adset_index: adsetList.adset_index,
      campaign_index: campaign_list.campaign_index,
      ad_index: adList.ad_index,
    },
  ]
  emit('batchCancelHandler', false, params)
}
const delTask = async (campaignIndex, unitIndex, customIndex) => {
  let campaign_list = tableData.value.campaign_list[campaignIndex]
  let adsetList = campaign_list.adset_list[unitIndex]
  let adList = campaign_list.adset_list[unitIndex].ad_list[customIndex]
  let params = {
    adset_index: adsetList.adset_index,
    campaign_index: campaign_list.campaign_index,
    ad_index: adList.ad_index,
  }
  emit('delTask', params)
}

defineOptions({
  name: 'DetailsTable',
})
</script>
<style lang="scss">
.n-gg-ads-detail-popper {
  &.#{$customNameSpace}-popover.#{$customNameSpace}-popper {
    padding: 0 0 10px 0;
  }

  .#{$customNameSpace}-popover__title {
    margin-bottom: 0;
    padding: 10px;
  }

  .detail-list {
    padding: 0 10px;

    > .detail-item {
      line-height: 1.2;
      color: $color-616161;

      & + .detail-item {
        margin-top: 0.5em;
      }
    }
  }
}
</style>
<style scoped lang="scss">
.creative-preview {
  display: flex;
  justify-content: space-between;
  align-items: center;

  > span:first-child {
    display: -webkit-box;
    overflow: hidden;
    margin-right: 1em;
    line-height: 1.3;
    word-break: break-all;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    white-space: break-spaces;
  }
}

.editor-name {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
  display: -webkit-box;
  overflow: hidden;
  margin-right: 1em;
  line-height: 1.3;
  word-break: break-all;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  white-space: break-spaces;
}
</style>
