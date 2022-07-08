import React from "react";
import { Anchor, useMantineTheme } from "@mantine/core";
import { Link } from "react-router-dom";

export default function Logo() {
    const theme = useMantineTheme();

    return (
        <Anchor
            component={Link}
            to="/"
            className="app-logo"
            sx={() => ({
                color:
                    theme.colorScheme === "dark"
                        ? theme.colors.gray[0]
                        : theme.colors.dark[9],
                fontSize: 24,
                fontFamily: "'Playball', cursive",
                "&:hover": {
                    textDecoration: "none",
                },
                fontWeight: 600,
            })}
        >
            BBLog
        </Anchor>
    );
}
