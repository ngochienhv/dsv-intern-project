import {
    Container,
    Grid,
    Text,
    Title,
    Space,
    useMantineTheme,
    Group,
    Textarea,
    Transition,
    ActionIcon,
    Pagination,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form/lib/use-form";
import React, { Dispatch, SetStateAction } from "react";
import UserSmallCard from "./userSmallCard";
import { Edit } from "tabler-icons-react";

type Props = {
    form: UseFormReturnType<any>;
    edit: boolean;
    other: boolean;
    editBio: boolean;
    setEditBio: Dispatch<SetStateAction<boolean>>;
    profile: {
        username: string;
        avatar: string;
        description: string;
        bio: string;
        followers: Object[];
        following: Object[];
        bookmarks: Object[];
        firstname: string;
        lastname: string;
    };
};

export default function ProfileAbout({
    profile,
    other,
    edit,
    form,
    editBio,
    setEditBio,
}: Props) {
    const arr = [1, 2, 3, 4, 5, 6];
    const theme = useMantineTheme();

    return (
        <Container>
            <Grid>
                <Grid.Col>
                    <Title order={4}>
                        Who's {profile?.lastname + " " + profile?.firstname}
                    </Title>
                    <Space h="md" />
                    <Group grow={true}>
                        {!editBio ? (
                            <Text>
                                {profile?.bio
                                    ? profile.bio
                                    : !other
                                    ? "Let people know more about yourself!"
                                    : ""}
                            </Text>
                        ) : (
                            <Textarea
                                label="Bio"
                                autosize={true}
                                {...form.getInputProps("bio")}
                            />
                        )}
                        <Transition
                            mounted={edit}
                            transition="fade"
                            duration={400}
                            timingFunction="ease"
                        >
                            {(styles) => (
                                <ActionIcon
                                    style={styles}
                                    onClick={() => setEditBio(!editBio)}
                                >
                                    <Edit size={22} strokeWidth={2} />
                                </ActionIcon>
                            )}
                        </Transition>
                    </Group>
                </Grid.Col>
                <Grid.Col>
                    <Group spacing={5}>
                        <Title order={4}>Followers</Title>
                        <Title
                            order={4}
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
                    <Space h="md" />
                    <Grid>
                        {arr.map((x) => (
                            <Grid.Col xl={4}>
                                <UserSmallCard />
                            </Grid.Col>
                        ))}
                        <Grid.Col>
                            <Pagination
                                total={3}
                                position="right"
                                color={
                                    theme.colorScheme === "dark" ? "" : "dark"
                                }
                            />
                        </Grid.Col>
                    </Grid>
                </Grid.Col>
                <Grid.Col>
                    <Group spacing={5}>
                        <Title order={4}>Following</Title>
                        <Title
                            order={4}
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
                    <Space h="md" />
                    <Grid>
                        {arr.map((x) => (
                            <Grid.Col xl={4}>
                                <UserSmallCard />
                            </Grid.Col>
                        ))}
                    </Grid>
                </Grid.Col>
            </Grid>
        </Container>
    );
}
