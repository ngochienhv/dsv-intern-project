import React, { ReactNode, ReactElement, JSXElementConstructor } from "react";
import { AppShell, MantineTheme } from "@mantine/core";

type Props = {
    theme: MantineTheme;
    children: ReactNode;
    navbar: ReactElement<any, string | JSXElementConstructor<any>> | undefined;
    aside: ReactElement<any, string | JSXElementConstructor<any>> | undefined;
    footer: ReactElement<any, string | JSXElementConstructor<any>> | undefined;
    header: ReactElement<any, string | JSXElementConstructor<any>> | undefined;
};

export default function AppShells({
    theme,
    children,
    navbar,
    aside,
    footer,
    header,
}: Props) {
    return (
        <AppShell
            styles={{
                main: {
                    background:
                        theme.colorScheme === "dark"
                            ? theme.colors.dark[8]
                            : theme.colors.gray[0],
                },
            }}
            navbarOffsetBreakpoint="sm"
            asideOffsetBreakpoint="sm"
            fixed
            navbar={navbar}
            aside={aside}
            header={header}
            footer={footer}
        >
            {children}
        </AppShell>
    );
}
