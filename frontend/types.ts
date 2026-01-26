import React from 'react';

export enum UserRole {
  ADMIN = 'ADMIN',
  DEVELOPER = 'DEVELOPER',
  VIEWER = 'VIEWER'
}

export interface KPICardProps {
  title: string;
  value: string;
  trend: number; // percentage
  trendLabel: string;
  icon: React.ReactNode;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  caller: string;
  model: string;
  tokensPrompt: number;
  tokensCompletion: number;
  latency: number;
  status: 'success' | 'failed' | 'blocked';
  errorMessage?: string;
}

export interface AlertEntry {
  id: string;
  timestamp: string;
  type: string;
  severity: 'high' | 'medium' | 'low';
  rule: string;
  status: 'pending' | 'confirmed' | 'ignored';
}

export interface PromptVersion {
  id: string;
  version: string;
  content: string; // System prompt
  userTemplate: string;
  updatedAt: string;
  updatedBy: string;
}

export interface Prompt {
  id: string;
  name: string;
  description: string;
  tags: string[];
  businessLine: string; 
  model: string;
  isActive: boolean;
  securityLevel: 'internal' | 'public';
  versions: PromptVersion[];
  currentVersionId: string;
  callCount7Days: number;
  createdAt: string;
  creator: string;
  lastModifiedAt: string;
  lastModifier: string;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  timestamp?: string;
}

export interface PromptRunHistory {
  id: string;
  timestamp: string;
  caller: string;
  environment: 'Prod' | 'Staging' | 'Dev';
  tokensTotal: number;
  tokensPrompt: number;
  tokensCompletion: number;
  hasAlert: boolean;
  latency: number;
  messages: ChatMessage[];
}