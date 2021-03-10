export class StorageMock {
  private store: Map<string, string> = new Map();

  clear() {
    this.store.clear();
  }

  getItem(key:string) {
    return this.store.get(key) || null;
  }

  setItem(key:string, value:string) {
    this.store.set(key, value);
  }

  removeItem(key:string) {
    this.store.delete(key);
  }
};
