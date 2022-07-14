import { Avatar, Group, Title, Anchor, Card, Text } from "@mantine/core";
import React from "react";
import { userFollower } from "./profileAbout";
import { Link } from "react-router-dom";
import { useShallowEffect } from "@mantine/hooks";
import FollowBtns from "./followBtns";

export default function UserSmallCard(user: userFollower) {
    const [followed, setFollowed] = React.useState<boolean>(user.followed);

    useShallowEffect(() => {
        setFollowed(user.followed);
    }, [user.followed]);

    return (
        <Card>
            <Group direction="row">
                <Avatar
                    radius="xl"
                    src={user.avatar}
                    component={Link}
                    to={`/profile/${user.username}`}
                />
                <Group direction="column" spacing={3}>
                    <Anchor
                        component={Link}
                        to={`/profile/${user.username}`}
                        underline={false}
                        variant="text"
                    >
                        <Title order={5}>
                            {user.lastname + " " + user.firstname}
                        </Title>
                    </Anchor>
                    <Text
                        size="sm"
                        color="gray"
                        component={Link}
                        to={`/profile/${user.username}`}
                    >
                        {"@" + user.username}
                    </Text>
                </Group>
                {!user.own && (
                    <FollowBtns
                        followed={followed}
                        username={user.username}
                        setFollowed={setFollowed}
                    />
                )}
            </Group>
        </Card>
    );
}
