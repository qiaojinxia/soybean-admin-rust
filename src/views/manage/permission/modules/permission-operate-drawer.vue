<script setup lang="tsx">
import { computed, reactive, watch } from 'vue';
import type { TreeSelectOption } from 'naive-ui';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { enableStatusOptions, perMissionTypeOptions } from '@/constants/business';
import { createPermission, updatePermission } from '@/service/api';
import { translateOptions } from '@/utils/common';
import ButtonAuthModal from '@/views/manage/permission/modules/button-auth-modal.vue';
import MenuAuthModal from '@/views/manage/permission/modules/menu-auth-modal.vue';
import { useBoolean } from '~/packages/hooks';

defineOptions({
  name: 'PermissionOperateDrawer'
});

export type OperateType = NaiveUI.TableOperateType;

interface Props {
  /** the type of operation */
  operateType: OperateType;
  /** the edit permission data */
  rowData?: Api.SystemManage.Permission | null;
  /** all menus */
  allMenus: Api.SystemManage.MenuTree | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const { formRef, validate, restoreValidation } = useNaiveForm();
const { defaultRequiredRule } = useFormRules();
const { bool: menuAuthVisible, setTrue: openMenuAuthModal } = useBoolean();
const { bool: buttonAuthVisible, setTrue: openButtonAuthModal } = useBoolean();

const title = computed(() => {
  const titles: Record<OperateType, string> = {
    add: $t('page.manage.permission.addPermission'),
    edit: $t('page.manage.permission.editPermission')
  };
  return titles[props.operateType];
});

type Model = Pick<
  Api.SystemManage.Permission,
  'id' | 'permissionCode' | 'permissionName' | 'description' | 'actionCodes' | 'menus' | 'status'
>;

const model: Model = reactive(createDefaultModel());
const originalModel: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    id: 0,
    permissionCode: '',
    permissionName: '',
    description: '',
    actionCodes: [],
    menus: [],
    status: '1'
  };
}

type RuleKey = Extract<keyof Model, 'permissionName' | 'permissionCode' | 'description'>;

const roleId = computed(() => props.rowData?.id || -1);

const isEdit = computed(() => props.operateType === 'edit');

const rules: Record<RuleKey, App.Global.FormRule> = {
  permissionName: defaultRequiredRule,
  description: defaultRequiredRule,
  permissionCode: defaultRequiredRule
};

// Assuming props and Api.SystemManage.MenuTree are defined elsewhere
const menuOptions = computed<TreeSelectOption[]>(() => {
  // Transform a single MenuTree object into TreeSelectOption format
  const transformMenuTree = (menu: Api.SystemManage.MenuTree): TreeSelectOption => {
    const transformed: TreeSelectOption = {
      key: `${menu.id}`,
      label: menu.label,
      disabled: false, // Assuming you have a 'disabled' field
      isLeaf: !(menu.children && menu.children.length > 0)
    };
    if (menu.children && menu.children.length > 0) {
      transformed.children = menu.children.map(child => transformMenuTree(child));
    }
    return transformed;
  };

  // Check if 'props.allMenus' is not null and is an object
  if (!props.allMenus || typeof props.allMenus !== 'object') {
    return [];
  }

  // Since 'props.allMenus' is a single object, wrap the result in an array
  return transformMenuTree(props.allMenus).children || [];
});

function handleUpdateModel() {
  if (props.operateType === 'add') {
    Object.assign(model, createDefaultModel());
    Object.assign(originalModel, createDefaultModel());
    return;
  }
  if (props.operateType === 'edit' && props.rowData) {
    const { ...rest } = props.rowData;
    Object.assign(model, rest);
    Object.assign(originalModel, rest);
  }
}

function closeDrawer() {
  visible.value = false;
}

// Utility function to get changed fields
function getChangedFields(original: Model, updated: Model): Partial<Model> {
  const changes: Partial<Model> = {};
  for (const key in original) {
    if (original[key as keyof Model] !== updated[key as keyof Model]) {
      (changes as any)[key] = updated[key as keyof Model];
    }
  }
  return changes;
}

async function handleSubmit() {
  await validate();
  const changedFields = getChangedFields(originalModel, model);
  if (props.operateType === 'add') {
    model.menus = Array.from(new Set(model.menus.map(menuId => Number(menuId))));
    await createPermission(model).then(_resp => {
      window.$message?.success($t('common.addSuccess'));
      closeDrawer();
      emit('submitted');
    });
  } else if (props.operateType === 'edit' && props.rowData) {
    const { id } = props.rowData as Api.SystemManage.Permission;
    if (id && Object.keys(changedFields).length > 0) {
      changedFields.menus = Array.from(new Set(model.menus.map(menuId => Number(menuId))));
      await updatePermission(id, changedFields).then(_resp => {
        window.$message?.success($t('common.updateSuccess'));
        closeDrawer();
        emit('submitted');
      });
    }
  }
}

watch(visible, () => {
  if (visible.value) {
    handleUpdateModel();
    restoreValidation();
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" :title="title" display-directive="show" :width="360">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NForm ref="formRef" :model="model" :rules="rules" label-placement="top">
        <NFormItem :label="$t('page.manage.permission.permissionName')" path="permissionName">
          <NInput
            v-model:value="model.permissionName"
            :placeholder="$t('page.manage.permission.form.inputPermissionName')"
          />
        </NFormItem>
        <NFormItem :label="$t('page.manage.permission.permissionCode')" path="permissionCode">
          <NInput
            v-model:value="model.permissionCode"
            :placeholder="$t('page.manage.permission.form.inputPermissionCode')"
          />
        </NFormItem>
        <NFormItem :label="$t('page.manage.permission.description')" path="description">
          <NInput
            v-model:value="model.description"
            :placeholder="$t('page.manage.permission.form.inputPermissionDesc')"
          />
        </NFormItem>
        <NFormItem :label="$t('page.manage.permission.actionCodes')" path="actions">
          <NSelect v-model:value="model.actionCodes" multiple :options="translateOptions(perMissionTypeOptions)" />
        </NFormItem>
        <NFormItem :label="$t('page.manage.permission.menus')" path="menus">
          <NTreeSelect v-model:value="model.menus" multiple cascade checkable :options="menuOptions" />
        </NFormItem>
        <NFormItem :label="$t('page.manage.permission.permissionStatus')" path="status">
          <NRadioGroup v-model:value="model.status">
            <NRadio v-for="item in enableStatusOptions" :key="item.value" :value="item.value" :label="$t(item.label)" />
          </NRadioGroup>
        </NFormItem>
        <NSpace v-if="isEdit">
          <NButton @click="openMenuAuthModal">{{ $t('page.manage.role.menuAuth') }}</NButton>
          <MenuAuthModal v-model:visible="menuAuthVisible" :role-id="roleId" />
          <NButton @click="openButtonAuthModal">{{ $t('page.manage.role.buttonAuth') }}</NButton>
          <ButtonAuthModal v-model:visible="buttonAuthVisible" :role-id="roleId" />
        </NSpace>
      </NForm>
      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
          <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>
