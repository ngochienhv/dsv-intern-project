import React from "react";
import { Navbar, Text } from "@mantine/core";

type Props = {
    opened: boolean;
};
export default function NavBar({ opened }: Props) {
    return (
        <Navbar
            p="md"
            hiddenBreakpoint="sm"
            hidden={!opened}
            width={{ sm: 200, lg: 300 }}
        >
            <Text>Left Sidebar</Text>
        </Navbar>
    );
}
