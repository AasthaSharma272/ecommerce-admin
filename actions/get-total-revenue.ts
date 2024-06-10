import prismadb from "@/lib/prismadb"

/**
 * Retrieves the total revenue generated by paid orders for a specific store.
 * @param storeId The ID of the store for which total revenue is to be retrieved.
 * @returns The total revenue generated by paid orders for the specified store.
 */
export const getTotalRevenue = async (storeId: string) => {
    // Fetching paid orders with associated products from the database
    const paidOrders = await prismadb.order.findMany({
        where: {
            storeId,
            isPaid: true
        },
        include: {
            orderItems: {
                include: {
                    product: true
                }
            }
        }
    });

    // Calculating the total revenue from all paid orders
    const totalRevenue = paidOrders.reduce((total, order) => {
        // Calculating the total revenue for each order
        const orderTotal = order.orderItems.reduce((orderSum, item) => {
            return orderSum = item.product.price.toNumber();
        }, 0);

        return total + orderTotal; // Accumulating total revenue
    }, 0);

    return totalRevenue;
}