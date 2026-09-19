#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/98f0ef2366fad2de91c2eca3d39ff049ca7b65c0c69dc3f1d52b3f42f31dedc9/contract';
import endContract from '../../snapshots/98f0ef2366fad2de91c2eca3d39ff049ca7b65c0c69dc3f1d52b3f42f31dedc9/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'authEvent',
        columns: [
          col('authEventTypeId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('ipAddress', 'character varying(45)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 45 } },
          }),
          col('occurredAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('userAgent', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('userId', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'authEventType',
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
          col('sortOrder', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
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
        table: 'authProvider',
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
          col('sortOrder', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
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
        table: 'crmCompany',
        columns: [
          col('city', 'character varying(100)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('countryRegionId', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('email', 'character varying(255)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('industry', 'character varying(100)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('isActive', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('legalName', 'character varying(255)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('name', 'character varying(255)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('phone', 'character varying(50)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 50 } },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('website', 'character varying(255)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('workspaceId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'crmContact',
        columns: [
          col('companyId', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('email', 'character varying(255)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('firstName', 'character varying(100)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('jobTitle', 'character varying(150)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 150 } },
          }),
          col('lastName', 'character varying(100)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('metadata', 'jsonb', { codecRef: { codecId: 'pg/jsonb@1' } }),
          col('ownerUserId', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
          col('phone', 'character varying(50)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 50 } },
          }),
          col('sourceId', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
          col('statusId', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
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
        table: 'crmContactSource',
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
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'crmContactStatus',
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
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'crmContactTag',
        columns: [
          col('contactId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
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
        table: 'crmTag',
        columns: [
          col('code', 'character varying(50)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 50 } },
          }),
          col('color', 'character varying(20)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 20 } },
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
        table: 'integrationChannel',
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
          col('providerId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'integrationConnection',
        columns: [
          col('channelId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('connectedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('disconnectedAt', 'timestamptz', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('externalAccountId', 'character varying(255)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('externalAccountName', 'character varying(255)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('lastConnectedAt', 'timestamptz', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('lastError', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('metadata', 'jsonb', { codecRef: { codecId: 'pg/jsonb@1' } }),
          col('providerId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('statusId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('tenantId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'integrationConnectionCredential',
        columns: [
          col('connectionId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('credentialType', 'character varying(50)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 50 } },
          }),
          col('encryptedCredentials', 'text', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('expiresAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'integrationConnectionStatus',
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
          col('sortOrder', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
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
        table: 'integrationProvider',
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
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'integrationWebhook',
        columns: [
          col('connectionId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('encryptedVerifyToken', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('externalWebhookId', 'character varying(255)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('lastError', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('lastReceivedAt', 'timestamptz', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('statusId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('webhookUrl', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'integrationWebhookEvent',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('errorMessage', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('eventType', 'character varying(100)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('externalEventId', 'character varying(255)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('payload', 'jsonb', { notNull: true, codecRef: { codecId: 'pg/jsonb@1' } }),
          col('processedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('receivedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('statusId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('webhookId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'integrationWebhookEventStatus',
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
          col('sortOrder', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
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
        table: 'integrationWebhookStatus',
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
          col('sortOrder', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
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
        table: 'passwordReset',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('expiresAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('revokedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('tokenHash', 'character varying(255)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('usedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('userId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'permission',
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
          col('isActive', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('name', 'character varying(150)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 150 } },
          }),
          col('permissionGroupId', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
          col('sortOrder', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'permissionGroup',
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
          col('sortOrder', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'region',
        columns: [
          col('code', 'character varying(20)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 20 } },
          }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
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
          col('parentRegionId', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
          col('regionTypeId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('sortOrder', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
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
        table: 'regionType',
        columns: [
          col('code', 'character varying(30)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 30 } },
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
          col('name', 'character varying(50)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 50 } },
          }),
          col('sortOrder', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
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
        table: 'role',
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
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'rolePermission',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('permissionId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('roleId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'scopeType',
        columns: [
          col('code', 'character varying(30)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 30 } },
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
          col('name', 'character varying(50)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 50 } },
          }),
          col('sortOrder', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
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
        table: 'session',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('expiresAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('ipAddress', 'character varying(45)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 45 } },
          }),
          col('lastActivityAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('revokedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('tokenHash', 'character varying(255)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('userAgent', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('userId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'tenant',
        columns: [
          col('code', 'character varying(50)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 50 } },
          }),
          col('contactEmail', 'character varying(255)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('contactPhone', 'character varying(30)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 30 } },
          }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('defaultCurrencyId', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
          col('defaultTimezoneId', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('legalName', 'character varying(200)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 200 } },
          }),
          col('name', 'character varying(150)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 150 } },
          }),
          col('slug', 'character varying(150)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 150 } },
          }),
          col('tenantStatusId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('tenantTypeId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('websiteUrl', 'character varying(500)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 500 } },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'tenantInvitation',
        columns: [
          col('acceptedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('email', 'character varying(255)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('expiresAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('invitedBy', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('revokedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('tenantId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('tokenHash', 'character varying(255)', {
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
        table: 'tenantMembership',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('invitedBy', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
          col('isActive', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('joinedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('leftAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('tenantId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
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
        table: 'tenantStatus',
        columns: [
          col('code', 'character varying(30)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 30 } },
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
          col('name', 'character varying(50)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 50 } },
          }),
          col('sortOrder', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
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
        table: 'tenantType',
        columns: [
          col('code', 'character varying(30)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 30 } },
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
          col('name', 'character varying(50)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 50 } },
          }),
          col('sortOrder', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
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
        table: 'user',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('email', 'character varying(255)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('emailVerifiedAt', 'timestamptz', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('firstName', 'character varying(100)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('lastLoginAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('lastName', 'character varying(100)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('status', 'text', {
            notNull: true,
            default: lit('ACTIVE'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'user_status_check_a34ffd8e',
            "\"status\" IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'userAuthProvider',
        columns: [
          col('authProviderId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('isActive', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('lastUsedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('providerEmail', 'character varying(255)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('providerUserId', 'character varying(255)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
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
        table: 'userCredential',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('passwordChangedAt', 'timestamptz', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('passwordHash', 'character varying(255)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
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
        table: 'userRoleAssignment',
        columns: [
          col('assignedBy', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('effectiveFrom', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('effectiveTo', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('isActive', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('roleId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('scopeId', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
          col('scopeTypeId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
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
        table: 'workspace',
        columns: [
          col('code', 'character varying(50)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 50 } },
          }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('defaultCurrencyId', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
          col('defaultTimezoneId', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('name', 'character varying(150)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 150 } },
          }),
          col('slug', 'character varying(150)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 150 } },
          }),
          col('tenantId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('workspaceStatusId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('workspaceTypeId', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'workspaceInvitation',
        columns: [
          col('acceptedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('email', 'character varying(255)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('expiresAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('invitedBy', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('revokedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('tokenHash', 'character varying(255)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
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
        table: 'workspaceMembership',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('invitedBy', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
          col('isActive', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('joinedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('leftAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('userId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('workspaceId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'workspaceStatus',
        columns: [
          col('code', 'character varying(30)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 30 } },
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
          col('name', 'character varying(50)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 50 } },
          }),
          col('sortOrder', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
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
        table: 'workspaceType',
        columns: [
          col('code', 'character varying(30)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 30 } },
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
          col('name', 'character varying(50)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 50 } },
          }),
          col('sortOrder', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'authEventType',
        constraint: 'authEventType_code_key',
        columns: ['code'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'authProvider',
        constraint: 'authProvider_code_key',
        columns: ['code'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'crmContactSource',
        constraint: 'crmContactSource_code_key',
        columns: ['code'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'crmContactStatus',
        constraint: 'crmContactStatus_code_key',
        columns: ['code'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'crmContactTag',
        constraint: 'crmContactTag_contactId_tagId_key',
        columns: ['contactId', 'tagId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'crmTag',
        constraint: 'crmTag_workspaceId_code_key',
        columns: ['workspaceId', 'code'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'crmTag',
        constraint: 'crmTag_workspaceId_name_key',
        columns: ['workspaceId', 'name'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'integrationChannel',
        constraint: 'integrationChannel_providerId_code_key',
        columns: ['providerId', 'code'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'integrationConnection',
        constraint: 'integrationConnection_tenantId_providerId_channelId_externalAccountId_key',
        columns: ['tenantId', 'providerId', 'channelId', 'externalAccountId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'integrationConnectionCredential',
        constraint: 'integrationConnectionCredential_connectionId_credentialType_key',
        columns: ['connectionId', 'credentialType'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'integrationConnectionStatus',
        constraint: 'integrationConnectionStatus_code_key',
        columns: ['code'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'integrationProvider',
        constraint: 'integrationProvider_code_key',
        columns: ['code'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'integrationWebhookEvent',
        constraint: 'integrationWebhookEvent_webhookId_externalEventId_key',
        columns: ['webhookId', 'externalEventId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'integrationWebhookEventStatus',
        constraint: 'integrationWebhookEventStatus_code_key',
        columns: ['code'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'integrationWebhookStatus',
        constraint: 'integrationWebhookStatus_code_key',
        columns: ['code'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'passwordReset',
        constraint: 'passwordReset_tokenHash_key',
        columns: ['tokenHash'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'permission',
        constraint: 'permission_code_key',
        columns: ['code'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'permissionGroup',
        constraint: 'permissionGroup_code_key',
        columns: ['code'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'region',
        constraint: 'region_code_key',
        columns: ['code'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'regionType',
        constraint: 'regionType_code_key',
        columns: ['code'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'role',
        constraint: 'role_code_key',
        columns: ['code'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'rolePermission',
        constraint: 'rolePermission_roleId_permissionId_key',
        columns: ['roleId', 'permissionId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'scopeType',
        constraint: 'scopeType_code_key',
        columns: ['code'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'session',
        constraint: 'session_tokenHash_key',
        columns: ['tokenHash'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'tenant',
        constraint: 'tenant_slug_key',
        columns: ['slug'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'tenant',
        constraint: 'tenant_code_key',
        columns: ['code'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'tenantInvitation',
        constraint: 'tenantInvitation_tokenHash_key',
        columns: ['tokenHash'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'tenantMembership',
        constraint: 'tenantMembership_tenantId_userId_key',
        columns: ['tenantId', 'userId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'tenantStatus',
        constraint: 'tenantStatus_code_key',
        columns: ['code'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'tenantType',
        constraint: 'tenantType_code_key',
        columns: ['code'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'user',
        constraint: 'user_email_key',
        columns: ['email'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'userAuthProvider',
        constraint: 'userAuthProvider_userId_authProviderId_key',
        columns: ['userId', 'authProviderId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'userAuthProvider',
        constraint: 'userAuthProvider_authProviderId_providerUserId_key',
        columns: ['authProviderId', 'providerUserId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'userCredential',
        constraint: 'userCredential_userId_key',
        columns: ['userId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'userRoleAssignment',
        constraint: 'userRoleAssignment_userId_roleId_scopeTypeId_scopeId_key',
        columns: ['userId', 'roleId', 'scopeTypeId', 'scopeId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'workspace',
        constraint: 'workspace_tenantId_slug_key',
        columns: ['tenantId', 'slug'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'workspace',
        constraint: 'workspace_tenantId_code_key',
        columns: ['tenantId', 'code'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'workspaceInvitation',
        constraint: 'workspaceInvitation_tokenHash_key',
        columns: ['tokenHash'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'workspaceMembership',
        constraint: 'workspaceMembership_workspaceId_userId_key',
        columns: ['workspaceId', 'userId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'workspaceStatus',
        constraint: 'workspaceStatus_code_key',
        columns: ['code'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'workspaceType',
        constraint: 'workspaceType_code_key',
        columns: ['code'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'authEvent',
        index: 'authEvent_authEventTypeId_idx_6a5e78b4',
        columns: ['authEventTypeId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'authEvent',
        index: 'authEvent_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'authEvent',
        index: 'authEvent_userId_occurredAt_idx_9003f3bb',
        columns: ['userId', 'occurredAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'crmCompany',
        index: 'crmCompany_countryRegionId_idx_017e9793',
        columns: ['countryRegionId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'crmCompany',
        index: 'crmCompany_createdAt_idx_9575dbd7',
        columns: ['createdAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'crmCompany',
        index: 'crmCompany_isActive_idx_77fe3ba1',
        columns: ['isActive'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'crmCompany',
        index: 'crmCompany_workspaceId_idx_ba65f874',
        columns: ['workspaceId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'crmContact',
        index: 'crmContact_companyId_idx_33acc5ed',
        columns: ['companyId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'crmContact',
        index: 'crmContact_ownerUserId_idx_f93ae154',
        columns: ['ownerUserId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'crmContact',
        index: 'crmContact_sourceId_idx_d92a2571',
        columns: ['sourceId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'crmContact',
        index: 'crmContact_statusId_idx_e5a44bce',
        columns: ['statusId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'crmContact',
        index: 'crmContact_workspaceId_companyId_idx_988d6c93',
        columns: ['workspaceId', 'companyId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'crmContact',
        index: 'crmContact_workspaceId_createdAt_idx_5ff7e893',
        columns: ['workspaceId', 'createdAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'crmContact',
        index: 'crmContact_workspaceId_idx_ba65f874',
        columns: ['workspaceId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'crmContact',
        index: 'crmContact_workspaceId_ownerUserId_idx_e7fad1ad',
        columns: ['workspaceId', 'ownerUserId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'crmContact',
        index: 'crmContact_workspaceId_sourceId_idx_0c96def9',
        columns: ['workspaceId', 'sourceId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'crmContact',
        index: 'crmContact_workspaceId_statusId_idx_d55fda1f',
        columns: ['workspaceId', 'statusId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'crmContactTag',
        index: 'crmContactTag_contactId_idx_ec98db2a',
        columns: ['contactId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'crmContactTag',
        index: 'crmContactTag_tagId_idx_86854244',
        columns: ['tagId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'crmTag',
        index: 'crmTag_workspaceId_idx_ba65f874',
        columns: ['workspaceId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'crmTag',
        index: 'crmTag_workspaceId_isActive_idx_89addad9',
        columns: ['workspaceId', 'isActive'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'integrationChannel',
        index: 'integrationChannel_providerId_idx_d1904c54',
        columns: ['providerId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'integrationConnection',
        index: 'integrationConnection_channelId_idx_166d3598',
        columns: ['channelId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'integrationConnection',
        index: 'integrationConnection_providerId_idx_d1904c54',
        columns: ['providerId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'integrationConnection',
        index: 'integrationConnection_statusId_idx_e5a44bce',
        columns: ['statusId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'integrationConnection',
        index: 'integrationConnection_tenantId_idx_c93ed4f1',
        columns: ['tenantId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'integrationConnection',
        index: 'integrationConnection_tenantId_statusId_idx_12280664',
        columns: ['tenantId', 'statusId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'integrationConnectionCredential',
        index: 'integrationConnectionCredential_connectionId_idx_b3eeb6ac',
        columns: ['connectionId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'integrationWebhook',
        index: 'integrationWebhook_connectionId_idx_b3eeb6ac',
        columns: ['connectionId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'integrationWebhook',
        index: 'integrationWebhook_statusId_idx_e5a44bce',
        columns: ['statusId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'integrationWebhookEvent',
        index: 'integrationWebhookEvent_receivedAt_idx_9e532856',
        columns: ['receivedAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'integrationWebhookEvent',
        index: 'integrationWebhookEvent_statusId_idx_e5a44bce',
        columns: ['statusId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'integrationWebhookEvent',
        index: 'integrationWebhookEvent_webhookId_idx_16330c4e',
        columns: ['webhookId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'passwordReset',
        index: 'passwordReset_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'permission',
        index: 'permission_permissionGroupId_idx_b8807d0b',
        columns: ['permissionGroupId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'region',
        index: 'region_parentRegionId_idx_44adb8cc',
        columns: ['parentRegionId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'region',
        index: 'region_regionTypeId_idx_28af28ca',
        columns: ['regionTypeId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'rolePermission',
        index: 'rolePermission_permissionId_idx_f46fcdf5',
        columns: ['permissionId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'rolePermission',
        index: 'rolePermission_roleId_idx_ffccc9a4',
        columns: ['roleId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'session',
        index: 'session_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'tenant',
        index: 'tenant_tenantStatusId_idx_f6ab4890',
        columns: ['tenantStatusId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'tenant',
        index: 'tenant_tenantTypeId_idx_d1157510',
        columns: ['tenantTypeId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'tenantInvitation',
        index: 'tenantInvitation_invitedBy_idx_8266eaa5',
        columns: ['invitedBy'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'tenantInvitation',
        index: 'tenantInvitation_tenantId_idx_c93ed4f1',
        columns: ['tenantId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'tenantMembership',
        index: 'tenantMembership_invitedBy_idx_8266eaa5',
        columns: ['invitedBy'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'tenantMembership',
        index: 'tenantMembership_tenantId_idx_c93ed4f1',
        columns: ['tenantId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'tenantMembership',
        index: 'tenantMembership_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'userAuthProvider',
        index: 'userAuthProvider_authProviderId_idx_7bd3932e',
        columns: ['authProviderId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'userAuthProvider',
        index: 'userAuthProvider_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'userRoleAssignment',
        index: 'ura_scope_active_idx',
        columns: ['userId', 'scopeTypeId', 'scopeId', 'isActive'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'userRoleAssignment',
        index: 'userRoleAssignment_assignedBy_idx_5032fb8a',
        columns: ['assignedBy'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'userRoleAssignment',
        index: 'userRoleAssignment_roleId_idx_ffccc9a4',
        columns: ['roleId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'userRoleAssignment',
        index: 'userRoleAssignment_scopeTypeId_idx_bb7c90b3',
        columns: ['scopeTypeId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'userRoleAssignment',
        index: 'userRoleAssignment_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'workspace',
        index: 'workspace_tenantId_idx_c93ed4f1',
        columns: ['tenantId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'workspace',
        index: 'workspace_workspaceStatusId_idx_ea7f8745',
        columns: ['workspaceStatusId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'workspace',
        index: 'workspace_workspaceTypeId_idx_fd635322',
        columns: ['workspaceTypeId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'workspaceInvitation',
        index: 'workspaceInvitation_invitedBy_idx_8266eaa5',
        columns: ['invitedBy'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'workspaceInvitation',
        index: 'workspaceInvitation_workspaceId_idx_ba65f874',
        columns: ['workspaceId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'workspaceMembership',
        index: 'workspaceMembership_invitedBy_idx_8266eaa5',
        columns: ['invitedBy'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'workspaceMembership',
        index: 'workspaceMembership_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'workspaceMembership',
        index: 'workspaceMembership_workspaceId_idx_ba65f874',
        columns: ['workspaceId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'authEvent',
        foreignKey: {
          name: 'authEvent_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'authEvent',
        foreignKey: {
          name: 'authEvent_authEventTypeId_fkey',
          columns: ['authEventTypeId'],
          references: { schema: 'public', table: 'authEventType', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'crmCompany',
        foreignKey: {
          name: 'crmCompany_workspaceId_fkey',
          columns: ['workspaceId'],
          references: { schema: 'public', table: 'workspace', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'crmCompany',
        foreignKey: {
          name: 'crmCompany_countryRegionId_fkey',
          columns: ['countryRegionId'],
          references: { schema: 'public', table: 'region', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'crmContact',
        foreignKey: {
          name: 'crmContact_workspaceId_fkey',
          columns: ['workspaceId'],
          references: { schema: 'public', table: 'workspace', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'crmContact',
        foreignKey: {
          name: 'crmContact_companyId_fkey',
          columns: ['companyId'],
          references: { schema: 'public', table: 'crmCompany', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'crmContact',
        foreignKey: {
          name: 'crmContact_sourceId_fkey',
          columns: ['sourceId'],
          references: { schema: 'public', table: 'crmContactSource', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'crmContact',
        foreignKey: {
          name: 'crmContact_statusId_fkey',
          columns: ['statusId'],
          references: { schema: 'public', table: 'crmContactStatus', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'crmContact',
        foreignKey: {
          name: 'crmContact_ownerUserId_fkey',
          columns: ['ownerUserId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'crmContactTag',
        foreignKey: {
          name: 'crmContactTag_contactId_fkey',
          columns: ['contactId'],
          references: { schema: 'public', table: 'crmContact', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'crmContactTag',
        foreignKey: {
          name: 'crmContactTag_tagId_fkey',
          columns: ['tagId'],
          references: { schema: 'public', table: 'crmTag', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'crmTag',
        foreignKey: {
          name: 'crmTag_workspaceId_fkey',
          columns: ['workspaceId'],
          references: { schema: 'public', table: 'workspace', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'integrationChannel',
        foreignKey: {
          name: 'integrationChannel_providerId_fkey',
          columns: ['providerId'],
          references: { schema: 'public', table: 'integrationProvider', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'integrationConnection',
        foreignKey: {
          name: 'integrationConnection_tenantId_fkey',
          columns: ['tenantId'],
          references: { schema: 'public', table: 'tenant', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'integrationConnection',
        foreignKey: {
          name: 'integrationConnection_providerId_fkey',
          columns: ['providerId'],
          references: { schema: 'public', table: 'integrationProvider', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'integrationConnection',
        foreignKey: {
          name: 'integrationConnection_channelId_fkey',
          columns: ['channelId'],
          references: { schema: 'public', table: 'integrationChannel', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'integrationConnection',
        foreignKey: {
          name: 'integrationConnection_statusId_fkey',
          columns: ['statusId'],
          references: { schema: 'public', table: 'integrationConnectionStatus', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'integrationConnectionCredential',
        foreignKey: {
          name: 'integrationConnectionCredential_connectionId_fkey',
          columns: ['connectionId'],
          references: { schema: 'public', table: 'integrationConnection', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'integrationWebhook',
        foreignKey: {
          name: 'integrationWebhook_connectionId_fkey',
          columns: ['connectionId'],
          references: { schema: 'public', table: 'integrationConnection', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'integrationWebhook',
        foreignKey: {
          name: 'integrationWebhook_statusId_fkey',
          columns: ['statusId'],
          references: { schema: 'public', table: 'integrationWebhookStatus', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'integrationWebhookEvent',
        foreignKey: {
          name: 'integrationWebhookEvent_webhookId_fkey',
          columns: ['webhookId'],
          references: { schema: 'public', table: 'integrationWebhook', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'integrationWebhookEvent',
        foreignKey: {
          name: 'integrationWebhookEvent_statusId_fkey',
          columns: ['statusId'],
          references: { schema: 'public', table: 'integrationWebhookEventStatus', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'passwordReset',
        foreignKey: {
          name: 'passwordReset_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'permission',
        foreignKey: {
          name: 'permission_permissionGroupId_fkey',
          columns: ['permissionGroupId'],
          references: { schema: 'public', table: 'permissionGroup', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'region',
        foreignKey: {
          name: 'region_regionTypeId_fkey',
          columns: ['regionTypeId'],
          references: { schema: 'public', table: 'regionType', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'region',
        foreignKey: {
          name: 'region_parentRegionId_fkey',
          columns: ['parentRegionId'],
          references: { schema: 'public', table: 'region', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'rolePermission',
        foreignKey: {
          name: 'rolePermission_roleId_fkey',
          columns: ['roleId'],
          references: { schema: 'public', table: 'role', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'rolePermission',
        foreignKey: {
          name: 'rolePermission_permissionId_fkey',
          columns: ['permissionId'],
          references: { schema: 'public', table: 'permission', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'session',
        foreignKey: {
          name: 'session_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'tenant',
        foreignKey: {
          name: 'tenant_tenantTypeId_fkey',
          columns: ['tenantTypeId'],
          references: { schema: 'public', table: 'tenantType', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'tenant',
        foreignKey: {
          name: 'tenant_tenantStatusId_fkey',
          columns: ['tenantStatusId'],
          references: { schema: 'public', table: 'tenantStatus', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'tenantInvitation',
        foreignKey: {
          name: 'tenantInvitation_tenantId_fkey',
          columns: ['tenantId'],
          references: { schema: 'public', table: 'tenant', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'tenantInvitation',
        foreignKey: {
          name: 'tenantInvitation_invitedBy_fkey',
          columns: ['invitedBy'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'tenantMembership',
        foreignKey: {
          name: 'tenantMembership_tenantId_fkey',
          columns: ['tenantId'],
          references: { schema: 'public', table: 'tenant', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'tenantMembership',
        foreignKey: {
          name: 'tenantMembership_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'tenantMembership',
        foreignKey: {
          name: 'tenantMembership_invitedBy_fkey',
          columns: ['invitedBy'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'userAuthProvider',
        foreignKey: {
          name: 'userAuthProvider_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'userAuthProvider',
        foreignKey: {
          name: 'userAuthProvider_authProviderId_fkey',
          columns: ['authProviderId'],
          references: { schema: 'public', table: 'authProvider', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'userCredential',
        foreignKey: {
          name: 'userCredential_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'userRoleAssignment',
        foreignKey: {
          name: 'userRoleAssignment_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'userRoleAssignment',
        foreignKey: {
          name: 'userRoleAssignment_roleId_fkey',
          columns: ['roleId'],
          references: { schema: 'public', table: 'role', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'userRoleAssignment',
        foreignKey: {
          name: 'userRoleAssignment_scopeTypeId_fkey',
          columns: ['scopeTypeId'],
          references: { schema: 'public', table: 'scopeType', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'userRoleAssignment',
        foreignKey: {
          name: 'userRoleAssignment_assignedBy_fkey',
          columns: ['assignedBy'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'workspace',
        foreignKey: {
          name: 'workspace_tenantId_fkey',
          columns: ['tenantId'],
          references: { schema: 'public', table: 'tenant', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'workspace',
        foreignKey: {
          name: 'workspace_workspaceTypeId_fkey',
          columns: ['workspaceTypeId'],
          references: { schema: 'public', table: 'workspaceType', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'workspace',
        foreignKey: {
          name: 'workspace_workspaceStatusId_fkey',
          columns: ['workspaceStatusId'],
          references: { schema: 'public', table: 'workspaceStatus', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'workspaceInvitation',
        foreignKey: {
          name: 'workspaceInvitation_workspaceId_fkey',
          columns: ['workspaceId'],
          references: { schema: 'public', table: 'workspace', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'workspaceInvitation',
        foreignKey: {
          name: 'workspaceInvitation_invitedBy_fkey',
          columns: ['invitedBy'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'workspaceMembership',
        foreignKey: {
          name: 'workspaceMembership_workspaceId_fkey',
          columns: ['workspaceId'],
          references: { schema: 'public', table: 'workspace', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'workspaceMembership',
        foreignKey: {
          name: 'workspaceMembership_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'workspaceMembership',
        foreignKey: {
          name: 'workspaceMembership_invitedBy_fkey',
          columns: ['invitedBy'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
