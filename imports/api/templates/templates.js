import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

class TemplatesCollection extends Mongo.Collection {}

export const Templates = new TemplatesCollection('templates');

Templates.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Templates.schema = new SimpleSchema({
  owner: {
    type: String,
    label: 'Owner'
  },
  name: {
    type: String,
    label: 'Template name'
  },
  companyId: {
    type: String,
    label: 'Company',
    defaultValue: '',
    optional: true,
  },
  activities: {
    type: Array,
    defaultValue: [],
    optional: true,
  },
  'activities.$': {
    type: String,
    optional: true,
  },
  stakeHolders: {
    type: Array,
    defaultValue: [],
    label: 'template StakeHolders',
    optional: true
  },
  'stakeHolders.$': {
    type: String,
    optional: true
  },
  vision: {
    type: Array,
    defaultValue: [],
    label: 'template vision',
    optional: true
  },
  'vision.$': {
    type: String,
    optional: true,
  },
  objectives: {
    type: Array,
    defaultValue: [],
    label: 'template vision',
    optional: true,
  },
  'objectives.$': {
    type: String,
    optional: true,
  },
  impacts: {
    type: Array,
    defaultValue: [],
    label: 'template impacts',
  },
  'impacts.$': {
    type: Object,
    blackbox: true,
  },
  benefits: {
    type: Array,
    defaultValue: [],
    label: 'template benefits',
  },
  'benefits.$': {
    type: Object,
    blackbox: true,
  },
  risks: {
    type: Array,
    defaultValue: [],
    label: 'template risks',
  },
  'risks.$': {
    type: Object,
    blackbox: true,
  },
});

Templates.attachSchema(Templates.schema);

Templates.publicFields = {
  name: 1
};