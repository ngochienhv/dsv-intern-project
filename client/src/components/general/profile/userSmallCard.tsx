import {
    Avatar,
    Container,
    Group,
    Title,
    useMantineTheme,
    Button,
    Card,
} from "@mantine/core";
import React from "react";

export default function UserSmallCard() {
    const theme = useMantineTheme();

    return (
        <Card>
            <Group>
                <Avatar radius={50} />
                <Group direction="column" spacing={5}>
                    <Title order={6}>Nguyen Van A</Title>
                    <Group spacing={6}>
                        <Title order={6}>Followers</Title>
                        <Title
                            order={6}
                            sx={() => ({
                                color:
                                    theme.colorScheme === "dark"
                                        ? theme.colors.blue[8]
                                        : theme.colors.dark[2],
                            })}
                        >
                            (1.000)
                        </Title>
                    </Group>
                </Group>
                <Button
                    sx={() => ({
                        backgroundColor:
                            theme.colorScheme === "dark"
                                ? theme.colors.blue[8]
                                : theme.colors.dark[9],
                        transition: "background-color 0.3s",
                        "&:hover": {
                            backgroundColor:
                                theme.colorScheme === "dark"
                                    ? theme.colors.blue[4]
                                    : theme.colors.dark[5],
                        },
                    })}
                    radius={30}
                    size="xs"
                >
                    Follow
                </Button>
            </Group>
        </Card>
    );
}
