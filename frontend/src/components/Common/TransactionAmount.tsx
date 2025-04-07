// components/Common/TransactionAmount.tsx
import React from "react"
import { TransactionType } from "../../constant/TransactionConstant"
import { CURRENCY } from "../../constant/CurrencyConstant"

interface TransactionAmountProps {
    amount: number | string
    transactionType: string
    currency?: string
    className?: string
}

const TransactionAmount: React.FC<TransactionAmountProps> = ({
    amount,
    transactionType,
    currency = CURRENCY.SYMBOL,
    className = "",
}) => {
    const isPositive = transactionType === TransactionType.TOP_UP

    return (
        <span
            className={`${isPositive ? "text-green-400" : "text-red-400"} ${className}`}
        >
            {isPositive ? "+" : "-"}{amount} {currency}
        </span>
    )
}

export default TransactionAmount