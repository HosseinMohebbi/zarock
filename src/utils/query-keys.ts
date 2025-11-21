export const queryKeys = {
    items: (businessId: string) => ["items", businessId],
    item: (businessId: string, itemId: string) => ["item", businessId, itemId],
}