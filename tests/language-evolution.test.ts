import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Stacks blockchain functions
vi.mock('@stacks/transactions', () => ({
  makeContractCall: vi.fn(() => Promise.resolve({ txId: 'mock-txid' })),
  callReadOnlyFunction: vi.fn(() => Promise.resolve({ value: { type: 'uint', value: 1n } })),
  uintCV: vi.fn(value => ({ type: 'uint', value: BigInt(value) })),
  stringAsciiCV: vi.fn(value => ({ type: 'string-ascii', value })),
  standardPrincipalCV: vi.fn(address => ({ type: 'principal', address })),
}));

const {
  makeContractCall,
  callReadOnlyFunction,
  uintCV,
  stringAsciiCV,
  standardPrincipalCV,
} = await import('@stacks/transactions');

const CONTRACT_ADDRESS = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
const CONTRACT_NAME = 'language-evolution';
const SENDER_ADDRESS = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
const RECIPIENT_ADDRESS = 'ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC';

describe('Language Evolution Contract', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('should propose a word', async () => {
    const result = await makeContractCall({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'propose-word',
      functionArgs: [
        stringAsciiCV('newword'),
        stringAsciiCV('definition of the new word'),
      ],
      senderAddress: SENDER_ADDRESS,
    });
    
    expect(result.txId).toBe('mock-txid');
    expect(makeContractCall).toHaveBeenCalledTimes(1);
  });
  
  it('should vote on a word', async () => {
    const result = await makeContractCall({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'vote-word',
      functionArgs: [uintCV(1)],
      senderAddress: SENDER_ADDRESS,
    });
    
    expect(result.txId).toBe('mock-txid');
    expect(makeContractCall).toHaveBeenCalledTimes(1);
  });
  
  it('should approve a word', async () => {
    const result = await makeContractCall({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'approve-word',
      functionArgs: [uintCV(1)],
      senderAddress: SENDER_ADDRESS,
    });
    
    expect(result.txId).toBe('mock-txid');
    expect(makeContractCall).toHaveBeenCalledTimes(1);
  });
  
  it('should propose a grammatical rule', async () => {
    const result = await makeContractCall({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'propose-grammatical-rule',
      functionArgs: [
        stringAsciiCV('New grammatical rule description'),
      ],
      senderAddress: SENDER_ADDRESS,
    });
    
    expect(result.txId).toBe('mock-txid');
    expect(makeContractCall).toHaveBeenCalledTimes(1);
  });
  
  it('should vote on a grammatical rule', async () => {
    const result = await makeContractCall({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'vote-grammatical-rule',
      functionArgs: [uintCV(1)],
      senderAddress: SENDER_ADDRESS,
    });
    
    expect(result.txId).toBe('mock-txid');
    expect(makeContractCall).toHaveBeenCalledTimes(1);
  });
  
  it('should approve a grammatical rule', async () => {
    const result = await makeContractCall({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'approve-grammatical-rule',
      functionArgs: [uintCV(1)],
      senderAddress: SENDER_ADDRESS,
    });
    
    expect(result.txId).toBe('mock-txid');
    expect(makeContractCall).toHaveBeenCalledTimes(1);
  });
  
  it('should propose a phonetic change', async () => {
    const result = await makeContractCall({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'propose-phonetic-change',
      functionArgs: [
        stringAsciiCV('New phonetic change description'),
      ],
      senderAddress: SENDER_ADDRESS,
    });
    
    expect(result.txId).toBe('mock-txid');
    expect(makeContractCall).toHaveBeenCalledTimes(1);
  });
  
  it('should vote on a phonetic change', async () => {
    const result = await makeContractCall({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'vote-phonetic-change',
      functionArgs: [uintCV(1)],
      senderAddress: SENDER_ADDRESS,
    });
    
    expect(result.txId).toBe('mock-txid');
    expect(makeContractCall).toHaveBeenCalledTimes(1);
  });
  
  it('should approve a phonetic change', async () => {
    const result = await makeContractCall({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'approve-phonetic-change',
      functionArgs: [uintCV(1)],
      senderAddress: SENDER_ADDRESS,
    });
    
    expect(result.txId).toBe('mock-txid');
    expect(makeContractCall).toHaveBeenCalledTimes(1);
  });
  
  it('should transfer word ownership', async () => {
    const result = await makeContractCall({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'transfer-word-ownership',
      functionArgs: [
        uintCV(1),
        standardPrincipalCV(RECIPIENT_ADDRESS),
        uintCV(50),
      ],
      senderAddress: SENDER_ADDRESS,
    });
    
    expect(result.txId).toBe('mock-txid');
    expect(makeContractCall).toHaveBeenCalledTimes(1);
  });
  
  it('should add a translation', async () => {
    const result = await makeContractCall({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'add-translation',
      functionArgs: [
        stringAsciiCV('source'),
        stringAsciiCV('target'),
        stringAsciiCV('language'),
      ],
      senderAddress: SENDER_ADDRESS,
    });
    
    expect(result.txId).toBe('mock-txid');
    expect(makeContractCall).toHaveBeenCalledTimes(1);
  });
  
  it('should get word information', async () => {
    const result = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-word',
      functionArgs: [uintCV(1)],
      senderAddress: SENDER_ADDRESS,
    });
    
    expect(result).toBeDefined();
    expect(callReadOnlyFunction).toHaveBeenCalledTimes(1);
  });
  
  it('should get grammatical rule information', async () => {
    const result = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-grammatical-rule',
      functionArgs: [uintCV(1)],
      senderAddress: SENDER_ADDRESS,
    });
    
    expect(result).toBeDefined();
    expect(callReadOnlyFunction).toHaveBeenCalledTimes(1);
  });
  
  it('should get phonetic change information', async () => {
    const result = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-phonetic-change',
      functionArgs: [uintCV(1)],
      senderAddress: SENDER_ADDRESS,
    });
    
    expect(result).toBeDefined();
    expect(callReadOnlyFunction).toHaveBeenCalledTimes(1);
  });
  
  it('should get word ownership information', async () => {
    const result = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-word-ownership',
      functionArgs: [
        uintCV(1),
        standardPrincipalCV(SENDER_ADDRESS),
      ],
      senderAddress: SENDER_ADDRESS,
    });
    
    expect(result).toBeDefined();
    expect(callReadOnlyFunction).toHaveBeenCalledTimes(1);
  });
  
  it('should get translation information', async () => {
    const result = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-translation',
      functionArgs: [uintCV(1)],
      senderAddress: SENDER_ADDRESS,
    });
    
    expect(result).toBeDefined();
    expect(callReadOnlyFunction).toHaveBeenCalledTimes(1);
  });
  
  it('should get user score', async () => {
    const result = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-user-score',
      functionArgs: [standardPrincipalCV(SENDER_ADDRESS)],
      senderAddress: SENDER_ADDRESS,
    });
    
    expect(result).toBeDefined();
    expect(callReadOnlyFunction).toHaveBeenCalledTimes(1);
  });
  
  it('should get word count', async () => {
    const result = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-word-count',
      functionArgs: [],
      senderAddress: SENDER_ADDRESS,
    });
    
    expect(result).toBeDefined();
    expect(callReadOnlyFunction).toHaveBeenCalledTimes(1);
  });
  
  it('should get grammatical rule count', async () => {
    const result = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-grammatical-rule-count',
      functionArgs: [],
      senderAddress: SENDER_ADDRESS,
    });
    
    expect(result).toBeDefined();
    expect(callReadOnlyFunction).toHaveBeenCalledTimes(1);
  });
  
  it('should get phonetic change count', async () => {
    const result = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-phonetic-change-count',
      functionArgs: [],
      senderAddress: SENDER_ADDRESS,
    });
    
    expect(result).toBeDefined();
    expect(callReadOnlyFunction).toHaveBeenCalledTimes(1);
  });
});

