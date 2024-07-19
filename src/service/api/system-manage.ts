import { request } from '../request';

/** get role list */
export function fetchGetRoleList(params?: Api.SystemManage.RoleSearchParams) {
  return request<Api.SystemManage.RoleList>({
    url: '/system-manage/roles',
    method: 'get',
    params
  });
}

/**
 * get all roles
 *
 * these roles are all enabled
 */
export function fetchGetAllRoles() {
  return request<Api.SystemManage.AllRole[]>({
    url: '/system-manage/roles-options',
    method: 'get'
  });
}

/** get user list */
export function fetchGetUserList(params?: Api.SystemManage.UserSearchParams) {
  return request<Api.SystemManage.UserList>({
    url: '/system-manage/users',
    method: 'get',
    params
  });
}

/**
 * get menu list
 *
 * @deprecated this will removed in next version 1.1.0
 */
export function fetchGetMenuListV1() {
  return request<Api.SystemManage.Menu[]>({
    url: '/system-manage/menus',
    method: 'get'
  });
}

/** get menu list */
export function fetchGetMenuList() {
  return request<Api.SystemManage.MenuList>({
    url: '/system-manage/menus',
    method: 'get'
  });
}

/** get all pages */
export function fetchGetAllPages() {
  return request<string[]>({
    url: '/system-manage/getAllPages',
    method: 'get'
  });
}

/** get menu tree */
export function fetchGetMenuTree() {
  return request<Api.SystemManage.MenuTree>({
    url: '/system-manage/menus/tree',
    method: 'get'
  });
}

/** create menu list */
export function createMenu(data: any) {
  return request<Api.SystemManage.Menu>({
    url: '/system-manage/menus',
    method: 'post',
    data
  });
}

/** delete menu list */
export function deleteMenuById(id: number) {
  return request<Api.SystemManage.Menu>({
    url: `/system-manage/menus/${id}`,
    method: 'delete'
  });
}

/** batch delete menu list */
export function deleteMenus(data: any) {
  return request<Api.SystemManage.Menu>({
    url: `/system-manage/menus`,
    method: 'delete',
    data
  });
}

export function updateMenu(id: number, data: any) {
  return request<Api.SystemManage.Menu>({
    url: `/system-manage/menus/${id}`,
    method: 'put',
    data
  });
}

/** get menu list */
export function fetchGetPermissionList() {
  return request<Api.SystemManage.PermissionList>({
    url: '/system-manage/permissions',
    method: 'get'
  });
}

export function createPermission(data: any) {
  return request<Api.SystemManage.Permission[]>({
    url: '/system-manage/permissions',
    method: 'post',
    data
  });
}

export function updatePermission(id: number, data: any) {
  return request<Api.SystemManage.Permission[]>({
    url: `/system-manage/permissions/${id}`,
    method: 'put',
    data
  });
}
export function deletePermission(id: number) {
  return request<Api.SystemManage.Permission[]>({
    url: `/system-manage/permissions/${id}`,
    method: 'delete'
  });
}

/** create role list */
export function createRoles(data: any) {
  return request<Api.SystemManage.Role>({
    url: '/system-manage/roles',
    method: 'post',
    data
  });
}

export function getSimplePermissions() {
  return request<Api.SystemManage.SimplePermission[]>({
    url: '/system-manage/permissions/simple',
    method: 'get'
  });
}

/** edit role list */
export function updateRole(id: number, data: any) {
  return request<Api.SystemManage.Role>({
    url: `/system-manage/roles/${id}`,
    method: 'put',
    data
  });
}

export function deleteRole(id: number) {
  return request<Api.SystemManage.Role>({
    url: `/system-manage/roles/${id}`,
    method: 'delete'
  });
}

export function deleteRoles(ids: number[]) {
  return request<number[]>({
    url: '/system-manage/roles',
    method: 'delete',
    data: ids // 传递数组作为请求体
  });
}

export function createUser(data: any) {
  return request<Api.SystemManage.User>({
    url: '/system-manage/users',
    method: 'post',
    data
  });
}

export function updateUser(id: number, data: any) {
  return request<Api.SystemManage.User>({
    url: `/system-manage/users/${id}`,
    method: 'put',
    data
  });
}

export function deleteUser(id: number) {
  return request<Api.SystemManage.User>({
    url: `/system-manage/users/${id}`,
    method: 'delete'
  });
}

export function batchDeleteUsers(ids: number[]) {
  return request<Api.SystemManage.User>({
    url: `/system-manage/users`,
    method: 'delete',
    data: ids
  });
}

export function fetchMenuIdsByPermissionCode(permissionCode: string) {
  return request<Api.SystemManage.PermissionMenuIds>({
    url: `/system-manage/permissions/menus/${permissionCode}`,
    method: 'get'
  });
}
