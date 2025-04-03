export const TransactionStatus = {
    // Top-up transaction statuses
    PENDING: "PENDING",
    FAILED: "FAILED",
    SUCCESS: "SUCCESS",
    // Subscription payment transaction statuses
    SCHEDULED: "SCHEDULED",
    PAID: "PAID",
    OVERDUE: "OVERDUE",
    EXPIRED: "EXPIRED"
}

export const TransactionType = {
    TOP_UP: "TOP_UP",
    SUBSCRIPTION_PAYMENT: "SUBSCRIPTION_PAYMENT"
}