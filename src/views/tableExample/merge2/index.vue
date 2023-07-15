<template>
  <section v-loading="loading" class="section-task-details">
    <div>
      <header class="section-task-header">
        <div class="task-form-item">
          <el-button @click="submitDataHandler" type="primary"
            >立即提交审核
          </el-button>
        </div>
        <div class="task-form-item">
          <el-button @click="batchCancelHandler(true)" type="primary"
            >批量取消定时
          </el-button>
        </div>
        <div class="task-form-item">
          <el-button @click="updAuditStatusHandler" type="primary"
            >查看审核状态
          </el-button>
        </div>
        <!--      <div class="task-form-item">-->
        <!--        <el-checkbox>勾选所有媒体账号的全部广告计划</el-checkbox>-->
        <!--      </div>-->
        <!--      <div class="task-form-item">所有账号广告组数量：<span class="primary-text">10</span></div>-->
        <!--      <div class="task-form-item">定时任务数：<span class="primary-text">100</span></div>-->
        <!--      <div class="task-form-item">提交成功：<span class="success-text">30</span></div>-->
      </header>
      <div class="table-count">
        <div class="task-detail-header">
          <div class="task-form-item">
            <el-checkbox
              :indeterminate="tableData.indeterminate"
              v-model="tableData.checkAll"
              :disabled="tableData.disabled"
              >勾选此账户的全部广告组
            </el-checkbox>
            (已勾选{{ tableData.selectGroupCount }}个广告)
          </div>
          <div class="task-form-item">{{ tableData.advertiser_alias }}</div>
          <div class="task-form-item">
            广告系列：<span class="primary-text">{{
              tableData.planCount
            }}</span>
          </div>
          <div class="task-form-item">
            广告组：<span class="primary-text">
              {{ tableData.groupCount }}
            </span>
            <span>
              ( 待提交：<i class="primary-text">{{ tableData.pendingCount }}</i>
              &nbsp; 定时任务：<i class="primary-text">{{
                tableData.timedCount
              }}</i
              >&nbsp;
              <!--              已提交数量：<i class="primary-text">{{ 4 }}</i>&nbsp;-->
              提交成功：<i class="primary-text">{{ tableData.successCount }}</i
              >&nbsp; 提交失败：<i class="primary-text">{{
                tableData.failedCount
              }}</i>
              )
            </span>
          </div>
        </div>
        <DetailsTable
          :rowDataLists="tableRowLists"
          :data="tableData"
          @batchCancelHandler="batchCancelHandler"
          @delTask="delTask" />
      </div>
    </div>
  </section>
</template>

<script>
import { defineComponent, reactive, toRefs, computed, watch } from 'vue'

import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { debounce, cloneDeep } from 'lodash-es'
import DetailsTable from './DetailsTable.vue'

import { isString, isBoolean } from '@/utils/validate'
import { data } from './data.json'

export default defineComponent({
  name: 'AdTaskDetails',
  components: {
    DetailsTable,
  },
  /* beforeRouteEnter(to, from, next) {
     !to.query.id ? next({name: 'PlatformKuaishouAdvertising'}) : next();
   },*/
  setup() {
    const task_id = 133
    const initVal = () => {
      return {
        // 半选状态
        indeterminate: computed(() => {
          const checkedList = state.tableData.campaign_list.filter(
            (item) => item.checked || item.indeterminate,
          )
          // let mark = !state.tableData.campaign_list.every(parent => parent.adset_list.every(unit => unit.checked))
          let mark = !state.tableData.campaign_list.every((parent) =>
            parent.adset_list.every((adset) => {
              return adset.ad_list.every((ad) => ad.checked)
            }),
          )
          return !!checkedList.length && mark
        }),
        campaign_list: [],
        checkAll: computed({
          get() {
            const checkedList = state.tableData.campaign_list.filter(
              (item) => item.checked,
            )
            // return !!checkedList.length && checkedList.length === state.tableData.campaign_list.length
            return checkedList.length === state.tableData.campaign_list.length
          },
          set(v) {
            state.tableData.campaign_list.forEach((parent) => {
              if (!parent.disabled) {
                parent.adset_list.forEach((adset) => {
                  adset.ad_list.forEach((ad) => {
                    if (!ad.disabled) ad.checked = v
                  })
                })
                let checked = parent.adset_list.filter((item) => {
                  return item.ad_list.some((ad) => ad.checked)
                }).length
                let disabled = parent.adset_list.filter((item) => {
                  return item.ad_list.some((ad) => !ad.disabled)
                }).length
                let mark = !parent.adset_list.every((item) => {
                  return item.ad_list.every((ad) => ad.checked)
                })
                parent.checked = checked === disabled
                //半选状态
                parent.indeterminate = v ? mark : false
              }
            })
          },
        }),
        // 广告计划数量
        planCount: 0,
        // 定时任务数量
        timedCount: 0,
        // 成功数量
        successCount: 0,
        // 失败数量
        failedCount: 0,
        // 待提交数量
        pendingCount: 0,
        // 广告组数量
        groupCount: 0,
        // 已勾选广告组数量
        selectGroupCount: computed(() => {
          return state.tableData.campaign_list.reduce((p, c) => {
            c.adset_list.forEach((item) => {
              item.ad_list.forEach((ad) => {
                p += +ad.checked
              })
            })
            return p
          }, 0)
        }),
        disabled: computed(
          () =>
            state.tableData.campaign_list.filter((item) => item.disabled)
              .length === state.tableData.campaign_list.length,
        ),
      }
    }
    const state = reactive({
      loading: false,
      tableData: initVal(),
      tableRowLists: [],
      customTableRef: null,
    })
    let elMsg = null
    let isSlowReq = true
    // 规则分配
    const ruleMap = new Map([
      ['materials', '6'],
      ['titles', '7'],
      ['descriptions', '8'],
      // 目前没有
      ['targets', '9'],
      ['landings', '10'],
    ])
    const setTaskId = async () => {
      // 广告计划数量
      state.tableData = initVal()
      data.campaign_list = data.campaign_list.filter((item) => {
        item.adset_list = item.adset_list.filter(
          (adset) => adset.ad_list.length,
        )
        return item.adset_list.length
      })
      state.tableData.planCount = data.campaign_list.length
      data.campaign_list.forEach((parent) => {
        let disabledLen = 0
        let adLen = 0
        parent.checked = false
        parent.indeterminate = false
        parent.adset_list.forEach((adset) => {
          state.tableData.groupCount++
          adset.ad_list.forEach((ad) => {
            ad.disabled = false
            ad.checked = false
            if (ad.submit_status === '定时提交') {
              state.tableData.timedCount++
            } else if (ad.submit_status === '成功') {
              state.tableData.successCount++
              ad.disabled = true
            } else if (ad.submit_status === '失败') {
              state.tableData.failedCount++
              ad.disabled = true
            } else if (ad.submit_status === '待提交') {
              state.tableData.pendingCount++
            }
          })
          disabledLen += adset.ad_list.filter((item) => item.disabled).length
          adLen += adset.ad_list.length
        })
        // 禁用的长度和总数据长度
        parent.disabled = adLen === disabledLen
      })
      Object.assign(state.tableData, data)
      state.tableRowLists = state.tableData.campaign_list.reduce(
        (arr, item, aIndex) => {
          item.adset_list.forEach((adset, gIndex) => {
            adset.ad_list.forEach((custom, index) => {
              const span_obj = {
                // campaignList 对应下标
                campaignIndex: aIndex,
                // campaignList下的adset_list 对应下标
                unitIndex: gIndex,
                // campaignList下的adset_list的ad_list对应下标
                customIndex: index,
              }
              // [1,2] = 合并1行 ,合并2列 0=不显示
              // console.log(index, gIndex,adset.ad_list.length)
              if (index === 0 && gIndex === 0) {
                // 统计当前adset_list下的ad_list的总数量
                let len = item.adset_list.reduce((p, c) => {
                  p += c.ad_list.length
                  return p
                }, 0)
                // 按照广告组里所有广告列表数量合并
                span_obj['0'] = [len, 1]
                span_obj['1'] = [len, 1]
                // 按照广告列表 数量合并(adset.ad_list.length)
                span_obj['5'] = [adset.ad_list.length, 1]
                span_obj[ruleMap.get(state.tableData.ft_group_by)] = [
                  adset.ad_list.length,
                  1,
                ]
              } else {
                span_obj['0'] = [0, 0]
                span_obj['1'] = [0, 0]
                // index = 0 代表新的一组
                span_obj['5'] = index === 0 ? [adset.ad_list.length, 1] : [0, 0]
                span_obj[ruleMap.get(state.tableData.ft_group_by)] =
                  index === 0 ? [adset.ad_list.length, 1] : [0, 0]
              }
              arr.push(span_obj)
            })
          })
          return arr
        },
        [],
      )
      console.log(state.tableRowLists)
    }
    setTaskId()
    // 要渲染多少个 tr
    const submitDataHandler = debounce(async () => {
      if (!state.tableData.indeterminate && !state.tableData.checkAll) {
        elMsg = ElMessage.warning(`请选择广告组`)
        return
      }
      let tmpData = cloneDeep(state.tableData)
      Object.keys(tmpData).forEach((k) => {
        if (
          ![
            'campaign_list',
            'batch_id',
            'advertiser_id',
            'task_submit_time',
          ].includes(k)
        ) {
          Reflect.deleteProperty(tmpData, k)
        }
      })
      tmpData.campaign_list.forEach((campaign) => {
        Object.keys(campaign).forEach((k) => {
          // 移除空值和布尔值 属性
          if (
            (isString(campaign[k]) && !campaign[k].trim().length) ||
            isBoolean(campaign[k]) ||
            k.startsWith('ft_')
          ) {
            Reflect.deleteProperty(campaign, k)
          }
        })
        campaign.adset_list.forEach((adset) => {
          Object.keys(adset).forEach((k) => {
            if (
              (isString(adset[k]) && !adset[k].trim().length) ||
              isBoolean(adset[k]) ||
              k.startsWith('ft_')
            ) {
              Reflect.deleteProperty(adset, k)
            }
          })
          adset.ad_list = adset.ad_list.filter((ad) => ad.checked)
          adset.ad_list.forEach((ad) => {
            Object.keys(ad).forEach((k) => {
              if (
                (isString(ad[k]) && !ad[k].trim().length) ||
                isBoolean(ad[k]) ||
                k.startsWith('ft_')
              ) {
                Reflect.deleteProperty(ad, k)
              }
            })
          })
        })
        campaign.adset_list = campaign.adset_list.filter(
          (item) => item.ad_list.length,
        )
      })
      tmpData.campaign_list = tmpData.campaign_list.filter(
        (item) => item.adset_list.length,
      )
      console.log([tmpData], '提交')
      updAuditStatusHandler()
    }, 300)

    const batchCancelHandler = debounce(async (mark, index_list) => {
      let params = index_list
      if (mark) {
        params = state.tableData.campaign_list.reduce((p, c) => {
          c.adset_list.forEach((item) => {
            item.ad_list.forEach((ad) => {
              if (ad.checked && ad.submit_status === '定时提交') {
                p.push({
                  adset_index: item.adset_index,
                  campaign_index: c.campaign_index,
                  ad_index: ad.ad_index,
                })
              }
            })
          })
          return p
        }, [])
        if (!params.length) {
          ElMessage.warning('请选择定时任务')
          return
        }
      }
      if (Date.now() >= new Date(state.tableData.task_submit_time).getTime()) {
        ElMessage.warning('已过定时时间，不能取消')
        return
      }
      try {
        await ElMessageBox.confirm(
          `该操作不可恢复，确定${
            params.length === 1 ? '取消该' : '批量取消'
          }定时任务吗？`,
          '警告',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          },
        )
        console.log(
          {
            index_list: params,
            task_id,
          },
          '取消',
        )

        updAuditStatusHandler()
      } catch (e) {
        console.log(e)
      }
    }, 300)

    const updAuditStatusHandler = debounce(() => {
      setTaskId()
    }, 300)
    // 删除任务
    const delTask = debounce(async (params) => {
      try {
        await ElMessageBox.confirm(`该操作不可恢复，确定删除吗？`, '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        console.log(
          {
            ...params,
            task_id,
          },
          '删除',
        )
        updAuditStatusHandler()
      } catch (e) {
        console.log(e)
      }
    }, 300)

    return {
      ...toRefs(state),
      delTask,
      submitDataHandler,
      batchCancelHandler,
      updAuditStatusHandler,
    }
  },
})
</script>

<style lang="scss" scoped>
:deep(.#{$customNameSpace}-table--border th:first-child .cell) {
  padding-left: 10px;
}

:deep(
    .#{$customNameSpace}-table--border td,
    .#{$customNameSpace}-table--border th
  ) {
  border-right: 1px solid #dedede !important;
  border-bottom: 1px solid #dedede !important;
}

:deep(.#{$customNameSpace}-table) {
  display: flex;
  flex-direction: column;
  flex: 1;

  .#{$customNameSpace}-table--border td:first-child .cell,
  .#{$customNameSpace}-table__body tr td:first-child .cell {
    padding-left: 10px;
  }

  td:not(:last-of-type) {
    border-right: 1px solid #f2f2f2;
  }

  .#{$customNameSpace}-table__body-wrapper {
    flex: 1;
    overflow-y: overlay;
  }

  thead.is-group {
    th {
      background: #fff;
    }
  }
}

.section-task-details {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 100%;
  height: 100%;
  @include pageSection();
  font-size: 14px;

  .section-task-header {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    padding-top: 20px;
    padding-bottom: 20px;
    color: $color-616161;

    > .task-form-item {
      & + .task-form-item {
        margin-left: 20px;
      }

      :deep(.#{$customNameSpace}-checkbox__label) {
        color: $color-616161;
      }
    }
  }

  .table-count {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid #dedede;
  }

  .task-detail-header {
    flex-shrink: 0;
    display: flex;
    padding: 15px 20px;
    color: $color-616161;

    > .task-form-item {
      & + .task-form-item {
        margin-left: 20px;
      }

      :deep(.#{$customNameSpace}-checkbox__label) {
        color: $color-616161;
      }
    }
  }

  > div {
    display: flex;
    flex-direction: column;
    flex: 1;
    border-bottom: none;
    overflow: hidden;
  }
}

.campaign-name {
  & + .campaign-name {
    margin-top: 1em;
  }

  .strong-text {
    margin-bottom: 0.25em;
  }
}
</style>

<style lang="scss">
.creative_detail {
  width: auto !important;

  .creative_detail_content {
    max-height: 360px;
    overflow: auto;

    .creative_detail_content_item {
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 0;
      }

      .creative_detail_content_item_title {
        margin-bottom: 10px;
        font-weight: 700;
      }
    }
  }

  .creative_detail_content_material {
    .creative_detail_content_material_item {
      display: inline-block;
      margin-right: 15px;

      &:last-child {
        margin-right: 0;
      }

      .material {
        width: 200px;
        height: 112px;
        text-align: center;
        background: #dedede;
        margin-top: 10px;
        cursor: pointer;

        img,
        video {
          max-width: 100%;
          max-height: 100%;
        }
      }

      .sticker_styles {
        width: 102px;
        height: 112px;
      }
    }
  }

  .creative_detail_content {
    .creative_detail_slogan_item {
      margin-top: 10px;
    }
  }
}

.layout-header[name='PlatformGoogleAdvertisingTaskDetails'] {
  > .layout-header-menu {
    display: none;
  }
}
</style>
