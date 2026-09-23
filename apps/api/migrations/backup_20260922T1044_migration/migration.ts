#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/98f0ef2366fad2de91c2eca3d39ff049ca7b65c0c69dc3f1d52b3f42f31dedc9/contract';
import startContract from '../../snapshots/98f0ef2366fad2de91c2eca3d39ff049ca7b65c0c69dc3f1d52b3f42f31dedc9/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/9bdc0b1dd008c0ec09d0d9cb884431c76d4a05ca51453767e38236c5dc6e6fa5/contract';
import endContract from '../../snapshots/9bdc0b1dd008c0ec09d0d9cb884431c76d4a05ca51453767e38236c5dc6e6fa5/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
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
        index: 'socialInboxConversation_externalConversationId_idx_685c596f',
        columns: ['externalConversationId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'socialInboxConversation',
        index: 'socialInboxConversation_isArchived_idx_fd07763a',
        columns: ['isArchived'],
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
        index: 'socialInboxConversationAssignment_assignedAt_idx_eb36d59d',
        columns: ['assignedAt'],
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
      this.addForeignKey({
        schema: 'public',
        table: 'socialInboxConversation',
        foreignKey: {
          name: 'socialInboxConversation_connectionId_fkey',
          columns: ['connectionId'],
          references: { schema: 'public', table: 'integrationConnection', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'socialInboxConversation',
        foreignKey: {
          name: 'socialInboxConversation_contactId_fkey',
          columns: ['contactId'],
          references: { schema: 'public', table: 'crmContact', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'socialInboxConversation',
        foreignKey: {
          name: 'socialInboxConversation_statusId_fkey',
          columns: ['statusId'],
          references: { schema: 'public', table: 'socialInboxConversationStatus', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'socialInboxConversationAssignment',
        foreignKey: {
          name: 'socialInboxConversationAssignment_conversationId_fkey',
          columns: ['conversationId'],
          references: { schema: 'public', table: 'socialInboxConversation', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'socialInboxConversationAssignment',
        foreignKey: {
          name: 'socialInboxConversationAssignment_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'socialInboxConversationAssignment',
        foreignKey: {
          name: 'socialInboxConversationAssignment_assignedByUserId_fkey',
          columns: ['assignedByUserId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'socialInboxConversationRead',
        foreignKey: {
          name: 'socialInboxConversationRead_conversationId_fkey',
          columns: ['conversationId'],
          references: { schema: 'public', table: 'socialInboxConversation', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'socialInboxConversationRead',
        foreignKey: {
          name: 'socialInboxConversationRead_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'socialInboxConversationRead',
        foreignKey: {
          name: 'socialInboxConversationRead_lastReadMessageId_fkey',
          columns: ['lastReadMessageId'],
          references: { schema: 'public', table: 'socialInboxMessage', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'socialInboxConversationTag',
        foreignKey: {
          name: 'socialInboxConversationTag_conversationId_fkey',
          columns: ['conversationId'],
          references: { schema: 'public', table: 'socialInboxConversation', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'socialInboxConversationTag',
        foreignKey: {
          name: 'socialInboxConversationTag_tagId_fkey',
          columns: ['tagId'],
          references: { schema: 'public', table: 'crmTag', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'socialInboxMessage',
        foreignKey: {
          name: 'socialInboxMessage_conversationId_fkey',
          columns: ['conversationId'],
          references: { schema: 'public', table: 'socialInboxConversation', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'socialInboxMessage',
        foreignKey: {
          name: 'socialInboxMessage_replyToMessageId_fkey',
          columns: ['replyToMessageId'],
          references: { schema: 'public', table: 'socialInboxMessage', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'socialInboxMessage',
        foreignKey: {
          name: 'socialInboxMessage_senderContactId_fkey',
          columns: ['senderContactId'],
          references: { schema: 'public', table: 'crmContact', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'socialInboxMessage',
        foreignKey: {
          name: 'socialInboxMessage_senderUserId_fkey',
          columns: ['senderUserId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'socialInboxMessage',
        foreignKey: {
          name: 'socialInboxMessage_messageTypeId_fkey',
          columns: ['messageTypeId'],
          references: { schema: 'public', table: 'socialInboxMessageType', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'socialInboxMessage',
        foreignKey: {
          name: 'socialInboxMessage_statusId_fkey',
          columns: ['statusId'],
          references: { schema: 'public', table: 'socialInboxMessageStatus', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
