<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { enableStatusOptions } from '@/constants/business';
import { createRoles, updateRole } from '@/service/api';
import SimplePermission = Api.SystemManage.SimplePermission;

defineOptions({
  name: 'RoleOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.SystemManage.Role | null;
  permissionList: SimplePermission[] | null;
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

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: $t('page.manage.role.addRole'),
    edit: $t('page.manage.role.editRole')
  };
  return titles[props.operateType];
});

type Model = Pick<Api.SystemManage.Role, 'id' | 'roleName' | 'roleCode' | 'roleDesc' | 'permissionIds' | 'status'>;

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    id: 0,
    roleName: '',
    roleCode: '',
    roleDesc: '',
    permissionIds: [],
    status: null
  };
}

type RuleKey = Exclude<keyof Model, 'id' | 'roleDesc' | 'permissionIds'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  roleName: defaultRequiredRule,
  roleCode: defaultRequiredRule,
  status: defaultRequiredRule
};

const permissionOptions = computed(() => {
  return (
    props.permissionList?.map(permission => ({
      label: permission.permissionName,
      value: permission.id,
      key: permission.id
    })) || []
  );
});

function handleInitModel() {
  Object.assign(model, createDefaultModel());

  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model, props.rowData);
  }
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();
  if (props.operateType === 'add') {
    await createRoles(model).then(_resp => {
      window.$message?.success($t('common.addSuccess'));
    });
  } else if (props.operateType === 'edit' && props.rowData) {
    const { id, ...rest } = model;
    await updateRole(id, rest).then(_resp => {
      window.$message?.success($t('common.updateSuccess'));
    });
  }

  closeDrawer();
  emit('submitted');
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="360">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NForm ref="formRef" :model="model" :rules="rules">
        <NFormItem :label="$t('page.manage.role.roleName')" path="roleName">
          <NInput v-model:value="model.roleName" :placeholder="$t('page.manage.role.form.roleName')" />
        </NFormItem>
        <NFormItem :label="$t('page.manage.role.roleCode')" path="roleCode">
          <NInput v-model:value="model.roleCode" :placeholder="$t('page.manage.role.form.roleCode')" />
        </NFormItem>
        <NFormItem :label="$t('page.manage.role.roleStatus')" path="status">
          <NRadioGroup v-model:value="model.status">
            <NRadio v-for="item in enableStatusOptions" :key="item.value" :value="item.value" :label="$t(item.label)" />
          </NRadioGroup>
        </NFormItem>
        <NFormItem :label="$t('page.manage.role.roleDesc')" path="roleDesc">
          <NInput v-model:value="model.roleDesc" :placeholder="$t('page.manage.role.form.roleDesc')" />
        </NFormItem>
        <NFormItem :label="$t('page.manage.role.permissions')" path="permissionIds">
          <NTreeSelect
            v-model:value="model.permissionIds"
            :options="permissionOptions"
            :placeholder="$t('page.manage.role.form.selectPermissions')"
            multiple
            :show-path="true"
          />
        </NFormItem>
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
