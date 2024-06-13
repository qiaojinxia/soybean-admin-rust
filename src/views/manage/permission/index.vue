<script setup lang="tsx">
import { ref } from 'vue';
import type { Ref } from 'vue';
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { useBoolean } from '@sa/hooks';
import { deletePermission, fetchGetMenuTree, fetchGetPermissionList } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { $t } from '@/locales';

import type { OperateType } from '@/views/manage/permission/modules/permission-operate-drawer.vue';
import PermissionOperateDrawer from '@/views/manage/permission/modules/permission-operate-drawer.vue';

const appStore = useAppStore();

const wrapperRef = ref<HTMLElement | null>(null);

const { bool: drawerVisible, setTrue: openDrawer, setFalse: _closeDrawer } = useBoolean();

const { columns, columnChecks, data, loading, pagination, getData } = useTable({
  apiFn: fetchGetPermissionList,
  columns: () => [
    {
      type: 'selection',
      align: 'center',
      width: 30
    },
    {
      key: 'id',
      title: $t('page.manage.permission.id'),
      align: 'center',
      width: 50
    },
    {
      key: 'permissionName',
      title: $t('page.manage.permission.permissionName'),
      align: 'center',
      width: 150
    },
    {
      key: 'permissionCode',
      title: $t('page.manage.permission.permissionCode'),
      align: 'center',
      width: 150
    },
    {
      key: 'description',
      title: $t('page.manage.permission.description'),
      align: 'center',
      minWidth: 200 // Using minWidth to accommodate content length
    },
    {
      key: 'actionCodes',
      title: $t('page.manage.permission.actionCodes'),
      align: 'center',
      width: 250,
      render: row => {
        return row.actionCodes.map(actionCode => {
          switch (actionCode) {
            case '1':
              return (
                <NTag style={{ marginRight: '8px' }} type="success">
                  {$t('page.manage.permission.type.create')}
                </NTag>
              );
            case '2':
              return (
                <NTag style={{ marginRight: '8px' }} type="info">
                  {$t('page.manage.permission.type.read')}
                </NTag>
              );
            case '3':
              return (
                <NTag style={{ marginRight: '8px' }} type="warning">
                  {$t('page.manage.permission.type.update')}
                </NTag>
              );
            case '4':
              return (
                <NTag style={{ marginRight: '8px' }} type="error">
                  {$t('page.manage.permission.type.delete')}
                </NTag>
              );
            default:
              return null;
          }
        });
      }
    },
    {
      key: 'status',
      title: $t('page.manage.permission.permissionStatus'),
      align: 'center',
      width: 100,
      render: row => {
        switch (row.status) {
          case '1':
            return <NTag type="success">{$t('page.manage.common.status.enable')}</NTag>;
          case '2':
            return <NTag type="warning">{$t('page.manage.common.status.disable')}</NTag>;
          default:
            return <NTag type="default">{$t('page.manage.common.status.unknown')}</NTag>;
        }
      }
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 200,
      fixed: 'right',
      render: row => {
        return (
          <div class="flex-center">
            <NButton type="primary" ghost size="small" onClick={() => handleEdit(row)}>
              {$t('common.edit')}
            </NButton>
            <NPopconfirm onPositiveClick={() => handleDelete(row.id)}>
              {{
                default: () => $t('common.confirmDelete'),
                trigger: () => (
                  <NButton type="error" ghost size="small" style="margin-left: 8px;">
                    {$t('common.delete')}
                  </NButton>
                )
              }}
            </NPopconfirm>
          </div>
        );
      }
    }
  ]
});

const { checkedRowKeys, onBatchDeleted, onDeleted } = useTableOperate(data, getData);

const operateType = ref<OperateType>('add');

const allMenus = ref<Api.SystemManage.MenuTree | null>({
  id: 0,
  label: '',
  pId: 0,
  children: []
});

async function getAllPages() {
  const { data: pages } = await fetchGetMenuTree();
  allMenus.value = pages;
}

function handleAdd() {
  operateType.value = 'add';
  openDrawer();
}

function handleDelete(id: number) {
  // Delete logic here...
  deletePermission(id);
  onDeleted();
}
async function handleBatchDelete() {
  // request
  await onBatchDeleted();
}

const editingData: Ref<Api.SystemManage.Permission | null> = ref(null);

function handleEdit(item: Api.SystemManage.Permission) {
  operateType.value = 'edit';
  editingData.value = { ...item };
  openDrawer();
}

function init() {
  getAllPages();
}

// Init call
init();
</script>

<template>
  <div ref="wrapperRef" class="flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard
      :title="$t('page.manage.permission.title')"
      :bordered="false"
      size="small"
      class="sm:flex-1-hidden card-wrapper"
    >
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          @add="handleAdd"
          @delete="handleBatchDelete"
          @refresh="getData"
        />
      </template>
      <NDataTable
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="1088"
        :loading="loading"
        :row-key="row => row.id"
        remote
        :pagination="pagination"
        class="sm:h-full"
      />
      <PermissionOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        :all-menus="allMenus"
        @submitted="getData"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
