import React, { ReactNode } from "react";
import { Aside, MediaQuery, ScrollArea } from "@mantine/core";

type Props = {
    children: ReactNode | undefined;
    size: number[];
};
export default function Sidebar({ children, size }: Props) {
    return (
        <MediaQuery smallerThan={1200} styles={{ display: "none" }}>
            <ScrollArea style={{ height: "100%" }}>
                <Aside
                    p="sm"
                    hiddenBreakpoint="md"
                    hidden
                    width={{
                        xs: size[0],
                        sm: size[0],
                        md: size[0],
                        lg: size[1],
                        xl: size[2],
                    }}
                >
                    {children}
                </Aside>
            </ScrollArea>
        </MediaQuery>
    );
}
