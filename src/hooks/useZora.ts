import { useState } from 'react';
import { usePublicClient, useWalletClient, useWriteContract, useSimulateContract } from 'wagmi';
import { createContentCoin, extractCoinAddressFromReceipt } from '@/lib/zora';
import { createCoinCall } from "@zoralabs/coins-sdk";
import type { CoinDetails, CreateCoinParams } from '@/types/zora';
import useSWR from 'swr';
import { Address } from 'viem';

// 空のコインデータ配列
const emptyCoins: CoinDetails[] = [];

// データフェッチャー関数
const coinsFetcher = async (url: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.status}`);
    }
    const data = await response.json();
    return data.coins || [];
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error);
    // エラー時のモックデータ
    return getMockCoins(url);
  }
};

// エラー時のモックデータを返す関数
function getMockCoins(url: string): CoinDetails[] {
  // URLに基づいて適切なモックデータを返す
  if (url.includes('trending')) {
    return [
      {
        id: '1',
        name: 'TrendCoin',
        description: 'A trending example coin',
        address: '0x1234567890123456789012345678901234567890',
        symbol: 'TREND',
        createdAt: new Date().
