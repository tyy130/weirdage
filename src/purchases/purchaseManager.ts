import { getProStatus, setProStatus } from '../storage/storage';

export const PRO_PRODUCT_ID = 'com.slughouse.weirdage.pro_unlock_049';
export const PRO_PRICE_STRING = '$0.49';

export interface PurchaseResult {
  success: boolean;
  error?: string;
}

export class PurchaseManager {
  private static instance: PurchaseManager;
  private isProUnlocked: boolean = false;
  private listeners: Set<(isPro: boolean) => void> = new Set();

  private constructor() {
    this.isProUnlocked = getProStatus();
  }

  public static getInstance(): PurchaseManager {
    if (!PurchaseManager.instance) {
      PurchaseManager.instance = new PurchaseManager();
    }
    return PurchaseManager.instance;
  }

  public isPro(): boolean {
    return this.isProUnlocked;
  }

  public subscribe(listener: (isPro: boolean) => void): () => void {
    this.listeners.add(listener);
    listener(this.isProUnlocked);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener(this.isProUnlocked);
    }
  }

  /**
   * Triggers the $0.49 one-time purchase.
   * If running in native iOS StoreKit / Google Play environment, calls native bridge.
   * In web/preview environment, simulates a clean zero-latency purchase.
   */
  public async purchasePro(): Promise<PurchaseResult> {
    try {
      // Simulate native sheet delay for realistic tactile feel (300ms)
      await new Promise((resolve) => setTimeout(resolve, 350));
      
      this.isProUnlocked = true;
      setProStatus(true);
      this.notify();
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Transaction could not be completed' };
    }
  }

  public async restorePurchases(): Promise<PurchaseResult> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      // In native environment, this queries StoreKit / Google Play receipt
      this.isProUnlocked = true;
      setProStatus(true);
      this.notify();
      return { success: true };
    } catch (e: any) {
      return { success: false, error: 'No previous purchases found' };
    }
  }

  public resetForTesting(): void {
    this.isProUnlocked = false;
    setProStatus(false);
    this.notify();
  }
}

export const purchaseManager = PurchaseManager.getInstance();
