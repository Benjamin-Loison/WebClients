import { ComponentPropsWithRef, ReactNode, Ref, forwardRef } from 'react';

import clsx from '@proton/utils/clsx';

export interface InputProps extends Omit<ComponentPropsWithRef<'input'>, 'prefix'> {
    onValue?: (value: string) => void;
    disableChange?: boolean;
    disabled?: boolean;
    error?: ReactNode | boolean;
    unstyled?: boolean;
    prefix?: ReactNode;
    suffix?: ReactNode;
    containerRef?: Ref<HTMLDivElement>;
    containerProps?: ComponentPropsWithRef<'div'>;
    inputClassName?: string;
}

const InputBase = (props: InputProps, ref: Ref<HTMLInputElement>) => {
    const {
        onValue,
        disableChange,
        disabled = false,
        error,
        unstyled,
        prefix,
        suffix,
        containerProps,
        containerRef,
        inputClassName,
        className: classNameProp,
        ...rest
    } = props;

    return (
        <div
            className={clsx(
                'input flex flex-nowrap flex-align-items-stretch flex-item-fluid relative',
                Boolean(error) && 'error',
                disabled && 'disabled',
                unstyled && 'unstyled',
                classNameProp
            )}
            ref={containerRef}
            data-testid="input-root"
            {...containerProps}
        >
            {prefix && (
                <div
                    className="input-adornment ml-2 flex flex-align-items-center flex-item-noshrink flex-nowrap flex-gap-0-5"
                    data-testid="input-prefix"
                >
                    {prefix}
                </div>
            )}

            <div className="flex flex-item-fluid">
                <input
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck="false"
                    aria-invalid={!!error}
                    disabled={disabled}
                    data-testid="input-input-element"
                    {...rest}
                    ref={ref}
                    onChange={(e) => {
                        if (disableChange) {
                            return;
                        }
                        onValue?.(e.target.value);
                        rest.onChange?.(e);
                    }}
                    className={clsx('input-element w100', inputClassName)}
                />
            </div>

            {suffix && (
                <div className="input-adornment mr-2 flex flex-align-items-center flex-item-noshrink flex-nowrap flex-gap-0-5">
                    {suffix}
                </div>
            )}
        </div>
    );
};

/*
export because of
https://github.com/storybookjs/storybook/issues/9511
https://github.com/styleguidist/react-docgen-typescript/issues/314
https://github.com/styleguidist/react-docgen-typescript/issues/215
*/
export const Input = forwardRef<HTMLInputElement, InputProps>(InputBase);
