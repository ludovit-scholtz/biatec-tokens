import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useTokenStore } from './tokens';

describe('Token Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should initialize with empty tokens array', () => {
    const store = useTokenStore();
    
    expect(store.tokens).toEqual([]);
    expect(store.totalTokens).toBe(0);
    expect(store.deployedTokens).toBe(0);
    expect(store.failedTokens).toBe(0);
  });

  it('should have 8 token standards available', () => {
    const store = useTokenStore();
    
    expect(store.tokenStandards).toHaveLength(8);
    expect(store.tokenStandards.map(s => s.name)).toContain('ASA');
    expect(store.tokenStandards.map(s => s.name)).toContain('ARC200');
    expect(store.tokenStandards.map(s => s.name)).toContain('ARC72');
  });

  it('should create token with valid data', async () => {
    const store = useTokenStore();
    
    const tokenData = {
      name: 'Test Token',
      symbol: 'TEST',
      standard: 'ASA' as const,
      type: 'FT' as const,
      supply: 1000000,
      decimals: 6,
      description: 'A test token',
    };
    
    const token = await store.createToken(tokenData);
    
    expect(token).toBeDefined();
    expect(token.name).toBe('Test Token');
    expect(token.symbol).toBe('TEST');
    expect(token.status).toBe('deployed');
    expect(store.tokens).toHaveLength(1);
    expect(store.totalTokens).toBe(1);
  });

  it('should update token counts correctly', async () => {
    const store = useTokenStore();
    
    await store.createToken({
      name: 'Token 1',
      symbol: 'TK1',
      standard: 'ASA' as const,
      type: 'FT' as const,
      supply: 1000,
      description: 'Token 1',
    });
    
    await store.createToken({
      name: 'Token 2',
      symbol: 'TK2',
      standard: 'ARC200' as const,
      type: 'FT' as const,
      supply: 2000,
      description: 'Token 2',
    });
    
    expect(store.totalTokens).toBe(2);
    expect(store.deployedTokens).toBe(2);
  });

  it('should delete token by id', async () => {
    const store = useTokenStore();
    
    const token = await store.createToken({
      name: 'Test Token',
      symbol: 'TEST',
      standard: 'ASA' as const,
      type: 'FT' as const,
      supply: 1000,
      description: 'Test',
    });
    
    expect(store.totalTokens).toBe(1);
    
    store.deleteToken(token.id);
    
    expect(store.totalTokens).toBe(0);
    expect(store.tokens).toHaveLength(0);
  });

  it('should update token status', async () => {
    const store = useTokenStore();
    
    const token = await store.createToken({
      name: 'Test Token',
      symbol: 'TEST',
      standard: 'ASA' as const,
      type: 'FT' as const,
      supply: 1000,
      description: 'Test',
    });
    
    store.updateTokenStatus(token.id, 'failed');
    
    expect(store.tokens[0].status).toBe('failed');
    expect(store.failedTokens).toBe(1);
    expect(store.deployedTokens).toBe(0);
  });

  it('should group tokens by standard', async () => {
    const store = useTokenStore();
    
    await store.createToken({
      name: 'ASA Token',
      symbol: 'ASA1',
      standard: 'ASA' as const,
      type: 'FT' as const,
      supply: 1000,
      description: 'ASA Token',
    });
    
    await store.createToken({
      name: 'ARC200 Token',
      symbol: 'ARC1',
      standard: 'ARC200' as const,
      type: 'FT' as const,
      supply: 2000,
      description: 'ARC200 Token',
    });
    
    const grouped = store.tokensByStandard;
    
    expect(grouped['ASA']).toHaveLength(1);
    expect(grouped['ARC200']).toHaveLength(1);
  });
});
