import clsx from '@proton/utils/clsx';

interface Props extends React.HTMLProps<HTMLDivElement> {
    center?: boolean;
    disableShadow?: boolean;
    maxWidth?: string;
}

const Main = ({ children, className, center = true, maxWidth = 'mw30r', disableShadow, ...rest }: Props) => {
    return (
        <main
            className={clsx(
                'ui-standard w100 relative sign-layout shadow-color-primary on-tiny-mobile-no-box-shadow px-6 pt-1 pb-6 sm:p-11',
                center && 'max-w100 mx-auto',
                disableShadow ? '' : 'shadow-lifted',
                maxWidth,
                className
            )}
            {...rest}
        >
            {children}
        </main>
    );
};

export default Main;
