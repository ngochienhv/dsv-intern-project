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
import axios from "axios";
import { baseUrl } from "../others/fetchDataFunctions";
import { useShallowEffect } from "@mantine/hooks";

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
        followersCount: number;
        following: Object[];
        followingCount: number;
        bookmarks: Object[];
        firstname: string;
        lastname: string;
    };
};

export type userFollower = {
    _id: string;
    firstname: string;
    lastname: string;
    username: string;
    avatar: string;
    followed: boolean;
    own: boolean;
};

export default function ProfileAbout({
    profile,
    other,
    edit,
    form,
    editBio,
    setEditBio,
}: Props) {
    const theme = useMantineTheme();
    const [followers, setFollowers] = React.useState<userFollower[]>([]);
    const [followings, setFollowings] = React.useState<userFollower[]>([]);
    const [followersPage, setFollowersPage] = React.useState<number>(1);
    const [followingsPage, setFollowingsPage] = React.useState<number>(1);
    const maxPerPage = 6;
    const getFollowers = async () => {
        await axios
            .get(
                `${baseUrl}/profile/${profile.username}/followers/${
                    followersPage - 1
                }`,
                {
                    headers: {
                        "x-access-token": JSON.parse(
                            localStorage.getItem("user") || "{}"
                        ).token,
                    },
                }
            )
            .then((response) => {
                console.log(response);
                setFollowers(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const getFollowings = async () => {
        await axios
            .get(
                `${baseUrl}/profile/${profile.username}/followings/${
                    followingsPage - 1
                }`,
                {
                    headers: {
                        "x-access-token": JSON.parse(
                            localStorage.getItem("user") || "{}"
                        ).token,
                    },
                }
            )
            .then((response) => {
                console.log(response);
                setFollowings(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useShallowEffect(() => {
        getFollowers();
        getFollowings();
    }, [profile.username]);

    useShallowEffect(() => {
        getFollowers();
    }, [followersPage]);
    useShallowEffect(() => {
        getFollowings();
    }, [followingsPage]);

    return (
        <Container size="lg">
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
                            ({profile.followers.length})
                        </Title>
                    </Group>
                    <Space h="md" />
                    <Grid>
                        {followers.map((follower) => (
                            <Grid.Col
                                xl={4}
                                lg={4}
                                md={6}
                                sm={6}
                                key={follower._id}
                            >
                                <UserSmallCard
                                    _id={follower._id}
                                    username={follower.username}
                                    firstname={follower.firstname}
                                    lastname={follower.lastname}
                                    avatar={follower.avatar}
                                    followed={follower.followed}
                                    own={follower.own}
                                />
                            </Grid.Col>
                        ))}
                        <Grid.Col>
                            {profile.followers.length > 0 && (
                                <Pagination
                                    total={Math.ceil(
                                        profile.followers.length / maxPerPage
                                    )}
                                    position="right"
                                    color={
                                        theme.colorScheme === "dark"
                                            ? ""
                                            : "dark"
                                    }
                                    page={followersPage}
                                    onChange={setFollowersPage}
                                />
                            )}
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
                            ({profile.following.length})
                        </Title>
                    </Group>
                    <Space h="md" />
                    <Grid>
                        {followings.map((following) => (
                            <Grid.Col
                                xl={4}
                                lg={4}
                                md={6}
                                sm={6}
                                key={following._id}
                            >
                                <UserSmallCard
                                    _id={following._id}
                                    username={following.username}
                                    firstname={following.firstname}
                                    lastname={following.lastname}
                                    avatar={following.avatar}
                                    followed={following.followed}
                                    own={following.own}
                                />
                            </Grid.Col>
                        ))}
                        <Grid.Col>
                            {profile.following.length > 0 && (
                                <Pagination
                                    total={Math.ceil(
                                        profile.following.length / maxPerPage
                                    )}
                                    position="right"
                                    color={
                                        theme.colorScheme === "dark"
                                            ? ""
                                            : "dark"
                                    }
                                    page={followingsPage}
                                    onChange={setFollowingsPage}
                                />
                            )}
                        </Grid.Col>
                    </Grid>
                </Grid.Col>
            </Grid>
        </Container>
    );
}
