// ─── AI-DOST Service Layer ───────────────────────────────
// The orchestrator: receives typed requests, calls the
// appropriate prompt builder, dispatches to the provider,
// and formats the response.
//
// Now supports two modes:
// 1. Legacy: direct prompt builders (backward compatible)
// 2. Contextual: enriched context → orchestrator pipeline

import { openRouterProvider, AiProviderError } from './openrouter.service.js';
import { assembleContext } from './context.assembler.js';
import {
  buildHintPrompt,
  buildExplainPrompt,
  buildDebugPrompt,
  buildConceptPrompt,
  orchestratePrompt,
} from '../prompts/index.js';
import { formatAiResponse, formatAiError } from '../utils/ai.formatter.js';
import { logger } from '../lib/logger.js';
import type {
  AiHintRequest,
  AiExplainRequest,
  AiDebugRequest,
  AiConceptRequest,
  AiRequestContext,
  AiResponse,
  PromptIntent,
  PromptParams,
  HintLevel,
} from '../types/ai.types.js';

// ─── AI Service ──────────────────────────────────────────

export const aiService = {
  /**
   * Progressive hint generation.
   * Levels: 1 = direction, 2 = concept, 3 = approach, 4 = pseudocode.
   */
  async getHint(request: AiHintRequest): Promise<AiResponse> {
    const startTime = Date.now();
    logger.info('AI-DOST: Generating hint', {
      problem: request.context.problemTitle,
      level: request.hintLevel,
      language: request.context.language,
    });

    try {
      const messages = buildHintPrompt(request.context, request.hintLevel);
      const raw = await openRouterProvider.complete(messages);
      return formatAiResponse(raw, 'hint', Date.now() - startTime);
    } catch (error) {
      return handleServiceError(error, 'hint');
    }
  },

  /**
   * Code explanation — step-by-step walkthrough adapted to difficulty.
   */
  async explainCode(request: AiExplainRequest): Promise<AiResponse> {
    const startTime = Date.now();
    logger.info('AI-DOST: Explaining code', {
      problem: request.context.problemTitle,
      language: request.context.language,
    });

    try {
      const messages = buildExplainPrompt(request.context);
      const raw = await openRouterProvider.complete(messages);
      return formatAiResponse(raw, 'explain', Date.now() - startTime);
    } catch (error) {
      return handleServiceError(error, 'explain');
    }
  },

  /**
   * Debugging assistance — analyzes failing tests, guides toward fix.
   */
  async debugCode(request: AiDebugRequest): Promise<AiResponse> {
    const startTime = Date.now();
    logger.info('AI-DOST: Debugging assistance', {
      problem: request.context.problemTitle,
      failingTests: request.testResults.filter((t) => !t.passed).length,
    });

    try {
      const messages = buildDebugPrompt(request.context, request.testResults);
      const raw = await openRouterProvider.complete(messages);
      return formatAiResponse(raw, 'debug', Date.now() - startTime);
    } catch (error) {
      return handleServiceError(error, 'debug');
    }
  },

  /**
   * Concept teaching — explains DSA concepts with analogies.
   */
  async explainConcept(request: AiConceptRequest): Promise<AiResponse> {
    const startTime = Date.now();
    logger.info('AI-DOST: Explaining concept', {
      problem: request.context.problemTitle,
      concept: request.concept || 'auto-detect',
    });

    try {
      const messages = buildConceptPrompt(request.context, request.concept);
      const raw = await openRouterProvider.complete(messages);
      return formatAiResponse(raw, 'concept', Date.now() - startTime);
    } catch (error) {
      return handleServiceError(error, 'concept');
    }
  },

  // ─── Contextual Orchestration Pipeline ───────────────────

  /**
   * Contextual hint generation via the enriched orchestration pipeline.
   * Runs code analysis → context assembly → prompt orchestration → provider.
   * Produces higher-quality, context-aware responses.
   */
  async getContextualHint(request: AiHintRequest): Promise<AiResponse> {
    const startTime = Date.now();
    logger.info('AI-DOST: Contextual hint generation', {
      problem: request.context.problemTitle,
      level: request.hintLevel,
      language: request.context.language,
    });

    try {
      // 1. Enrich the context with code analysis
      const enriched = assembleContext(request.context);

      logger.debug('Context enrichment complete', {
        progressLevel: enriched.analysis.progressLevel,
        patterns: enriched.analysis.detectedPatterns,
        issues: enriched.analysis.potentialIssues.length,
        failurePattern: enriched.failurePattern?.patternDescription,
      });

      // 2. Orchestrate the prompt
      const messages = orchestratePrompt('hint', enriched, {
        hintLevel: request.hintLevel,
      });

      logger.debug('Outgoing AI payload and analyzer snapshot', {
        messages: JSON.stringify(messages),
        analysisSnapshot: JSON.stringify(enriched.analysis)
      });

      // 3. Send to provider
      const raw = await openRouterProvider.complete(messages);

      return formatAiResponse(raw, 'hint', Date.now() - startTime);
    } catch (error) {
      return handleServiceError(error, 'contextual-hint');
    }
  },

  /**
   * Generic contextual AI interaction via the orchestration pipeline.
   * Supports any intent type with enriched context analysis.
   */
  async contextualInteraction(
    context: AiRequestContext,
    intent: PromptIntent,
    params?: PromptParams
  ): Promise<AiResponse> {
    const startTime = Date.now();
    const promptType = intent;

    logger.info(`AI-DOST: Contextual ${intent}`, {
      problem: context.problemTitle,
      language: context.language,
      intent,
    });

    try {
      // 1. Enrich the context
      const enriched = assembleContext(context);

      // 2. Orchestrate the prompt
      const messages = orchestratePrompt(intent, enriched, params);

      // 3. Send to provider
      const raw = await openRouterProvider.complete(messages);

      return formatAiResponse(raw, promptType, Date.now() - startTime);
    } catch (error) {
      return handleServiceError(error, `contextual-${intent}`);
    }
  },
};

// ─── Error Handler ───────────────────────────────────────

function handleServiceError(error: unknown, promptType: string): AiResponse {
  if (error instanceof AiProviderError) {
    logger.error(`AI-DOST ${promptType} provider error`, {
      message: error.message,
      statusCode: error.statusCode,
      retryable: error.isRetryable,
    });
    return formatAiError(error.message);
  }

  const message = error instanceof Error ? error.message : 'Unexpected AI service error';
  const stack = error instanceof Error ? error.stack : undefined;
  logger.error(`AI-DOST ${promptType} unexpected error`, { message, stack });
  
  // Replace vague 502 responses with detailed diagnostics for debugging
  return formatAiError(`Detailed Diagnostic Error: ${message}\nStack: ${stack}`);
}
