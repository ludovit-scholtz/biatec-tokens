import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from './auth';

describe('Auth Store', () => {
  beforeEach(() => {
    // Create a new pinia instance for each test
    setActivePinia(createPinia());
    localStorage.clear();
  });

  it('should initialize with null user and not connected', () => {
    const store = useAuthStore();
    
    expect(store.user).toBeNull();
    expect(store.isConnected).toBe(false);
    expect(store.isAuthenticated).toBe(false);
  });

  it('should connect wallet with valid address', async () => {
    const store = useAuthStore();
    const walletAddress = 'ALGO123456789ABCDEF';
    
    await store.connectWallet(walletAddress);
    
    expect(store.user).not.toBeNull();
    expect(store.user?.address).toBe(walletAddress);
    expect(store.isConnected).toBe(true);
    expect(store.isAuthenticated).toBe(true);
  });

  it('should save user to localStorage on connect', async () => {
    const store = useAuthStore();
    const walletAddress = 'ALGO123456789ABCDEF';
    
    await store.connectWallet(walletAddress);
    
    const savedData = localStorage.getItem('algorand_user');
    expect(savedData).toBeTruthy();
    expect(savedData).toContain(walletAddress);
  });

  it('should sign out and clear state', async () => {
    const store = useAuthStore();
    
    // First connect
    await store.connectWallet('ALGO123456789ABCDEF');
    expect(store.isAuthenticated).toBe(true);
    
    // Then sign out
    await store.signOut();
    
    expect(store.user).toBeNull();
    expect(store.isConnected).toBe(false);
    expect(store.isAuthenticated).toBe(false);
  });

  it('should initialize from localStorage if user was saved', async () => {
    const savedUser = {
      address: 'ALGO123456789ABCDEF',
      name: 'Test User',
    };
    
    localStorage.setItem('algorand_user', JSON.stringify(savedUser));
    
    const store = useAuthStore();
    await store.initialize();
    
    expect(store.user).toEqual(savedUser);
    expect(store.isConnected).toBe(true);
    expect(store.isAuthenticated).toBe(true);
  });

  it('should update user information', async () => {
    const store = useAuthStore();
    await store.connectWallet('ALGO123456789ABCDEF');
    
    store.updateUser({ name: 'Updated Name', email: 'test@example.com' });
    
    expect(store.user?.name).toBe('Updated Name');
    expect(store.user?.email).toBe('test@example.com');
  });
});
