// ─── OpenRouter Provider Service ─────────────────────────
// Handles all communication with the OpenRouter API.
// Designed as a provider abstraction — can be swapped for
// any other LLM provider implementing the same interface.

import axios, { AxiosError } from 'axios';
import { aiConfig } from '../config/ai.config.js';
import { logger } from '../lib/logger.js';
import type { PromptMessage, AiProviderResponse } from '../types/ai.types.js';

// ─── Error Types ─────────────────────────────────────────

export class AiProviderError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public isRetryable: boolean = false
  ) {
    super(message);
    this.name = 'AiProviderError';
  }
}

// ─── Provider Interface ──────────────────────────────────
// Future providers (OpenAI, Gemini, local) implement this.

export interface IAiProvider {
  complete(messages: PromptMessage[]): Promise<AiProviderResponse>;
}

// ─── OpenRouter Implementation ───────────────────────────

class OpenRouterProvider implements IAiProvider {
  /**
   * Sends a chat completion request to OpenRouter.
   * Returns typed provider response with content, model, and token usage.
   */
  async complete(messages: PromptMessage[]): Promise<AiProviderResponse> {
    const config = aiConfig.provider;

    if (!config.headers['Authorization']) {
      throw new AiProviderError(
        'OPENROUTER_API_KEY is not configured. Set it in your .env file.',
        503,
        false
      );
    }

    logger.debug('OpenRouter request', {
      model: config.model,
      messageCount: messages.length,
    });

    let safeMessages = messages;
    let promptLength = safeMessages.reduce((acc, m) => acc + m.content.length, 0);
    let serializedMessages = JSON.stringify(safeMessages);

    // Final payload protection: hard cap lengths to prevent token overflows
    if (promptLength > 20000 || serializedMessages.length > 25000) {
      safeMessages = safeMessages.map(m => {
        if (m.content.length > 5000) {
          return { ...m, content: m.content.substring(0, 5000) + '\n...[TRUNCATED FOR SIZE]' };
        }
        return m;
      });
      promptLength = safeMessages.reduce((acc, m) => acc + m.content.length, 0);
      serializedMessages = JSON.stringify(safeMessages);
    }

    console.log("=== AI-DOST REQUEST ===");
    console.log("Prompt length:", promptLength);
    console.log("Messages size:", serializedMessages.length);
    console.log("Model:", config.model);

    try {
      const response = await axios.post(
        config.apiUrl,
        {
          model: config.model,
          messages: safeMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          max_tokens: config.maxTokens,
          temperature: config.temperature,
        },
        {
          headers: config.headers,
          timeout: 30_000, // 30 second timeout
        }
      );

      const choice = response.data?.choices?.[0];
      if (!choice?.message?.content) {
        throw new AiProviderError(
          'OpenRouter returned an empty response.',
          502,
          true
        );
      }

      const tokensUsed =
        (response.data?.usage?.prompt_tokens || 0) +
        (response.data?.usage?.completion_tokens || 0);

      logger.debug('OpenRouter response received', {
        model: response.data?.model || config.model,
        tokensUsed,
      });

      return {
        content: choice.message.content,
        model: response.data?.model || config.model,
        tokensUsed,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Maps axios/network errors to typed AiProviderError.
   */
  private handleError(error: unknown): AiProviderError {
    if (error instanceof AiProviderError) {
      return error;
    }

    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const data = error.response?.data;

      console.error("AI PROVIDER ERROR:", error);
      console.error("MESSAGE:", error.message);
      console.error("RESPONSE:", data);

      // Rate limited
      if (status === 429) {
        logger.warn('OpenRouter rate limited');
        return new AiProviderError(
          'AI service is temporarily rate limited. Please try again in a moment.',
          429,
          true
        );
      }

      // Auth error
      if (status === 401 || status === 403) {
        logger.error('OpenRouter auth error', { status });
        return new AiProviderError(
          'AI service authentication failed. Check your API key.',
          503,
          false
        );
      }

      // Model not found / bad request
      if (status === 400) {
        const errorMessage = data?.error?.message || 'Bad request to AI provider';
        logger.error('OpenRouter bad request', { 
          message: errorMessage,
          responseData: data,
          requestPayload: error.config?.data
        });
        return new AiProviderError(errorMessage, 400, false);
      }

      // Timeout
      if (error.code === 'ECONNABORTED') {
        logger.warn('OpenRouter request timeout');
        return new AiProviderError(
          'AI service timed out. The model may be overloaded.',
          504,
          true
        );
      }

      // Network error
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        logger.error('OpenRouter network error', { code: error.code });
        return new AiProviderError(
          'Cannot reach AI service. Check your network connection.',
          503,
          true
        );
      }

      // Generic API error
      logger.error('OpenRouter unknown API error', {
        status,
        message: error.message,
      });
      return new AiProviderError(
        `AI provider error: ${error.message}`,
        status || 500,
        true
      );
    }

    // Unknown error
    const message = error instanceof Error ? error.message : 'Unknown AI provider error';
    logger.error('OpenRouter unexpected error', { message });
    return new AiProviderError(message, 500, false);
  }
}

// ─── Singleton Export ────────────────────────────────────

export const openRouterProvider: IAiProvider = new OpenRouterProvider();
