const KEY = "chillcharge_receipts";

export function getReceipts() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function addReceipt(receipt) {
  const list = getReceipts();
  list.unshift(receipt);
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, 100)));
}

export function clearReceipts() {
  localStorage.removeItem(KEY);
}