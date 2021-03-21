export class StorageMock {
  private store: Map<string, string> = new Map();

  clear(): void {
    this.store.clear();
  }

  getItem(key:string): string | null {
    return this.store.get(key) || null;
  }

  setItem(key:string, value:string): void {
    this.store.set(key, value);
  }

  removeItem(key:string): void {
    this.store.delete(key);
  }
}
