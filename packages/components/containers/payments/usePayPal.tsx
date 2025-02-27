import { useState } from 'react';

import { PAYMENT_METHOD_TYPES, process } from '@proton/components/payments/core';
import { createToken } from '@proton/shared/lib/api/payments';
import { Currency } from '@proton/shared/lib/interfaces';

import { useApi, useLoading, useModals } from '../../hooks';
import { AmountAndCurrency, TokenPaymentMethod } from '../../payments/core/interface';
import PaymentVerificationModal from './PaymentVerificationModal';

interface Model {
    Token: string;
    ApprovalURL: string;
    ReturnHost: string;
}

const DEFAULT_MODEL = {
    Token: '',
    ApprovalURL: '',
    ReturnHost: '',
};

export interface PayPalHook {
    isReady: boolean;
    loadingToken: boolean;
    loadingVerification: boolean;
    onToken: () => Promise<void>;
    onVerification: () => Promise<void>;
    clear: () => void;
}

type PAYPAL_PAYMENT_METHOD = PAYMENT_METHOD_TYPES.PAYPAL | PAYMENT_METHOD_TYPES.PAYPAL_CREDIT;

export type OnPayResult = TokenPaymentMethod & AmountAndCurrency & { type: PAYPAL_PAYMENT_METHOD };

interface Props {
    amount: number;
    currency: Currency;
    type: PAYPAL_PAYMENT_METHOD;
    onPay: (data: OnPayResult) => void;
    onValidate?: () => Promise<boolean>;
}

const usePayPal = ({ amount = 0, currency: Currency, type: Type, onPay, onValidate }: Props) => {
    const api = useApi();
    const [model, setModel] = useState<Model>(DEFAULT_MODEL);
    const [loadingVerification, withLoadingVerification] = useLoading();
    const [loadingToken, withLoadingToken] = useLoading();
    const { createModal } = useModals();
    const clear = () => setModel(DEFAULT_MODEL);

    const onToken = async () => {
        try {
            const result = await api<{ Token: string; ApprovalURL: string; ReturnHost: string }>(
                createToken({
                    Amount: amount,
                    Currency,
                    Payment: { Type },
                })
            );
            setModel(result);
        } catch (error: any) {
            clear();
            throw error;
        }
    };

    const onVerification = async () => {
        const { Token, ApprovalURL, ReturnHost } = model;
        const tokenPaymentMethod = await new Promise<TokenPaymentMethod>((resolve, reject) => {
            const onProcess = () => {
                const abort = new AbortController();
                return {
                    promise: process({
                        Token,
                        api,
                        ReturnHost,
                        ApprovalURL,
                        signal: abort.signal,
                    }),
                    abort,
                };
            };
            createModal(
                <PaymentVerificationModal
                    token={Token}
                    onSubmit={resolve}
                    onClose={reject}
                    type={Type}
                    onProcess={onProcess}
                    initialProcess={onProcess()}
                />
            );
        });

        onPay({ ...tokenPaymentMethod, Amount: amount, Currency, type: Type });
    };

    return {
        isReady: !!model.Token,
        loadingToken,
        loadingVerification,
        onToken: async () => {
            return withLoadingToken(onToken());
        },
        onVerification: async () => {
            if (!((await onValidate?.()) ?? true)) {
                return;
            }
            return withLoadingVerification(onVerification());
        },
        clear,
    };
};

export default usePayPal;
