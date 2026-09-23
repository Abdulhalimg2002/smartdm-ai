#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/7f70abb297ebc12c6d7925ca55e90444fa95b44881fe39a309b4cb5c51e44eeb/contract';
import endContract from '../../snapshots/7f70abb297ebc12c6d7925ca55e90444fa95b44881fe39a309b4cb5c51e44eeb/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/98f0ef2366fad2de91c2eca3d39ff049ca7b65c0c69dc3f1d52b3f42f31dedc9/contract';
import startContract from '../../snapshots/98f0ef2366fad2de91c2eca3d39ff049ca7b65c0c69dc3f1d52b3f42f31dedc9/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-target-postgres/target/migration';;

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations(): Migration<Start, End>['operations'] {
    return [
// FINAL BASELINE FK ON DELETE
      this.dropConstraint({ schema: 'public', table: 'authEvent', constraint: 'authEvent_userId_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'authEvent', foreignKey: { name: 'authEvent_userId_fkey', columns: ['userId'], references: { schema: 'public', table: 'user', columns: ['id'] }, onDelete: 'setNull' } }),
      this.dropConstraint({ schema: 'public', table: 'authEvent', constraint: 'authEvent_authEventTypeId_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'authEvent', foreignKey: { name: 'authEvent_authEventTypeId_fkey', columns: ['authEventTypeId'], references: { schema: 'public', table: 'authEventType', columns: ['id'] }, onDelete: 'restrict' } }),
      this.dropConstraint({ schema: 'public', table: 'crmCompany', constraint: 'crmCompany_workspaceId_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'crmCompany', foreignKey: { name: 'crmCompany_workspaceId_fkey', columns: ['workspaceId'], references: { schema: 'public', table: 'workspace', columns: ['id'] }, onDelete: 'cascade' } }),
      this.dropConstraint({ schema: 'public', table: 'crmCompany', constraint: 'crmCompany_countryRegionId_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'crmCompany', foreignKey: { name: 'crmCompany_countryRegionId_fkey', columns: ['countryRegionId'], references: { schema: 'public', table: 'region', columns: ['id'] }, onDelete: 'setNull' } }),
      this.dropConstraint({ schema: 'public', table: 'crmContact', constraint: 'crmContact_workspaceId_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'crmContact', foreignKey: { name: 'crmContact_workspaceId_fkey', columns: ['workspaceId'], references: { schema: 'public', table: 'workspace', columns: ['id'] }, onDelete: 'cascade' } }),
      this.dropConstraint({ schema: 'public', table: 'crmContact', constraint: 'crmContact_companyId_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'crmContact', foreignKey: { name: 'crmContact_companyId_fkey', columns: ['companyId'], references: { schema: 'public', table: 'crmCompany', columns: ['id'] }, onDelete: 'setNull' } }),
      this.dropConstraint({ schema: 'public', table: 'crmContact', constraint: 'crmContact_sourceId_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'crmContact', foreignKey: { name: 'crmContact_sourceId_fkey', columns: ['sourceId'], references: { schema: 'public', table: 'crmContactSource', columns: ['id'] }, onDelete: 'setNull' } }),
      this.dropConstraint({ schema: 'public', table: 'crmContact', constraint: 'crmContact_statusId_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'crmContact', foreignKey: { name: 'crmContact_statusId_fkey', columns: ['statusId'], references: { schema: 'public', table: 'crmContactStatus', columns: ['id'] }, onDelete: 'setNull' } }),
      this.dropConstraint({ schema: 'public', table: 'crmContact', constraint: 'crmContact_ownerUserId_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'crmContact', foreignKey: { name: 'crmContact_ownerUserId_fkey', columns: ['ownerUserId'], references: { schema: 'public', table: 'user', columns: ['id'] }, onDelete: 'setNull' } }),
      this.dropConstraint({ schema: 'public', table: 'crmContactTag', constraint: 'crmContactTag_contactId_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'crmContactTag', foreignKey: { name: 'crmContactTag_contactId_fkey', columns: ['contactId'], references: { schema: 'public', table: 'crmContact', columns: ['id'] }, onDelete: 'cascade' } }),
      this.dropConstraint({ schema: 'public', table: 'crmContactTag', constraint: 'crmContactTag_tagId_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'crmContactTag', foreignKey: { name: 'crmContactTag_tagId_fkey', columns: ['tagId'], references: { schema: 'public', table: 'crmTag', columns: ['id'] }, onDelete: 'cascade' } }),
      this.dropConstraint({ schema: 'public', table: 'crmTag', constraint: 'crmTag_workspaceId_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'crmTag', foreignKey: { name: 'crmTag_workspaceId_fkey', columns: ['workspaceId'], references: { schema: 'public', table: 'workspace', columns: ['id'] }, onDelete: 'cascade' } }),
      this.dropConstraint({ schema: 'public', table: 'integrationChannel', constraint: 'integrationChannel_providerId_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'integrationChannel', foreignKey: { name: 'integrationChannel_providerId_fkey', columns: ['providerId'], references: { schema: 'public', table: 'integrationProvider', columns: ['id'] }, onDelete: 'restrict' } }),
      this.dropConstraint({ schema: 'public', table: 'integrationConnection', constraint: 'integrationConnection_tenantId_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'integrationConnection', foreignKey: { name: 'integrationConnection_tenantId_fkey', columns: ['tenantId'], references: { schema: 'public', table: 'tenant', columns: ['id'] }, onDelete: 'cascade' } }),
      this.dropConstraint({ schema: 'public', table: 'integrationConnection', constraint: 'integrationConnection_providerId_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'integrationConnection', foreignKey: { name: 'integrationConnection_providerId_fkey', columns: ['providerId'], references: { schema: 'public', table: 'integrationProvider', columns: ['id'] }, onDelete: 'restrict' } }),
      this.dropConstraint({ schema: 'public', table: 'integrationConnection', constraint: 'integrationConnection_statusId_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'integrationConnection', foreignKey: { name: 'integrationConnection_statusId_fkey', columns: ['statusId'], references: { schema: 'public', table: 'integrationConnectionStatus', columns: ['id'] }, onDelete: 'restrict' } }),
      this.dropConstraint({ schema: 'public', table: 'integrationConnectionCredential', constraint: 'integrationConnectionCredential_connectionId_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'integrationConnectionCredential', foreignKey: { name: 'integrationConnectionCredential_connectionId_fkey', columns: ['connectionId'], references: { schema: 'public', table: 'integrationConnection', columns: ['id'] }, onDelete: 'cascade' } }),
      this.dropConstraint({ schema: 'public', table: 'integrationWebhook', constraint: 'integrationWebhook_connectionId_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'integrationWebhook', foreignKey: { name: 'integrationWebhook_connectionId_fkey', columns: ['connectionId'], references: { schema: 'public', table: 'integrationConnection', columns: ['id'] }, onDelete: 'cascade' } }),
      this.dropConstraint({ schema: 'public', table: 'integrationWebhook', constraint: 'integrationWebhook_statusId_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'integrationWebhook', foreignKey: { name: 'integrationWebhook_statusId_fkey', columns: ['statusId'], references: { schema: 'public', table: 'integrationWebhookStatus', columns: ['id'] }, onDelete: 'restrict' } }),
      this.dropConstraint({ schema: 'public', table: 'integrationWebhookEvent', constraint: 'integrationWebhookEvent_webhookId_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'integrationWebhookEvent', foreignKey: { name: 'integrationWebhookEvent_webhookId_fkey', columns: ['webhookId'], references: { schema: 'public', table: 'integrationWebhook', columns: ['id'] }, onDelete: 'cascade' } }),
      this.dropConstraint({ schema: 'public', table: 'integrationWebhookEvent', constraint: 'integrationWebhookEvent_statusId_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'integrationWebhookEvent', foreignKey: { name: 'integrationWebhookEvent_statusId_fkey', columns: ['statusId'], references: { schema: 'public', table: 'integrationWebhookEventStatus', columns: ['id'] }, onDelete: 'restrict' } }),
      this.dropConstraint({ schema: 'public', table: 'passwordReset', constraint: 'passwordReset_userId_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'passwordReset', foreignKey: { name: 'passwordReset_userId_fkey', columns: ['userId'], references: { schema: 'public', table: 'user', columns: ['id'] }, onDelete: 'cascade' } }),
      this.dropConstraint({ schema: 'public', table: 'permission', constraint: 'permission_permissionGroupId_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'permission', foreignKey: { name: 'permission_permissionGroupId_fkey', columns: ['permissionGroupId'], references: { schema: 'public', table: 'permissionGroup', columns: ['id'] }, onDelete: 'restrict' } }),
      this.dropConstraint({ schema: 'public', table: 'region', constraint: 'region_regionTypeId_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'region', foreignKey: { name: 'region_regionTypeId_fkey', columns: ['regionTypeId'], references: { schema: 'public', table: 'regionType', columns: ['id'] }, onDelete: 'restrict' } }),
      this.dropConstraint({ schema: 'public', table: 'region', constraint: 'region_parentRegionId_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'region', foreignKey: { name: 'region_parentRegionId_fkey', columns: ['parentRegionId'], references: { schema: 'public', table: 'region', columns: ['id'] }, onDelete: 'setNull' } }),
      this.dropConstraint({ schema: 'public', table: 'rolePermission', constraint: 'rolePermission_roleId_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'rolePermission', foreignKey: { name: 'rolePermission_roleId_fkey', columns: ['roleId'], references: { schema: 'public', table: 'role', columns: ['id'] }, onDelete: 'cascade' } }),
      this.dropConstraint({ schema: 'public', table: 'rolePermission', constraint: 'rolePermission_permissionId_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'rolePermission', foreignKey: { name: 'rolePermission_permissionId_fkey', columns: ['permissionId'], references: { schema: 'public', table: 'permission', columns: ['id'] }, onDelete: 'cascade' } }),
      this.dropConstraint({ schema: 'public', table: 'session', constraint: 'session_userId_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'session', foreignKey: { name: 'session_userId_fkey', columns: ['userId'], references: { schema: 'public', table: 'user', columns: ['id'] }, onDelete: 'cascade' } }),
      this.dropConstraint({ schema: 'public', table: 'tenant', constraint: 'tenant_tenantTypeId_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'tenant', foreignKey: { name: 'tenant_tenantTypeId_fkey', columns: ['tenantTypeId'], references: { schema: 'public', table: 'tenantType', columns: ['id'] }, onDelete: 'restrict' } }),
      this.dropConstraint({ schema: 'public', table: 'tenant', constraint: 'tenant_tenantStatusId_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'tenant', foreignKey: { name: 'tenant_tenantStatusId_fkey', columns: ['tenantStatusId'], references: { schema: 'public', table: 'tenantStatus', columns: ['id'] }, onDelete: 'restrict' } }),
      this.dropConstraint({ schema: 'public', table: 'tenantInvitation', constraint: 'tenantInvitation_tenantId_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'tenantInvitation', foreignKey: { name: 'tenantInvitation_tenantId_fkey', columns: ['tenantId'], references: { schema: 'public', table: 'tenant', columns: ['id'] }, onDelete: 'cascade' } }),
      this.dropConstraint({ schema: 'public', table: 'tenantInvitation', constraint: 'tenantInvitation_invitedBy_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'tenantInvitation', foreignKey: { name: 'tenantInvitation_invitedBy_fkey', columns: ['invitedBy'], references: { schema: 'public', table: 'user', columns: ['id'] }, onDelete: 'restrict' } }),
      this.dropConstraint({ schema: 'public', table: 'tenantMembership', constraint: 'tenantMembership_tenantId_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'tenantMembership', foreignKey: { name: 'tenantMembership_tenantId_fkey', columns: ['tenantId'], references: { schema: 'public', table: 'tenant', columns: ['id'] }, onDelete: 'cascade' } }),
      this.dropConstraint({ schema: 'public', table: 'tenantMembership', constraint: 'tenantMembership_userId_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'tenantMembership', foreignKey: { name: 'tenantMembership_userId_fkey', columns: ['userId'], references: { schema: 'public', table: 'user', columns: ['id'] }, onDelete: 'cascade' } }),
      this.dropConstraint({ schema: 'public', table: 'tenantMembership', constraint: 'tenantMembership_invitedBy_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'tenantMembership', foreignKey: { name: 'tenantMembership_invitedBy_fkey', columns: ['invitedBy'], references: { schema: 'public', table: 'user', columns: ['id'] }, onDelete: 'setNull' } }),
      this.dropConstraint({ schema: 'public', table: 'userAuthProvider', constraint: 'userAuthProvider_userId_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'userAuthProvider', foreignKey: { name: 'userAuthProvider_userId_fkey', columns: ['userId'], references: { schema: 'public', table: 'user', columns: ['id'] }, onDelete: 'cascade' } }),
      this.dropConstraint({ schema: 'public', table: 'userAuthProvider', constraint: 'userAuthProvider_authProviderId_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'userAuthProvider', foreignKey: { name: 'userAuthProvider_authProviderId_fkey', columns: ['authProviderId'], references: { schema: 'public', table: 'authProvider', columns: ['id'] }, onDelete: 'restrict' } }),
      this.dropConstraint({ schema: 'public', table: 'userCredential', constraint: 'userCredential_userId_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'userCredential', foreignKey: { name: 'userCredential_userId_fkey', columns: ['userId'], references: { schema: 'public', table: 'user', columns: ['id'] }, onDelete: 'cascade' } }),
      this.dropConstraint({ schema: 'public', table: 'userRoleAssignment', constraint: 'userRoleAssignment_userId_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'userRoleAssignment', foreignKey: { name: 'userRoleAssignment_userId_fkey', columns: ['userId'], references: { schema: 'public', table: 'user', columns: ['id'] }, onDelete: 'cascade' } }),
      this.dropConstraint({ schema: 'public', table: 'userRoleAssignment', constraint: 'userRoleAssignment_roleId_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'userRoleAssignment', foreignKey: { name: 'userRoleAssignment_roleId_fkey', columns: ['roleId'], references: { schema: 'public', table: 'role', columns: ['id'] }, onDelete: 'restrict' } }),
      this.dropConstraint({ schema: 'public', table: 'userRoleAssignment', constraint: 'userRoleAssignment_scopeTypeId_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'userRoleAssignment', foreignKey: { name: 'userRoleAssignment_scopeTypeId_fkey', columns: ['scopeTypeId'], references: { schema: 'public', table: 'scopeType', columns: ['id'] }, onDelete: 'restrict' } }),
      this.dropConstraint({ schema: 'public', table: 'userRoleAssignment', constraint: 'userRoleAssignment_assignedBy_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'userRoleAssignment', foreignKey: { name: 'userRoleAssignment_assignedBy_fkey', columns: ['assignedBy'], references: { schema: 'public', table: 'user', columns: ['id'] }, onDelete: 'setNull' } }),
      this.dropConstraint({ schema: 'public', table: 'workspace', constraint: 'workspace_tenantId_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'workspace', foreignKey: { name: 'workspace_tenantId_fkey', columns: ['tenantId'], references: { schema: 'public', table: 'tenant', columns: ['id'] }, onDelete: 'cascade' } }),
      this.dropConstraint({ schema: 'public', table: 'workspace', constraint: 'workspace_workspaceTypeId_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'workspace', foreignKey: { name: 'workspace_workspaceTypeId_fkey', columns: ['workspaceTypeId'], references: { schema: 'public', table: 'workspaceType', columns: ['id'] }, onDelete: 'setNull' } }),
      this.dropConstraint({ schema: 'public', table: 'workspace', constraint: 'workspace_workspaceStatusId_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'workspace', foreignKey: { name: 'workspace_workspaceStatusId_fkey', columns: ['workspaceStatusId'], references: { schema: 'public', table: 'workspaceStatus', columns: ['id'] }, onDelete: 'restrict' } }),
      this.dropConstraint({ schema: 'public', table: 'workspaceInvitation', constraint: 'workspaceInvitation_workspaceId_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'workspaceInvitation', foreignKey: { name: 'workspaceInvitation_workspaceId_fkey', columns: ['workspaceId'], references: { schema: 'public', table: 'workspace', columns: ['id'] }, onDelete: 'cascade' } }),
      this.dropConstraint({ schema: 'public', table: 'workspaceInvitation', constraint: 'workspaceInvitation_invitedBy_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'workspaceInvitation', foreignKey: { name: 'workspaceInvitation_invitedBy_fkey', columns: ['invitedBy'], references: { schema: 'public', table: 'user', columns: ['id'] }, onDelete: 'restrict' } }),
      this.dropConstraint({ schema: 'public', table: 'workspaceMembership', constraint: 'workspaceMembership_workspaceId_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'workspaceMembership', foreignKey: { name: 'workspaceMembership_workspaceId_fkey', columns: ['workspaceId'], references: { schema: 'public', table: 'workspace', columns: ['id'] }, onDelete: 'cascade' } }),
      this.dropConstraint({ schema: 'public', table: 'workspaceMembership', constraint: 'workspaceMembership_userId_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'workspaceMembership', foreignKey: { name: 'workspaceMembership_userId_fkey', columns: ['userId'], references: { schema: 'public', table: 'user', columns: ['id'] }, onDelete: 'cascade' } }),
      this.dropConstraint({ schema: 'public', table: 'workspaceMembership', constraint: 'workspaceMembership_invitedBy_fkey', kind: 'foreignKey' }),
      this.addForeignKey({ schema: 'public', table: 'workspaceMembership', foreignKey: { name: 'workspaceMembership_invitedBy_fkey', columns: ['invitedBy'], references: { schema: 'public', table: 'user', columns: ['id'] }, onDelete: 'setNull' } }),

      this.dropIndex({
        schema: 'public',
        table: 'crmCompany',
        index: 'crmCompany_createdAt_idx_9575dbd7',
      }),
      this.dropIndex({
        schema: 'public',
        table: 'crmCompany',
        index: 'crmCompany_isActive_idx_77fe3ba1',
      }),
      this.dropConstraint({
        schema: 'public',
        table: 'integrationConnection',
        constraint: 'integrationConnection_channelId_fkey',
        kind: 'foreignKey',
      }),
      this.dropIndex({
        schema: 'public',
        table: 'integrationConnection',
        index: 'integrationConnection_channelId_idx_166d3598',
      }),
      this.dropConstraint({
        schema: 'public',
        table: 'integrationConnection',
        constraint: 'integrationConnection_tenantId_providerId_channelId_externalAcc',
      }),
      this.dropConstraint({
        schema: 'public',
        table: 'integrationWebhookEvent',
        constraint: 'integrationWebhookEvent_webhookId_externalEventId_key',
      }),
      this.createTable({
        schema: 'public',
        table: 'aiAgent',
        columns: [
          col('code', 'character varying(100)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('createdByUserId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('name', 'character varying(255)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('status', 'character varying(50)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 50 } },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('workspaceId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'aiAgentConfiguration',
        columns: [
          col('agentId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('maxTokens', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('modelId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('systemPrompt', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('temperature', 'numeric', { codecRef: { codecId: 'pg/numeric@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'aiModel',
        columns: [
          col('code', 'character varying(100)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('name', 'character varying(150)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 150 } },
          }),
          col('providerId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('providerModelId', 'character varying(255)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'aiProvider',
        columns: [
          col('code', 'character varying(50)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 50 } },
          }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('isActive', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('name', 'character varying(100)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('sortOrder', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'currency',
        columns: [
          col('code', 'character varying(3)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 3 } },
          }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('decimalPlaces', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('isActive', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('name', 'character varying(100)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('numericCode', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('sortOrder', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('symbol', 'character varying(10)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 10 } },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'socialInboxConversation',
        columns: [
          col('connectionId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('contactId', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('externalConversationId', 'character varying(255)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('isArchived', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('lastMessageAt', 'timestamptz', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('snoozedUntil', 'timestamptz', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('statusId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('subject', 'character varying(255)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'socialInboxConversationAssignment',
        columns: [
          col('assignedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('assignedByUserId', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
          col('conversationId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('unassignedAt', 'timestamptz', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('userId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'socialInboxConversationRead',
        columns: [
          col('conversationId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('lastReadAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('lastReadMessageId', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('userId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'socialInboxConversationStatus',
        columns: [
          col('code', 'character varying(50)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 50 } },
          }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('isActive', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('name', 'character varying(100)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('sortOrder', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'socialInboxConversationTag',
        columns: [
          col('conversationId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('tagId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'socialInboxMessage',
        columns: [
          col('content', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('conversationId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('direction', 'character varying(20)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 20 } },
          }),
          col('externalMessageId', 'character varying(255)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('messageTypeId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('replyToMessageId', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
          col('senderContactId', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
          col('senderUserId', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
          col('sentAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('statusId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'socialInboxMessageStatus',
        columns: [
          col('code', 'character varying(50)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 50 } },
          }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('isActive', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('name', 'character varying(100)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('sortOrder', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'socialInboxMessageType',
        columns: [
          col('code', 'character varying(50)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 50 } },
          }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('isActive', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('name', 'character varying(100)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('sortOrder', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'timezone',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('ianaName', 'character varying(100)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('isActive', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('regionId', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
          col('sortOrder', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'aiAgent',
        constraint: 'aiAgent_workspaceId_code_key',
        columns: ['workspaceId', 'code'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'aiAgentConfiguration',
        constraint: 'aiAgentConfiguration_agentId_key',
        columns: ['agentId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'aiModel',
        constraint: 'aiModel_providerId_code_key',
        columns: ['providerId', 'code'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'aiModel',
        constraint: 'aiModel_providerId_providerModelId_key',
        columns: ['providerId', 'providerModelId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'aiProvider',
        constraint: 'aiProvider_code_key',
        columns: ['code'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'currency',
        constraint: 'currency_code_key',
        columns: ['code'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'currency',
        constraint: 'currency_numericCode_key',
        columns: ['numericCode'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'integrationChannel',
        constraint: 'integrationChannel_providerId_id_key',
        columns: ['providerId', 'id'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'socialInboxConversationRead',
        constraint: 'socialInboxConversationRead_conversationId_userId_key',
        columns: ['conversationId', 'userId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'socialInboxConversationStatus',
        constraint: 'socialInboxConversationStatus_code_key',
        columns: ['code'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'socialInboxConversationTag',
        constraint: 'socialInboxConversationTag_conversationId_tagId_key',
        columns: ['conversationId', 'tagId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'socialInboxMessageStatus',
        constraint: 'socialInboxMessageStatus_code_key',
        columns: ['code'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'socialInboxMessageType',
        constraint: 'socialInboxMessageType_code_key',
        columns: ['code'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'timezone',
        constraint: 'timezone_ianaName_key',
        columns: ['ianaName'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'aiAgent',
        index: 'aiAgent_createdByUserId_idx_93e8a540',
        columns: ['createdByUserId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'aiAgent',
        index: 'aiAgent_workspaceId_idx_ba65f874',
        columns: ['workspaceId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'aiAgent',
        index: 'aiAgent_workspaceId_status_idx_76d68132',
        columns: ['workspaceId', 'status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'aiAgentConfiguration',
        index: 'aiAgentConfiguration_modelId_idx_a8222b0e',
        columns: ['modelId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'aiModel',
        index: 'aiModel_providerId_idx_d1904c54',
        columns: ['providerId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'crmCompany',
        index: 'crmCompany_workspaceId_createdAt_idx_5ff7e893',
        columns: ['workspaceId', 'createdAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'crmCompany',
        index: 'crmCompany_workspaceId_isActive_idx_89addad9',
        columns: ['workspaceId', 'isActive'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'integrationConnection',
        index: 'integrationConnection_providerId_channelId_idx_aa6c393b',
        columns: ['providerId', 'channelId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'socialInboxConversation',
        index: 'socialInboxConversation_connectionId_idx_b3eeb6ac',
        columns: ['connectionId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'socialInboxConversation',
        index: 'socialInboxConversation_contactId_idx_ec98db2a',
        columns: ['contactId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'socialInboxConversation',
        index: 'socialInboxConversation_lastMessageAt_idx_150705d0',
        columns: ['lastMessageAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'socialInboxConversation',
        index: 'socialInboxConversation_snoozedUntil_idx_6c34833f',
        columns: ['snoozedUntil'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'socialInboxConversation',
        index: 'socialInboxConversation_statusId_idx_e5a44bce',
        columns: ['statusId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'socialInboxConversationAssignment',
        index: 'socialInboxConversationAssignment_assignedByUserId_idx_2ceeeec9',
        columns: ['assignedByUserId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'socialInboxConversationAssignment',
        index: 'socialInboxConversationAssignment_conversationId_idx_669215a6',
        columns: ['conversationId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'socialInboxConversationAssignment',
        index: 'socialInboxConversationAssignment_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'socialInboxConversationRead',
        index: 'socialInboxConversationRead_conversationId_idx_669215a6',
        columns: ['conversationId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'socialInboxConversationRead',
        index: 'socialInboxConversationRead_lastReadMessageId_idx_87f919b1',
        columns: ['lastReadMessageId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'socialInboxConversationRead',
        index: 'socialInboxConversationRead_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'socialInboxConversationTag',
        index: 'socialInboxConversationTag_conversationId_idx_669215a6',
        columns: ['conversationId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'socialInboxConversationTag',
        index: 'socialInboxConversationTag_tagId_idx_86854244',
        columns: ['tagId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'socialInboxMessage',
        index: 'socialInboxMessage_conversationId_idx_669215a6',
        columns: ['conversationId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'socialInboxMessage',
        index: 'socialInboxMessage_messageTypeId_idx_4546e6b0',
        columns: ['messageTypeId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'socialInboxMessage',
        index: 'socialInboxMessage_replyToMessageId_idx_dcef6925',
        columns: ['replyToMessageId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'socialInboxMessage',
        index: 'socialInboxMessage_senderContactId_idx_5e827452',
        columns: ['senderContactId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'socialInboxMessage',
        index: 'socialInboxMessage_senderUserId_idx_64078a57',
        columns: ['senderUserId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'socialInboxMessage',
        index: 'socialInboxMessage_sentAt_idx_143b1b4c',
        columns: ['sentAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'socialInboxMessage',
        index: 'socialInboxMessage_statusId_idx_e5a44bce',
        columns: ['statusId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'tenant',
        index: 'tenant_defaultCurrencyId_idx_afb00d5c',
        columns: ['defaultCurrencyId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'tenant',
        index: 'tenant_defaultTimezoneId_idx_2072c5de',
        columns: ['defaultTimezoneId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'timezone',
        index: 'timezone_regionId_idx_f44e49e6',
        columns: ['regionId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'workspace',
        index: 'workspace_defaultCurrencyId_idx_afb00d5c',
        columns: ['defaultCurrencyId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'workspace',
        index: 'workspace_defaultTimezoneId_idx_2072c5de',
        columns: ['defaultTimezoneId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'aiAgent',
        foreignKey: {
          name: 'aiAgent_workspaceId_fkey',
          columns: ['workspaceId'],
          references: { schema: 'public', table: 'workspace', columns: ['id'] },
           onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'aiAgent',
        foreignKey: {
          name: 'aiAgent_createdByUserId_fkey',
          columns: ['createdByUserId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
            onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'aiAgentConfiguration',
        foreignKey: {
          name: 'aiAgentConfiguration_agentId_fkey',
          columns: ['agentId'],
          references: { schema: 'public', table: 'aiAgent', columns: ['id'] },
            onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'aiAgentConfiguration',
        foreignKey: {
          name: 'aiAgentConfiguration_modelId_fkey',
          columns: ['modelId'],
          references: { schema: 'public', table: 'aiModel', columns: ['id'] },
            onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'aiModel',
        foreignKey: {
          name: 'aiModel_providerId_fkey',
          columns: ['providerId'],
          references: { schema: 'public', table: 'aiProvider', columns: ['id'] },
            onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'integrationConnection',
        foreignKey: {
          name: 'integrationConnection_providerId_channelId_fkey',
          columns: ['providerId', 'channelId'],
          references: {
            schema: 'public',
            table: 'integrationChannel',
            columns: ['providerId', 'id'],
          },
            onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'socialInboxConversation',
        foreignKey: {
          name: 'socialInboxConversation_connectionId_fkey',
          columns: ['connectionId'],
          references: { schema: 'public', table: 'integrationConnection', columns: ['id'] },
            onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'socialInboxConversation',
        foreignKey: {
          name: 'socialInboxConversation_contactId_fkey',
          columns: ['contactId'],
          references: { schema: 'public', table: 'crmContact', columns: ['id'] },
            onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'socialInboxConversation',
        foreignKey: {
          name: 'socialInboxConversation_statusId_fkey',
          columns: ['statusId'],
          references: { schema: 'public', table: 'socialInboxConversationStatus', columns: ['id'] },
            onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'socialInboxConversationAssignment',
        foreignKey: {
          name: 'socialInboxConversationAssignment_conversationId_fkey',
          columns: ['conversationId'],
          references: { schema: 'public', table: 'socialInboxConversation', columns: ['id'] },
            onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'socialInboxConversationAssignment',
        foreignKey: {
          name: 'socialInboxConversationAssignment_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
            onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'socialInboxConversationAssignment',
        foreignKey: {
          name: 'socialInboxConversationAssignment_assignedByUserId_fkey',
          columns: ['assignedByUserId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
            onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'socialInboxConversationRead',
        foreignKey: {
          name: 'socialInboxConversationRead_conversationId_fkey',
          columns: ['conversationId'],
          references: { schema: 'public', table: 'socialInboxConversation', columns: ['id'] },
            onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'socialInboxConversationRead',
        foreignKey: {
          name: 'socialInboxConversationRead_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
            onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'socialInboxConversationRead',
        foreignKey: {
          name: 'socialInboxConversationRead_lastReadMessageId_fkey',
          columns: ['lastReadMessageId'],
          references: { schema: 'public', table: 'socialInboxMessage', columns: ['id'] },
            onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'socialInboxConversationTag',
        foreignKey: {
          name: 'socialInboxConversationTag_conversationId_fkey',
          columns: ['conversationId'],
          references: { schema: 'public', table: 'socialInboxConversation', columns: ['id'] },
            onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'socialInboxConversationTag',
        foreignKey: {
          name: 'socialInboxConversationTag_tagId_fkey',
          columns: ['tagId'],
          references: { schema: 'public', table: 'crmTag', columns: ['id'] },
            onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'socialInboxMessage',
        foreignKey: {
          name: 'socialInboxMessage_conversationId_fkey',
          columns: ['conversationId'],
          references: { schema: 'public', table: 'socialInboxConversation', columns: ['id'] },
            onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'socialInboxMessage',
        foreignKey: {
          name: 'socialInboxMessage_replyToMessageId_fkey',
          columns: ['replyToMessageId'],
          references: { schema: 'public', table: 'socialInboxMessage', columns: ['id'] },
            onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'socialInboxMessage',
        foreignKey: {
          name: 'socialInboxMessage_senderContactId_fkey',
          columns: ['senderContactId'],
          references: { schema: 'public', table: 'crmContact', columns: ['id'] },
            onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'socialInboxMessage',
        foreignKey: {
          name: 'socialInboxMessage_senderUserId_fkey',
          columns: ['senderUserId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
            onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'socialInboxMessage',
        foreignKey: {
          name: 'socialInboxMessage_messageTypeId_fkey',
          columns: ['messageTypeId'],
          references: { schema: 'public', table: 'socialInboxMessageType', columns: ['id'] },
            onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'socialInboxMessage',
        foreignKey: {
          name: 'socialInboxMessage_statusId_fkey',
          columns: ['statusId'],
          references: { schema: 'public', table: 'socialInboxMessageStatus', columns: ['id'] },
            onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'tenant',
        foreignKey: {
          name: 'tenant_defaultCurrencyId_fkey',
          columns: ['defaultCurrencyId'],
          references: { schema: 'public', table: 'currency', columns: ['id'] },
            onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'timezone',
        foreignKey: {
          name: 'timezone_regionId_fkey',
          columns: ['regionId'],
          references: { schema: 'public', table: 'region', columns: ['id'] },
            onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'tenant',
        foreignKey: {
          name: 'tenant_defaultTimezoneId_fkey',
          columns: ['defaultTimezoneId'],
          references: { schema: 'public', table: 'timezone', columns: ['id'] },
            onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'workspace',
        foreignKey: {
          name: 'workspace_defaultCurrencyId_fkey',
          columns: ['defaultCurrencyId'],
          references: { schema: 'public', table: 'currency', columns: ['id'] },
            onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'workspace',
        foreignKey: {
          name: 'workspace_defaultTimezoneId_fkey',
          columns: ['defaultTimezoneId'],
          references: { schema: 'public', table: 'timezone', columns: ['id'] },
            onDelete: 'restrict',
        },
      }),
      this.createIndex({
  schema: 'public',
  table: 'tenantInvitation',
  index: 'ux_tenant_invitation_active_email',
  columns: ['tenantId', 'email'],
  extras: {
    unique: true,
    where: '"acceptedAt" IS NULL AND "revokedAt" IS NULL',
  },
}),

this.createIndex({
  schema: 'public',
  table: 'workspaceInvitation',
  index: 'ux_workspace_invitation_active_email',
  columns: ['workspaceId', 'email'],
  extras: {
    unique: true,
    where: '"acceptedAt" IS NULL AND "revokedAt" IS NULL',
  },
}),

this.createIndex({
  schema: 'public',
  table: 'integrationConnection',
  index: 'ux_integration_connection_external_account',
  columns: [
    'tenantId',
    'providerId',
    'channelId',
    'externalAccountId',
  ],
  extras: {
    unique: true,
    where: '"externalAccountId" IS NOT NULL',
  },
}),

this.createIndex({
  schema: 'public',
  table: 'integrationWebhook',
  index: 'ux_integration_webhook_external_id',
  columns: ['connectionId', 'externalWebhookId'],
  extras: {
    unique: true,
    where: '"externalWebhookId" IS NOT NULL',
  },
}),

this.createIndex({
  schema: 'public',
  table: 'integrationWebhookEvent',
  index: 'ux_integration_webhook_event_external_id',
  columns: ['webhookId', 'externalEventId'],
  extras: {
    unique: true,
    where: '"externalEventId" IS NOT NULL',
  },
}),

this.createIndex({
  schema: 'public',
  table: 'socialInboxConversation',
  index: 'ux_social_inbox_conversation_external_id',
  columns: ['connectionId', 'externalConversationId'],
  extras: {
    unique: true,
    where: '"externalConversationId" IS NOT NULL',
  },
}),

this.createIndex({
  schema: 'public',
  table: 'socialInboxMessage',
  index: 'ux_social_inbox_message_external_id',
  columns: ['conversationId', 'externalMessageId'],
  extras: {
    unique: true,
    where: '"externalMessageId" IS NOT NULL',
  },
}),

this.createIndex({
  schema: 'public',
  table: 'socialInboxConversationAssignment',
  index: 'ux_social_inbox_conversation_assignment_active',
  columns: ['conversationId'],
  extras: {
    unique: true,
    where: '"unassignedAt" IS NULL',
  },
}),
this.addCheckConstraint({
  schema: 'public',
  table: 'aiProvider',
  constraint: 'ck_ai_provider_sort_order_non_negative',
  expression: '"sortOrder" >= 0',
}),

this.addCheckConstraint({
  schema: 'public',
  table: 'currency',
  constraint: 'ck_currency_sort_order_non_negative',
  expression: '"sortOrder" >= 0',
}),

this.addCheckConstraint({
  schema: 'public',
  table: 'socialInboxConversationStatus',
  constraint: 'ck_social_inbox_conversation_status_sort_order_non_negative',
  expression: '"sortOrder" >= 0',
}),

this.addCheckConstraint({
  schema: 'public',
  table: 'socialInboxMessageStatus',
  constraint: 'ck_social_inbox_message_status_sort_order_non_negative',
  expression: '"sortOrder" >= 0',
}),

this.addCheckConstraint({
  schema: 'public',
  table: 'socialInboxMessageType',
  constraint: 'ck_social_inbox_message_type_sort_order_non_negative',
  expression: '"sortOrder" >= 0',
}),

this.addCheckConstraint({
  schema: 'public',
  table: 'timezone',
  constraint: 'ck_timezone_sort_order_non_negative',
  expression: '"sortOrder" >= 0',
}),
this.addCheckConstraint({
  schema: 'public',
  table: 'tenantInvitation',
  constraint: 'ck_tenant_invitation_expires_after_created',
  expression: '"expiresAt" > "createdAt"',
}),

this.addCheckConstraint({
  schema: 'public',
  table: 'workspaceInvitation',
  constraint: 'ck_workspace_invitation_expires_after_created',
  expression: '"expiresAt" > "createdAt"',
}),
this.addCheckConstraint({
  schema: 'public',
  table: 'tenantMembership',
  constraint: 'ck_tenant_membership_left_after_joined',
  expression: '"leftAt" >= "joinedAt"',
}),

this.addCheckConstraint({
  schema: 'public',
  table: 'workspaceMembership',
  constraint: 'ck_workspace_membership_left_after_joined',
  expression: '"leftAt" >= "joinedAt"',
}),
this.addCheckConstraint({
  schema: 'public',
  table: 'userRoleAssignment',
  constraint: 'ck_user_role_assignment_effective_to_after_from',
  expression: '"effectiveTo" >= "effectiveFrom"',
}),
this.addCheckConstraint({
  schema: 'public',
  table: 'socialInboxConversationAssignment',
  constraint: 'ck_conversation_assignment_unassigned_after_assigned',
  expression: '"unassignedAt" >= "assignedAt"',
}),
this.addCheckConstraint({
  schema: 'public',
  table: 'aiAgent',
  constraint: 'ck_ai_agent_status_valid',
  expression: `"status" IN ('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED')`,
}),
this.addCheckConstraint({
  schema: 'public',
  table: 'socialInboxMessage',
  constraint: 'ck_social_inbox_message_sender_direction',
  expression: `(
    ("direction" = 'inbound'
      AND "senderContactId" IS NOT NULL
      AND "senderUserId" IS NULL)
    OR
    ("direction" = 'outbound'
      AND "senderUserId" IS NOT NULL
      AND "senderContactId" IS NULL)
  )`,
}),
this.addCheckConstraint({
  schema: 'public',
  table: 'socialInboxMessage',
  constraint: 'ck_social_inbox_message_reply_not_self',
  expression: '"replyToMessageId" IS NULL OR "replyToMessageId" <> "id"',
}),
this.addCheckConstraint({
  schema: 'public',
  table: 'aiAgentConfiguration',
  constraint: 'ck_ai_agent_configuration_temperature_non_negative',
  expression: '"temperature" >= 0',
}),
this.addCheckConstraint({
  schema: 'public',
  table: 'aiAgentConfiguration',
  constraint: 'ck_ai_agent_configuration_max_tokens_positive',
  expression: '"maxTokens" > 0',
}),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);






