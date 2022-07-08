import React, { ReactNode } from "react";
import { Aside, MediaQuery } from "@mantine/core";

type Props = {
    children: ReactNode | undefined;
    size: number[];
};
export default function Sidebar({ children, size }: Props) {
    return (
        <MediaQuery smallerThan="md" styles={{ display: "none" }}>
            <Aside
                p="md"
                hiddenBreakpoint="md"
                width={{
                    xs: size[0],
                    sm: size[0],
                    md: size[0],
                    lg: size[1],
                    xl: size[2],
                }}
                height="100vh"
            >
                {children}
            </Aside>
        </MediaQuery>
    );
}
