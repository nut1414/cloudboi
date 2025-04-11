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

// Group transaction statuses by their relation to transaction types
export const TransactionStatusRelations = {
    // Statuses related to top-up transactions
    [TransactionType.TOP_UP]: [
        TransactionStatus.PENDING,
        TransactionStatus.FAILED,
        TransactionStatus.SUCCESS
    ],
    // Statuses related to subscription payment transactions
    [TransactionType.SUBSCRIPTION_PAYMENT]: [
        TransactionStatus.SCHEDULED,
        TransactionStatus.PAID,
        TransactionStatus.OVERDUE,
        TransactionStatus.EXPIRED
    ]
}