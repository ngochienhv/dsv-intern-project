import { Badge, Text } from "@mantine/core";
import React from "react";
import { Link } from "react-router-dom";

export default function Tag({ tag }: { tag: string }) {
    return (
        <Badge
            style={{ cursor: "pointer" }}
            component={Link}
            to="/"
            sx={(theme) => ({
                transition: "background-color 0.3s",
                "&:hover": {
                    backgroundColor:
                        theme.colorScheme === "dark"
                            ? theme.colors.blue[7]
                            : theme.colors.blue[2],
                },
            })}
            key={tag}
        >
            <Text transform="capitalize" size="sm">
                {tag}
            </Text>
        </Badge>
    );
}
