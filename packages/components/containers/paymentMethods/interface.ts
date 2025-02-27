import { PaymentMethodType } from '@proton/components/payments/core';

import { IconName } from '../../components/icon';

export interface PaymentMethodData {
    icon?: IconName;
    value: PaymentMethodType;
    text: string;
    disabled?: boolean;
}

export type PaymentMethodFlows = 'invoice' | 'signup' | 'human-verification' | 'credit' | 'donation' | 'subscription';
